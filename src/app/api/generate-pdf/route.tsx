import { NextRequest } from "next/server";
import {
  pdf,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* --- PAGE GEOMETRY --- */
const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;

/* --- LAYOUT CONSTANTS --- */
const MARGIN = { l: 15, r: 22, t: 22, b: 22 };
const HEADER_BAR_HEIGHT = 80;
const COLUMN_LABEL_OFFSET = 10;
const LABEL_ROW_HEIGHT = 24;
const SECTION_BAR_HEIGHT = 18;
const ROW_HEIGHT = 18;
const SECTION_SPACING = 8;

/* --- COLOURS --- */
const GREEN = "#2E9747";
const GRID_LIGHT = "#C9C9C9";
const GRID_DARK = "#999999";

/* --- COLUMN WIDTHS --- */
const NAME_COL_WIDTH = 110;
const NUTRIENT_COL_WIDTH = 31.5;

/* --- DATA DEFINITIONS --- */
const nutrientColumns = [
  { key: "kcal", label: "Energia\n(kcal)" },
  { key: "fat_g", label: "Zsír\n(g)" },
  { key: "sat_fat_g", label: "Telített zsír\n(g)" },
  { key: "carbs_g", label: "Szénhidrát\n(g)" },
  { key: "sugar_g", label: "Cukor\n(g)" },
  { key: "protein_g", label: "Fehérje\n(g)" },
  { key: "salt_g", label: "Só\n(g)" },
  { key: "fiber_g", label: "Rost\n(g)" },
];

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

const SECTIONS: Array<{ key: string; title: string }> = [
  { key: "BURGEREK", title: "BURGEREK" },
  { key: "FRIES", title: "FRIES" },
  { key: "MILKSHAKES", title: "MILKSHAKES" },
  { key: "SAUCES", title: "SAUCES" },
  { key: "REFILL DRINKS (350 ML)", title: "REFILL DRINKS (350 ML)" },
];

/* --- HELPERS --- */
function normaliseCategory(cat: string | null): string {
  if (!cat) return "";
  const c = cat.trim().toLowerCase();
  if (c.startsWith("burg")) return "BURGEREK";
  if (c.startsWith("fries") || c.startsWith("side")) return "FRIES";
  if (c.startsWith("milk") || c.startsWith("shake")) return "MILKSHAKES";
  if (c.startsWith("sauc")) return "SAUCES";
  if (c.includes("drink") || c.includes("refill"))
    return "REFILL DRINKS (350 ML)";
  return cat.toUpperCase();
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

/* --- STYLES --- */
const styles = StyleSheet.create({
  page: {
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
    backgroundColor: "#fff",
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
  },
  headerBar: {
    position: "absolute",
    top: 0,
    left: 0,
    width: PAGE_WIDTH,
    height: HEADER_BAR_HEIGHT,
    backgroundColor: GREEN,
  },
  headerText: {
    position: "absolute",
    top: MARGIN.t,
    left: MARGIN.l,
    color: "#fff",
    fontSize: 18,
  },
});

export async function GET(_req: NextRequest) {
  const { data: rows, error } = await supabaseAdmin
    .from("nutrition_items")
    .select("*")
    .order("category")
    .order("position");

  if (error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });

  const grouped: Record<string, any[]> = {};
  SECTIONS.forEach((s) => (grouped[s.key] = []));
  (rows || []).forEach((r) => {
    const norm = normaliseCategory(r.category);
    if (grouped[norm]) grouped[norm].push(r);
  });

  const X_BASE = MARGIN.l + NAME_COL_WIDTH;
  const allergenAreaX = X_BASE + NUTRIENT_COL_WIDTH * nutrientColumns.length;
  const allergenAreaW = PAGE_WIDTH - MARGIN.r - allergenAreaX;
  const aColW = allergenAreaW / allergenColumns.length;

  const startY =
    HEADER_BAR_HEIGHT + COLUMN_LABEL_OFFSET + LABEL_ROW_HEIGHT + 20;
  let y = startY;
  const bars: { y: number; title: string }[] = [];
  const rowsDraw: any[] = [];

  for (const sec of SECTIONS) {
    bars.push({ y, title: sec.title });
    y += SECTION_BAR_HEIGHT + SECTION_SPACING / 2;
    const items = grouped[sec.key] || [];
    items.forEach((item: any) => {
      rowsDraw.push({ item, y });
      y += ROW_HEIGHT;
    });
    y += SECTION_SPACING / 2;
  }
  const endY = y;

  const doc = (
    <Document>
      <Page size={{ width: PAGE_WIDTH, height: PAGE_HEIGHT }} style={styles.page}>
        {/* Header */}
        <View style={styles.headerBar} />
        <Text style={styles.headerText}>
          SIMON'S BURGER TÁPANYAG{"\n"}ÉS ALLERGÉNTÁBLÁZAT
        </Text>

        {/* Rotated nutrient headers */}
        {nutrientColumns.map((col, i) => (
          <Text
            key={col.key}
            style={{
              position: "absolute",
              top: HEADER_BAR_HEIGHT + 50,
              left: X_BASE + i * NUTRIENT_COL_WIDTH + 12,
              fontSize: 7,
              transform: "rotate(-90deg)",
              transformOrigin: "left top",
              textAlign: "center",
            }}
          >
            {col.label.replace(/\n/g, " ")}
          </Text>
        ))}

        {/* Rotated allergen headers */}
        {allergenColumns.map((ak, i) => (
          <Text
            key={`alg-${ak}`}
            style={{
              position: "absolute",
              top: HEADER_BAR_HEIGHT + 52,
              left: allergenAreaX + i * aColW + aColW / 2 - 4,
              fontSize: 6,
              transform: "rotate(-90deg)",
              transformOrigin: "left top",
              textAlign: "center",
            }}
          >
            {allergenNames[ak]}
          </Text>
        ))}

        {/* Grey allergen background */}
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

        {/* Vertical grid lines */}
        {[
          MARGIN.l,
          MARGIN.l + NAME_COL_WIDTH,
          ...nutrientColumns.map((_, i) => X_BASE + i * NUTRIENT_COL_WIDTH),
          allergenAreaX,
          ...Array.from(
            { length: allergenColumns.length + 1 },
            (_, i) => allergenAreaX + i * aColW
          ),
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
              backgroundColor: x >= allergenAreaX ? GRID_DARK : GRID_LIGHT,
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

        {/* Section bars */}
        {bars.map((bar) => (
          <View
            key={`bar-${bar.y}`}
            style={{
              position: "absolute",
              top: bar.y,
              left: MARGIN.l - 8,
              width: PAGE_WIDTH - MARGIN.l - MARGIN.r + 15,
              height: SECTION_BAR_HEIGHT,
              backgroundColor: GREEN,
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
              }}
            >
              {bar.title}
            </Text>
          </View>
        ))}

        {/* Data rows */}
        {rowsDraw.map((r, i) => {
          const it = r.item;
          const allerg = parseAllergens(it.allergens);
          const yPos = r.y + 3;
          return (
            <View key={`row-${i}`}>
              <Text
                style={{
                  position: "absolute",
                  top: yPos,
                  left: MARGIN.l + 3,
                }}
              >
                {it.name}
              </Text>
              {nutrientColumns.map((c, j) => (
                <Text
                  key={`${i}-${c.key}`}
                  style={{
                    position: "absolute",
                    top: yPos,
                    left: X_BASE + j * NUTRIENT_COL_WIDTH + 3,
                  }}
                >
                  {it[c.key] ?? ""}
                </Text>
              ))}
              {allergenColumns.map((ak, ai) =>
                allerg.has(ak) ? (
                  <Text
                    key={`${i}-${ak}`}
                    style={{
                      position: "absolute",
                      top: yPos,
                      left: allergenAreaX + ai * aColW + aColW / 2 - 2,
                      fontSize: 10,
                    }}
                  >
                    •
                  </Text>
                ) : null
              )}
            </View>
          );
        })}

        {/* Footer note */}
        <Text
          style={{
            position: "absolute",
            bottom: MARGIN.b,
            left: MARGIN.l,
            right: MARGIN.r,
            fontSize: 8,
            color: "#333",
          }}
        >
          Ételeink a táblázatban felsorolt allergéneket tartalmazhatják. A
          jelzett allergének mellett esetenként egyéb allergének is
          előfordulhatnak.
        </Text>
      </Page>
    </Document>
  );

  const buffer = await pdf(doc).toBuffer();
  return new Response(buffer as any, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=simonsburger_nutrition.pdf",
    },
  });
}
