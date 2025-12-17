import { ClerkExpressWithAuth, StrictAuthProp } from "@clerk/clerk-sdk-node";
import { Request, Response, NextFunction, RequestHandler } from "express";
import prisma from "../prisma/client";

declare global {
  namespace Express {
    interface Request extends StrictAuthProp {}
  }
}

export const requireAuth = ClerkExpressWithAuth() as unknown as RequestHandler;

export const syncUserToDb = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, claims } = req.auth;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });

    if (!existingUser) {
      console.log(`👤 New user detected (${userId}), syncing to DB...`);
      const email =
        (claims?.email as string) || `no-email-${userId}@example.com`;

      await prisma.user.create({
        data: {
          clerkId: userId,
          email: email,
        },
      });
    }

    next();
  } catch (error) {
    console.error("Auth Sync Error:", error);
    return res
      .status(500)
      .json({ error: "Authentication synchronization failed" });
  }
};
