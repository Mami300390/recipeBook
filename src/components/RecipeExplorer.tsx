"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Recipe, UserProfile, difficulties } from "@/lib/recipes";
import { defaultFilters, filterRecipes, Filters, Scope } from "@/lib/filter";
import { getCurrentUserProfile, getFavorites, getRecipes } from "@/lib/store";
import { RecipeCard } from "./RecipeCard";

type Props = {
  scope: Scope;
  title: string;
  description: string;
  emptyTitle: string;
  emptyAction?: string;
};

export function RecipeExplorer({
  scope,
  title,
  description,
  emptyTitle,
  emptyAction,
}: Props) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  useEffect(() => {
    Promise.all([getCurrentUserProfile(), getRecipes(), getFavorites()])
      .then(([nextProfile, nextRecipes, nextFavorites]) => {
        setProfile(nextProfile);
        setRecipes(nextRecipes);
        setFavorites(nextFavorites);
      })
      .catch((caught: Error) => setError(caught.message));
  }, []);

  const visible = useMemo(
    () => filterRecipes(recipes, filters, scope, favorites, profile?.id ?? ""),
    [recipes, filters, scope, favorites, profile?.id],
  );

  const cuisines = useMemo(
    () => Array.from(new Set(recipes.map((recipe) => recipe.cuisine))).sort(),
    [recipes],
  );
  const dietaryTags = useMemo(
    () => Array.from(new Set(recipes.flatMap((recipe) => recipe.dietary))).sort(),
    [recipes],
  );

  function updateFilter<K extends keyof Filters>(key: K, value: Filters[K]) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  return (
    <>
      <section className="mx-auto mb-6 flex w-[min(1120px,calc(100%-32px))] flex-col gap-4 px-4 md:flex-row md:items-end md:justify-between md:px-0">
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-[#d94f32]">
            Recipe Book
          </p>
          <h1 className="serif text-5xl font-black leading-none text-[#1f2520] md:text-7xl">
            {title}
          </h1>
        </div>
        <p className="max-w-xl leading-7 text-[#596159]">{description}</p>
      </section>
      <section
        className="mx-auto mb-6 grid w-[min(1120px,calc(100%-32px))] grid-cols-1 gap-2 rounded-3xl border border-black/10 bg-white/75 p-3 shadow-[0_18px_50px_rgba(31,37,32,0.08)] backdrop-blur md:grid-cols-[1.4fr_repeat(4,minmax(130px,1fr))]"
        aria-label="Recipe filters"
      >
        <input
          className="min-h-11 rounded-2xl border border-black/10 bg-white px-3 text-[#1f2520] outline-none transition placeholder:text-[#8b9288] focus:border-[#d94f32]/50 focus:ring-4 focus:ring-[#d94f32]/10"
          placeholder="Search title, ingredient, tag, author"
          value={filters.query}
          onChange={(event) => updateFilter("query", event.target.value)}
        />
        <select
          className="min-h-11 rounded-2xl border border-black/10 bg-white px-3 font-bold text-[#1f2520]"
          value={filters.cuisine}
          onChange={(event) => updateFilter("cuisine", event.target.value)}
        >
          <option>All cuisines</option>
          {cuisines.map((cuisine) => (
            <option key={cuisine}>{cuisine}</option>
          ))}
        </select>
        <select
          className="min-h-11 rounded-2xl border border-black/10 bg-white px-3 font-bold text-[#1f2520]"
          value={filters.dietary}
          onChange={(event) => updateFilter("dietary", event.target.value)}
        >
          <option>All diets</option>
          {dietaryTags.map((tag) => (
            <option key={tag}>{tag}</option>
          ))}
        </select>
        <select
          className="min-h-11 rounded-2xl border border-black/10 bg-white px-3 font-bold text-[#1f2520]"
          value={filters.difficulty}
          onChange={(event) => updateFilter("difficulty", event.target.value)}
        >
          <option>All levels</option>
          {difficulties.map((difficulty) => (
            <option key={difficulty}>{difficulty}</option>
          ))}
        </select>
        <select
          className="min-h-11 rounded-2xl border border-black/10 bg-white px-3 font-bold text-[#1f2520]"
          value={filters.maxCookTime}
          onChange={(event) => updateFilter("maxCookTime", event.target.value)}
        >
          <option>Any time</option>
          <option value="15">15 min</option>
          <option value="30">30 min</option>
          <option value="45">45 min</option>
          <option value="60">60 min</option>
        </select>
        <select
          className="min-h-11 rounded-2xl border border-black/10 bg-white px-3 font-bold text-[#1f2520] md:col-start-1"
          value={filters.sort}
          onChange={(event) => updateFilter("sort", event.target.value as Filters["sort"])}
        >
          <option value="newest">Newest</option>
          <option value="favorites">Favorites</option>
          <option value="alphabetical">Alphabetical</option>
          <option value="quickest">Quickest</option>
        </select>
      </section>
      {visible.length ? (
        <section className="mx-auto grid w-[min(1120px,calc(100%-32px))] grid-cols-1 gap-5 px-4 md:grid-cols-2 md:px-0 xl:grid-cols-3">
          {visible.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              favorite={favorites.includes(recipe.id)}
              currentUserId={profile?.id}
            />
          ))}
        </section>
      ) : error ? (
        <section className="mx-auto w-[min(1120px,calc(100%-32px))] rounded-3xl border border-dashed border-[#6f8764]/40 bg-white/75 p-8 text-center shadow-[0_18px_50px_rgba(31,37,32,0.08)]">
          <h2 className="serif text-3xl font-black text-[#1f2520]">
            Supabase needs a little attention.
          </h2>
          <p className="mt-2 text-[#596159]">{error}</p>
        </section>
      ) : (
        <section className="mx-auto w-[min(1120px,calc(100%-32px))] rounded-3xl border border-dashed border-[#6f8764]/40 bg-white/75 p-8 text-center shadow-[0_18px_50px_rgba(31,37,32,0.08)]">
          <h2 className="serif text-3xl font-black text-[#1f2520]">{emptyTitle}</h2>
          {emptyAction ? (
            <Link
              className="mt-5 inline-flex min-h-11 items-center rounded-2xl bg-[#d94f32] px-5 font-black text-white shadow-lg shadow-[#d94f32]/20 transition hover:bg-[#b83e27]"
              href="/app/new"
            >
              {emptyAction}
            </Link>
          ) : null}
        </section>
      )}
    </>
  );
}
