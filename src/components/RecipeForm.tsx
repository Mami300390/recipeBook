"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Recipe } from "@/lib/recipes";
import {
  createBlankRecipe,
  getCurrentUserProfile,
  saveRecipe,
  uploadRecipePhoto,
} from "@/lib/store";

type Props = {
  initialRecipe?: Recipe;
  mode: "new" | "edit";
};

export function RecipeForm({ initialRecipe, mode }: Props) {
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(initialRecipe ?? null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialRecipe) return;
    getCurrentUserProfile()
      .then((profile) => setRecipe(createBlankRecipe(profile)))
      .catch((caught: Error) => setError(caught.message));
  }, [initialRecipe]);

  function set<K extends keyof Recipe>(key: K, value: Recipe[K]) {
    setRecipe((current) => (current ? { ...current, [key]: value } : current));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!recipe) return;
    const cleaned: Recipe = {
      ...recipe,
      title: recipe.title.trim() || "Untitled Recipe",
      ingredients: recipe.ingredients.filter((ingredient) => ingredient.name.trim()),
      steps: recipe.steps.filter((step) => step.trim()),
      dietary: recipe.dietary.filter(Boolean),
    };
    try {
      await saveRecipe(cleaned);
      router.push(`/app/recipe/${cleaned.id}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not save recipe.");
    }
  }

  async function handlePhotoUpload(file: File | undefined) {
    if (!file) return;
    try {
      const url = await uploadRecipePhoto(file);
      set("photo", url);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not upload photo.");
    }
  }

  if (!recipe) {
    return (
      <section className="mx-auto w-[min(1120px,calc(100%-32px))] rounded-3xl border border-dashed border-[#6f8764]/40 bg-white/75 p-8 text-center shadow-[0_18px_50px_rgba(31,37,32,0.08)]">
        <h1 className="serif text-3xl font-black text-[#1f2520]">
          {error || "Preparing recipe form..."}
        </h1>
      </section>
    );
  }

  return (
    <>
      <section className="mx-auto mb-6 flex w-[min(1120px,calc(100%-32px))] flex-col gap-4 px-4 md:flex-row md:items-end md:justify-between md:px-0">
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-[#d94f32]">
            {mode === "new" ? "Add" : "Edit"}
          </p>
          <h1 className="serif text-5xl font-black leading-none text-[#1f2520] md:text-7xl">
            {mode === "new" ? "New Recipe" : recipe.title}
          </h1>
        </div>
        <p className="max-w-xl leading-7 text-[#596159]">
          Capture the dish in enough detail that future-you can cook it without hunting for notes.
        </p>
      </section>
      <form
        className="mx-auto grid w-[min(1120px,calc(100%-32px))] grid-cols-1 gap-4 px-4 md:grid-cols-2 md:px-0"
        onSubmit={submit}
      >
        <label className="grid gap-2 font-black text-[#596159] md:col-span-2">
          Title
          <input className={fieldClass} value={recipe.title} onChange={(event) => set("title", event.target.value)} />
        </label>
        <label className="grid gap-2 font-black text-[#596159] md:col-span-2">
          Description
          <textarea className={textareaClass} value={recipe.description} onChange={(event) => set("description", event.target.value)} />
        </label>
        <label className="grid gap-2 font-black text-[#596159] md:col-span-2">
          Photo URL
          <input className={fieldClass} value={recipe.photo} onChange={(event) => set("photo", event.target.value)} />
        </label>
        <label className="grid gap-2 font-black text-[#596159] md:col-span-2">
          Upload photo
          <input className={fieldClass} type="file" accept="image/*" onChange={(event) => handlePhotoUpload(event.target.files?.[0])} />
        </label>
        <label className="grid gap-2 font-black text-[#596159]">
          Servings
          <input className={fieldClass} type="number" min="1" value={recipe.servings} onChange={(event) => set("servings", Number(event.target.value))} />
        </label>
        <label className="grid gap-2 font-black text-[#596159]">
          Prep minutes
          <input className={fieldClass} type="number" min="0" value={recipe.prepTime} onChange={(event) => set("prepTime", Number(event.target.value))} />
        </label>
        <label className="grid gap-2 font-black text-[#596159]">
          Cook minutes
          <input className={fieldClass} type="number" min="0" value={recipe.cookTime} onChange={(event) => set("cookTime", Number(event.target.value))} />
        </label>
        <label className="grid gap-2 font-black text-[#596159]">
          Difficulty
          <select className={fieldClass} value={recipe.difficulty} onChange={(event) => set("difficulty", event.target.value as Recipe["difficulty"])}>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </label>
        <label className="grid gap-2 font-black text-[#596159]">
          Cuisine
          <input className={fieldClass} value={recipe.cuisine} onChange={(event) => set("cuisine", event.target.value)} />
        </label>
        <label className="grid gap-2 font-black text-[#596159]">
          Dietary tags
          <input className={fieldClass} value={recipe.dietary.join(", ")} onChange={(event) => set("dietary", event.target.value.split(",").map((tag) => tag.trim()))} />
        </label>
        <label className="grid gap-2 font-black text-[#596159]">
          Visibility
          <select className={fieldClass} value={recipe.visibility} onChange={(event) => set("visibility", event.target.value as Recipe["visibility"])}>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </label>
        <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-[0_18px_50px_rgba(31,37,32,0.08)] md:col-span-2">
          <h2 className="serif mb-4 text-3xl font-black text-[#1f2520]">Ingredients</h2>
          {recipe.ingredients.map((ingredient, index) => (
            <div className="mb-2 grid grid-cols-1 gap-2 md:grid-cols-[1fr_1fr_1.4fr]" key={index}>
              <input className={fieldClass} type="number" min="0" step="0.25" value={ingredient.qty} onChange={(event) => {
                const ingredients = [...recipe.ingredients];
                ingredients[index] = { ...ingredient, qty: Number(event.target.value) };
                set("ingredients", ingredients);
              }} />
              <input className={fieldClass} value={ingredient.unit} placeholder="unit" onChange={(event) => {
                const ingredients = [...recipe.ingredients];
                ingredients[index] = { ...ingredient, unit: event.target.value };
                set("ingredients", ingredients);
              }} />
              <input className={fieldClass} value={ingredient.name} placeholder="ingredient" onChange={(event) => {
                const ingredients = [...recipe.ingredients];
                ingredients[index] = { ...ingredient, name: event.target.value };
                set("ingredients", ingredients);
              }} />
            </div>
          ))}
          <button className={ghostButtonClass} type="button" onClick={() => set("ingredients", [...recipe.ingredients, { qty: 1, unit: "", name: "" }])}>
            Add ingredient
          </button>
        </div>
        <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-[0_18px_50px_rgba(31,37,32,0.08)] md:col-span-2">
          <h2 className="serif mb-4 text-3xl font-black text-[#1f2520]">Steps</h2>
          {recipe.steps.map((step, index) => (
            <textarea key={index} className={`${textareaClass} mb-2`} value={step} onChange={(event) => {
              const steps = [...recipe.steps];
              steps[index] = event.target.value;
              set("steps", steps);
            }} />
          ))}
          <button className={ghostButtonClass} type="button" onClick={() => set("steps", [...recipe.steps, ""])}>
            Add step
          </button>
        </div>
        <label className="grid gap-2 font-black text-[#596159] md:col-span-2">
          Notes
          <textarea className={textareaClass} value={recipe.notes} onChange={(event) => set("notes", event.target.value)} />
        </label>
        <div className="flex flex-wrap gap-3 md:col-span-2">
          {error ? <p className="w-full text-[#b83e27]">{error}</p> : null}
          <button className="min-h-11 rounded-2xl bg-[#d94f32] px-5 font-black text-white shadow-lg shadow-[#d94f32]/20 transition hover:bg-[#b83e27]" type="submit">
            Save recipe
          </button>
          <button className={ghostButtonClass} type="button" onClick={() => router.back()}>
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}

const fieldClass =
  "min-h-11 w-full rounded-2xl border border-black/10 bg-white px-3 text-[#1f2520] outline-none transition placeholder:text-[#8b9288] focus:border-[#d94f32]/50 focus:ring-4 focus:ring-[#d94f32]/10";

const textareaClass =
  "min-h-32 w-full rounded-2xl border border-black/10 bg-white px-3 py-3 text-[#1f2520] outline-none transition placeholder:text-[#8b9288] focus:border-[#d94f32]/50 focus:ring-4 focus:ring-[#d94f32]/10";

const ghostButtonClass =
  "inline-flex min-h-11 items-center rounded-2xl border border-black/10 bg-white px-4 font-black text-[#1f2520] transition hover:border-[#d94f32]/40 hover:text-[#d94f32]";
