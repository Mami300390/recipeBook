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
      <section className="mx-auto w-[min(1120px,calc(100%-32px))] rounded-lg border border-dashed border-[#55633f]/40 bg-[#fffaf0]/75 p-8 text-center">
        <h1 className="serif text-3xl font-black text-[#334028]">Recipe not found</h1>
        <Link className="mt-5 inline-flex min-h-11 items-center rounded-lg bg-[#b65f3a] px-5 font-black text-white" href="/app">
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
          backgroundImage: `linear-gradient(0deg, rgba(47,41,36,0.72), rgba(47,41,36,0.18)), url(${recipe.photo})`,
        }}
      >
        <div className="mx-auto w-[min(1120px,100%)] drop-shadow-xl">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#f5d8bd]">
            {recipe.cuisine} · {recipe.difficulty}
          </p>
          <h1 className="serif max-w-4xl text-5xl font-black leading-none md:text-8xl">
            {recipe.title}
          </h1>
          <p className="mt-4 text-[#fff2df]">
            By {recipe.authorName} · {recipe.prepTime + recipe.cookTime} minutes ·{" "}
            {recipe.visibility}
          </p>
        </div>
      </section>
      <section className="mx-auto grid w-[min(1120px,calc(100%-32px))] grid-cols-1 gap-5 px-4 py-7 md:grid-cols-[0.85fr_1.15fr] md:px-0">
        <aside className="rounded-lg border border-[#4a3a2c]/15 bg-[#fffaf0]/90 p-5 shadow-[0_18px_50px_rgba(73,45,25,0.13)]">
          <div className="no-print mb-5 flex flex-wrap gap-2">
            <button
              className="min-h-11 rounded-lg bg-[#55633f] px-4 font-black text-white shadow-lg shadow-[#334028]/20 transition hover:bg-[#334028]"
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
          <h2 className="serif mb-4 text-3xl font-black text-[#334028]">Ingredients</h2>
          <label className="mb-5 grid gap-2 font-black text-[#766a5e]">
            Servings
            <input
              className="min-h-11 rounded-lg border border-[#4a3a2c]/15 bg-[#fffaf0]/90 px-3 text-[#2f2924]"
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
        <article className="rounded-lg border border-[#4a3a2c]/15 bg-[#fffaf0]/90 p-5 shadow-[0_18px_50px_rgba(73,45,25,0.13)]">
          <p className="detail-print-title leading-8 text-[#5f5349]">{recipe.description}</p>
          <h2 className="serif mb-4 mt-6 text-3xl font-black text-[#334028]">Steps</h2>
          <ol className="grid list-none gap-3 p-0">
            {recipe.steps.map((step, index) => (
              <li className="grid grid-cols-[34px_1fr] gap-3 leading-7" key={step}>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-[#b65f3a] font-black text-white">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          {recipe.notes ? (
            <>
              <h2 className="serif mb-3 mt-6 text-3xl font-black text-[#334028]">Notes</h2>
              <p className="leading-7 text-[#5f5349]">{recipe.notes}</p>
            </>
          ) : null}
        </article>
      </section>
    </>
  );
}

const ghostButtonClass =
  "inline-flex min-h-11 items-center rounded-lg border border-[#4a3a2c]/15 bg-white/60 px-4 font-black text-[#2f2924] transition hover:bg-white";

function formatQty(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/0$/, "");
}
