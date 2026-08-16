import prisma from "../config/prisma";
import { MediaContext, MediaType } from "@prisma/client";

export async function createMediaRecords(
  userId: string,
  files: Express.Multer.File[],
  data: {
    context: MediaContext;
    incidentId?: string;
    eventId?: string;
    communityId?: string;
  }
) {
  if (!files || files.length === 0) {
    throw new Error("No files uploaded");
  }

  if (data.context === "INCIDENT" && !data.incidentId) {
    throw new Error("Incident ID is required");
  }

  if (data.context === "EVENT" && !data.eventId) {
    throw new Error("Event ID is required");
  }

  if (data.context === "COMMUNITY" && !data.communityId) {
    throw new Error("Community ID is required");
  }

  const mediaRecords = await Promise.all(
    files.map((file) =>
      prisma.media.create({
        data: {
          url: `/uploads/${getFolder(data.context)}/${file.filename}`,
          fileName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          type: MediaType.IMAGE,
          context: data.context,
          uploadedById: userId,
          incidentId: data.incidentId,
          eventId: data.eventId,
          communityId: data.communityId,
        },
      })
    )
  );

  return mediaRecords;
}

function getFolder(context: MediaContext) {
  switch (context) {
    case MediaContext.EVENT:
      return "events";

    case MediaContext.COMMUNITY:
      return "communities";

    case MediaContext.INCIDENT:
    default:
      return "incidents";
  }
}

export async function getMediaByIncident(
  userId: string,
  incidentId: string
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

  return prisma.media.findMany({
    where: {
      incidentId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getMediaByEvent(
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

  return prisma.media.findMany({
    where: {
      eventId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}