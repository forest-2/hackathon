"use client";

import { useState } from "react";

type Style = {
  id: string;
  label: string;
  prompt: string;
  highlight?: boolean;
};

const STYLES: Style[] = [
  { id: "boss", label: "上司向け", prompt: "敬語を使った丁寧なビジネス文体" },
  { id: "colleague", label: "同僚向け", prompt: "フレンドリーかつ仕事上の親しみやすい文体" },
  { id: "subordinate", label: "部下向け", prompt: "明確で親しみやすい、指示や依頼を含む文体" },
  { id: "customer", label: "お客様向け", prompt: "丁寧で礼儀正しいビジネス敬語" },
  { id: "lover", label: "恋人向け", prompt: "親密でやわらかく、愛情のこもった文体" },
  { id: "parent", label: "親向け", prompt: "子が親に話しかける、親しみと敬意のある文体" },
  { id: "child", label: "子ども向け", prompt: "子どもが理解できるやさしくシンプルな言葉" },
  {
    id: "easy-japanese",
    label: "やさしい日本語",
    prompt: "日本語を母語としない外国人向けのやさしい日本語。短い文、簡単な語彙、漢字にはふりがな",
    highlight: true,
  },
  { id: "kansai", label: "関西弁", prompt: "大阪弁・関西弁の話し言葉" },
  { id: "casual", label: "カジュアルに", prompt: "くだけた話し言葉でカジュアルに" },
  { id: "formal", label: "もっと丁寧に", prompt: "より格式高く丁寧な文語体" },
  { id: "concise", label: "短く", prompt: "要点のみを残し、できるだけ短く簡潔に" },
  { id: "classical", label: "古文風", prompt: "平安〜江戸時代の古典的な日本語の文体" },
];

function styleButtonColors(isActive: boolean, highlight: boolean) {
  if (isActive) return { borderColor: "#6366f1", background: "#6366f1", color: "#fff" };
  if (highlight) return { borderColor: "#16a34a", background: "#f0fdf4", color: "#16a34a" };
  return { borderColor: "#e5e7eb", background: "var(--background)", color: "var(--foreground)" };
}

function StyleButton({
  style,
  isActive,
  disabled,
  onClick,
}: {
  style: Style;
  isActive: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  const colors = styleButtonColors(isActive, !!style.highlight);
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "0.5rem 1rem",
        fontSize: "0.875rem",
        fontWeight: isActive ? 600 : 400,
        border: "1.5px solid",
        borderRadius: "2rem",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled && !isActive ? 0.5 : 1,
        transition: "all 0.15s",
        whiteSpace: "nowrap",
        ...colors,
      }}
    >
      {style.highlight ? `🌏 ${style.label}` : style.label}
    </button>
  );
}

export function StyleTransformer() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [activeStyle, setActiveStyle] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function streamResponse(reader: ReadableStreamDefaultReader<Uint8Array>) {
    const decoder = new TextDecoder();
    let accumulated = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      accumulated += decoder.decode(value, { stream: true });
      setOutputText(accumulated);
    }
  }

  async function handleStyleClick(style: Style) {
    if (!inputText.trim()) return;
    setActiveStyle(style.id);
    setIsLoading(true);
    setOutputText("");

    try {
      const res = await fetch("/api/transform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: inputText,
          styleLabel: style.label,
          stylePrompt: style.prompt,
        }),
      });

      if (!res.ok || !res.body) {
        setOutputText("エラーが発生しました。");
        return;
      }

      await streamResponse(res.body.getReader());
    } catch {
      setOutputText("通信エラーが発生しました。");
    } finally {
      setIsLoading(false);
    }
  }

  const activeStyleLabel = STYLES.find((s) => s.id === activeStyle)?.label;

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label
          htmlFor="input"
          style={{
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "var(--color-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          原文
        </label>
        <textarea
          id="input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="ここに文章を入力してください…"
          rows={5}
          style={{
            width: "100%",
            padding: "0.875rem",
            fontSize: "1rem",
            lineHeight: 1.6,
            border: "1.5px solid #e5e7eb",
            borderRadius: "0.5rem",
            resize: "vertical",
            fontFamily: "inherit",
            background: "var(--background)",
            color: "var(--foreground)",
            outline: "none",
            transition: "border-color 0.15s",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#6366f1";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#e5e7eb";
          }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <span
          style={{
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "var(--color-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          文体を選ぶ
        </span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {STYLES.map((style) => (
            <StyleButton
              key={style.id}
              style={style}
              isActive={activeStyle === style.id}
              disabled={isLoading || !inputText.trim()}
              onClick={() => handleStyleClick(style)}
            />
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <label
            htmlFor="output"
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "var(--color-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            変換後
            {activeStyleLabel && !isLoading && (
              <span style={{ marginLeft: "0.5rem", color: "#6366f1" }}>— {activeStyleLabel}</span>
            )}
            {isLoading && <span style={{ marginLeft: "0.5rem", color: "#6366f1" }}>生成中…</span>}
          </label>
          {outputText && (
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(outputText)}
              style={{
                fontSize: "0.75rem",
                padding: "0.25rem 0.625rem",
                border: "1px solid #e5e7eb",
                borderRadius: "0.375rem",
                background: "transparent",
                color: "var(--color-muted)",
                cursor: "pointer",
              }}
            >
              コピー
            </button>
          )}
        </div>
        <textarea
          id="output"
          value={outputText}
          readOnly
          rows={5}
          placeholder="ボタンを押すと変換結果がここに表示されます"
          style={{
            width: "100%",
            padding: "0.875rem",
            fontSize: "1rem",
            lineHeight: 1.6,
            border: "1.5px solid #e5e7eb",
            borderRadius: "0.5rem",
            resize: "vertical",
            fontFamily: "inherit",
            background: outputText ? "var(--background)" : "#f9fafb",
            color: "var(--foreground)",
            outline: "none",
          }}
        />
      </div>
    </div>
  );
}
