import { Request, Response } from "express";
import {
  createMediaRecords,
  getMediaByIncident,
  getMediaByEvent,
} from "../services/media.service";
import { MediaContext } from "@prisma/client";

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export async function uploadMediaController(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No images uploaded",
      });
    }

    const context = String(req.body.context || "").toUpperCase();

    if (!Object.values(MediaContext).includes(context as MediaContext)) {
      return res.status(400).json({
        success: false,
        message: "Invalid media context",
      });
    }

    const media = await createMediaRecords(
      req.user.userId,
      files,
      {
        context: context as MediaContext,
        incidentId: req.body.incidentId,
        eventId: req.body.eventId,
        communityId: req.body.communityId,
      }
    );

    return res.status(201).json({
      success: true,
      message: "Media uploaded successfully",
      count: media.length,
      media,
    });
  } catch (error: unknown) {
    console.error("UPLOAD MEDIA ERROR:", error);

    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to upload media",
    });
  }
}

export async function getIncidentMediaController(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const incidentId = String(req.params.id);

    const media = await getMediaByIncident(
      req.user.userId,
      incidentId
    );

    return res.json({
      success: true,
      count: media.length,
      media,
    });
  } catch (error: unknown) {
    console.error("GET INCIDENT MEDIA ERROR:", error);

    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to get incident media",
    });
  }
}

export async function getEventMediaController(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const eventId = String(req.params.id);

    const media = await getMediaByEvent(
      req.user.userId,
      eventId
    );

    return res.json({
      success: true,
      count: media.length,
      media,
    });
  } catch (error: unknown) {
    console.error("GET EVENT MEDIA ERROR:", error);

    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to get event media",
    });
  }
}