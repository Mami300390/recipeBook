import Link from "next/link";
import Image from "next/image";
import { Recipe } from "@/lib/recipes";

type Props = {
  recipe: Recipe;
  favorite?: boolean;
  currentUserId?: string;
  onToggleFavorite?: (recipeId: string) => void | Promise<void>;
};

export function RecipeCard({
  recipe,
  favorite = false,
  currentUserId,
  onToggleFavorite,
}: Props) {
  const totalTime = recipe.prepTime + recipe.cookTime;
  const isMine = recipe.ownerId === currentUserId;

  return (
    <article className="group flex min-h-full flex-col overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_20px_55px_rgba(31,37,32,0.09)] transition hover:-translate-y-1 hover:border-[#d94f32]/25 hover:shadow-[0_26px_70px_rgba(31,37,32,0.13)]">
      <Link href={`/app/recipe/${recipe.id}`}>
        <Image
          className="aspect-4/3 w-full bg-[#ece4d7] object-cover transition duration-300 group-hover:scale-[1.03]"
          src={recipe.photo}
          alt=""
          width={640}
          height={480}
          sizes="(max-width: 900px) 100vw, 33vw"
        />
      </Link>
      <div className="grid gap-3 p-5">
        <div className="flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.12em] text-[#6f8764]">
          <span>{recipe.cuisine}</span>
          <span>{totalTime} min</span>
          <span>{recipe.difficulty}</span>
        </div>
        <Link href={`/app/recipe/${recipe.id}`}>
          <h2 className="serif m-0 text-2xl font-black leading-tight text-[#1f2520] transition group-hover:text-[#d94f32]">
            {recipe.title}
          </h2>
        </Link>
        <p className="line-clamp-3 text-sm leading-6 text-[#596159]">
          {recipe.description}
        </p>
        <div className="flex flex-wrap items-center gap-2 text-sm text-[#596159]">
          <span
            className="grid h-9 w-9 place-items-center rounded-full bg-[#1f2520] text-xs font-black text-white"
            aria-hidden="true"
          >
            {recipe.authorAvatar}
          </span>
          <span>
            {recipe.authorName}
            {isMine ? " · yours" : ""}
          </span>
          <span>{recipe.visibility}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {recipe.dietary.map((tag) => (
            <span
              className="rounded-full bg-[#f5efe3] px-2.5 py-1 text-xs font-black text-[#6f8764]"
              key={tag}
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-1 flex items-center justify-between gap-3 border-t border-black/10 pt-4">
          <Link
            className="text-sm font-black text-[#d94f32] transition hover:text-[#b83e27]"
            href={`/app/recipe/${recipe.id}`}
          >
            View recipe
          </Link>
          <button
            className={[
              "min-h-10 rounded-xl border px-3 text-sm font-black transition",
              favorite
                ? "border-[#d94f32]/25 bg-[#d94f32] text-white shadow-lg shadow-[#d94f32]/20 hover:bg-[#b83e27]"
                : "border-black/10 bg-white text-[#1f2520] hover:border-[#d94f32]/40 hover:text-[#d94f32]",
            ].join(" ")}
            type="button"
            onClick={() => onToggleFavorite?.(recipe.id)}
          >
            {favorite ? "♥ Favorited" : "♡ Favorite"}
          </button>
        </div>
      </div>
    </article>
  );
}
