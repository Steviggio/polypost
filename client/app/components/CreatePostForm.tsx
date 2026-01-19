"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";

export default function CreatePostForm({
  onPostCreated,
}: {
  onPostCreated?: () => void;
}) {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded || !isSignedIn) {
      alert("Veuillez patienter, connexion à Clerk en cours...");
      return;
    }

    setStatus("idle");

    try {
      const token = await getToken();

      if (!token) {
        console.error("Token est null malgré isSignedIn=true");
        setStatus("error");
        return;
      }

      console.log("Token envoyé :", token.substring(0, 10) + "..."); // Debug

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur serveur");
      }

      setContent("");
      setStatus("success");
      if (onPostCreated) onPostCreated();
      console.log("Post créé avec succès !");
    } catch (error) {
      console.error(error);
      setStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
      <h2 className="text-xl font-bold mb-4">Nouveau Post</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-30 text-gray-800"
          placeholder="Qu'avez-vous en tête pour LinkedIn ?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isLoading}
        />

        <div className="flex justify-between items-center mt-4">
          <div>
            {status === "success" && (
              <span className="text-green-600 text-sm">Post créé ! ✅</span>
            )}
            {status === "error" && (
              <span className="text-red-600 text-sm">
                Erreur lors de l&apos;envoi ❌
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !content.trim()}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? "Envoi..." : "Créer le post"}
          </button>
        </div>
      </form>
    </div>
  );
}
