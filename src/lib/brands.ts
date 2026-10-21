export type NutrientKey =
  | "kcal"
  | "fat_g"
  | "sat_fat_g"
  | "carbs_g"
  | "sugar_g"
  | "protein_g"
  | "salt_g"
  | "fiber_g";

/** PDF label language — one dictionary per locale so brands can share the
 * same canonical nutrient/allergen keys while printing different text. */
export type Locale = "hu" | "ro" | "sk";

export const NUTRIENT_FIELD_DEFS: Record<
  Locale,
  Record<NutrientKey, { label: string }>
> = {
  hu: {
    kcal: { label: "Energia\n(kcal)" },
    fat_g: { label: "Zsír\n(g)" },
    sat_fat_g: { label: "Telített zsír\n(g)" },
    carbs_g: { label: "Szénhidrát\n(g)" },
    sugar_g: { label: "Cukor\n(g)" },
    protein_g: { label: "Fehérje\n(g)" },
    salt_g: { label: "Só\n(g)" },
    fiber_g: { label: "Rost\n(g)" },
  },
  ro: {
    kcal: { label: "Energie\n(kcal)" },
    fat_g: { label: "Grăsimi\n(g)" },
    sat_fat_g: { label: "Saturate\n(g)" },
    carbs_g: { label: "Carbohidrați\n(g)" },
    sugar_g: { label: "Zaharuri\n(g)" },
    protein_g: { label: "Proteine\n(g)" },
    salt_g: { label: "Sare\n(g)" },
    fiber_g: { label: "Fibre\n(g)" },
  },
  sk: {
    kcal: { label: "Energia\n(kcal)" },
    fat_g: { label: "Tuky\n(g)" },
    sat_fat_g: { label: "Nasýtené tuky\n(g)" },
    carbs_g: { label: "Sacharidy\n(g)" },
    sugar_g: { label: "Cukry\n(g)" },
    protein_g: { label: "Bielkoviny\n(g)" },
    salt_g: { label: "Soľ\n(g)" },
    fiber_g: { label: "Vláknina\n(g)" },
  },
};

export type AllergenKey =
  | "gluten"
  | "rakfelek"
  | "tojas"
  | "hal"
  | "foldimogyoro"
  | "szojabab"
  | "tej"
  | "diofelek"
  | "zeller"
  | "mustar"
  | "szezammag"
  | "ken-dioxid"
  | "csillagfurt"
  | "puhatestuek";

export const ALLERGEN_FIELD_DEFS: Record<
  Locale,
  Record<AllergenKey, { label: string }>
> = {
  hu: {
    gluten: { label: "Glutén" },
    rakfelek: { label: "Rákfélék" },
    tojas: { label: "Tojás" },
    hal: { label: "Hal" },
    foldimogyoro: { label: "Földimogyoró" },
    szojabab: { label: "Szójabab" },
    tej: { label: "Tej" },
    diofelek: { label: "Diófélék" },
    zeller: { label: "Zeller" },
    mustar: { label: "Mustár" },
    szezammag: { label: "Szezámmag" },
    "ken-dioxid": { label: "Kén-dioxid" },
    csillagfurt: { label: "Csillagfürt" },
    puhatestuek: { label: "Puhatestűek" },
  },
  ro: {
    gluten: { label: "Gluten" },
    rakfelek: { label: "Crustacee" },
    tojas: { label: "Ouă" },
    hal: { label: "Pește" },
    foldimogyoro: { label: "Arahide" },
    szojabab: { label: "Soia" },
    tej: { label: "Lapte" },
    diofelek: { label: "Fructe cu coajă" },
    zeller: { label: "Țelină" },
    mustar: { label: "Muștar" },
    szezammag: { label: "Susan" },
    "ken-dioxid": { label: "Dioxid de sulf" },
    csillagfurt: { label: "Lupin" },
    puhatestuek: { label: "Moluște" },
  },
  sk: {
    gluten: { label: "Gluten" },
    rakfelek: { label: "Kôrovce" },
    tojas: { label: "Vajcia" },
    hal: { label: "Ryby" },
    foldimogyoro: { label: "Arašidy" },
    szojabab: { label: "Sója" },
    tej: { label: "Mlieko" },
    diofelek: { label: "Orechy" },
    zeller: { label: "Zeler" },
    mustar: { label: "Horčica" },
    szezammag: { label: "Sezam" },
    "ken-dioxid": { label: "Oxid siričitý" },
    csillagfurt: { label: "Vlčí bôb" },
    puhatestuek: { label: "Mäkkýše" },
  },
};

export const ALL_ALLERGEN_KEYS: AllergenKey[] = [
  "gluten",
  "rakfelek",
  "tojas",
  "hal",
  "foldimogyoro",
  "szojabab",
  "tej",
  "diofelek",
  "zeller",
  "mustar",
  "szezammag",
  "ken-dioxid",
  "csillagfurt",
  "puhatestuek",
];

export interface BrandSection {
  /** canonical value stored in nutrition_items.category */
  key: string;
  /** section-bar label printed on the PDF */
  title: string;
  /** lowercase substrings used as a fallback match for free-text categories */
  matchers?: string[];
}

export interface BrandConfig {
  slug: "simons" | "travis" | "ro" | "sk";
  /** language for PDF labels (nutrient/allergen headers, disclaimer) */
  locale: Locale;
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
  /** allergen columns to render, in order (only used when hasAllergens is true) */
  allergenKeys?: AllergenKey[];
  /** footer disclaimer shown when hasAllergens is true */
  allergenDisclaimer?: string;
  /** PDF name-column width, in pt */
  nameColWidth: number;
  /** production hostnames mapped to this brand */
  hostnames: string[];
  /** hero heading on the public landing page */
  publicHeading: string;
  /** show a portion-weight (grams) column before the nutrient columns */
  hasGramaj?: boolean;
  /** PDF header label for the gramaj column (may contain a literal \n) */
  gramajLabel?: string;
}

export const BRANDS: Record<string, BrandConfig> = {
  simons: {
    slug: "simons",
    locale: "hu",
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
    allergenKeys: ALL_ALLERGEN_KEYS,
    allergenDisclaimer:
      "Az egyes termékeinkben található allergének ételeink feldolgozási technológiájának jellegéből adódóan nyomokban előfordulhatnak más termékekben.",
    nameColWidth: 110,
    hostnames: ["nutrition.simonsburger.hu"],
    publicHeading: "NUTRITION & ALLERGENS",
  },
  travis: {
    slug: "travis",
    locale: "hu",
    displayName: "Travis' Tenders",
    primaryColor: "#CE1441",
    logoFile: "travis_logo.png",
    // source art has a lot of transparent padding baked in even after
    // trimming, so it's sized noticeably larger than Simon's to read
    // at a comparable visual weight in the header bar
    logoWidth: 114,
    logoHeight: 55,
    // shifted a bit below center in the 85pt header bar (bar spans -10..75)
    logoTop: 13,
    pdfHeaderTitle: "TRAVIS' TENDERS\nTÁPANYAGTÁBLÁZAT",
    pdfFilename: "travistenders_nutrition.pdf",
    sections: [
      {
        key: "COMBOS",
        title: "COMBOS",
        matchers: ["combo"],
      },
      {
        key: "EXTRAS",
        title: "EXTRAS",
        matchers: ["fries", "toast", "coleslaw", "side", "tender", "honey"],
      },
      { key: "SAUCES", title: "SAUCES", matchers: ["sauce", "dip"] },
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
    hasAllergens: true,
    allergenKeys: [
      "gluten",
      "tojas",
      "tej",
      "hal",
      "mustar",
      "szojabab",
      "foldimogyoro",
    ],
    allergenDisclaimer:
      "Termékeink közös konyhában készülnek, ezért a keresztszennyeződés lehetősége nem zárható ki.",
    nameColWidth: 160,
    hostnames: ["nutrition.travistenders.hu"],
    publicHeading: "NUTRITION FACTS",
  },
  // Romanian Simon's Burger table — duplicated from `simons` for now.
  // Meat portions (and therefore nutrient values) differ from the HU menu,
  // so this is its own brand/dataset with its own admin at /admin/nutrition/ro
  // rather than a translation layer over the same rows.
  ro: {
    slug: "ro",
    locale: "ro",
    displayName: "Simon's Burger (RO)",
    primaryColor: "#2E9747",
    logoFile: "simons_logo.png",
    logoWidth: 85,
    logoHeight: 45,
    logoTop: 17,
    pdfHeaderTitle: "SIMON'S BURGER TABEL\nNUTRIȚIONAL ȘI ALERGENI",
    pdfFilename: "simonsburger_ro_nutrition.pdf",
    sections: [
      { key: "BURGEREK", title: "BURGERI", matchers: ["burg"] },
      {
        key: "FRIES",
        title: "CARTOFI PRĂJIȚI",
        matchers: ["fries", "side", "cartof"],
      },
      { key: "MILKSHAKES", title: "MILKSHAKES", matchers: ["milk", "shake"] },
      { key: "SAUCES", title: "SOSURI", matchers: ["sauc", "sos"] },
      {
        key: "REFILL DRINKS (350 ML)",
        title: "BĂUTURI CU REUMPLERE (350 ML)",
        matchers: ["drink", "refill", "bautur", "băutur"],
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
    allergenKeys: ALL_ALLERGEN_KEYS,
    allergenDisclaimer:
      "Alergenii din produsele noastre pot apărea în urme și în alte produse, datorită tehnologiei comune de preparare.",
    nameColWidth: 110,
    // path-based, not a separate domain: lives at nutrition.simonsburger.hu/ro
    hostnames: [],
    publicHeading: "NUTRIȚIE ȘI ALERGENI",
    hasGramaj: true,
    gramajLabel: "Gramaj\n(g)",
  },
  // Slovak Simon's Burger table — duplicated from `simons` for now, same
  // pattern as `ro`: its own brand/dataset with its own admin at
  // /admin/nutrition/sk rather than a translation layer over the HU rows.
  sk: {
    slug: "sk",
    locale: "sk",
    displayName: "Simon's Burger (SK)",
    primaryColor: "#2E9747",
    logoFile: "simons_logo.png",
    logoWidth: 85,
    logoHeight: 45,
    logoTop: 17,
    pdfHeaderTitle: "SIMON'S BURGER TABUĽKA\nVÝŽIVOVÝCH HODNÔT A ALERGÉNOV",
    pdfFilename: "simonsburger_sk_nutrition.pdf",
    sections: [
      { key: "BURGEREK", title: "BURGERY", matchers: ["burg"] },
      {
        key: "FRIES",
        title: "HRANOLKY",
        matchers: ["fries", "side", "hranol"],
      },
      { key: "MILKSHAKES", title: "MILKSHAKES", matchers: ["milk", "shake"] },
      { key: "SAUCES", title: "OMÁČKY", matchers: ["sauc", "omack", "omáčk"] },
      {
        key: "REFILL DRINKS (350 ML)",
        title: "NÁPOJE S DOPĹŇANÍM (350 ML)",
        matchers: ["drink", "refill", "napoj", "nápoj"],
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
    allergenKeys: ALL_ALLERGEN_KEYS,
    allergenDisclaimer:
      "Alergény z našich výrobkov sa môžu v stopovom množstve vyskytovať aj v iných výrobkoch, vzhľadom na spoločnú technológiu prípravy.",
    nameColWidth: 110,
    // path-based, not a separate domain: lives at nutrition.simonsburger.hu/sk
    hostnames: [],
    publicHeading: "VÝŽIVA A ALERGÉNY",
  },
};

export function getBrand(slug: string | undefined): BrandConfig {
  return BRANDS[slug ?? "simons"] ?? BRANDS.simons;
}
