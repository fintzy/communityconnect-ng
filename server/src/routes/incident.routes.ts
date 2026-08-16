import { Router } from "express";

import {
  createIncidentController,
  getIncidentsController,
  getIncidentController,
  updateIncidentStatusController,
} from "../controllers/incident.controller";

import { authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate);

router.post("/", createIncidentController);

router.get("/", getIncidentsController);

router.get("/:id", getIncidentController);

router.patch("/:id/status", updateIncidentStatusController);

export default router;