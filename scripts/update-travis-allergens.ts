// One-off script to backfill the `allergens` field on the already-seeded
// Travis' Tenders rows, from Travis_Allergen_tablazat.xlsx.
//   npx tsx --env-file=.env.local scripts/update-travis-allergens.ts
import { supabaseAdmin } from "../src/lib/supabaseAdmin";

const allergensByName: Record<string, string> = {
  "Tender (1 db)": "Glutén, Tojás, Tej",
  "Chicken Sandwich": "Glutén, Tojás, Tej, Hal, Mustár",
  "Combo Meal": "Glutén, Tojás, Tej, Hal, Mustár",
  "Combo Extra": "Glutén, Tojás, Tej, Hal, Mustár",
  "Combo Ultra": "Glutén, Tojás, Tej, Hal, Mustár",
  "Combo Sandwich": "Glutén, Tojás, Tej, Hal, Mustár",
  "French Fries": "",
  "Texas Toast": "Glutén, Tojás, Tej",
  Coleslaw: "Glutén, Tojás, Tej, Mustár",
  "Signature Sauce": "Glutén, Tojás, Tej, Hal, Mustár",
  "Dip Bomb": "Glutén, Tojás, Tej, Hal, Mustár",
  Honey: "",
  "Hot Honey": "",
  "Vanilla Milkshake": "Glutén, Tej",
  "Oreo Milkshake": "Glutén, Tej, Szója",
  "M&M's Milkshake": "Glutén, Tej, Szója, Földimogyoró",
  "Cini Minis Milkshake": "Glutén, Tojás, Tej",
  "Animal Style Milkshake": "Glutén, Tej, Szója, Földimogyoró",
};

async function main() {
  const { data: rows, error } = await supabaseAdmin
    .from("nutrition_items")
    .select("id, name")
    .eq("brand", "travis");

  if (error) {
    console.error("Fetch failed:", error.message);
    process.exit(1);
  }

  const results: any[] = [];
  for (const row of rows || []) {
    if (!(row.name in allergensByName)) {
      console.warn(`No allergen mapping for "${row.name}" (id ${row.id}), skipping`);
      continue;
    }
    const { data, error: updateError } = await supabaseAdmin
      .from("nutrition_items")
      .update({ allergens: allergensByName[row.name] })
      .eq("id", row.id)
      .select("id, name, allergens")
      .single();
    if (updateError) {
      console.error(`Update failed for "${row.name}":`, updateError.message);
      continue;
    }
    results.push(data);
  }

  console.log(`Updated ${results.length} Travis rows.`);
  console.table(results);
}

main();
