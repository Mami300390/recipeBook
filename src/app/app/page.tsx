import { RecipeExplorer } from "@/components/RecipeExplorer";

export default function MyCookbookPage() {
  return (
    <RecipeExplorer
      scope="mine"
      title="وصفاتي"
      description="هنا تجد وصفاتك الخاصة والعامة، جاهزة للتعديل والطباعة والحفظ والطبخ من جديد."
      emptyTitle="دفترك ينتظر أول وصفة."
      emptyAction="أضف أول وصفة"
    />
  );
}
