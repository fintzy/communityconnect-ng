import { Router } from "express";

import authRoutes from "./auth.routes";

const router = Router();

router.get("/health", (_, res) => {
  res.json({
    success: true,
    message: "CommunityConnect NG API is healthy",
    timestamp: new Date().toISOString(),
  });
});

router.use("/auth", authRoutes);

export default router;