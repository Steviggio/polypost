import express from "express";
import { getMe } from "../controllers/user.controller";
import { requireAuth, syncUserToDb } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/me", getMe, requireAuth, syncUserToDb);

export default router;
