import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { BRANDS } from "@/lib/brands";
import { renderNutritionPdf } from "@/lib/nutritionPdf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ brand: string }> }
) {
  const { brand: slug } = await context.params;
  const brand = BRANDS[slug];
  if (!brand) return new Response("Unknown brand", { status: 404 });

  const { data: rows, error } = await supabaseAdmin
    .from("nutrition_items")
    .select("*")
    .eq("brand", brand.slug)
    .order("category")
    .order("position");

  if (error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });

  const buffer = await renderNutritionPdf(brand, rows || []);
  return new Response(buffer as any, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=${brand.pdfFilename}`,
    },
  });
}
