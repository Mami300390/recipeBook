"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Recipe, UserProfile } from "@/lib/recipes";
import {
  deleteRecipe,
  getCurrentUserProfile,
  getFavorites,
  getRecipe,
  toggleFavorite,
} from "@/lib/store";

export function RecipeDetail() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null | undefined>(undefined);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [servings, setServings] = useState(1);

  useEffect(() => {
    Promise.all([getCurrentUserProfile(), getRecipe(params.id), getFavorites()]).then(
      ([nextProfile, nextRecipe, nextFavorites]) => {
        setProfile(nextProfile);
        setRecipe(nextRecipe);
        setFavorites(nextFavorites);
        setServings(nextRecipe?.servings ?? 1);
      },
    );
  }, [params.id]);

  if (recipe === undefined) return null;

  if (!recipe) {
    return (
      <section className="mx-auto w-[min(1120px,calc(100%-32px))] rounded-3xl border border-dashed border-[#6f8764]/40 bg-white/75 p-8 text-center shadow-[0_18px_50px_rgba(31,37,32,0.08)]">
        <h1 className="serif text-3xl font-black text-[#1f2520]">Recipe not found</h1>
        <Link className="mt-5 inline-flex min-h-11 items-center rounded-2xl bg-[#d94f32] px-5 font-black text-white" href="/app">
          Back to cookbook
        </Link>
      </section>
    );
  }

  const ratio = servings / recipe.servings;
  const isMine = recipe.ownerId === profile?.id;
  const favorite = favorites.includes(recipe.id);

  function remove() {
    if (!recipe || !isMine) return;
    deleteRecipe(recipe.id).then(() => router.push("/app"));
  }

  return (
    <>
      <section
        className="grid min-h-[46vh] items-end bg-cover bg-center px-4 py-8 text-white"
        style={{
          backgroundImage: `linear-gradient(0deg, rgba(31,37,32,0.78), rgba(31,37,32,0.16)), url(${recipe.photo})`,
        }}
      >
        <div className="mx-auto w-[min(1120px,100%)] drop-shadow-xl">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#ffcfbc]">
            {recipe.cuisine} · {recipe.difficulty}
          </p>
          <h1 className="serif max-w-4xl text-5xl font-black leading-none md:text-8xl">
            {recipe.title}
          </h1>
          <p className="mt-4 text-[#f8efe4]">
            By {recipe.authorName} · {recipe.prepTime + recipe.cookTime} minutes ·{" "}
            {recipe.visibility}
          </p>
        </div>
      </section>
      <section className="mx-auto grid w-[min(1120px,calc(100%-32px))] grid-cols-1 gap-5 px-4 py-7 md:grid-cols-[0.85fr_1.15fr] md:px-0">
        <aside className="rounded-3xl border border-black/10 bg-white p-5 shadow-[0_18px_50px_rgba(31,37,32,0.08)]">
          <div className="no-print mb-5 flex flex-wrap gap-2">
            <button
              className="min-h-11 rounded-2xl bg-[#d94f32] px-4 font-black text-white shadow-lg shadow-[#d94f32]/20 transition hover:bg-[#b83e27]"
              type="button"
              onClick={async () => setFavorites(await toggleFavorite(recipe.id))}
            >
              {favorite ? "Hearted" : "Favorite"}
            </button>
            {isMine ? (
              <>
                <Link className={ghostButtonClass} href={`/app/recipe/${recipe.id}/edit`}>
                  Edit
                </Link>
                <button className={ghostButtonClass} type="button" onClick={remove}>
                  Delete
                </button>
              </>
            ) : null}
            <button className={ghostButtonClass} type="button" onClick={() => window.print()}>
              Print
            </button>
          </div>
          <h2 className="serif mb-4 text-3xl font-black text-[#1f2520]">Ingredients</h2>
          <label className="mb-5 grid gap-2 font-black text-[#596159]">
            Servings
            <input
              className="min-h-11 rounded-2xl border border-black/10 bg-white px-3 text-[#1f2520]"
              type="number"
              min="1"
              value={servings}
              onChange={(event) => setServings(Number(event.target.value))}
            />
          </label>
          <ul className="grid list-none gap-3 p-0">
            {recipe.ingredients.map((ingredient) => (
              <li key={`${ingredient.name}-${ingredient.unit}`}>
                <label className="flex items-baseline gap-3 leading-6">
                  <input type="checkbox" />
                  <span>
                    {formatQty(ingredient.qty * ratio)} {ingredient.unit} {ingredient.name}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </aside>
        <article className="rounded-3xl border border-black/10 bg-white p-5 shadow-[0_18px_50px_rgba(31,37,32,0.08)]">
          <p className="detail-print-title leading-8 text-[#596159]">{recipe.description}</p>
          <h2 className="serif mb-4 mt-6 text-3xl font-black text-[#1f2520]">Steps</h2>
          <ol className="grid list-none gap-3 p-0">
            {recipe.steps.map((step, index) => (
              <li className="grid grid-cols-[34px_1fr] gap-3 leading-7" key={step}>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-[#d94f32] font-black text-white">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          {recipe.notes ? (
            <>
              <h2 className="serif mb-3 mt-6 text-3xl font-black text-[#1f2520]">Notes</h2>
              <p className="leading-7 text-[#596159]">{recipe.notes}</p>
            </>
          ) : null}
        </article>
      </section>
    </>
  );
}

const ghostButtonClass =
  "inline-flex min-h-11 items-center rounded-2xl border border-black/10 bg-white px-4 font-black text-[#1f2520] transition hover:border-[#d94f32]/40 hover:text-[#d94f32]";

function formatQty(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/0$/, "");
}
