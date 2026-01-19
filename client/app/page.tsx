"use client";

import {
  UserButton,
  SignInButton,
  SignedIn,
  SignedOut,
  useAuth,
} from "@clerk/nextjs";
import CreatePostForm from "./components/CreatePostForm";
import PostList from "./components/PostList";
import { useState } from "react";

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);
  const { isLoaded } = useAuth();

  const handlePostCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        Chargement...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b p-4 flex justify-between items-center shadow-sm">
        <h1 className="text-2xl font-bold text-blue-600">PolyPost</h1>

        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>

        <SignedOut>
          <SignInButton mode="modal">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Se connecter
            </button>
          </SignInButton>
        </SignedOut>
      </nav>

      <main className="max-w-2xl mx-auto p-8">
        <SignedOut>
          <div className="text-center mt-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Bienvenue sur PolyPost 👋
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              L&apos;outil ultime pour générer vos posts LinkedIn multilingues grâce
              à l&apos;IA.
            </p>
            <SignInButton mode="modal">
              <button className="bg-blue-600 text-white text-lg px-8 py-3 rounded-full hover:bg-blue-700 shadow-lg transition-transform transform hover:scale-105">
                Commencer maintenant
              </button>
            </SignInButton>
          </div>
        </SignedOut>

        <SignedIn>
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
        </SignedIn>
      </main>
    </div>
  );
}
