import { Recipe } from "./recipes";

export type Scope = "mine" | "discover" | "favorites";
export type SortMode = "newest" | "favorites" | "alphabetical" | "quickest";

export type Filters = {
  query: string;
  cuisine: string;
  dietary: string;
  difficulty: string;
  maxCookTime: string;
  sort: SortMode;
};

export const defaultFilters: Filters = {
  query: "",
  cuisine: "All cuisines",
  dietary: "All diets",
  difficulty: "All levels",
  maxCookTime: "Any time",
  sort: "newest",
};

export function filterRecipes(
  recipes: Recipe[],
  filters: Filters,
  scope: Scope,
  favoriteIds: string[],
  currentUserId: string,
) {
  const query = filters.query.trim().toLowerCase();

  return recipes
    .filter((recipe) => {
      if (scope === "mine" && recipe.ownerId !== currentUserId) return false;
      if (scope === "discover" && recipe.visibility !== "public") return false;
      if (scope === "favorites" && !favoriteIds.includes(recipe.id)) return false;
      return true;
    })
    .filter((recipe) => {
      const haystack = [
        recipe.title,
        recipe.description,
        recipe.authorName,
        recipe.cuisine,
        ...recipe.dietary,
        ...recipe.ingredients.map((ingredient) => ingredient.name),
      ]
        .join(" ")
        .toLowerCase();
      return query ? haystack.includes(query) : true;
    })
    .filter((recipe) =>
      filters.cuisine === "All cuisines" ? true : recipe.cuisine === filters.cuisine,
    )
    .filter((recipe) =>
      filters.dietary === "All diets" ? true : recipe.dietary.includes(filters.dietary),
    )
    .filter((recipe) =>
      filters.difficulty === "All levels" ? true : recipe.difficulty === filters.difficulty,
    )
    .filter((recipe) => {
      if (filters.maxCookTime === "Any time") return true;
      return recipe.cookTime <= Number(filters.maxCookTime);
    })
    .sort((a, b) => {
      if (filters.sort === "alphabetical") return a.title.localeCompare(b.title);
      if (filters.sort === "quickest") return a.cookTime - b.cookTime;
      if (filters.sort === "favorites") {
        return Number(favoriteIds.includes(b.id)) - Number(favoriteIds.includes(a.id));
      }
      return b.createdAt.localeCompare(a.createdAt);
    });
}
