import { TravelItem } from "../api/parse/route";

interface Props {
  items: TravelItem[];
}

export default function SummaryBar({ items }: Props) {
  const total = items.length;
  const visited = items.filter((i) => i.status === "已去").length;
  const wantTo = items.filter((i) => i.status === "想去").length;

  const percent = total > 0 ? Math.round((visited / total) * 100) : 0;

  return (
    <div className="mt-6 bg-white rounded-2xl border border-rose-100 p-4 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">打卡进度</span>
        <span className="text-sm text-rose-500 font-bold">{visited}/{total}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-rose-400 to-orange-400 h-2 rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="flex gap-4 mt-3 text-xs text-gray-500">
        <span>🎯 想去 <strong className="text-gray-700">{wantTo}</strong></span>
        <span>✅ 已去 <strong className="text-green-600">{visited}</strong></span>
        <span>📍 共 <strong className="text-gray-700">{total}</strong> 个</span>
      </div>
    </div>
  );
}
