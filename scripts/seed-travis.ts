// One-off seed script for Travis' Tenders nutrition items.
// Run after applying the `brand` column migration:
//   npx tsx --env-file=.env.local scripts/seed-travis.ts
import { supabaseAdmin } from "../src/lib/supabaseAdmin";

const rows = [
  // SANDWICHES
  { name: "Chicken Sandwich", category: "SANDWICHES", position: 1, kcal: 605, fat_g: 28.40, sat_fat_g: 5.70, carbs_g: 45.40, sugar_g: 11.60, protein_g: 40.80, salt_g: 7.48 },
  { name: "Combo Meal", category: "SANDWICHES", position: 2, kcal: 1198, fat_g: 53.80, sat_fat_g: 8.10, carbs_g: 129.50, sugar_g: 23.90, protein_g: 45.00, salt_g: 13.83 },
  { name: "Combo Extra", category: "SANDWICHES", position: 3, kcal: 1561, fat_g: 71.40, sat_fat_g: 10.30, carbs_g: 149.10, sugar_g: 27.00, protein_g: 76.00, salt_g: 20.25 },
  { name: "Combo Ultra", category: "SANDWICHES", position: 4, kcal: 1925, fat_g: 89.00, sat_fat_g: 12.40, carbs_g: 168.70, sugar_g: 30.10, protein_g: 106.90, salt_g: 26.68 },
  { name: "Combo Sandwich", category: "SANDWICHES", position: 5, kcal: 1164, fat_g: 58.50, sat_fat_g: 9.40, carbs_g: 108.70, sugar_g: 23.90, protein_g: 47.30, salt_g: 12.43 },
  { name: "Tender (1 db)", category: "SANDWICHES", position: 6, kcal: 175, fat_g: 8.00, sat_fat_g: 1.00, carbs_g: 9.80, sugar_g: 1.60, protein_g: 15.50, salt_g: 3.21 },
  // SIDES
  { name: "French Fries", category: "SIDES", position: 1, kcal: 332, fat_g: 10.80, sat_fat_g: 1.30, carbs_g: 50.80, sugar_g: 2.20, protein_g: 5.40, salt_g: 3.86 },
  { name: "Texas Toast", category: "SIDES", position: 2, kcal: 274, fat_g: 6.10, sat_fat_g: 2.30, carbs_g: 46.60, sugar_g: 8.40, protein_g: 7.60, salt_g: 2.45 },
  { name: "Coleslaw", category: "SIDES", position: 3, kcal: 82, fat_g: 6.40, sat_fat_g: 0.60, carbs_g: 5.80, sugar_g: 4.20, protein_g: 0.40, salt_g: 0.52 },
  // SAUCES
  { name: "Signature Sauce", category: "SAUCES", position: 1, kcal: 145, fat_g: 12.90, sat_fat_g: 1.80, carbs_g: 6.70, sugar_g: 5.90, protein_g: 0.70, salt_g: 0.57 },
  { name: "Dip Bomb", category: "SAUCES", position: 2, kcal: 1195, fat_g: 106.10, sat_fat_g: 14.60, carbs_g: 54.90, sugar_g: 48.60, protein_g: 5.60, salt_g: 4.72 },
  { name: "Honey", category: "SAUCES", position: 3, kcal: 46, fat_g: 0.00, sat_fat_g: 0.00, carbs_g: 12.40, sugar_g: 12.30, protein_g: 0.00, salt_g: 0.00 },
  { name: "Hot Honey", category: "SAUCES", position: 4, kcal: 52, fat_g: 0.00, sat_fat_g: 0.00, carbs_g: 10.70, sugar_g: 10.70, protein_g: 0.00, salt_g: 0.00 },
  // MILKSHAKES
  { name: "Vanilla Milkshake", category: "MILKSHAKES", position: 1, kcal: 343, fat_g: 9.80, sat_fat_g: 6.60, carbs_g: 61.80, sugar_g: 53.40, protein_g: 5.40, salt_g: 0.16 },
  { name: "Oreo Milkshake", category: "MILKSHAKES", position: 2, kcal: 556, fat_g: 18.40, sat_fat_g: 9.00, carbs_g: 92.40, sugar_g: 70.50, protein_g: 11.40, salt_g: 0.30 },
  { name: "M&M's Milkshake", category: "MILKSHAKES", position: 3, kcal: 799, fat_g: 27.90, sat_fat_g: 18.00, carbs_g: 128.30, sugar_g: 115.10, protein_g: 9.80, salt_g: 0.33 },
  { name: "Cini Minis Milkshake", category: "MILKSHAKES", position: 4, kcal: 448, fat_g: 12.50, sat_fat_g: 7.10, carbs_g: 80.20, sugar_g: 59.60, protein_g: 7.00, salt_g: 0.37 },
  { name: "Animal Style Milkshake", category: "MILKSHAKES", position: 5, kcal: 601, fat_g: 19.60, sat_fat_g: 11.30, carbs_g: 100.30, sugar_g: 81.80, protein_g: 8.20, salt_g: 0.40 },
].map((r) => ({ ...r, brand: "travis", fiber_g: null, allergens: "" }));

async function main() {
  const { data, error } = await supabaseAdmin
    .from("nutrition_items")
    .insert(rows)
    .select("id, name, category");

  if (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
  console.log(`Inserted ${data?.length ?? 0} Travis rows.`);
  console.table(data);
}

main();
