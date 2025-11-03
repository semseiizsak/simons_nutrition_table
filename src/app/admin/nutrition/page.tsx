"use client";
import { useEffect, useState } from "react";
import type { NutritionItem } from "@/types/nutrition";

const ADMIN_TOKEN =
  typeof window !== "undefined"
    ? localStorage.getItem("ADMIN_TOKEN") || ""
    : "";

export default function NutritionAdminPage() {
  const [items, setItems] = useState<NutritionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    setToken(localStorage.getItem("ADMIN_TOKEN") || "");
    fetch("/api/nutrition")
      .then((r) => r.json())
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

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
        kcal: 0,
        fat_g: 0,
        sat_fat_g: 0,
        carbs_g: 0,
        sugar_g: 0,
        protein_g: 0,
        salt_g: 0,
        fiber_g: 0,
        allergens: "",
        category: "BURGEREK",
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

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-xl font-bold text-[#0fa650] animate-pulse">
        Loading Nutrition Data…
      </div>
    );

  return (
    <div className="min-h-screen bg-white text-gray-800 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-black tracking-tight text-[#0fa650]">
            Simon’s Burger — Nutrition Admin
          </h1>
          <a
            href="/api/generate-pdf"
            target="_blank"
            className="bg-[#0fa650] hover:bg-[#0c8c43] transition-colors text-white font-semibold px-5 py-2 rounded-lg shadow-sm"
          >
            Generate PDF
          </a>
        </div>

        {/* TOKEN INPUT */}
        <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
          <input
            className="border border-gray-300 rounded-md px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-[#0fa650]"
            placeholder="Admin token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <button
            className="bg-[#0fa650] hover:bg-[#0d8e45] text-white font-semibold px-4 py-2 rounded-md transition-all shadow-sm active:scale-[0.98]"
            onClick={saveToken}
          >
            Save Token
          </button>
        </div>

        {/* TABLE */}
        <div className="overflow-auto border border-gray-200 rounded-lg shadow-md">
          <table className="min-w-full text-sm border-collapse">
            <thead className="bg-[#0fa650] text-white">
              <tr>
                {[
                  "#",
                  "Category",
                  "Name",
                  "kcal",
                  "fat_g",
                  "sat_fat_g",
                  "carbs_g",
                  "sugar_g",
                  "protein_g",
                  "salt_g",
                  "fiber_g",
                  "allergens",
                  "position",
                  "actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-3 py-2 text-left font-semibold border-b border-[#0d8e45]"
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
                  className="even:bg-gray-50 hover:bg-[#f2fff6] transition-colors"
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
                      <option value="BURGEREK">BURGEREK</option>
                      <option value="FRIES">FRIES</option>
                      <option value="MILKSHAKES">MILKSHAKES</option>
                      <option value="SAUCES">SAUCES</option>
                      <option value="REFILL DRINKS (350 ML)">
                        REFILL DRINKS (350 ML)
                      </option>
                    </select>
                  </td>
                  <td className="border-t px-2 py-1">
                    <input
                      className="border border-gray-300 rounded px-2 py-1 w-48 focus:ring-2 focus:ring-[#0fa650]"
                      value={it.name}
                      onChange={(e) =>
                        updateField(it.id!, "name", e.target.value)
                      }
                    />
                  </td>
                  {(
                    [
                      "kcal",
                      "fat_g",
                      "sat_fat_g",
                      "carbs_g",
                      "sugar_g",
                      "protein_g",
                      "salt_g",
                      "fiber_g",
                    ] as const
                  ).map((key) => (
                    <td key={key} className="border-t px-2 py-1">
                      <input
                        type="number"
                        className="border border-gray-300 rounded px-2 py-1 w-20 text-right focus:ring-2 focus:ring-[#0fa650]"
                        value={(it as any)[key]}
                        onChange={(e) =>
                          updateField(it.id!, key, Number(e.target.value))
                        }
                      />
                    </td>
                  ))}
                  <td className="border-t px-2 py-1">
                    <input
                      className="border border-gray-300 rounded px-2 py-1 w-56 focus:ring-2 focus:ring-[#0fa650]"
                      value={it.allergens || ""}
                      onChange={(e) =>
                        updateField(it.id!, "allergens", e.target.value)
                      }
                    />
                  </td>
                  <td className="border-t px-2 py-1">
                    <input
                      type="number"
                      className="border border-gray-300 rounded px-2 py-1 w-16 text-center focus:ring-2 focus:ring-[#0fa650]"
                      value={it.position || 0}
                      onChange={(e) =>
                        updateField(it.id!, "position", Number(e.target.value))
                      }
                    />
                  </td>
                  <td className="border-t px-2 py-1 flex gap-2">
                    <button
                      className="bg-[#0fa650] hover:bg-[#0d8e45] text-white rounded px-3 py-1 text-xs font-semibold shadow-sm transition-all active:scale-[0.97]"
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
          className="w-full bg-[#0fa650] hover:bg-[#0c8e45] text-white text-lg font-semibold py-3 rounded-lg shadow-md transition-all active:scale-[0.98]"
          onClick={addRow}
        >
          + Add New Item
        </button>
      </div>
    </div>
  );
}
