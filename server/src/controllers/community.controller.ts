import { Response } from "express";
import prisma from "../config/prisma";
import { AuthRequest } from "../middleware/auth";

export async function createCommunity(req: AuthRequest, res: Response) {
  try {
    const { name, state, lga, description } = req.body;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!name || !state || !lga) {
      return res.status(400).json({
        success: false,
        message: "Name, state and LGA are required",
      });
    }

    // Create the community
    const community = await prisma.community.create({
      data: {
        name,
        state,
        lga,
        description,
        ownerId: req.user.userId,
      },
    });

    // Automatically make the creator the community OWNER
    await prisma.communityMember.create({
      data: {
        userId: req.user.userId,
        communityId: community.id,
        role: "OWNER",
      },
    });

    return res.status(201).json({
      success: true,
      message: "Community created successfully",
      community,
    });
  } catch (error) {
    console.error("Create community error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create community",
    });
  }
}

export async function getCommunities(
  _req: AuthRequest,
  res: Response
) {
  try {
    const communities = await prisma.community.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        owner: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        _count: {
          select: {
            members: true,
            incidents: true,
            events: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json({
      success: true,
      count: communities.length,
      communities,
    });
  } catch (error) {
    console.error("Get communities error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve communities",
    });
  }
}

export async function joinCommunity(
  req: AuthRequest,
  res: Response
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const communityId = String(req.params.id);

    const community = await prisma.community.findUnique({
      where: {
        id: communityId,
      },
    });

    if (!community) {
      return res.status(404).json({
        success: false,
        message: "Community not found",
      });
    }

    const existingMember = await prisma.communityMember.findUnique({
      where: {
        userId_communityId: {
          userId: req.user.userId,
          communityId,
        },
      },
    });

    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: "You are already a member of this community",
      });
    }

    const membership = await prisma.communityMember.create({
      data: {
        userId: req.user.userId,
        communityId,
        role: "MEMBER",
      },
    });

    return res.status(201).json({
      success: true,
      message: "Joined community successfully",
      membership,
    });
  } catch (error) {
    console.error("Join community error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to join community",
    });
  }
}