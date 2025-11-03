import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { nutritionItemSchema } from "@/types/nutrition";
const requireAdmin = (req: NextRequest) => {
  const token = req.headers.get("x-admin-token");
  return token && token === process.env.ADMIN_TOKEN;
};

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ unwrap Promise
  const numId = Number(id);
  const body = await req.json();
  const parsed = nutritionItemSchema.partial().safeParse(body);
  if (!parsed.success)
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  const { data, error } = await supabaseAdmin
    .from("nutrition_items")
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single();
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const numId = Number(id);
  const { error } = await supabaseAdmin
    .from("nutrition_items")
    .delete()
    .eq("id", id);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
