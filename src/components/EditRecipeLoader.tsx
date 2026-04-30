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
      <section className="mx-auto w-[min(1120px,calc(100%-32px))] rounded-3xl border border-dashed border-[#6f8764]/40 bg-white/75 p-8 text-center shadow-[0_18px_50px_rgba(31,37,32,0.08)]">
        <h1 className="serif text-3xl font-black text-[#1f2520]">
          يمكن للكاتب فقط تعديل هذه الوصفة.
        </h1>
        <Link
          className="mt-5 inline-flex min-h-11 items-center rounded-2xl bg-[#d94f32] px-5 font-black text-white shadow-lg shadow-[#d94f32]/20 transition hover:bg-[#b83e27]"
          href="/app/discover"
        >
          العودة إلى الاكتشاف
        </Link>
      </section>
    );
  }

  return <RecipeForm mode="edit" initialRecipe={recipe} />;
}
