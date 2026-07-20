"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { NutritionItem } from "@/types/nutrition";
import { getBrand, NutrientKey } from "@/lib/brands";
import Papa from "papaparse";

const ADMIN_TOKEN =
  typeof window !== "undefined"
    ? localStorage.getItem("ADMIN_TOKEN") || ""
    : "";

export default function NutritionAdminPage() {
  const params = useParams();
  const brand = getBrand(
    Array.isArray(params.brand) ? params.brand[0] : params.brand
  );

  const [items, setItems] = useState<NutritionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    setToken(localStorage.getItem("ADMIN_TOKEN") || "");
    setLoading(true);
    fetch(`/api/nutrition?brand=${brand.slug}`)
      .then((r) => r.json())
      .then(setItems)
      .finally(() => setLoading(false));
  }, [brand.slug]);

  const saveToken = () => {
    localStorage.setItem("ADMIN_TOKEN", token);
    alert("✅ Admin token saved!");
  };

  const updateField = (id: number, field: keyof NutritionItem, value: any) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, [field]: value } : it))
    );
  };

  const saveRow = async (row: NutritionItem) => {
    const res = await fetch(`/api/nutrition/${row.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify(row),
    });
    if (!res.ok) alert("❌ Save failed");
  };

  const addRow = async () => {
    const res = await fetch("/api/nutrition", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify({
        name: "New Item",
        brand: brand.slug,
        kcal: 0,
        fat_g: 0,
        sat_fat_g: 0,
        carbs_g: 0,
        sugar_g: 0,
        protein_g: 0,
        salt_g: 0,
        fiber_g: brand.nutrientKeys.includes("fiber_g") ? 0 : null,
        allergens: "",
        category: brand.sections[0].key,
        position: items.length + 1,
      }),
    });
    if (res.ok) {
      const created = await res.json();
      setItems((prev) => [...prev, created]);
    } else {
      alert("❌ Create failed");
    }
  };

  const delRow = async (id?: number) => {
    if (!id) return;
    if (!confirm("Delete item?")) return;
    const res = await fetch(`/api/nutrition/${id}`, {
      method: "DELETE",
      headers: { "x-admin-token": token },
    });
    if (res.ok) setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const importCSV = async (file: File) => {
    const text = await file.text();
    const { data, errors } = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      delimitersToGuess: [",", ";", "\t", "|"],
    });

    if (errors.length) {
      alert("❌ CSV parse error: " + errors[0].message);
      return;
    }

    const rows: NutritionItem[] = data
      .filter((r: any) => r.name) // ignore empty rows
      .map((r: any, i: number) => ({
        name: r.name?.trim() || "",
        brand: brand.slug,
        kcal: Number(r.kcal) || 0,
        fat_g: Number(r.fat_g) || 0,
        sat_fat_g: Number(r.sat_fat_g) || 0,
        carbs_g: Number(r.carbs_g) || 0,
        sugar_g: Number(r.sugar_g) || 0,
        protein_g: Number(r.protein_g) || 0,
        salt_g: Number(r.salt_g) || 0,
        fiber_g:
          r.fiber_g !== undefined && r.fiber_g !== ""
            ? Number(r.fiber_g)
            : null,
        allergens: r.allergens || "",
        category: r.category || brand.sections[0].key,
        position: Number(r.position) || i + 1,
      }));

    if (!confirm(`Import ${rows.length} items into DB?`)) return;

    for (const row of rows) {
      const res = await fetch("/api/nutrition", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
        },
        body: JSON.stringify(row),
      });
      if (!res.ok) {
        console.error("Failed to insert row:", row.name);
      }
    }

    alert(`✅ Imported ${rows.length} items`);
    location.reload();
  };

  const numericKeys = brand.nutrientKeys;

  if (loading)
    return (
      <div
        style={{ ["--brand" as any]: brand.primaryColor }}
        className="flex items-center justify-center h-screen text-xl font-bold text-[var(--brand)] animate-pulse"
      >
        Loading Nutrition Data…
      </div>
    );

  return (
    <div
      style={{ ["--brand" as any]: brand.primaryColor }}
      className="min-h-screen bg-white text-gray-800 p-8"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-black tracking-tight text-[var(--brand)]">
            {brand.displayName} — Nutrition Admin
          </h1>
          <a
            href={`/api/nutrition-table/${brand.slug}`}
            target="_blank"
            className="bg-[var(--brand)] hover:opacity-90 transition-opacity text-white font-semibold px-5 py-2 rounded-lg shadow-sm"
          >
            Generate PDF
          </a>
        </div>

        {/* BRAND SWITCH */}
        <div className="text-sm text-gray-500">
          <a href="/admin" className="underline hover:text-gray-700">
            ← Back to brands
          </a>
        </div>

        {/* TOKEN INPUT */}
        <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
          <input
            className="border border-gray-300 rounded-md px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
            placeholder="Admin token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <button
            className="bg-[var(--brand)] hover:opacity-90 text-white font-semibold px-4 py-2 rounded-md transition-all shadow-sm active:scale-[0.98]"
            onClick={saveToken}
          >
            Save Token
          </button>
        </div>

        {/* CSV IMPORT */}
        <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
          <label className="font-semibold text-gray-700">
            Import CSV:
            <input
              type="file"
              accept=".csv"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) importCSV(file);
              }}
              className="ml-3"
            />
          </label>
          <span className="text-sm text-gray-500">
            (columns: name, {numericKeys.join(", ")}, allergens, category,
            position)
          </span>
        </div>

        {/* TABLE */}
        <div className="overflow-auto border border-gray-200 rounded-lg shadow-md">
          <table className="min-w-full text-sm border-collapse">
            <thead className="bg-[var(--brand)] text-white">
              <tr>
                {[
                  "#",
                  "Category",
                  "Name",
                  ...numericKeys,
                  "allergens",
                  "position",
                  "actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-3 py-2 text-left font-semibold border-b border-white/20"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((it, idx) => (
                <tr
                  key={it.id || idx}
                  className="even:bg-gray-50 hover:bg-gray-100/60 transition-colors"
                >
                  <td className="border-t px-2 py-2 font-medium text-gray-600">
                    {it.id}
                  </td>
                  <td className="border-t px-2 py-1">
                    <select
                      className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
                      value={it.category || ""}
                      onChange={(e) =>
                        updateField(it.id!, "category", e.target.value)
                      }
                    >
                      {brand.sections.map((s) => (
                        <option key={s.key} value={s.key}>
                          {s.key}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border-t px-2 py-1">
                    <input
                      className="border border-gray-300 rounded px-2 py-1 w-48 focus:ring-2 focus:ring-[var(--brand)]"
                      value={it.name}
                      onChange={(e) =>
                        updateField(it.id!, "name", e.target.value)
                      }
                    />
                  </td>
                  {numericKeys.map((key: NutrientKey) => (
                    <td key={key} className="border-t px-2 py-1">
                      <input
                        type="number"
                        className="border border-gray-300 rounded px-2 py-1 w-20 text-right focus:ring-2 focus:ring-[var(--brand)]"
                        value={(it as any)[key] ?? ""}
                        onChange={(e) =>
                          updateField(
                            it.id!,
                            key,
                            e.target.value === "" ? null : Number(e.target.value)
                          )
                        }
                      />
                    </td>
                  ))}
                  <td className="border-t px-2 py-1">
                    <input
                      className="border border-gray-300 rounded px-2 py-1 w-56 focus:ring-2 focus:ring-[var(--brand)]"
                      value={it.allergens || ""}
                      onChange={(e) =>
                        updateField(it.id!, "allergens", e.target.value)
                      }
                    />
                  </td>
                  <td className="border-t px-2 py-1">
                    <input
                      type="number"
                      className="border border-gray-300 rounded px-2 py-1 w-16 text-center focus:ring-2 focus:ring-[var(--brand)]"
                      value={it.position || 0}
                      onChange={(e) =>
                        updateField(it.id!, "position", Number(e.target.value))
                      }
                    />
                  </td>
                  <td className="border-t px-2 py-1 flex gap-2">
                    <button
                      className="bg-[var(--brand)] hover:opacity-90 text-white rounded px-3 py-1 text-xs font-semibold shadow-sm transition-all active:scale-[0.97]"
                      onClick={() => saveRow(it)}
                    >
                      Save
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white rounded px-3 py-1 text-xs font-semibold shadow-sm transition-all active:scale-[0.97]"
                      onClick={() => delRow(it.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ADD BUTTON */}
        <button
          className="w-full bg-[var(--brand)] hover:opacity-90 text-white text-lg font-semibold py-3 rounded-lg shadow-md transition-all active:scale-[0.98]"
          onClick={addRow}
        >
          + Add New Item
        </button>
      </div>
    </div>
  );
}
