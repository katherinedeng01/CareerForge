"use client";

import { useState } from "react";

interface Props {
  onParse: (text: string) => void;
  loading: boolean;
}

export default function ParseInput({ onParse, loading }: Props) {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(true);

  function handleSubmit() {
    if (!text.trim()) return;
    onParse(text.trim());
    setText("");
    setOpen(false);
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-rose-100 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-4 flex items-center justify-between text-left"
      >
        <span className="font-medium text-gray-700 flex items-center gap-2">
          <span>📋</span> 粘贴小红书帖子内容
        </span>
        <span className="text-gray-400 text-sm">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-gray-50">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="把小红书帖子的文字内容粘贴到这里...&#10;&#10;例如：&#10;📍 大阪三天两夜攻略&#10;第一天：道顿堀 → 心斋桥 → 黑门市场&#10;美食推荐：一兰拉面（约¥80），章鱼烧（¥50）&#10;住宿：心斋桥商业区酒店（约¥400/晚）"
            className="w-full mt-3 p-3 text-sm text-gray-700 bg-gray-50 rounded-xl border border-gray-200 focus:border-rose-300 focus:outline-none resize-none h-36 placeholder-gray-400"
          />
          <button
            onClick={handleSubmit}
            disabled={loading || !text.trim()}
            className="mt-3 w-full py-3 bg-rose-500 hover:bg-rose-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-medium rounded-xl transition-colors text-sm"
          >
            {loading ? "AI 解析中..." : "✨ 一键生成清单"}
          </button>
        </div>
      )}
    </div>
  );
}
