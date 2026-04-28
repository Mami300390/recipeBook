##### Recipe Book App — Updated Plan

A warm, rustic recipe book where signed-in users build their personal cookbook and can browse recipes shared by other users. Includes search, filters, and a "Surprise Me" random recipe button.

###### Authentication (required)

- Email + password sign up / sign in (auto-confirm, no email verification friction)
- Protected app: unauthenticated visitors see a landing/login page only
- Each user has a profile (display name, optional avatar)

###### Recipe Visibility Model

- Every recipe has a visibility flag: private or public
- Users always see/edit their own recipes (private + public)
- Users can browse all public recipes from other users (read-only)
- Only the author can edit or delete their own recipes
- Default on create: public (toggle to private if desired)

###### Core Features

1\. My Cookbook (my recipes)

- Grid of the current user's recipes (private + public)
- Empty state with "Add your first recipe" CTA

2\. Discover (community feed)

- Grid of public recipes from all users
- Shows author name + avatar on each card
- Search + filters apply here too

3\. Add / Edit Recipe

- Fields: title, description, photo, servings, prep/cook time, difficulty, cuisine, dietary tags, ingredients (qty + unit + name), step-by-step instructions, notes
- Visibility toggle: Public (shared to Discover) / Private (only me)

4\. Recipe Detail View

- Hero image, ingredient checklist, numbered steps, author byline
- Servings adjuster auto-scales ingredients
- Favorite ❤️ (works on own + others' recipes)
- Edit/delete shown only to the author
- Print-friendly view

5\. Search \& Filter (works on both My Cookbook and Discover)

- Search: title, ingredient, tag, author
- Filter chips: cuisine, dietary, difficulty, max cook time
- Sort: newest, favorites, alphabetical, quickest

6\. 🎲 Surprise Me — Random Recipe Button

- Prominent button in header
- Picks a random recipe and opens it
- Scope toggle: from My Cookbook / from Discover / from My Favorites

7\. Favorites view

- All hearted recipes (own + others')
- Design — Warm \& Rustic
- Cream background, terracotta primary, deep olive accent, warm charcoal text
- Serif headings (Playfair-style), clean sans body
- Soft rounded cards, subtle paper texture, food-photo–forward, drop-cap intros on detail pages

###### Pages

- / — Landing + sign in / sign up
- /app — My Cookbook
- /app/discover — Community public recipes
- /app/new — Add recipe
- /app/recipe/:id — Recipe detail (own or others')
- /app/recipe/:id/edit — Edit (author only)
- /app/favorites — Favorites

###### Backend (Lovable Cloud)

- Auth: email/password
- profiles table — auto-created on signup (display_name, avatar_url); publicly readable so authors can be shown on shared recipes
- recipes table — owner user_id, visibility (public|private), all recipe fields stored as columns + JSON for ingredients/steps
- favorites table — (user_id, recipe_id) pairs
- Storage bucket for recipe photos (per-user folder)

###### RLS policies

- recipes SELECT: owner OR visibility = 'public'
- recipes INSERT/UPDATE/DELETE: owner only
- favorites SELECT/INSERT/DELETE: owner only
- profiles SELECT: anyone authenticated; UPDATE: owner only
- Storage: public read on the recipe-photos bucket; write restricted to owner's folder
