import { RecipeExplorer } from "@/components/RecipeExplorer";

export default function DiscoverPage() {
  return (
    <RecipeExplorer
      scope="discover"
      title="Discover"
      description="Browse public recipes from other cooks, search by ingredient or author, and save what catches your appetite."
      emptyTitle="No public recipes match those filters."
    />
  );
}
