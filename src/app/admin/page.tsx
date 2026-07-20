import Link from "next/link";
import { BRANDS } from "@/lib/brands";

export default function AdminIndex() {
  return (
    <div className="min-h-screen bg-white text-gray-800 p-8 flex items-center justify-center">
      <div className="max-w-md w-full space-y-6 text-center">
        <h1 className="text-3xl font-black tracking-tight text-gray-900">
          Nutrition Admin
        </h1>
        <p className="text-gray-500">Choose a brand to manage.</p>
        <div className="flex flex-col gap-4">
          {Object.values(BRANDS).map((brand) => (
            <Link
              key={brand.slug}
              href={`/admin/nutrition/${brand.slug}`}
              style={{ backgroundColor: brand.primaryColor }}
              className="text-white font-semibold px-5 py-3 rounded-lg shadow-sm hover:opacity-90 transition-opacity"
            >
              {brand.displayName}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
