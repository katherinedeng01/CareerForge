"use client";

import { useState } from "react";
import { TravelItem } from "./api/parse/route";
import ItemCard from "./components/ItemCard";
import ParseInput from "./components/ParseInput";
import SummaryBar from "./components/SummaryBar";

export default function Home() {
  const [items, setItems] = useState<TravelItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tripName, setTripName] = useState("我的旅行清单");

  async function handleParse(text: string) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "解析失败");
      setItems((prev) => [...prev, ...data.items]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "解析失败，请重试");
    } finally {
      setLoading(false);
    }
  }

  function handleUpdate(updated: TravelItem) {
    setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
  }

  function handleDelete(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function handleAdd() {
    const newItem: TravelItem = {
      id: `item-${Date.now()}`,
      name: "新项目",
      category: "其他",
      price: "未知",
      notes: "",
      status: "想去",
    };
    setItems((prev) => [...prev, newItem]);
  }

  const categories = ["景点", "美食", "住宿", "购物", "交通", "其他"] as const;
  const grouped = categories
    .map((cat) => ({
      category: cat,
      items: items.filter((i) => i.category === cat),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 to-orange-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <div className="text-4xl mb-2">✈️</div>
          <input
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
            className="text-2xl font-bold text-center bg-transparent border-b-2 border-dashed border-rose-300 focus:border-rose-500 outline-none text-gray-800 w-full max-w-xs"
          />
          <p className="text-sm text-gray-500 mt-1">粘贴小红书攻略，一键生成打卡清单</p>
        </div>

        <ParseInput onParse={handleParse} loading={loading} />

        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {items.length > 0 && <SummaryBar items={items} />}

        {grouped.map(({ category, items: catItems }) => (
          <div key={category} className="mt-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span>{categoryIcon(category)}</span>
              {category}
              <span className="text-gray-400">({catItems.length})</span>
            </h2>
            <div className="space-y-2">
              {catItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        ))}

        {items.length > 0 && (
          <button
            onClick={handleAdd}
            className="mt-6 w-full py-3 border-2 border-dashed border-rose-300 rounded-xl text-rose-400 hover:border-rose-400 hover:text-rose-500 hover:bg-rose-50 transition-colors text-sm font-medium"
          >
            + 手动添加项目
          </button>
        )}

        {items.length === 0 && !loading && (
          <div className="mt-12 text-center text-gray-400">
            <div className="text-5xl mb-4">🗺️</div>
            <p className="text-sm">粘贴小红书帖子文字，开始规划你的旅行</p>
          </div>
        )}
      </div>
    </main>
  );
}

function categoryIcon(category: string) {
  const icons: Record<string, string> = {
    景点: "🏛️",
    美食: "🍜",
    住宿: "🏨",
    购物: "🛍️",
    交通: "🚇",
    其他: "📌",
  };
  return icons[category] || "📌";
}
