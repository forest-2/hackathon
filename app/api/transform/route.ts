import type { NextRequest } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const { text, styleLabel, stylePrompt } = await req.json();

  if (!text?.trim()) {
    return new Response("テキストを入力してください", { status: 400 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return new Response("OPENAI_API_KEY が設定されていません", { status: 500 });
  }

  const stream = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    stream: true,
    messages: [
      {
        role: "system",
        content:
          "あなたは文体変換の専門家です。入力された文章を指定された文体に変換してください。意味・内容は変えず、文体・トーン・語彙のみを変換してください。変換後の文章のみを出力し、説明や前置きは一切不要です。",
      },
      {
        role: "user",
        content: `以下の文章を「${styleLabel}」向けの文体（${stylePrompt}）に変換してください。\n\n${text}`,
      },
    ],
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content ?? "";
        if (delta) {
          controller.enqueue(encoder.encode(delta));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
