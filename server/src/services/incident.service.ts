import prisma from "../config/prisma";
import { IncidentCategory, IncidentStatus } from "@prisma/client";

export async function createIncident(
  userId: string,
  data: {
    title: string;
    description: string;
    category: IncidentCategory;
    location: string;
    latitude?: number;
    longitude?: number;
    communityId: string;
    imageUrl?: string;
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
    throw new Error(
      "You must be a member of this community to report an incident"
    );
  }

  // Validate GPS coordinates when supplied
  if (data.latitude !== undefined) {
    if (data.latitude < -90 || data.latitude > 90) {
      throw new Error("Invalid latitude. Latitude must be between -90 and 90");
    }
  }

  if (data.longitude !== undefined) {
    if (data.longitude < -180 || data.longitude > 180) {
      throw new Error(
        "Invalid longitude. Longitude must be between -180 and 180"
      );
    }
  }

  return prisma.incidentReport.create({
    data: {
      title: data.title,
      description: data.description,
      category: data.category,
      location: data.location,
      latitude: data.latitude,
      longitude: data.longitude,
      imageUrl: data.imageUrl,
      reporterId: userId,
      communityId: data.communityId,
    },
    include: {
      reporter: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
      community: true,
    },
  });
}

export async function getIncidents(userId: string) {
  return prisma.incidentReport.findMany({
    where: {
      community: {
        members: {
          some: {
            userId,
          },
        },
      },
    },
    include: {
      reporter: {
        select: {
          id: true,
          fullName: true,
        },
      },
      community: {
        select: {
          id: true,
          name: true,
          state: true,
          lga: true,
        },
      },
      assignedTo: {
        select: {
          id: true,
          fullName: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getIncidentById(
  userId: string,
  incidentId: string
) {
  const incident = await prisma.incidentReport.findUnique({
    where: {
      id: incidentId,
    },
    include: {
      reporter: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
      community: true,
      assignedTo: {
        select: {
          id: true,
          fullName: true,
        },
      },
    },
  });

  if (!incident) {
    throw new Error("Incident not found");
  }

  const member = await prisma.communityMember.findUnique({
    where: {
      userId_communityId: {
        userId,
        communityId: incident.communityId,
      },
    },
  });

  if (!member) {
    throw new Error("You do not have access to this incident");
  }

  return incident;
}

export async function updateIncidentStatus(
  userId: string,
  incidentId: string,
  status: IncidentStatus
) {
  const incident = await prisma.incidentReport.findUnique({
    where: {
      id: incidentId,
    },
  });

  if (!incident) {
    throw new Error("Incident not found");
  }

  const member = await prisma.communityMember.findUnique({
    where: {
      userId_communityId: {
        userId,
        communityId: incident.communityId,
      },
    },
  });

  if (!member) {
    throw new Error("You do not have access to this incident");
  }

  if (!["OWNER", "MODERATOR"].includes(member.role)) {
    throw new Error(
      "Only community owners or moderators can update incident status"
    );
  }

  return prisma.incidentReport.update({
    where: {
      id: incidentId,
    },
    data: {
      status,
    },
  });
}