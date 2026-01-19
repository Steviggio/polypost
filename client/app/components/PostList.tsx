"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";

interface Post {
  id: string;
  originalContent: string;
  createdAt: string;
  status: string;
}

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = await getToken();
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/posts`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        }
      } catch (error) {
        console.error("Erreur chargement", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [getToken]);

  const handleDelete = async (e: React.MouseEvent, postId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm("Voulez-vous vraiment supprimer ce post ?")) return;

    try {
      const token = await getToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== postId));
      } else {
        alert("Erreur lors de la suppression");
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading)
    return <p className="text-gray-500 text-center">Chargement...</p>;

  if (posts.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <p className="text-gray-600">Aucun post pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Link
          href={`/posts/${post.id}`}
          key={post.id}
          className="block group relative"
        >
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 group-hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-2">
              <span
                className={`text-xs font-bold px-2 py-1 rounded-full ${
                  post.status === "DRAFT" || post.status === "PROCESSING"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {post.status}
              </span>

              <button
                onClick={(e) => handleDelete(e, post.id)}
                className="text-gray-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition-colors z-10"
                title="Supprimer le post"
              >
                🗑️
              </button>
            </div>

            <p className="text-gray-800 whitespace-pre-wrap pr-8">
              {post.originalContent}
            </p>

            <div className="mt-3 text-right">
              <span className="text-xs text-blue-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Voir les traductions →
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
