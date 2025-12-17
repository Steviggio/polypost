"use client"; 

import { UserButton } from "@clerk/nextjs";
import CreatePostForm from "./components/CreatePostForm";
import PostList from "./components/PostList";
import { useState } from "react";

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePostCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">PolyPost</h1>
        <UserButton afterSignOutUrl="/" />
      </nav>

      <main className="max-w-2xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tableau de bord
          </h1>
          <p className="text-gray-600">
            Gérez vos publications LinkedIn multilingues.
          </p>
        </div>

        <CreatePostForm onPostCreated={handlePostCreated} />

        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Vos posts récents
          </h2>
          <PostList key={refreshKey} />
        </div>
      </main>
    </div>
  );
}
