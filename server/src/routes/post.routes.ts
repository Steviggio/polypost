import express from "express";
import {
  createPost,
  getPostById,
  getPosts,
} from "../controllers/post.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = express.Router();

router.use(requireAuth);
router.post("/", createPost);
router.get("/", getPosts);
router.get("/:id", getPostById);

export default router;
