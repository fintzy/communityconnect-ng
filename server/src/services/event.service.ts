import prisma from "../config/prisma";
import { EventStatus } from "@prisma/client";

export async function createEvent(
  userId: string,
  data: {
    title: string;
    description: string;
    venue: string;
    startDate: string;
    endDate: string;
    communityId: string;
  }
) {
  const community = await prisma.community.findUnique({
    where: {
      id: data.communityId,
    },
  });

  if (!community) {
    throw new Error("Community not found");
  }

  const member = await prisma.communityMember.findUnique({
    where: {
      userId_communityId: {
        userId,
        communityId: data.communityId,
      },
    },
  });

  if (!member) {
    throw new Error("You must be a member of this community");
  }

  if (!["OWNER", "MODERATOR"].includes(member.role)) {
    throw new Error(
      "Only community owners or moderators can create events"
    );
  }

  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);

  if (
    Number.isNaN(startDate.getTime()) ||
    Number.isNaN(endDate.getTime())
  ) {
    throw new Error("Invalid event date");
  }

  if (endDate <= startDate) {
    throw new Error("End date must be after start date");
  }

  return prisma.event.create({
    data: {
      title: data.title,
      description: data.description,
      venue: data.venue,
      startDate,
      endDate,
      communityId: data.communityId,
    },
    include: {
      community: {
        select: {
          id: true,
          name: true,
          state: true,
          lga: true,
        },
      },
    },
  });
}

export async function getEvents(
  userId: string,
  communityId?: string
) {
  return prisma.event.findMany({
    where: {
      ...(communityId
        ? {
            communityId,
          }
        : {
            community: {
              members: {
                some: {
                  userId,
                },
              },
            },
          }),
    },
    include: {
      community: {
        select: {
          id: true,
          name: true,
          state: true,
          lga: true,
        },
      },
      _count: {
        select: {
          attendees: true,
        },
      },
    },
    orderBy: {
      startDate: "asc",
    },
  });
}

export async function getEventById(
  userId: string,
  eventId: string
) {
  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
    include: {
      community: true,
      attendees: {
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (!event) {
    throw new Error("Event not found");
  }

  const member = await prisma.communityMember.findUnique({
    where: {
      userId_communityId: {
        userId,
        communityId: event.communityId,
      },
    },
  });

  if (!member) {
    throw new Error("You do not have access to this event");
  }

  return event;
}

export async function updateEvent(
  userId: string,
  eventId: string,
  data: {
    title?: string;
    description?: string;
    venue?: string;
    startDate?: string;
    endDate?: string;
    status?: EventStatus;
  }
) {
  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
  });

  if (!event) {
    throw new Error("Event not found");
  }

  const member = await prisma.communityMember.findUnique({
    where: {
      userId_communityId: {
        userId,
        communityId: event.communityId,
      },
    },
  });

  if (!member) {
    throw new Error("You do not have access to this event");
  }

  if (!["OWNER", "MODERATOR"].includes(member.role)) {
    throw new Error(
      "Only community owners or moderators can update events"
    );
  }

  const updateData: any = {};

  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined)
    updateData.description = data.description;
  if (data.venue !== undefined) updateData.venue = data.venue;
  if (data.status !== undefined) updateData.status = data.status;

  if (data.startDate !== undefined) {
    const startDate = new Date(data.startDate);

    if (Number.isNaN(startDate.getTime())) {
      throw new Error("Invalid start date");
    }

    updateData.startDate = startDate;
  }

  if (data.endDate !== undefined) {
    const endDate = new Date(data.endDate);

    if (Number.isNaN(endDate.getTime())) {
      throw new Error("Invalid end date");
    }

    updateData.endDate = endDate;
  }

  return prisma.event.update({
    where: {
      id: eventId,
    },
    data: updateData,
  });
}

export async function registerForEvent(
  userId: string,
  eventId: string
) {
  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
  });

  if (!event) {
    throw new Error("Event not found");
  }

  if (event.status === "CANCELLED") {
    throw new Error("Cannot register for a cancelled event");
  }

  const member = await prisma.communityMember.findUnique({
    where: {
      userId_communityId: {
        userId,
        communityId: event.communityId,
      },
    },
  });

  if (!member) {
    throw new Error(
      "You must be a member of this community to register"
    );
  }

  const existing = await prisma.eventRegistration.findUnique({
    where: {
      eventId_userId: {
        eventId,
        userId,
      },
    },
  });

  if (existing) {
    throw new Error("You are already registered for this event");
  }

  return prisma.eventRegistration.create({
    data: {
      eventId,
      userId,
    },
    include: {
      event: {
        select: {
          id: true,
          title: true,
          venue: true,
          startDate: true,
          endDate: true,
        },
      },
    },
  });
}

export async function unregisterFromEvent(
  userId: string,
  eventId: string
) {
  const registration = await prisma.eventRegistration.findUnique({
    where: {
      eventId_userId: {
        eventId,
        userId,
      },
    },
  });

  if (!registration) {
    throw new Error("You are not registered for this event");
  }

  await prisma.eventRegistration.delete({
    where: {
      id: registration.id,
    },
  });

  return {
    message: "Successfully unregistered from event",
  };
}