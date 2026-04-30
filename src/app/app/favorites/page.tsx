import { RecipeExplorer } from "@/components/RecipeExplorer";

export default function FavoritesPage() {
  return (
    <RecipeExplorer
      scope="favorites"
      title="المفضلة"
      description="كل الوصفات التي حفظتها، سواء كانت من دفتر وصفاتك أو من الوصفات العامة."
      emptyTitle="لا توجد وصفات مفضلة بعد."
    />
  );
}
