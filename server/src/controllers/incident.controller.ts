import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import {
  createIncident,
  getIncidents,
  getIncidentById,
  updateIncidentStatus,
} from "../services/incident.service";
import { IncidentCategory, IncidentStatus } from "@prisma/client";

export async function createIncidentController(
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
      category,
      location,
      latitude,
      longitude,
      communityId,
      imageUrl,
    } = req.body;

    if (
      !title ||
      !description ||
      !category ||
      !location ||
      !communityId
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    // Convert coordinates from request body to numbers.
    // Empty values remain undefined.
    const parsedLatitude =
      latitude !== undefined && latitude !== ""
        ? Number(latitude)
        : undefined;

    const parsedLongitude =
      longitude !== undefined && longitude !== ""
        ? Number(longitude)
        : undefined;

    // Reject invalid coordinate values.
    if (
      parsedLatitude !== undefined &&
      !Number.isFinite(parsedLatitude)
    ) {
      return res.status(400).json({
        success: false,
        message: "Latitude must be a valid number",
      });
    }

    if (
      parsedLongitude !== undefined &&
      !Number.isFinite(parsedLongitude)
    ) {
      return res.status(400).json({
        success: false,
        message: "Longitude must be a valid number",
      });
    }

    const incident = await createIncident(req.user.userId, {
      title,
      description,
      category: category as IncidentCategory,
      location,
      latitude: parsedLatitude,
      longitude: parsedLongitude,
      communityId,
      imageUrl,
    });

    return res.status(201).json({
      success: true,
      message: "Incident reported successfully",
      incident,
    });
  } catch (error: unknown) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create incident",
    });
  }
}

export async function getIncidentsController(
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

    const incidents = await getIncidents(req.user.userId);

    return res.json({
      success: true,
      count: incidents.length,
      incidents,
    });
  } catch (error: unknown) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch incidents",
    });
  }
}

export async function getIncidentController(
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

    const incident = await getIncidentById(
      req.user.userId,
      String(req.params.id)
    );

    return res.json({
      success: true,
      incident,
    });
  } catch (error: unknown) {
    return res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Incident not found",
    });
  }
}

export async function updateIncidentStatusController(
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

    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const incident = await updateIncidentStatus(
      req.user.userId,
      String(req.params.id),
      status as IncidentStatus
    );

    return res.json({
      success: true,
      message: "Incident status updated successfully",
      incident,
    });
  } catch (error: unknown) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update incident",
    });
  }
}