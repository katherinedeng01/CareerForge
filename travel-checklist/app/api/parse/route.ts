import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface TravelItem {
  id: string;
  name: string;
  category: "景点" | "美食" | "住宿" | "购物" | "交通" | "其他";
  price: string;
  notes: string;
  status: "想去" | "已去" | "跳过";
}

export async function POST(req: NextRequest) {
  const { text } = await req.json();

  if (!text?.trim()) {
    return NextResponse.json({ error: "请提供帖子文本" }, { status: 400 });
  }

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: `你是一个旅游攻略解析助手。请从以下小红书帖子文本中提取所有提到的旅游相关项目（景点、餐厅、住宿、购物地点、交通方式等），返回 JSON 数组。

每个项目包含：
- name: 名称（字符串）
- category: 类别，只能是以下之一："景点"、"美食"、"住宿"、"购物"、"交通"、"其他"
- price: 价格或预算（字符串，如"免费"、"约50元"、"100-200元"，没有提到则填"未知"）
- notes: 备注，从帖子中提取的相关描述（简短，不超过30字）

只返回 JSON 数组，不要其他内容。

帖子内容：
${text}`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    return NextResponse.json({ error: "解析失败" }, { status: 500 });
  }

  try {
    const jsonMatch = content.text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("No JSON array found");

    const items = JSON.parse(jsonMatch[0]);
    const itemsWithMeta: TravelItem[] = items.map(
      (item: Omit<TravelItem, "id" | "status">, i: number) => ({
        ...item,
        id: `item-${Date.now()}-${i}`,
        status: "想去" as const,
      })
    );

    return NextResponse.json({ items: itemsWithMeta });
  } catch {
    return NextResponse.json({ error: "JSON 解析失败" }, { status: 500 });
  }
}
