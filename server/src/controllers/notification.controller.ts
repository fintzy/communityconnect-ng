import { Response } from "express";
import { AuthRequest } from "../middleware/auth";

import {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../services/notification.service";

import { NotificationType } from "@prisma/client";

export async function createNotificationController(
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

    const { title, message, type } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: "Title and message are required",
      });
    }

    const notification = await createNotification(req.user.userId, {
      title,
      message,
      type: type as NotificationType | undefined,
    });

    return res.status(201).json({
      success: true,
      message: "Notification created successfully",
      notification,
    });
  } catch (error: unknown) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create notification",
    });
  }
}

export async function getNotificationsController(
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

    const notifications = await getUserNotifications(req.user.userId);

    return res.json({
      success: true,
      count: notifications.length,
      unreadCount: notifications.filter(
        (notification) => !notification.isRead
      ).length,
      notifications,
    });
  } catch (error: unknown) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to retrieve notifications",
    });
  }
}

export async function markNotificationAsReadController(
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

    const notification = await markNotificationAsRead(
      req.user.userId,
      String(req.params.id)
    );

    return res.json({
      success: true,
      message: "Notification marked as read",
      notification,
    });
  } catch (error: unknown) {
    return res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Notification not found",
    });
  }
}

export async function markAllNotificationsAsReadController(
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

    const result = await markAllNotificationsAsRead(req.user.userId);

    return res.json({
      success: true,
      message: "All notifications marked as read",
      updatedCount: result.count,
    });
  } catch (error: unknown) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update notifications",
    });
  }
}

export async function deleteNotificationController(
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

    await deleteNotification(
      req.user.userId,
      String(req.params.id)
    );

    return res.json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error: unknown) {
    return res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Notification not found",
    });
  }
}