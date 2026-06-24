"use client";

import { useState } from "react";
import { TravelItem } from "../api/parse/route";

interface Props {
  item: TravelItem;
  onUpdate: (item: TravelItem) => void;
  onDelete: (id: string) => void;
}

const STATUS_CONFIG = {
  想去: { label: "想去", color: "bg-blue-100 text-blue-600", next: "已去" as const },
  已去: { label: "✓ 已去", color: "bg-green-100 text-green-600", next: "跳过" as const },
  跳过: { label: "跳过", color: "bg-gray-100 text-gray-400", next: "想去" as const },
};

const CATEGORIES = ["景点", "美食", "住宿", "购物", "交通", "其他"] as const;

export default function ItemCard({ item, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(item);

  const statusCfg = STATUS_CONFIG[item.status];

  function cycleStatus() {
    onUpdate({ ...item, status: statusCfg.next });
  }

  function saveEdit() {
    onUpdate(draft);
    setEditing(false);
  }

  if (editing) {
    return (
      <div className="bg-white rounded-xl border border-rose-200 p-4 shadow-sm">
        <div className="space-y-3">
          <input
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            className="w-full text-sm font-medium border-b border-gray-200 focus:border-rose-300 outline-none pb-1"
            placeholder="名称"
          />
          <div className="flex gap-2">
            <select
              value={draft.category}
              onChange={(e) => setDraft({ ...draft, category: e.target.value as TravelItem["category"] })}
              className="text-xs border border-gray-200 rounded-lg px-2 py-1 outline-none focus:border-rose-300"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <input
              value={draft.price}
              onChange={(e) => setDraft({ ...draft, price: e.target.value })}
              className="flex-1 text-xs border border-gray-200 rounded-lg px-2 py-1 outline-none focus:border-rose-300"
              placeholder="价格/预算"
            />
          </div>
          <input
            value={draft.notes}
            onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
            className="w-full text-xs text-gray-500 border border-gray-200 rounded-lg px-2 py-1 outline-none focus:border-rose-300"
            placeholder="备注"
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setEditing(false)}
              className="text-xs px-3 py-1 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
            >
              取消
            </button>
            <button
              onClick={saveEdit}
              className="text-xs px-3 py-1 rounded-lg bg-rose-500 text-white hover:bg-rose-600"
            >
              保存
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex items-start gap-3 ${item.status === "跳过" ? "opacity-50" : ""}`}>
      <button
        onClick={cycleStatus}
        className={`shrink-0 text-xs px-2 py-1 rounded-full font-medium ${statusCfg.color} transition-colors mt-0.5`}
      >
        {statusCfg.label}
      </button>

      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-800 text-sm truncate">{item.name}</div>
        <div className="flex items-center gap-2 mt-1">
          {item.price && item.price !== "未知" && (
            <span className="text-xs text-orange-500">{item.price}</span>
          )}
          {item.notes && (
            <span className="text-xs text-gray-400 truncate">{item.notes}</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => setEditing(true)}
          className="text-gray-300 hover:text-gray-500 text-xs p-1"
          title="编辑"
        >
          ✏️
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="text-gray-300 hover:text-red-400 text-xs p-1"
          title="删除"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
