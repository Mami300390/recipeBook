import Link from "next/link";
import Image from "next/image";
import { Recipe } from "@/lib/recipes";

type Props = {
  recipe: Recipe;
  favorite?: boolean;
  currentUserId?: string;
};

export function RecipeCard({ recipe, favorite = false, currentUserId }: Props) {
  const totalTime = recipe.prepTime + recipe.cookTime;
  const isMine = recipe.ownerId === currentUserId;

  return (
    <Link
      className="group flex min-h-full flex-col overflow-hidden rounded-lg border border-[#4a3a2c]/15 bg-[#fffaf0]/90 shadow-[0_18px_50px_rgba(73,45,25,0.13)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(73,45,25,0.18)]"
      href={`/app/recipe/${recipe.id}`}
    >
      <Image
        className="aspect-[4/3] w-full bg-[#f1dfbd] object-cover transition duration-300 group-hover:scale-[1.03]"
        src={recipe.photo}
        alt=""
        width={640}
        height={480}
        sizes="(max-width: 900px) 100vw, 33vw"
      />
      <div className="grid gap-3 p-4">
        <div className="flex flex-wrap gap-2 text-xs font-bold text-[#766a5e]">
          <span>{recipe.cuisine}</span>
          <span>{totalTime} min</span>
          <span>{recipe.difficulty}</span>
        </div>
        <h2 className="serif m-0 text-2xl font-black leading-tight text-[#334028]">
          {recipe.title}
        </h2>
        <p className="line-clamp-3 text-sm leading-6 text-[#5f5349]">{recipe.description}</p>
        <div className="flex flex-wrap items-center gap-2 text-sm text-[#766a5e]">
          <span
            className="grid h-9 w-9 place-items-center rounded-full bg-[#55633f] text-xs font-black text-white"
            aria-hidden="true"
          >
            {recipe.authorAvatar}
          </span>
          <span>
            {recipe.authorName}
            {isMine ? " · yours" : ""}
          </span>
          <span>{favorite ? "Hearted" : recipe.visibility}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {recipe.dietary.map((tag) => (
            <span
              className="rounded-full bg-[#efe0c5] px-2.5 py-1 text-xs font-black text-[#5b4a3e]"
              key={tag}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
