import { RecipeExplorer } from "@/components/RecipeExplorer";

export default function FavoritesPage() {
  return (
    <RecipeExplorer
      scope="favorites"
      title="Favorites"
      description="All the recipes you hearted, whether they came from your cookbook or the shared table."
      emptyTitle="No favorites yet."
    />
  );
}
