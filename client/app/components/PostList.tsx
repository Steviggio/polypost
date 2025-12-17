"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";

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
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        }
      } catch (error) {
        console.error("Erreur chargement posts", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [getToken]);

  if (loading)
    return <p className="text-gray-500 text-center">Chargement des posts...</p>;

  if (posts.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <p className="text-gray-600">
          Aucun post pour le moment. Lancez-vous ! 🚀
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-2">
            <span
              className={`text-xs font-bold px-2 py-1 rounded-full ${
                post.status === "DRAFT"
                  ? "bg-gray-100 text-gray-600"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {post.status}
            </span>
            <span className="text-xs text-gray-400">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="text-gray-800 whitespace-pre-wrap">
            {post.originalContent}
          </p>
        </div>
      ))}
    </div>
  );
}
