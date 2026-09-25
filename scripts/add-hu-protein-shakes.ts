// One-off script: adds 3 new "Proteines Rudi Shake" items to the HU
// (simons) MILKSHAKES section. Saturated fat wasn't provided by the
// source, so it's estimated from the sat/total-fat ratio of the existing
// milkshake lineup (~0.65 for plain dairy-based flavors, lower for the
// peanut-butter variant, matching how Peanut Butter Milkshake's ratio
// diverges from the others) — user explicitly OK'd an estimate here.
//   npx tsx --env-file=.env.local scripts/add-hu-protein-shakes.ts
import { supabaseAdmin } from "../src/lib/supabaseAdmin";

const rows = [
  {
    name: "Natúr Proteines Rudi Shake",
    category: "MILKSHAKES",
    brand: "simons",
    kcal: 497.5,
    fat_g: 17.8,
    sat_fat_g: 11.6, // estimated (~0.65x total fat, plain-flavor ratio)
    carbs_g: 75.5,
    sugar_g: 55.7,
    protein_g: 16.6,
    salt_g: 0.3,
    fiber_g: 2.8,
    allergens: "Földimogyoró, Szójabab, Tej, Diófélék",
    position: 20,
  },
  {
    // shortened from "Mogyoróvajas Proteines Rudi Shake" — the full name
    // overran the PDF's name column and overlapped the kcal value
    name: "Mogyoróvajas Rudi Shake",
    category: "MILKSHAKES",
    brand: "simons",
    kcal: 535.5,
    fat_g: 21.5,
    sat_fat_g: 12.3, // estimated (peanut butter addition lowers the ratio)
    carbs_g: 75.5,
    sugar_g: 55.8,
    protein_g: 17.0,
    salt_g: 0.37,
    fiber_g: 3.0,
    allergens: "Glutén, Földimogyoró, Szójabab, Tej, Diófélék, Szezámmag",
    position: 21,
  },
  {
    name: "Málnás Proteines Rudi Shake",
    category: "MILKSHAKES",
    brand: "simons",
    kcal: 492.5,
    fat_g: 17.1,
    sat_fat_g: 11.1, // estimated (~0.65x total fat, plain-flavor ratio)
    carbs_g: 75.5,
    sugar_g: 55.8,
    protein_g: 16.3,
    salt_g: 0.27,
    fiber_g: 2.3,
    allergens: "Földimogyoró, Szójabab, Tej, Diófélék",
    position: 22,
  },
];

async function main() {
  const { data, error } = await supabaseAdmin
    .from("nutrition_items")
    .insert(rows)
    .select("id, name");
  if (error) {
    console.error("Insert failed:", error.message);
    process.exit(1);
  }
  console.log("Inserted:", data);
}

main();
