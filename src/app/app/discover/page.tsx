import { RecipeExplorer } from "@/components/RecipeExplorer";

export default function DiscoverPage() {
  return (
    <RecipeExplorer
      scope="discover"
      title="اكتشف"
      description="تصفح وصفات عامة من طهاة آخرين، وابحث بالمكونات أو باسم الكاتب، واحفظ ما يعجبك."
      emptyTitle="لا توجد وصفات عامة تطابق هذه الفلاتر."
    />
  );
}
