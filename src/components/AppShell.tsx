"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { Recipe, UserProfile } from "@/lib/recipes";
import { getCurrentUserProfile, getRecipes, signOut } from "@/lib/store";

type Props = {
  children: ReactNode;
};

export function AppShell({ children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const recipePool = useMemo(
    () =>
      profile
        ? recipes.filter(
            (recipe) =>
              recipe.ownerId === profile.id || recipe.visibility === "public",
          )
        : [],
    [profile, recipes],
  );

  const searchResults = useMemo(() => {
    const query = normalize(searchQuery);
    if (!query) return [];

    return recipePool
      .filter((recipe) =>
        normalize(
          [
            recipe.title,
            recipe.description,
            recipe.cuisine,
            recipe.authorName,
            recipe.difficulty,
            recipe.dietary.join(" "),
            recipe.ingredients.map((ingredient) => ingredient.name).join(" "),
          ].join(" "),
        ).includes(query),
      )
      .slice(0, 6);
  }, [recipePool, searchQuery]);

  useEffect(() => {
    Promise.all([getCurrentUserProfile(), getRecipes()])
      .then(([nextProfile, nextRecipes]) => {
        setProfile(nextProfile);
        setRecipes(nextRecipes);
      })
      .catch(() => router.push("/"));
  }, [router]);

  async function surpriseMe() {
    if (!profile) return;
    const recipes = await getRecipes();
    const pool = recipes.filter(
      (recipe) =>
        recipe.ownerId === profile.id || recipe.visibility === "public",
    );
    const pick = pool[Math.floor(Math.random() * pool.length)];
    if (pick) router.push(`/app/recipe/${pick.id}`);
  }

  function openRecipe(recipeId: string) {
    setSearchQuery("");
    setSearchOpen(false);
    router.push(`/app/recipe/${recipeId}`);
  }

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const [firstResult] = searchResults;
    if (firstResult) openRecipe(firstResult.id);
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
            alt="شعار دفتر الوصفات"
            width={220}
            height={80}
            priority
            className="mb-5 h-15 w-auto object-contain mx-auto"
          />
        </Link>
        <nav
          className="grid grid-cols-2 gap-2 lg:grid-cols-1"
          aria-label="تطبيق الوصفات"
        >
          <Link className={navClass(pathname === "/app")} href="/app">
            وصفاتي
          </Link>
          <Link
            className={navClass(pathname === "/app/discover")}
            href="/app/discover"
          >
            اكتشف
          </Link>
          <Link
            className={navClass(pathname === "/app/favorites")}
            href="/app/favorites"
          >
            المفضلة
          </Link>
          <Link className={navClass(pathname === "/app/new")} href="/app/new">
            أضف وصفة
          </Link>
        </nav>
      </aside>
      <main className="py-6 lg:py-8">
        <div className="no-print mx-auto mb-8 flex w-[min(1120px,calc(100%-32px))] flex-col gap-4 px-4 md:flex-row md:items-center md:justify-between md:px-0">
          <div className="flex flex-col gap-2 rounded-2xl border border-black/10 bg-white/75 p-2 shadow-[0_12px_34px_rgba(31,37,32,0.08)] backdrop-blur sm:flex-row sm:items-center">
            <form className="relative" onSubmit={handleSearchSubmit}>
              <input
                className="min-h-11 w-full min-w-0 rounded-xl border border-black/10 bg-white px-3 text-sm font-bold text-[#1f2520] outline-none transition placeholder:text-[#8b9288] focus:border-[#d94f32]/50 focus:ring-4 focus:ring-[#d94f32]/10 sm:w-72"
                type="search"
                placeholder="ابحث في كل الوصفات"
                value={searchQuery}
                onBlur={() => setSearchOpen(false)}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
              />
              {searchOpen && searchQuery.trim() ? (
                <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_18px_50px_rgba(31,37,32,0.14)]">
                  {searchResults.length ? (
                    searchResults.map((recipe) => (
                      <button
                        className="block w-full px-4 py-3 text-right transition hover:bg-[#f5efe3]"
                        key={recipe.id}
                        type="button"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => openRecipe(recipe.id)}
                      >
                        <span className="block text-sm font-black text-[#1f2520]">
                          {recipe.title}
                        </span>
                        <span className="mt-1 block text-xs font-bold uppercase tracking-[0.12em] text-[#6f8764]">
                          {recipe.cuisine} ·{" "}
                          {recipe.ownerId === profile?.id ? "وصفاتك" : "عام"}
                        </span>
                      </button>
                    ))
                  ) : (
                    <p className="px-4 py-3 text-sm font-bold text-[#596159]">
                      لا توجد وصفات مطابقة
                    </p>
                  )}
                </div>
              ) : null}
            </form>
            <button
              className="min-h-11 rounded-xl bg-[#d94f32] px-4 text-sm font-black text-white shadow-lg shadow-[#d94f32]/25 transition hover:bg-[#b83e27]"
              type="button"
              onClick={surpriseMe}
            >
              اقترح لي وصفة 🍽️
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
            <strong>{profile?.name ?? "طاهٍ"}</strong>
            <button
              className="min-h-10 rounded-xl border border-black/10 bg-white px-3 text-sm font-black text-[#1f2520] transition hover:border-[#d94f32]/40 hover:text-[#d94f32]"
              type="button"
              onClick={handleSignOut}
            >
              تسجيل الخروج
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

function normalize(value: string) {
  return value.trim().toLowerCase();
}
