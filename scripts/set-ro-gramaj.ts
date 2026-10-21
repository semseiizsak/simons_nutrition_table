// One-off script: populates gramaj_g (portion weight) on the existing RO
// rows, per the reference "simonsburger_ro_nutrition_gramaj_16x10" PDF.
// Drinks, Ketchup and Mayonnaise are left null — no gramaj shown for those
// in the reference.
//   npx tsx --env-file=.env.local scripts/set-ro-gramaj.ts
import { supabaseAdmin } from "../src/lib/supabaseAdmin";

const gramaj: Record<number, number> = {
  60: 342, // Cheeseburger
  61: 257, // Small Cheeseburger
  62: 293, // Hamburger
  63: 233, // Small Hamburger
  64: 269, // Simon's Special Burger
  65: 110, // Normal Fries
  66: 180, // Large Fries
  67: 297, // Simon's Cheese Fries
  68: 350, // Caramel Milkshake
  69: 342, // Oreo Milkshake
  70: 350, // Banana Milkshake
  71: 350, // Strawberry Milkshake
  72: 350, // Chocolate Milkshake
  73: 345, // Vanilla Milkshake
  74: 330, // Cheesecake Milkshake
  75: 350, // Peach Milkshake
  76: 350, // Peanut Butter Milkshake
  77: 350, // Mango Milkshake
  78: 350, // Whipped Cream
  89: 350, // Jimmy Jam Milkshake (not in the reference image; matches the other milkshakes)
  86: 30, // Simon's Special Sauce
};

async function main() {
  for (const [id, g] of Object.entries(gramaj)) {
    const { error } = await supabaseAdmin
      .from("nutrition_items")
      .update({ gramaj_g: g })
      .eq("id", Number(id))
      .eq("brand", "ro");
    if (error) {
      console.error(`Failed for id ${id}:`, error.message);
      process.exit(1);
    }
  }
  console.log(`Set gramaj_g on ${Object.keys(gramaj).length} RO rows.`);
}

main();
