import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { nutritionItemSchema } from "@/types/nutrition";
import { BRANDS } from "@/lib/brands";
const requireAdmin = (req: NextRequest) => {
  const token = req.headers.get("x-admin-token");
  return token && token === process.env.ADMIN_TOKEN;
};
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const brand = searchParams.get("brand") || "simons";
  const { data, error } = await supabaseAdmin
    .from("nutrition_items")
    .select("*")
    .eq("brand", brand)
    .order("category", { ascending: true })
    .order("position", { ascending: true });
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const token = req.headers.get("x-admin-token");
  if (token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = nutritionItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  if (!BRANDS[parsed.data.brand]) {
    return NextResponse.json(
      { error: `Unknown brand: ${parsed.data.brand}` },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("nutrition_items")
    .insert(parsed.data)
    .select("*")       // <-- this is important, to return the inserted record
    .single();         // <-- ensures only one row comes back

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data); // <-- return the actual inserted item
}
