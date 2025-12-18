import { Request, Response } from "express";

export const getMe = async (req: Request, res: Response) => {
  res.json({
    message: "You are authenticated and synced!",
    userId: req.auth.userId,
  });
};
