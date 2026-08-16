import prisma from "../config/prisma";
import { NotificationType } from "@prisma/client";

export async function createNotification(
  userId: string,
  data: {
    title: string;
    message: string;
    type?: NotificationType;
  }
) {
  return prisma.notification.create({
    data: {
      userId,
      title: data.title,
      message: data.message,
      type: data.type ?? NotificationType.SYSTEM,
    },
  });
}

export async function getUserNotifications(userId: string) {
  return prisma.notification.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function markNotificationAsRead(
  userId: string,
  notificationId: string
) {
  const notification = await prisma.notification.findFirst({
    where: {
      id: notificationId,
      userId,
    },
  });

  if (!notification) {
    throw new Error("Notification not found");
  }

  return prisma.notification.update({
    where: {
      id: notificationId,
    },
    data: {
      isRead: true,
    },
  });
}

export async function markAllNotificationsAsRead(userId: string) {
  const result = await prisma.notification.updateMany({
    where: {
      userId,
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });

  return result;
}

export async function deleteNotification(
  userId: string,
  notificationId: string
) {
  const notification = await prisma.notification.findFirst({
    where: {
      id: notificationId,
      userId,
    },
  });

  if (!notification) {
    throw new Error("Notification not found");
  }

  await prisma.notification.delete({
    where: {
      id: notificationId,
    },
  });

  return {
    success: true,
  };
}