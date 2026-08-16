import { Router } from "express";

import {
  uploadMediaController,
  getIncidentMediaController,
  getEventMediaController,
} from "../controllers/media.controller";

import { authenticate } from "../middleware/auth";
import { uploadImages } from "../middleware/upload";

const router = Router();

router.use(authenticate);

// Upload media
router.post(
  "/upload",
  uploadImages.array("images", 10),
  uploadMediaController
);

// Get incident images
router.get(
  "/incidents/:id",
  getIncidentMediaController
);

// Get event images
router.get(
  "/events/:id",
  getEventMediaController
);

export default router;