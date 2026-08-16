import { Router } from "express";

import {
  getUsersController,
  getUserController,
  updateUserRoleController,
} from "../controllers/admin.controller";

import { authenticate } from "../middleware/auth";
import { authorizeRoles } from "../middleware/role";

import { UserRole } from "@prisma/client";

const router = Router();

router.use(authenticate);

router.get(
  "/users",
  authorizeRoles(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  getUsersController
);

router.get(
  "/users/:id",
  authorizeRoles(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  getUserController
);

router.patch(
  "/users/:id/role",
  authorizeRoles(UserRole.SUPER_ADMIN),
  updateUserRoleController
);

export default router;