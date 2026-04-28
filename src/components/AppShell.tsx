"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { UserProfile } from "@/lib/recipes";
import {
  getCurrentUserProfile,
  getFavorites,
  getRecipes,
  signOut,
} from "@/lib/store";

type Props = {
  children: ReactNode;
};

export function AppShell({ children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [scope, setScope] = useState("mine");
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (pathname.includes("discover")) setScope("discover");
    if (pathname.includes("favorites")) setScope("favorites");
  }, [pathname]);

  useEffect(() => {
    getCurrentUserProfile()
      .then(setProfile)
      .catch(() => router.push("/"));
  }, [router]);

  async function surpriseMe() {
    if (!profile) return;
    const recipes = await getRecipes();
    const favorites = await getFavorites();
    const pool = recipes.filter((recipe) => {
      if (scope === "mine") return recipe.ownerId === profile.id;
      if (scope === "favorites") return favorites.includes(recipe.id);
      return recipe.visibility === "public";
    });
    const pick = pool[Math.floor(Math.random() * pool.length)];
    if (pick) router.push(`/app/recipe/${pick.id}`);
  }

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  return (
    <div className="min-h-screen md:grid md:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="no-print border-b border-[#4a3a2c]/15 bg-[#fffaf0]/90 p-5 backdrop-blur md:sticky md:top-0 md:h-screen md:border-b-0 md:border-r md:p-6">
        <Link href="/app" className="flex items-center">
          <Image
            src="/logo-bg.png"
            alt="Recipe Book Logo"
            width={220}
            height={80}
            priority
            className="h-14 mb-2 w-auto object-contain"
          />
        </Link>
        <nav
          className="grid grid-cols-2 gap-2 md:grid-cols-1"
          aria-label="Recipe app"
        >
          <Link className={navClass(pathname === "/app")} href="/app">
            My Cookbook
          </Link>
          <Link
            className={navClass(pathname === "/app/discover")}
            href="/app/discover"
          >
            Discover
          </Link>
          <Link
            className={navClass(pathname === "/app/favorites")}
            href="/app/favorites"
          >
            Favorites
          </Link>
          <Link className={navClass(pathname === "/app/new")} href="/app/new">
            Add Recipe
          </Link>
        </nav>
      </aside>
      <main className="py-7">
        <div className="no-print mx-auto mb-8 flex w-[min(1120px,calc(100%-32px))] flex-col gap-4 px-4 md:flex-row md:items-center md:justify-between md:px-0">
          <div className="flex flex-wrap items-center gap-2 rounded-lg border border-[#4a3a2c]/15 bg-[#fffaf0]/85 p-2 shadow-sm">
            <select
              className="min-h-11 rounded-lg border border-[#4a3a2c]/15 bg-white/70 px-3 text-sm font-bold text-[#2f2924]"
              aria-label="Surprise recipe scope"
              value={scope}
              onChange={(event) => setScope(event.target.value)}
            >
              <option value="mine">My Cookbook</option>
              <option value="discover">Discover</option>
              <option value="favorites">My Favorites</option>
            </select>
            <button
              className="min-h-11 rounded-lg bg-[#55633f] px-4 text-sm font-black text-white shadow-lg shadow-[#334028]/20 transition hover:bg-[#334028]"
              type="button"
              onClick={surpriseMe}
            >
              Surprise Me
            </button>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-[#4a3a2c]/15 bg-[#fffaf0]/85 p-2 shadow-sm">
            {profile?.avatarUrl ? (
              <Image
                src={profile.avatarUrl}
                alt={profile.name}
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[#55633f] font-black text-white">
                {profile?.avatar ?? "?"}
              </span>
            )}
            <strong>{profile?.name ?? "Cook"}</strong>
            <button
              className="min-h-10 rounded-lg border border-[#4a3a2c]/15 bg-white/60 px-3 text-sm font-black transition hover:bg-white"
              type="button"
              onClick={handleSignOut}
            >
              Sign out
            </button>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}

function navClass(active: boolean) {
  return [
    "rounded-lg border px-4 py-3 text-sm font-black transition",
    active
      ? "border-[#b65f3a]/30 bg-[#fff7e8] text-[#8f4328] shadow-sm"
      : "border-transparent text-[#2f2924] hover:border-[#4a3a2c]/15 hover:bg-[#fff7e8] hover:text-[#8f4328]",
  ].join(" ");
}
