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
    <div className="min-h-screen lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="no-print border-b border-black/10 bg-white/80 p-5 shadow-[0_16px_50px_rgba(31,37,32,0.08)] backdrop-blur-xl lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r lg:p-6">
        <Link href="/app" className="flex items-center">
          <Image
            src="/logo-bg.png"
            alt="Recipe Book Logo"
            width={220}
            height={80}
            priority
            className="mb-5 h-14 w-auto object-contain"
          />
        </Link>
        <nav
          className="grid grid-cols-2 gap-2 lg:grid-cols-1"
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
      <main className="py-6 lg:py-8">
        <div className="no-print mx-auto mb-8 flex w-[min(1120px,calc(100%-32px))] flex-col gap-4 px-4 md:flex-row md:items-center md:justify-between md:px-0">
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-black/10 bg-white/75 p-2 shadow-[0_12px_34px_rgba(31,37,32,0.08)] backdrop-blur">
            <select
              className="min-h-11 rounded-xl border border-black/10 bg-white px-3 text-sm font-bold text-[#1f2520] outline-none"
              aria-label="Surprise recipe scope"
              value={scope}
              onChange={(event) => setScope(event.target.value)}
            >
              <option value="mine">My Cookbook</option>
              <option value="discover">Discover</option>
              <option value="favorites">My Favorites</option>
            </select>
            <button
              className="min-h-11 rounded-xl bg-[#d94f32] px-4 text-sm font-black text-white shadow-lg shadow-[#d94f32]/25 transition hover:bg-[#b83e27]"
              type="button"
              onClick={surpriseMe}
            >
              Surprise Me
            </button>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white/75 p-2 shadow-[0_12px_34px_rgba(31,37,32,0.08)] backdrop-blur">
            {profile?.avatarUrl ? (
              <Image
                src={profile.avatarUrl}
                alt={profile.name}
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[#6f8764] font-black text-white">
                {profile?.avatar ?? ""}
              </span>
            )}
            <strong>{profile?.name ?? "Cook"}</strong>
            <button
              className="min-h-10 rounded-xl border border-black/10 bg-white px-3 text-sm font-black text-[#1f2520] transition hover:border-[#d94f32]/40 hover:text-[#d94f32]"
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
    "rounded-2xl border px-4 py-3 text-sm font-black transition",
    active
      ? "border-[#d94f32]/25 bg-[#d94f32] text-white shadow-lg shadow-[#d94f32]/20"
      : "border-transparent text-[#4c554d] hover:border-black/10 hover:bg-[#f5efe3] hover:text-[#d94f32]",
  ].join(" ");
}
