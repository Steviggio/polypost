import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { requireAuth, syncUserToDb } from "./middlewares/auth.middleware";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "OK", service: "PolyPost API" });
});

app.get("/api/me", requireAuth, syncUserToDb, async (req, res) => {
  res.json({
    message: "You are authenticated and synced!",
    userId: req.auth.userId,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

app.post("/api/posts", requireAuth, async (req, res) => {
  try {
    const { content } = req.body; 
    const clerkId = "user_36yocvzkoMTJ1SUzWl5Z5S4GHFp"; 

    if (!content) {
      return res.status(400).json({ error: "Le contenu est requis" });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: clerkId },
    });

    if (!user) {
      return res.status(404).json({ error: "Utilisateur introuvable en base" });
    }

    const newPost = await prisma.post.create({
      data: {
        originalContent: content,
        userId: user.id, 
        status: "DRAFT",
      },
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error("Erreur création post:", error);
    res.status(500).json({ error: "Erreur lors de la création du post" });
  }
});

app.get("/api/posts", requireAuth, async (req, res) => {
  try {
    const clerkId = req.auth.userId;

    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return res.status(404).json({ error: "Utilisateur introuvable" });
    }

    const posts = await prisma.post.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc", 
      },
    });

    res.json(posts);
  } catch (error) {
    console.error("Erreur récupération posts:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});
