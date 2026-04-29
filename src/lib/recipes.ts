export type Visibility = "public" | "private";

export type Ingredient = {
  qty: number;
  unit: string;
  name: string;
};

export type Recipe = {
  id: string;
  title: string;
  description: string;
  photo: string;
  servings: number;
  prepTime: number;
  cookTime: number;
  difficulty: "Easy" | "Medium" | "Hard";
  cuisine: string;
  dietary: string[];
  ingredients: Ingredient[];
  steps: string[];
  notes: string;
  visibility: Visibility;
  ownerId: string;
  authorName: string;
  authorFullName: string;
  authorEmail: string | null;
  authorAvatar: string;
  authorAvatarUrl: string | null;
  createdAt: string;
};

export type UserProfile = {
  id: string;
  name: string;
  fullName: string;
  email: string | null;
  avatar: string;
  avatarUrl: string | null;
};

export const seedRecipes: Recipe[] = [
  {
    id: "tomato-basil-soup",
    title: "Roasted Tomato Basil Soup",
    description:
      "Silky tomatoes, sweet garlic, and basil finished with a little cream. Built for crusty bread and rainy windows.",
    photo:
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80",
    servings: 4,
    prepTime: 15,
    cookTime: 40,
    difficulty: "Easy",
    cuisine: "Italian",
    dietary: ["Vegetarian"],
    ingredients: [
      { qty: 2, unit: "lb", name: "roma tomatoes" },
      { qty: 1, unit: "head", name: "garlic" },
      { qty: 1, unit: "cup", name: "vegetable stock" },
      { qty: 0.5, unit: "cup", name: "cream" },
      { qty: 0.25, unit: "cup", name: "fresh basil" },
    ],
    steps: [
      "Roast tomatoes and garlic at 425F until blistered and soft.",
      "Simmer roasted vegetables with stock for 15 minutes.",
      "Blend until smooth, stir in cream, and season with salt.",
      "Finish with torn basil and olive oil.",
    ],
    notes: "Swap cream for coconut milk to keep it dairy-free.",
    visibility: "public",
    ownerId: "user-me",
    authorName: "Maya Stone",
    authorFullName: "Maya Stone",
    authorEmail: null,
    authorAvatar: "MS",
    authorAvatarUrl: null,
    createdAt: "2026-04-20",
  },
  {
    id: "cardamom-pancakes",
    title: "Cardamom Honey Pancakes",
    description:
      "A soft breakfast stack with orange zest, cardamom, and warm honey butter.",
    photo:
      "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=1200&q=80",
    servings: 3,
    prepTime: 10,
    cookTime: 18,
    difficulty: "Easy",
    cuisine: "Brunch",
    dietary: ["Vegetarian"],
    ingredients: [
      { qty: 1.5, unit: "cups", name: "flour" },
      { qty: 1, unit: "tbsp", name: "baking powder" },
      { qty: 1, unit: "tsp", name: "cardamom" },
      { qty: 1.25, unit: "cups", name: "milk" },
      { qty: 2, unit: "", name: "eggs" },
    ],
    steps: [
      "Whisk dry ingredients with a pinch of salt.",
      "Fold in milk, eggs, and orange zest until just combined.",
      "Cook pancakes on a buttered griddle until golden.",
      "Serve with honey butter and citrus.",
    ],
    notes: "Keep the batter lumpy for tender pancakes.",
    visibility: "private",
    ownerId: "user-me",
    authorName: "Maya Stone",
    authorFullName: "Maya Stone",
    authorEmail: null,
    authorAvatar: "MS",
    authorAvatarUrl: null,
    createdAt: "2026-04-18",
  },
  {
    id: "olive-herb-chicken",
    title: "Olive Herb Chicken Tray Bake",
    description:
      "Chicken thighs, olives, lemon, and potatoes roasted together until the edges go crisp.",
    photo:
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1200&q=80",
    servings: 5,
    prepTime: 20,
    cookTime: 45,
    difficulty: "Medium",
    cuisine: "Mediterranean",
    dietary: ["Gluten-free"],
    ingredients: [
      { qty: 6, unit: "", name: "chicken thighs" },
      { qty: 1.5, unit: "lb", name: "baby potatoes" },
      { qty: 1, unit: "cup", name: "green olives" },
      { qty: 2, unit: "", name: "lemons" },
      { qty: 3, unit: "tbsp", name: "olive oil" },
    ],
    steps: [
      "Toss potatoes with oil, salt, and oregano.",
      "Nestle chicken, olives, and lemon wedges into the tray.",
      "Roast at 425F until chicken is cooked through and potatoes crisp.",
      "Rest for 8 minutes before serving.",
    ],
    notes: "Add feta after baking for a sharper finish.",
    visibility: "public",
    ownerId: "user-ana",
    authorName: "Ana Haddad",
    authorFullName: "Ana Haddad",
    authorEmail: null,
    authorAvatar: "AH",
    authorAvatarUrl: null,
    createdAt: "2026-04-14",
  },
  {
    id: "lentil-squash-stew",
    title: "Lentil Squash Stew",
    description:
      "A cozy pot of red lentils, squash, cumin, and greens with a bright lemon finish.",
    photo:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
    servings: 6,
    prepTime: 18,
    cookTime: 35,
    difficulty: "Easy",
    cuisine: "Levantine",
    dietary: ["Vegan", "Gluten-free"],
    ingredients: [
      { qty: 1.5, unit: "cups", name: "red lentils" },
      { qty: 3, unit: "cups", name: "diced squash" },
      { qty: 1, unit: "", name: "onion" },
      { qty: 2, unit: "tsp", name: "cumin" },
      { qty: 4, unit: "cups", name: "vegetable stock" },
    ],
    steps: [
      "Soften onion in olive oil with cumin and pepper.",
      "Add squash, lentils, and stock, then simmer until tender.",
      "Fold in greens and lemon juice.",
      "Top with herbs and toasted seeds.",
    ],
    notes: "Freezes beautifully in single-serving portions.",
    visibility: "public",
    ownerId: "user-nour",
    authorName: "Nour Saleh",
    authorFullName: "Nour Saleh",
    authorEmail: null,
    authorAvatar: "NS",
    authorAvatarUrl: null,
    createdAt: "2026-04-11",
  },
  {
    id: "sesame-noodle-salad",
    title: "Sesame Noodle Salad",
    description:
      "Cool noodles tossed with crunchy vegetables, sesame dressing, and chili crisp.",
    photo:
      "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=1200&q=80",
    servings: 4,
    prepTime: 20,
    cookTime: 8,
    difficulty: "Easy",
    cuisine: "East Asian",
    dietary: ["Vegan"],
    ingredients: [
      { qty: 10, unit: "oz", name: "soba noodles" },
      { qty: 1, unit: "cup", name: "shredded carrots" },
      { qty: 1, unit: "cup", name: "cucumber" },
      { qty: 3, unit: "tbsp", name: "tahini" },
      { qty: 2, unit: "tbsp", name: "soy sauce" },
    ],
    steps: [
      "Cook noodles, rinse cold, and drain well.",
      "Whisk tahini, soy sauce, lime, ginger, and water.",
      "Toss noodles with vegetables and dressing.",
      "Finish with sesame seeds and chili crisp.",
    ],
    notes: "Add edamame for more protein.",
    visibility: "public",
    ownerId: "user-eli",
    authorName: "Eli Park",
    authorFullName: "Eli Park",
    authorEmail: null,
    authorAvatar: "EP",
    authorAvatarUrl: null,
    createdAt: "2026-04-07",
  },
];

export const cuisines = Array.from(
  new Set(seedRecipes.map((recipe) => recipe.cuisine)),
);
export const dietaryTags = Array.from(
  new Set(seedRecipes.flatMap((recipe) => recipe.dietary)),
);
export const difficulties = ["Easy", "Medium", "Hard"] as const;
