import { Router } from "express";

import {
  createNotificationController,
  getNotificationsController,
  markNotificationAsReadController,
  markAllNotificationsAsReadController,
  deleteNotificationController,
} from "../controllers/notification.controller";

import { authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate);

router.post("/", createNotificationController);

router.get("/", getNotificationsController);

router.patch("/read-all", markAllNotificationsAsReadController);

router.patch("/:id/read", markNotificationAsReadController);

router.delete("/:id", deleteNotificationController);

export default router;