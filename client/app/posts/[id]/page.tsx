"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Translation {
  id: string;
  language: "EN" | "ES" | "PT";
  content: string;
}

interface PostDetail {
  id: string;
  originalContent: string;
  createdAt: string;
  status: string;
  translations: Translation[];
}

export default function PostDetailPage() {
  const { id } = useParams();
  const { getToken } = useAuth();
  const router = useRouter();

  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = await getToken();
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (!res.ok) throw new Error("Post introuvable");

        const data = await res.json();
        setPost(data);
      } catch (error) {
        console.error(error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPost();
  }, [id, getToken, router]);

  if (loading)
    return <div className="p-8 text-center">Chargement des traductions...</div>;
  if (!post) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="text-blue-600 hover:underline mb-6 inline-block"
        >
          ← Retour au tableau de bord
        </Link>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
            Original (Français)
          </h2>
          <p className="text-xl text-gray-900 leading-relaxed whitespace-pre-wrap">
            {post.originalContent}
          </p>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Traductions IA
        </h2>

        {post.translations.length === 0 ? (
          <p className="text-gray-500 italic">
            Aucune traduction disponible (ou en cours de génération...)
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {post.translations
              .sort((a, b) => a.language.localeCompare(b.language))
              .map((t) => (
                <div
                  key={t.id}
                  className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center mb-3">
                    <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700 mr-2">
                      {t.language}
                    </span>
                    <span className="text-sm font-semibold text-gray-600">
                      {t.language === "EN"
                        ? "Anglais"
                        : t.language === "ES"
                          ? "Espagnol"
                          : "Portugais"}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                    {t.content}
                  </p>
                  <button
                    onClick={() => navigator.clipboard.writeText(t.content)}
                    className="mt-4 text-xs text-blue-500 hover:text-blue-700 font-medium"
                  >
                    Copier le texte
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
