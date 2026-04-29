"use client";

import { Recipe, UserProfile } from "./recipes";
import { createClient } from "./supabase/browser";

type ProfileRow = {
  display_name: string | null;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
};

type RecipeRow = {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  photo_url: string;
  servings: number;
  prep_time: number;
  cook_time: number;
  difficulty: Recipe["difficulty"];
  cuisine: string;
  dietary: string[];
  ingredients: Recipe["ingredients"];
  steps: string[];
  notes: string;
  visibility: Recipe["visibility"];
  created_at: string;
  profiles: ProfileRow | ProfileRow[] | null;
};

export async function getCurrentUserProfile(): Promise<UserProfile> {
  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("You need to sign in first.");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, full_name, email, avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  const fullName =
    user.user_metadata.full_name ??
    user.user_metadata.name ??
    user.email?.split("@")[0] ??
    "Cook";
  const userName = firstName(fullName);
  const profileName = profile?.display_name?.trim();
  const shouldSyncName = !profileName || profileName === "Cook";
  const name = shouldSyncName ? userName : profileName;

  if (
    shouldSyncName ||
    profile?.full_name !== fullName ||
    profile?.email !== user.email ||
    !profile?.avatar_url
  ) {
    await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        display_name: name,
        full_name: fullName,
        email: user.email ?? null,
        avatar_url:
          profile?.avatar_url ?? user.user_metadata.avatar_url ?? null,
      })
      .select("id")
      .single();
  }

  return {
    id: user.id,
    name,
    fullName,
    email: user.email ?? null,
    avatar: initials(name),
    avatarUrl: profile?.avatar_url ?? user.user_metadata.avatar_url ?? null,
  };
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
}

export async function getRecipes(): Promise<Recipe[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("recipes")
    .select(
      "*, profiles!recipes_owner_id_fkey(display_name, full_name, email, avatar_url)",
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return ((data ?? []) as RecipeRow[]).map(mapRecipe);
}

export async function getRecipe(id: string): Promise<Recipe | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("recipes")
    .select(
      "*, profiles!recipes_owner_id_fkey(display_name, full_name, email, avatar_url)",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? mapRecipe(data as RecipeRow) : null;
}

export async function saveRecipe(recipe: Recipe) {
  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) throw new Error("You need to sign in first.");

  const payload = {
    id: recipe.id,
    owner_id: user.id,
    title: recipe.title,
    description: recipe.description,
    photo_url: recipe.photo,
    servings: recipe.servings,
    prep_time: recipe.prepTime,
    cook_time: recipe.cookTime,
    difficulty: recipe.difficulty,
    cuisine: recipe.cuisine,
    dietary: recipe.dietary,
    ingredients: recipe.ingredients,
    steps: recipe.steps,
    notes: recipe.notes,
    visibility: recipe.visibility,
  };

  const { error } = await supabase.from("recipes").upsert(payload);
  if (error) throw error;
}

export async function uploadRecipePhoto(file: File): Promise<string> {
  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) throw new Error("You need to sign in first.");

  const extension = file.name.split(".").pop() ?? "jpg";
  const path = `${user.id}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage
    .from("recipe-photos")
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw error;

  const { data } = supabase.storage.from("recipe-photos").getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteRecipe(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("recipes").delete().eq("id", id);
  if (error) throw error;
}

export async function getFavorites(): Promise<string[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("favorites").select("recipe_id");
  if (error) throw error;
  return (data ?? []).map((favorite) => favorite.recipe_id as string);
}

export async function toggleFavorite(id: string): Promise<string[]> {
  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) throw new Error("You need to sign in first.");

  const favorites = await getFavorites();

  if (favorites.includes(id)) {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("recipe_id", id);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("favorites")
      .insert({ user_id: user.id, recipe_id: id });
    if (error) throw error;
  }

  return getFavorites();
}

export function createBlankRecipe(profile: UserProfile): Recipe {
  return {
    id: crypto.randomUUID(),
    title: "",
    description: "",
    photo:
      "https://images.unsplash.com/photo-1575000977355-8b2a719926c9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    servings: 4,
    prepTime: 15,
    cookTime: 30,
    difficulty: "Easy",
    cuisine: "Home",
    dietary: [],
    ingredients: [{ qty: 1, unit: "cup", name: "" }],
    steps: [""],
    notes: "",
    visibility: "public",
    ownerId: profile.id,
    authorName: profile.name,
    authorFullName: profile.fullName,
    authorEmail: profile.email,
    authorAvatar: profile.avatar,
    authorAvatarUrl: profile.avatarUrl,
    createdAt: new Date().toISOString(),
  };
}

function mapRecipe(row: RecipeRow): Recipe {
  const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
  const authorName = profile?.display_name ?? "Cook";
  const authorFullName = profile?.full_name ?? authorName;

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    photo: row.photo_url,
    servings: row.servings,
    prepTime: row.prep_time,
    cookTime: row.cook_time,
    difficulty: row.difficulty,
    cuisine: row.cuisine,
    dietary: row.dietary ?? [],
    ingredients: row.ingredients ?? [],
    steps: row.steps ?? [],
    notes: row.notes,
    visibility: row.visibility,
    ownerId: row.owner_id,
    authorName,
    authorFullName,
    authorEmail: profile?.email ?? null,
    authorAvatar: initials(authorName),
    authorAvatarUrl: profile?.avatar_url ?? null,
    createdAt: row.created_at,
  };
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function firstName(name: string) {
  return name.trim().split(/\s+/)[0] || "Cook";
}
