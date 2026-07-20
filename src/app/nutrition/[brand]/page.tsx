import { notFound } from "next/navigation";
import { BRANDS } from "@/lib/brands";
import NutritionLanding from "@/components/NutritionLanding";

export function generateStaticParams() {
  return Object.keys(BRANDS).map((brand) => ({ brand }));
}

export default async function NutritionBrandPage({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand: slug } = await params;
  const brand = BRANDS[slug];
  if (!brand) notFound();
  return <NutritionLanding brand={brand} />;
}
