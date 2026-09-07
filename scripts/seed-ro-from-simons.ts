// One-off seed script: clones all `simons` (HU) nutrition_items rows into
// the new `ro` brand as a starting point. The RO menu uses a different meat
// portion, so these values are expected to be edited later via
// /admin/nutrition/ro — this just avoids launching with an empty table.
//   npx tsx --env-file=.env.local scripts/seed-ro-from-simons.ts
import { supabaseAdmin } from "../src/lib/supabaseAdmin";

async function main() {
  const { data: existing, error: existingErr } = await supabaseAdmin
    .from("nutrition_items")
    .select("id")
    .eq("brand", "ro");
  if (existingErr) {
    console.error("Check failed:", existingErr.message);
    process.exit(1);
  }
  if (existing && existing.length > 0) {
    console.error(
      `Aborting: brand "ro" already has ${existing.length} row(s). Delete them first if you want to reseed.`
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
    brand: "ro",
  }));

  const { data, error } = await supabaseAdmin
    .from("nutrition_items")
    .insert(rows)
    .select("id, name, category");

  if (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
  console.log(`Inserted ${data?.length ?? 0} RO rows (cloned from simons).`);
  console.table(data);
}

main();
