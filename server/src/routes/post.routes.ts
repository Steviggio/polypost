import express from "express";
import {
  createPost,
  getPostById,
  getPosts,
  deletePost,
} from "../controllers/post.controller";
import { requireAuth, syncUserToDb } from "../middlewares/auth.middleware";

const router = express.Router();

router.use(requireAuth);
router.use(syncUserToDb);
router.post("/", createPost);
router.get("/", getPosts);
router.get("/:id", getPostById);
router.delete("/:id", deletePost);

export default router;
