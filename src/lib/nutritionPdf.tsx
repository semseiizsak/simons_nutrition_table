import {
  pdf,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import path from "path";
import fs from "fs";
import { BrandConfig, NUTRIENT_FIELD_DEFS } from "./brands";

// ---- REGISTER OPEN SANS (400/700/800) — shared across brands ----
Font.register({
  family: "Open Sans",
  fonts: [
    {
      src: path.join(
        /*turbopackIgnore: true*/ process.cwd(),
        "public",
        "fonts",
        "open-sans",
        "static",
        "OpenSans-Regular.ttf"
      ),
      fontWeight: 400,
    },
    {
      src: path.join(
        /*turbopackIgnore: true*/ process.cwd(),
        "public",
        "fonts",
        "open-sans",
        "static",
        "SF-Pro-Display-Black.otf"
      ),
      fontWeight: 700,
    },
    {
      src: path.join(
        /*turbopackIgnore: true*/ process.cwd(),
        "public",
        "fonts",
        "open-sans",
        "static",
        "SF-Pro-Display-Black.otf"
      ),
      fontWeight: 800,
    },
  ],
});

// NOTE: paths must be literal (not built from a variable) so Next.js's
// build-time file tracing can see exactly which files a serverless
// function needs. A dynamic path (e.g. path.join(..., brand.logoFile))
// makes tracing fall back to bundling the whole public/ directory,
// which blows past Vercel's function size limit because of public/fonts.
const logoCache: Record<string, string> = {};
function getLogoBase64(brand: BrandConfig): string {
  if (!logoCache[brand.slug]) {
    let logoPath: string;
    switch (brand.slug) {
      case "simons":
        logoPath = path.join(
          /*turbopackIgnore: true*/ process.cwd(),
          "public",
          "simons_logo.png"
        );
        break;
      case "travis":
        logoPath = path.join(
          /*turbopackIgnore: true*/ process.cwd(),
          "public",
          "travis_logo.png"
        );
        break;
      default:
        throw new Error(`No logo path configured for brand: ${brand.slug}`);
    }
    const logoData = fs.readFileSync(logoPath);
    logoCache[brand.slug] = `data:image/png;base64,${logoData.toString(
      "base64"
    )}`;
  }
  return logoCache[brand.slug];
}

/* --- PAGE GEOMETRY --- */
const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;

/* --- LAYOUT CONSTANTS --- */
const MARGIN = { l: 15, r: 22, t: 22, b: 22 };
const HEADER_BAR_HEIGHT = 85;
const COLUMN_LABEL_OFFSET = 15;
const LABEL_ROW_HEIGHT = 24;
const SECTION_BAR_HEIGHT = 18;
const ROW_HEIGHT = 13;
const SECTION_SPACING = 8;

/* --- COLOURS --- */
const GRID_LIGHT = "#676767ff";
const GRID_DARK = "#292929ff";

/* --- fixed nutrient column width used when a brand shows the allergen grid --- */
const NUTRIENT_COL_WIDTH_WITH_ALLERGENS = 31.5;

/* --- ALLERGEN DEFINITIONS (brand-agnostic; unused when hasAllergens is false) --- */
const allergenColumns = [
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
] as const;

const allergenNames: { [key in (typeof allergenColumns)[number]]: string } = {
  gluten: "Glutén",
  rakfelek: "Rákfélék",
  tojas: "Tojás",
  hal: "Hal",
  foldimogyoro: "Földimogyoró",
  szojabab: "Szójabab",
  tej: "Tej",
  diofelek: "Diófélék",
  zeller: "Zeller",
  mustar: "Mustár",
  szezammag: "Szezámmag",
  "ken-dioxid": "Kén-dioxid",
  csillagfurt: "Csillagfürt",
  puhatestuek: "Puhatestűek",
};

/* --- HELPERS --- */
function normaliseCategory(brand: BrandConfig, cat: string | null): string {
  if (!cat) return "";
  const upper = cat.trim().toUpperCase();
  if (brand.sections.some((s) => s.key === upper)) return upper;
  const lower = cat.trim().toLowerCase();
  for (const s of brand.sections) {
    if (s.matchers?.some((m) => lower.includes(m))) return s.key;
  }
  return upper;
}

function parseAllergens(s: string | null): Set<string> {
  const set = new Set<string>();
  if (!s) return set;
  s.toLowerCase()
    .split(/[\s,;\/]+/)
    .map((t) => t.trim())
    .filter(Boolean)
    .forEach((part) => {
      if (part.includes("glut")) set.add("gluten");
      if (part.includes("rak")) set.add("rakfelek");
      if (part.includes("toj")) set.add("tojas");
      if (part.includes("hal") || part.includes("fish")) set.add("hal");
      if (part.includes("mogy") || part.includes("peanut"))
        set.add("foldimogyoro");
      if (part.includes("soy") || part.includes("szoj")) set.add("szojabab");
      if (part.includes("milk") || part.includes("tej")) set.add("tej");
      if (part.includes("dio")) set.add("diofelek");
      if (part.includes("zell")) set.add("zeller");
      if (part.includes("must")) set.add("mustar");
      if (part.includes("szez")) set.add("szezammag");
      if (part.includes("dioxid") || part.includes("sulf"))
        set.add("ken-dioxid");
      if (part.includes("csillag")) set.add("csillagfurt");
      if (part.includes("puha") || part.includes("mollusc"))
        set.add("puhatestuek");
    });
  return set;
}

/* --- STYLES (brand-agnostic) --- */
const styles = StyleSheet.create({
  page: {
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
    backgroundColor: "#fff",
    fontFamily: "Open Sans",
    fontSize: 8,
    fontWeight: 400,
  },
});

export async function renderNutritionPdf(brand: BrandConfig, rows: any[]) {
  const grouped: Record<string, any[]> = {};
  brand.sections.forEach((s) => (grouped[s.key] = []));
  (rows || []).forEach((r) => {
    const norm = normaliseCategory(brand, r.category);
    if (grouped[norm]) grouped[norm].push(r);
  });

  const nutrientColumns = brand.nutrientKeys.map((key) => ({
    key,
    label: NUTRIENT_FIELD_DEFS[key].label,
  }));

  const NAME_COL_WIDTH = brand.nameColWidth;
  const X_BASE = MARGIN.l + NAME_COL_WIDTH;

  let NUTRIENT_COL_WIDTH: number;
  let allergenAreaX = 0;
  let allergenAreaW = 0;
  let aColW = 0;

  if (brand.hasAllergens) {
    NUTRIENT_COL_WIDTH = NUTRIENT_COL_WIDTH_WITH_ALLERGENS;
    allergenAreaX = X_BASE + NUTRIENT_COL_WIDTH * nutrientColumns.length;
    allergenAreaW = PAGE_WIDTH - MARGIN.r - allergenAreaX;
    aColW = allergenAreaW / allergenColumns.length;
  } else {
    const available = PAGE_WIDTH - MARGIN.r - X_BASE;
    NUTRIENT_COL_WIDTH = available / nutrientColumns.length;
  }

  const startY =
    HEADER_BAR_HEIGHT + COLUMN_LABEL_OFFSET + LABEL_ROW_HEIGHT + 20;
  let y = startY;
  const bars: { y: number; title: string }[] = [];
  const rowsDraw: any[] = [];

  for (let s = 0; s < brand.sections.length; s++) {
    const sec = brand.sections[s];

    if (s > 0) y += SECTION_SPACING;

    bars.push({ y, title: sec.title });
    y += SECTION_BAR_HEIGHT;

    const items = grouped[sec.key] || [];
    items.forEach((item: any) => {
      rowsDraw.push({ item, y });
      y += ROW_HEIGHT;
    });
  }
  const endY = y;

  const logoBase64 = getLogoBase64(brand);

  const doc = (
    <Document>
      <Page
        size={{ width: PAGE_WIDTH, height: PAGE_HEIGHT }}
        style={styles.page}
      >
        {/* Header */}
        <View
          style={{
            position: "absolute",
            top: -10,
            left: 0,
            width: PAGE_WIDTH + 20,
            height: HEADER_BAR_HEIGHT,
            backgroundColor: brand.primaryColor,
          }}
        />

        {/* Header title */}
        <Text
          style={{
            position: "absolute",
            top: MARGIN.t - 2,
            left: MARGIN.l + 20,
            color: "#fff",
            fontSize: 18,
            fontFamily: "Open Sans",
            fontWeight: 1000,
            lineHeight: 1.1,
          }}
        >
          {brand.pdfHeaderTitle}
        </Text>

        {/* Header logo on the right */}
        <Image
          src={logoBase64}
          style={{
            position: "absolute",
            top: MARGIN.t - 5,
            right: MARGIN.r,
            width: 85,
            height: 45,
            objectFit: "contain",
          }}
        />

        {/* Rotated nutrient headers */}
        {nutrientColumns.map((col, i) => (
          <Text
            key={col.key}
            style={{
              position: "absolute",
              top: HEADER_BAR_HEIGHT + 54,
              left: X_BASE + i * NUTRIENT_COL_WIDTH + 12,
              fontSize: 8,
              transform: "rotate(-90deg)",
              transformOrigin: "left top",
              textAlign: "center",
              fontFamily: "Open Sans",
              fontWeight: 700,
            }}
          >
            {col.label.replace(/\n/g, " ")}
          </Text>
        ))}

        {/* Rotated allergen headers */}
        {brand.hasAllergens &&
          allergenColumns.map((ak, i) => (
            <Text
              key={`alg-${ak}`}
              style={{
                position: "absolute",
                top: HEADER_BAR_HEIGHT + 54,
                left: allergenAreaX + i * aColW + aColW / 2 - 4,
                fontSize: 7,
                transform: "rotate(-90deg)",
                transformOrigin: "left top",
                textAlign: "center",
                fontFamily: "Open Sans",
                fontWeight: 400,
              }}
            >
              {allergenNames[ak]}
            </Text>
          ))}

        {/* Grey allergen background */}
        {brand.hasAllergens && (
          <View
            style={{
              position: "absolute",
              top: startY,
              left: allergenAreaX,
              width: allergenAreaW,
              height: endY - startY,
              backgroundColor: "#EDEDED",
            }}
          />
        )}

        {/* Vertical grid lines */}
        {[
          MARGIN.l,
          MARGIN.l + NAME_COL_WIDTH,
          ...nutrientColumns.map((_, i) => X_BASE + i * NUTRIENT_COL_WIDTH),
          ...(brand.hasAllergens
            ? [
                allergenAreaX,
                ...Array.from(
                  { length: allergenColumns.length + 1 },
                  (_, i) => allergenAreaX + i * aColW
                ),
              ]
            : []),
          PAGE_WIDTH - MARGIN.r,
        ].map((x, i) => (
          <View
            key={`v-${i}`}
            style={{
              position: "absolute",
              top: startY,
              left: x,
              width: 0.5,
              height: endY - startY,
              backgroundColor:
                brand.hasAllergens && x >= allergenAreaX
                  ? GRID_DARK
                  : GRID_LIGHT,
            }}
          />
        ))}

        {/* Horizontal row lines */}
        {rowsDraw.map((r, i) => (
          <View
            key={`h-${i}`}
            style={{
              position: "absolute",
              top: r.y + ROW_HEIGHT,
              left: MARGIN.l,
              width: PAGE_WIDTH - MARGIN.l - MARGIN.r,
              height: 0.5,
              backgroundColor: GRID_LIGHT,
            }}
          />
        ))}

        {bars.map((bar) => (
          <View
            key={`bar-${bar.y}`}
            style={{
              position: "absolute",
              top: bar.y,
              left: MARGIN.l - 8,
              width: PAGE_WIDTH - MARGIN.l - MARGIN.r + 15,
              height: SECTION_BAR_HEIGHT,
              backgroundColor: brand.primaryColor,
              borderRadius: 6,
            }}
          >
            <Text
              style={{
                position: "absolute",
                left: 8,
                top: 3,
                color: "#fff",
                fontSize: 10,
                fontFamily: "Open Sans",
                fontWeight: 800,
              }}
            >
              {bar.title}
            </Text>
          </View>
        ))}

        {/* Data rows */}
        {rowsDraw.map((r, i) => {
          const it = r.item;
          const allerg = brand.hasAllergens
            ? parseAllergens(it.allergens)
            : null;
          const yPos = r.y + 3;
          return (
            <View key={`row-${i}`}>
              {/* Food name — Bold (700) */}
              <Text
                style={{
                  position: "absolute",
                  top: yPos,
                  left: MARGIN.l + 3,
                  fontFamily: "Open Sans",
                  fontWeight: 700,
                  fontSize: 7.5,
                }}
              >
                {it.name}
              </Text>

              {/* Nutrient values — Regular (400) */}
              {nutrientColumns.map((c, j) => (
                <Text
                  key={`${i}-${c.key}`}
                  style={{
                    position: "absolute",
                    top: yPos,
                    left: X_BASE + j * NUTRIENT_COL_WIDTH + 2,
                    fontFamily: "Open Sans",
                    fontWeight: 400,
                    fontSize: 6.5,
                  }}
                >
                  {it[c.key] ?? ""}
                </Text>
              ))}

              {/* Allergen dots */}
              {brand.hasAllergens &&
                allergenColumns.map((ak, ai) =>
                  allerg!.has(ak) ? (
                    <Text
                      key={`${i}-${ak}`}
                      style={{
                        position: "absolute",
                        top: yPos - 10,
                        left: allergenAreaX + ai * aColW + aColW / 2 - 3,
                        fontSize: 20,
                        color: brand.primaryColor,
                        fontFamily: "Open Sans",
                        fontWeight: 400,
                      }}
                    >
                      •
                    </Text>
                  ) : null
                )}
            </View>
          );
        })}

        {brand.hasAllergens && (
          <Text
            style={{
              position: "absolute",
              bottom: MARGIN.b,
              left: MARGIN.l,
              right: MARGIN.r,
              fontSize: 8,
              color: "#333",
              lineHeight: 1.4,
            }}
          >
            Az egyes termékeinkben található allergének ételeink feldolgozási
            technológiájának jellegéből adódóan nyomokban előfordulhatnak más
            termékekben.
          </Text>
        )}
      </Page>
    </Document>
  );

  const buffer = await pdf(doc).toBuffer();
  return buffer;
}
