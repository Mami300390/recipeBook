import { RecipeExplorer } from "@/components/RecipeExplorer";

export default function MyCookbookPage() {
  return (
    <RecipeExplorer
      scope="mine"
      title="My Cookbook"
      description="Your private and public recipes live here, ready to edit, print, favorite, and cook again."
      emptyTitle="Your cookbook is waiting for its first recipe."
      emptyAction="Add your first recipe"
    />
  );
}
