import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  registerForEvent,
  unregisterFromEvent,
} from "../services/event.service";
import { EventStatus } from "@prisma/client";

export async function createEventController(
  req: AuthRequest,
  res: Response
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const {
      title,
      description,
      venue,
      startDate,
      endDate,
      communityId,
    } = req.body;

    if (
      !title ||
      !description ||
      !venue ||
      !startDate ||
      !endDate ||
      !communityId
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    const event = await createEvent(req.user.userId, {
      title,
      description,
      venue,
      startDate,
      endDate,
      communityId,
    });

    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      event,
    });
  } catch (error: unknown) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create event",
    });
  }
}

export async function getEventsController(
  req: AuthRequest,
  res: Response
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const communityId =
      typeof req.query.communityId === "string"
        ? req.query.communityId
        : undefined;

    const events = await getEvents(
      req.user.userId,
      communityId
    );

    return res.json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error: unknown) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch events",
    });
  }
}

export async function getEventController(
  req: AuthRequest,
  res: Response
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const event = await getEventById(
      req.user.userId,
      String(req.params.id)
    );

    return res.json({
      success: true,
      event,
    });
  } catch (error: unknown) {
    return res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Event not found",
    });
  }
}

export async function updateEventController(
  req: AuthRequest,
  res: Response
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const {
      title,
      description,
      venue,
      startDate,
      endDate,
      status,
    } = req.body;

    const event = await updateEvent(
      req.user.userId,
      String(req.params.id),
      {
        title,
        description,
        venue,
        startDate,
        endDate,
        status: status as EventStatus | undefined,
      }
    );

    return res.json({
      success: true,
      message: "Event updated successfully",
      event,
    });
  } catch (error: unknown) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update event",
    });
  }
}

export async function registerForEventController(
  req: AuthRequest,
  res: Response
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const registration = await registerForEvent(
      req.user.userId,
      String(req.params.id)
    );

    return res.status(201).json({
      success: true,
      message: "Successfully registered for event",
      registration,
    });
  } catch (error: unknown) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to register for event",
    });
  }
}

export async function unregisterFromEventController(
  req: AuthRequest,
  res: Response
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const result = await unregisterFromEvent(
      req.user.userId,
      String(req.params.id)
    );

    return res.json({
      success: true,
      ...result,
    });
  } catch (error: unknown) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to unregister from event",
    });
  }
}