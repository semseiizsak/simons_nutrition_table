export type NutrientKey =
  | "kcal"
  | "fat_g"
  | "sat_fat_g"
  | "carbs_g"
  | "sugar_g"
  | "protein_g"
  | "salt_g"
  | "fiber_g";

export const NUTRIENT_FIELD_DEFS: Record<NutrientKey, { label: string }> = {
  kcal: { label: "Energia\n(kcal)" },
  fat_g: { label: "Zsír\n(g)" },
  sat_fat_g: { label: "Telített zsír\n(g)" },
  carbs_g: { label: "Szénhidrát\n(g)" },
  sugar_g: { label: "Cukor\n(g)" },
  protein_g: { label: "Fehérje\n(g)" },
  salt_g: { label: "Só\n(g)" },
  fiber_g: { label: "Rost\n(g)" },
};

export interface BrandSection {
  /** canonical value stored in nutrition_items.category */
  key: string;
  /** section-bar label printed on the PDF */
  title: string;
  /** lowercase substrings used as a fallback match for free-text categories */
  matchers?: string[];
}

export interface BrandConfig {
  slug: "simons" | "travis";
  displayName: string;
  primaryColor: string;
  /** filename under public/ */
  logoFile: string;
  /** logo display size in the PDF header, in pt */
  logoWidth: number;
  logoHeight: number;
  /** logo's `top` offset in the PDF header bar, in pt */
  logoTop: number;
  /** may contain a literal \n for a line break */
  pdfHeaderTitle: string;
  /** Content-Disposition filename for the generated PDF */
  pdfFilename: string;
  sections: BrandSection[];
  /** ordered subset of NUTRIENT_FIELD_DEFS to render */
  nutrientKeys: NutrientKey[];
  hasAllergens: boolean;
  /** PDF name-column width, in pt */
  nameColWidth: number;
  /** production hostnames mapped to this brand */
  hostnames: string[];
  /** hero heading on the public landing page */
  publicHeading: string;
}

export const BRANDS: Record<string, BrandConfig> = {
  simons: {
    slug: "simons",
    displayName: "Simon's Burger",
    primaryColor: "#2E9747",
    logoFile: "simons_logo.png",
    logoWidth: 85,
    logoHeight: 45,
    logoTop: 17,
    pdfHeaderTitle: "SIMON'S BURGER TÁPANYAG\nÉS ALLERGÉNTÁBLÁZAT",
    pdfFilename: "simonsburger_nutrition.pdf",
    sections: [
      { key: "BURGEREK", title: "BURGEREK", matchers: ["burg"] },
      { key: "FRIES", title: "FRIES", matchers: ["fries", "side"] },
      { key: "MILKSHAKES", title: "MILKSHAKES", matchers: ["milk", "shake"] },
      { key: "SAUCES", title: "SAUCES", matchers: ["sauc"] },
      {
        key: "REFILL DRINKS (350 ML)",
        title: "REFILL DRINKS (350 ML)",
        matchers: ["drink", "refill"],
      },
    ],
    nutrientKeys: [
      "kcal",
      "fat_g",
      "sat_fat_g",
      "carbs_g",
      "sugar_g",
      "protein_g",
      "salt_g",
      "fiber_g",
    ],
    hasAllergens: true,
    nameColWidth: 110,
    hostnames: ["nutrition.simonsburger.hu"],
    publicHeading: "NUTRITION & ALLERGENS",
  },
  travis: {
    slug: "travis",
    displayName: "Travis' Tenders",
    primaryColor: "#CE1441",
    logoFile: "travis_logo.png",
    // source art has a lot of transparent padding baked in even after
    // trimming, so it's sized noticeably larger than Simon's to read
    // at a comparable visual weight in the header bar
    logoWidth: 114,
    logoHeight: 55,
    // centered vertically in the 85pt header bar (bar spans -10..75)
    logoTop: 5,
    pdfHeaderTitle: "TRAVIS' TENDERS\nTÁPANYAGTÁBLÁZAT",
    pdfFilename: "travistenders_nutrition.pdf",
    sections: [
      {
        key: "SANDWICHES",
        title: "SANDWICHES",
        matchers: ["sandwich", "combo", "tender"],
      },
      {
        key: "SIDES",
        title: "SIDES",
        matchers: ["fries", "toast", "coleslaw", "side"],
      },
      { key: "SAUCES", title: "SAUCES", matchers: ["sauce", "honey", "dip"] },
      {
        key: "MILKSHAKES",
        title: "MILKSHAKES",
        matchers: ["milkshake", "shake"],
      },
    ],
    nutrientKeys: [
      "kcal",
      "fat_g",
      "sat_fat_g",
      "carbs_g",
      "sugar_g",
      "protein_g",
      "salt_g",
    ],
    hasAllergens: false,
    nameColWidth: 160,
    hostnames: ["nutrition.travistenders.hu"],
    publicHeading: "NUTRITION FACTS",
  },
};

export function getBrand(slug: string | undefined): BrandConfig {
  return BRANDS[slug ?? "simons"] ?? BRANDS.simons;
}
