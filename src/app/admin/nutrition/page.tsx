import { redirect } from "next/navigation";

// Old bookmarked URL — send straight to the Simon's brand admin.
export default function AdminNutritionRedirect() {
  redirect("/admin/nutrition/simons");
}
