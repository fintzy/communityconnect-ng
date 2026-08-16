import { Router } from "express";

import authRoutes from "./auth.routes";
import communityRoutes from "./community.routes";
import incidentRoutes from "./incident.routes";
import eventRoutes from "./event.routes";
import notificationRoutes from "./notification.routes";
import adminRoutes from "./admin.routes";
import mediaRoutes from "./media.routes";

const router = Router();

router.get("/health", (_, res) => {
  res.json({
    success: true,
    message: "CommunityConnect NG API is healthy",
    timestamp: new Date().toISOString(),
  });
});

router.use("/auth", authRoutes);

router.use("/communities", communityRoutes);

router.use("/incidents", incidentRoutes);

router.use("/events", eventRoutes);

router.use("/notifications", notificationRoutes);

router.use("/admin", adminRoutes);
  
router.use("/media", mediaRoutes);

export default router;