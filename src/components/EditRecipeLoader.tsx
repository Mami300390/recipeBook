"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { RecipeForm } from "@/components/RecipeForm";
import { Recipe, UserProfile } from "@/lib/recipes";
import { getCurrentUserProfile, getRecipe } from "@/lib/store";

export function EditRecipeLoader() {
  const params = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null | undefined>(undefined);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    Promise.all([getCurrentUserProfile(), getRecipe(params.id)]).then(
      ([nextProfile, nextRecipe]) => {
        setProfile(nextProfile);
        setRecipe(nextRecipe);
      },
    );
  }, [params.id]);

  if (recipe === undefined) return null;

  if (!recipe || recipe.ownerId !== profile?.id) {
    return (
      <section className="mx-auto w-[min(1120px,calc(100%-32px))] rounded-lg border border-dashed border-[#55633f]/40 bg-[#fffaf0]/75 p-8 text-center">
        <h1 className="serif text-3xl font-black text-[#334028]">
          Only the author can edit this recipe.
        </h1>
        <Link
          className="mt-5 inline-flex min-h-11 items-center rounded-lg bg-[#b65f3a] px-5 font-black text-white"
          href="/app/discover"
        >
          Back to Discover
        </Link>
      </section>
    );
  }

  return <RecipeForm mode="edit" initialRecipe={recipe} />;
}
