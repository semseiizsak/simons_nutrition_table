// One-off seed script: clones all `simons` (HU) nutrition_items rows into
// the new `sk` brand as a starting point, same pattern as
// seed-ro-from-simons.ts. Real Slovak menu/recipe data is expected to be
// entered later via /admin/nutrition/sk — this just avoids launching with
// an empty table.
//   npx tsx --env-file=.env.local scripts/seed-sk-from-simons.ts
import { supabaseAdmin } from "../src/lib/supabaseAdmin";

async function main() {
  const { data: existing, error: existingErr } = await supabaseAdmin
    .from("nutrition_items")
    .select("id")
    .eq("brand", "sk");
  if (existingErr) {
    console.error("Check failed:", existingErr.message);
    process.exit(1);
  }
  if (existing && existing.length > 0) {
    console.error(
      `Aborting: brand "sk" already has ${existing.length} row(s). Delete them first if you want to reseed.`
    );
    process.exit(1);
  }

  const { data: simonsRows, error: fetchErr } = await supabaseAdmin
    .from("nutrition_items")
    .select("*")
    .eq("brand", "simons")
    .order("category", { ascending: true })
    .order("position", { ascending: true });
  if (fetchErr) {
    console.error("Fetch failed:", fetchErr.message);
    process.exit(1);
  }

  const rows = (simonsRows || []).map(({ id, brand, ...rest }) => ({
    ...rest,
    brand: "sk",
  }));

  const { data, error } = await supabaseAdmin
    .from("nutrition_items")
    .insert(rows)
    .select("id, name, category");

  if (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
  console.log(`Inserted ${data?.length ?? 0} SK rows (cloned from simons).`);
  console.table(data);
}

main();
