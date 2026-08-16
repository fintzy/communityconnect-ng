import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { UserRole } from "@prisma/client";

import {
  getAllUsers,
  getUserById,
  updateUserRole,
} from "../services/admin.service";

export async function getUsersController(
  req: AuthRequest,
  res: Response
) {
  try {
    const users = await getAllUsers();

    return res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to retrieve users",
    });
  }
}

export async function getUserController(
  req: AuthRequest,
  res: Response
) {
  try {
    const user = await getUserById(String(req.params.id));

    return res.json({
      success: true,
      user,
    });
  } catch (error: unknown) {
    return res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "User not found",
    });
  }
}

export async function updateUserRoleController(
  req: AuthRequest,
  res: Response
) {
  try {
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Role is required",
      });
    }

    if (!Object.values(UserRole).includes(role as UserRole)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user role",
      });
    }

    const user = await updateUserRole(
      String(req.params.id),
      role as UserRole
    );

    return res.json({
      success: true,
      message: "User role updated successfully",
      user,
    });
  } catch (error: unknown) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update user role",
    });
  }
}