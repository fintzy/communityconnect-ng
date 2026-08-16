import { Router } from "express";

import {
  createEventController,
  getEventsController,
  getEventController,
  updateEventController,
  registerForEventController,
  unregisterFromEventController,
} from "../controllers/event.controller";

import { authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate);

router.post("/", createEventController);

router.get("/", getEventsController);

router.get("/:id", getEventController);

router.patch("/:id", updateEventController);

router.post("/:id/register", registerForEventController);

router.delete("/:id/register", unregisterFromEventController);

export default router;