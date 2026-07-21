// One-off script to re-group Travis' Tenders items into the renamed
// sections (SANDWICHES -> COMBOS, SIDES -> EXTRAS) and move
// Chicken Sandwich, Tender (1 db), Honey, and Hot Honey into EXTRAS.
// Also fixes the DB rows that had been stuck at category "FRIES"
// instead of the canonical section key.
//   npx tsx --env-file=.env.local scripts/reorganize-travis-categories.ts
import { supabaseAdmin } from "../src/lib/supabaseAdmin";

const updates: Record<string, { category: string; position: number }> = {
  "Combo Meal": { category: "COMBOS", position: 1 },
  "Combo Extra": { category: "COMBOS", position: 2 },
  "Combo Ultra": { category: "COMBOS", position: 3 },
  "Combo Sandwich": { category: "COMBOS", position: 4 },

  "French Fries": { category: "EXTRAS", position: 1 },
  "Texas Toast": { category: "EXTRAS", position: 2 },
  Coleslaw: { category: "EXTRAS", position: 3 },
  "Chicken Sandwich": { category: "EXTRAS", position: 4 },
  "Tender (1 db)": { category: "EXTRAS", position: 5 },
  Honey: { category: "EXTRAS", position: 6 },
  "Hot Honey": { category: "EXTRAS", position: 7 },

  "Signature Sauce": { category: "SAUCES", position: 1 },
  "Dip Bomb": { category: "SAUCES", position: 2 },

  "Vanilla Milkshake": { category: "MILKSHAKES", position: 1 },
  "Oreo Milkshake": { category: "MILKSHAKES", position: 2 },
  "M&M's Milkshake": { category: "MILKSHAKES", position: 3 },
  "Cini Minis Milkshake": { category: "MILKSHAKES", position: 4 },
  "Animal Style Milkshake": { category: "MILKSHAKES", position: 5 },
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
    const update = updates[row.name];
    if (!update) {
      console.warn(`No mapping for "${row.name}" (id ${row.id}), skipping`);
      continue;
    }
    const { data, error: updateError } = await supabaseAdmin
      .from("nutrition_items")
      .update(update)
      .eq("id", row.id)
      .select("id, name, category, position")
      .single();
    if (updateError) {
      console.error(`Update failed for "${row.name}":`, updateError.message);
      continue;
    }
    results.push(data);
  }

  results.sort((a, b) => a.category.localeCompare(b.category) || a.position - b.position);
  console.log(`Updated ${results.length} Travis rows.`);
  console.table(results);
}

main();
