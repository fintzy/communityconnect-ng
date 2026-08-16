import { Router } from "express";
import {
  createCommunity,
  getCommunities,
  joinCommunity,
} from "../controllers/community.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate);

router.post("/", createCommunity);
router.get("/", getCommunities);
router.post("/:id/join", joinCommunity);

export default router;