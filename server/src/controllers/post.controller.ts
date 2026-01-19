import mistral from "../lib/mistral";
import prisma from "../lib/prisma";
import { Request, Response } from "express";

export const createPost = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    const clerkId = req.auth?.userId;

    if (!clerkId) {
      return res.status(401).json({ error: "Non authentifié" });
    }

    if (!content) return res.status(400).json({ error: "Contenu requis" });

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user)
      return res.status(404).json({ error: "Utilisateur introuvable" });

    const newPost = await prisma.post.create({
      data: {
        originalContent: content,
        userId: user.id,
        status: "PROCESSING",
      },
    });

    const prompt = `
      Tu es un expert LinkedIn multilingue.
      Adapte le message suivant pour LinkedIn en 3 langues : Anglais (EN), Espagnol (ES) et Portugais (PT).
      Le ton doit être professionnel et engageant.
      
      Message original : "${content}"
      
      Réponds UNIQUEMENT avec un objet JSON au format suivant :
      {
        "EN": "Le texte en anglais...",
        "ES": "Le texte en espagnol...",
        "PT": "Le texte en portugais..."
      }
    `;

    const chatResponse = await mistral.chat.complete({
      model: "mistral-small-latest",
      messages: [{ role: "user", content: prompt }],
      responseFormat: { type: "json_object" },
    });

    const messageContent = chatResponse.choices?.[0].message.content;

    let rawContent = "";

    if (typeof messageContent === "string") {
      rawContent = messageContent;
    } else if (Array.isArray(messageContent)) {
      rawContent = messageContent
        .map((chunk) => {
          if ("text" in chunk) return chunk.text;
          return "";
        })
        .join("");
    }

    if (!rawContent) {
      throw new Error("Mistral a renvoyé une réponse vide.");
    }

    const aiResponse = JSON.parse(rawContent);
    console.log("🤖 MISTRAL A RÉPONDU :", aiResponse);
    await prisma.translation.createMany({
      data: [
        { language: "EN", content: aiResponse.EN, postId: newPost.id },
        { language: "ES", content: aiResponse.ES, postId: newPost.id },
        { language: "PT", content: aiResponse.PT, postId: newPost.id },
      ],
    });

    const finalPost = await prisma.post.update({
      where: { id: newPost.id },
      data: { status: "COMPLETED" },
      include: { translations: true },
    });

    res.status(201).json(finalPost);
  } catch (error) {
    console.error("Erreur Mistral/Backend:", error);
    res.status(500).json({ error: "Erreur lors de la génération avec l'IA" });
  }
};

export const getPosts = async (req: Request, res: Response) => {
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
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const clerkId = req.auth.userId;

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
        userId: user.id,
      },
      include: {
        translations: true,
      },
    });

    if (!post) {
      return res.status(404).json({ error: "Post introuvable" });
    }

    res.json(post);
  } catch (error) {
    console.error("Erreur fetch post:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const clerkId = req.auth.userId;

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) return res.status(404).json({ error: "Post introuvable" });
    if (post.userId !== user.id)
      return res.status(403).json({ error: "Non autorisé" });

    await prisma.post.delete({
      where: { id },
    });

    res.json({ message: "Post supprimé avec succès" });
  } catch (error) {
    console.error("Erreur deletePost:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
