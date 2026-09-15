// One-off script: replaces the cloned-from-HU placeholder values for RO
// Burgers/Fries/Milkshakes with the real RO recipe data from
// "Simon's Kalóriatábla.xlsx" (60g-patty burger variant, per user decision).
// Sauces and Refill Drinks are intentionally left untouched (cloned from HU).
//   npx tsx --env-file=.env.local scripts/update-ro-recipes.ts
import { supabaseAdmin } from "../src/lib/supabaseAdmin";

const updates: {
  id: number;
  name: string;
  kcal: number;
  fat_g: number;
  sat_fat_g: number;
  carbs_g: number;
  sugar_g: number;
  protein_g: number;
  salt_g: number;
  fiber_g: number;
  allergens: string;
}[] = [
  // BURGERS — Burger 60g tab (regular = 120g meat, small = 60g meat)
  { id: 62, name: "Hamburger", kcal: 691.55, fat_g: 53.63, sat_fat_g: 2.94, carbs_g: 36.15, sugar_g: 10.66, protein_g: 24.64, salt_g: 1.08, fiber_g: 2.36, allergens: "Glutén, Hal, Szójabab, Tej, Diófélék, Zeller, Mustár, Szezámmag, Kén-dioxid" },
  { id: 60, name: "Cheeseburger", kcal: 850.46, fat_g: 65.93, sat_fat_g: 11.79, carbs_g: 39.20, sugar_g: 13.02, protein_g: 33.65, salt_g: 2.56, fiber_g: 3.25, allergens: "Glutén, Tojás, Hal, Szójabab, Tej, Diófélék, Zeller, Mustár, Szezámmag, Kén-dioxid" },
  { id: 63, name: "Small Hamburger", kcal: 485.51, fat_g: 32.52, sat_fat_g: 2.28, carbs_g: 36.15, sugar_g: 10.66, protein_g: 15.45, salt_g: 1.05, fiber_g: 2.36, allergens: "Glutén, Tojás, Hal, Szójabab, Tej, Diófélék, Zeller, Mustár, Szezámmag, Kén-dioxid" },
  { id: 61, name: "Small Cheeseburger", kcal: 564.96, fat_g: 38.67, sat_fat_g: 6.71, carbs_g: 37.68, sugar_g: 11.84, protein_g: 19.95, salt_g: 1.79, fiber_g: 2.80, allergens: "Glutén, Tojás, Hal, Szójabab, Tej, Diófélék, Zeller, Mustár, Szezámmag, Kén-dioxid" },
  { id: 64, name: "Simon's Special Burger", kcal: 834.37, fat_g: 61.20, sat_fat_g: 11.11, carbs_g: 47.44, sugar_g: 21.65, protein_g: 32.57, salt_g: 2.24, fiber_g: 2.31, allergens: "Glutén, Tojás, Hal, Földimogyoró, Szójabab, Tej, Diófélék, Zeller, Mustár, Szezámmag, Kén-dioxid" },

  // FRIES
  { id: 65, name: "Normal Fries", kcal: 368.50, fat_g: 19.80, sat_fat_g: 2.09, carbs_g: 33.77, sugar_g: 0.74, protein_g: 3.67, salt_g: 1.68, fiber_g: 0, allergens: "" },
  { id: 66, name: "Large Fries", kcal: 603.00, fat_g: 32.40, sat_fat_g: 3.42, carbs_g: 55.26, sugar_g: 1.21, protein_g: 6.01, salt_g: 2.75, fiber_g: 0, allergens: "" },
  { id: 67, name: "Simon's Cheese Fries", kcal: 964.04, fat_g: 58.13, sat_fat_g: 12.17, carbs_g: 74.96, sugar_g: 7.42, protein_g: 14.66, salt_g: 4.77, fiber_g: 0.94, allergens: "Tej" },

  // MILKSHAKES (10 shared flavors; Whipped Cream left as cloned from HU)
  { id: 68, name: "Caramel Milkshake", kcal: 586.62, fat_g: 19.46, sat_fat_g: 13.46, carbs_g: 100.55, sugar_g: 90.79, protein_g: 6.62, salt_g: 0.32, fiber_g: 0.52, allergens: "Glutén, Földimogyoró, Tej, Diófélék" },
  { id: 69, name: "Oreo Milkshake", kcal: 591.46, fat_g: 24.18, sat_fat_g: 14.71, carbs_g: 88.59, sugar_g: 71.19, protein_g: 8.53, salt_g: 0.39, fiber_g: 1.44, allergens: "Glutén, Földimogyoró, Szójabab, Tej" },
  { id: 70, name: "Banana Milkshake", kcal: 554.22, fat_g: 19.46, sat_fat_g: 13.46, carbs_g: 92.00, sugar_g: 69.19, protein_g: 6.71, salt_g: 0.21, fiber_g: 0.52, allergens: "Glutén, Földimogyoró, Tej, Diófélék" },
  { id: 71, name: "Strawberry Milkshake", kcal: 547.92, fat_g: 19.46, sat_fat_g: 13.46, carbs_g: 90.65, sugar_g: 67.84, protein_g: 6.62, salt_g: 0.21, fiber_g: 0.74, allergens: "Glutén, Földimogyoró, Tej, Diófélék" },
  { id: 72, name: "Chocolate Milkshake", kcal: 575.82, fat_g: 21.08, sat_fat_g: 13.64, carbs_g: 92.45, sugar_g: 79.09, protein_g: 8.65, salt_g: 0.25, fiber_g: 1.37, allergens: "Glutén, Földimogyoró, Tej, Diófélék" },
  { id: 73, name: "Vanilla Milkshake", kcal: 461.92, fat_g: 20.07, sat_fat_g: 13.82, carbs_g: 66.44, sugar_g: 57.59, protein_g: 7.92, salt_g: 0.24, fiber_g: 0.52, allergens: "Földimogyoró, Tej" },
  { id: 74, name: "Cheesecake Milkshake", kcal: 478.77, fat_g: 21.93, sat_fat_g: 15.14, carbs_g: 65.87, sugar_g: 56.99, protein_g: 8.40, salt_g: 0.45, fiber_g: 0.64, allergens: "Földimogyoró, Tej" },
  { id: 75, name: "Peach Milkshake", kcal: 561.87, fat_g: 19.46, sat_fat_g: 13.46, carbs_g: 93.80, sugar_g: 69.64, protein_g: 6.69, salt_g: 0.21, fiber_g: 0.64, allergens: "Glutén, Földimogyoró, Tej, Diófélék" },
  { id: 76, name: "Peanut Butter Milkshake", kcal: 728.82, fat_g: 46.01, sat_fat_g: 17.11, carbs_g: 69.05, sugar_g: 57.22, protein_g: 15.62, salt_g: 0.59, fiber_g: 0.52, allergens: "Glutén, Földimogyoró, Tej, Diófélék" },
  { id: 77, name: "Mango Milkshake", kcal: 560.07, fat_g: 19.46, sat_fat_g: 13.46, carbs_g: 93.80, sugar_g: 70.99, protein_g: 6.67, salt_g: 0.21, fiber_g: 0.52, allergens: "Glutén, Földimogyoró, Tej, Diófélék" },
];

const newRows = [
  {
    name: "Jimmy Jam Milkshake",
    category: "MILKSHAKES",
    brand: "ro",
    kcal: 576.77,
    fat_g: 19.52,
    sat_fat_g: 13.51,
    carbs_g: 101.12,
    sugar_g: 77.64,
    protein_g: 6.65,
    salt_g: 0.21,
    fiber_g: 0.54,
    allergens: "Glutén, Földimogyoró, Tej, Diófélék",
    position: 20,
  },
];

async function main() {
  for (const { id, name, ...fields } of updates) {
    const { error } = await supabaseAdmin
      .from("nutrition_items")
      .update(fields)
      .eq("id", id)
      .eq("brand", "ro");
    if (error) {
      console.error(`Update failed for ${name} (id ${id}):`, error.message);
      process.exit(1);
    }
    console.log(`Updated ${name} (id ${id})`);
  }

  const { data, error } = await supabaseAdmin
    .from("nutrition_items")
    .insert(newRows)
    .select("id, name");
  if (error) {
    console.error("Insert failed:", error.message);
    process.exit(1);
  }
  console.log("Inserted:", data);
}

main();
