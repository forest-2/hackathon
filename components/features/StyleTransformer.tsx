"use client";

import { useEffect, useRef, useState } from "react";

type Style = {
  id: string;
  label: string;
  prompt: string;
  highlight?: boolean;
};

const EXAMPLES: string[] = [
  "明日の会議に少し遅れそうです。",
  "この件について一度相談させてください。",
  "先日はありがとうございました。",
  "体調が悪いので今日は早退したいです。",
  "プロジェクトの進捗はどうですか？",
  "もう少し時間をいただけると助かります。",
];

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
  {
    id: "dog",
    label: "犬向け",
    prompt:
      "入力文章の意味・感情・テンションを汲み取り、「わん」「ワン」「わんわん」「ウォン」「くぅーん」「わふ」などの犬の鳴き声だけで表現してください。人間の言葉は一切使わず、犬の鳴き声と感嘆符・句読点のみで構成すること。例：嬉しい→「わんわんわん！！」、悲しい→「くぅーん…くぅーん」、驚き→「わふっ！？ワンワン！」",
  },
  {
    id: "cat",
    label: "猫向け",
    prompt:
      "入力文章の意味・感情・テンションを汲み取り、「にゃ」「にゃあ」「にゃーん」「みゃ」「ふにゃ」「ごろごろ」「しゃー」などの猫の鳴き声だけで表現してください。人間の言葉は一切使わず、猫の鳴き声と感嘆符・句読点のみで構成すること。例：甘え→「にゃーん…にゃ、にゃあ」、怒り→「しゃーっ！みゃ！」、満足→「ごろごろ…にゃ」",
  },
];

const C = {
  bg: "#F0F2F5",
  ink: "#1A1C1E",
  inkMid: "#52575C",
  inkLight: "#9EA5AD",
  rule: "#D0D5DD",
  accent: "#1B4FBF",
  accentLight: "#E8EEFB",
  highlight: "#0D7A4A",
  highlightBg: "#E6F5EE",
  panelBg: "#FFFFFF",
  header: "#1A2433",
  headerText: "#FFFFFF",
  cursor: "#1B4FBF",
  rowHover: "#F5F7FA",
  rowActive: "#E8EEFB",
  rowActiveBorder: "#1B4FBF",
} as const;

async function fetchTransform(
  text: string,
  style: Style,
  onChunk: (text: string) => void,
): Promise<string | null> {
  const res = await fetch("/api/transform", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, styleLabel: style.label, stylePrompt: style.prompt }),
  });
  if (!res.ok || !res.body) return "エラーが発生しました。";
  await readStream(res.body.getReader(), onChunk);
  return null;
}

async function readStream(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  onChunk: (text: string) => void,
) {
  const decoder = new TextDecoder();
  let accumulated = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    accumulated += decoder.decode(value, { stream: true });
    onChunk(accumulated);
  }
}

function StreamCursor() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setVisible((v) => !v), 500);
    return () => clearInterval(id);
  }, []);
  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-block",
        width: "2px",
        height: "1em",
        background: visible ? C.cursor : "transparent",
        marginLeft: "2px",
        verticalAlign: "text-bottom",
        borderRadius: "1px",
      }}
    />
  );
}

function PanelHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div
      style={{
        padding: "0.6rem 1rem",
        background: "#E8ECF2",
        borderBottom: `1px solid ${C.rule}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: "36px",
      }}
    >
      <span
        style={{
          fontSize: "0.75rem",
          fontWeight: 700,
          color: C.inkMid,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {title}
      </span>
      {sub && (
        <span style={{ fontSize: "0.7rem", color: C.inkLight }}>
          {sub}
        </span>
      )}
    </div>
  );
}

export function StyleTransformer() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [activeStyle, setActiveStyle] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hoveredStyle, setHoveredStyle] = useState<string | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  async function handleStyleClick(style: Style) {
    if (!inputText.trim()) return;
    setActiveStyle(style.id);
    setIsLoading(true);
    setOutputText("");
    try {
      const err = await fetchTransform(inputText, style, setOutputText);
      if (err) setOutputText(err);
    } catch {
      setOutputText("通信エラーが発生しました。");
    } finally {
      setIsLoading(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(outputText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const activeStyleObj = STYLES.find((s) => s.id === activeStyle);
  const hasOutput = outputText.length > 0;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
        width: "100%",
        background: C.bg,
        fontFamily: "'Noto Serif JP', 'Hiragino Mincho ProN', 'Yu Mincho', serif",
        overflow: "hidden",
      }}
    >
      {/* ヘッダー */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 1.5rem",
          height: "48px",
          minHeight: "48px",
          background: C.header,
          color: C.headerText,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ fontSize: "0.9375rem", fontWeight: 700, letterSpacing: "0.06em" }}>
            文体変換システム
          </span>
          <span
            style={{
              fontSize: "0.6875rem",
              color: "rgba(255,255,255,0.45)",
              letterSpacing: "0.04em",
            }}
          >
            Japanese Style Transformer
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          {isLoading && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                fontSize: "0.75rem",
                color: "#7EB3FF",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#7EB3FF",
                  animation: "pulse 1s ease-in-out infinite",
                }}
              />
              処理中
            </div>
          )}
          <a
            href="https://github.com/forest-2/hackathon"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              textDecoration: "none",
            }}
          >
            <img
              src="/forest-2.png"
              alt="forest logo"
              style={{ height: "30px", width: "30px", objectFit: "contain" }}
            />
            <span
              style={{
                fontSize: "0.8125rem",
                fontWeight: 700,
                color: C.headerText,
                letterSpacing: "0.04em",
              }}
            >
              forest-2
            </span>
          </a>
        </div>
      </header>

      {/* サブヘッダー（操作バー） */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 1.5rem",
          height: "36px",
          minHeight: "36px",
          background: "#253045",
          borderBottom: `2px solid ${C.accent}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {activeStyleObj && (
            <span
              style={{
                fontSize: "0.75rem",
                color: "rgba(255,255,255,0.7)",
                letterSpacing: "0.04em",
              }}
            >
              選択中：
              <span style={{ color: "#7EB3FF", fontWeight: 700 }}>{activeStyleObj.label}</span>
            </span>
          )}
          {!activeStyleObj && (
            <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.04em" }}>
              変換スタイルを選択してください
            </span>
          )}
        </div>
        {hasOutput && !isLoading && (
          <button
            type="button"
            onClick={handleCopy}
            style={{
              fontSize: "0.75rem",
              padding: "0.2rem 0.9rem",
              border: `1px solid ${copied ? "#7EB3FF" : "rgba(255,255,255,0.25)"}`,
              borderRadius: "2px",
              background: copied ? "rgba(126,179,255,0.15)" : "transparent",
              color: copied ? "#7EB3FF" : "rgba(255,255,255,0.65)",
              cursor: "pointer",
              fontFamily: "inherit",
              letterSpacing: "0.04em",
              transition: "all 0.15s ease",
            }}
          >
            {copied ? "コピー済み ✓" : "結果をコピー"}
          </button>
        )}
      </div>

      {/* 3カラムメインエリア */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", gap: "0", padding: "0.75rem", gap: "0.75rem" }}>

        {/* 左カラム：入力 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            background: C.panelBg,
            border: `1px solid ${C.rule}`,
            borderRadius: "2px",
            overflow: "hidden",
          }}
        >
          <PanelHeader title="原文入力" sub={`${inputText.length} 文字`} />

          <textarea
            id="input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={"変換したい文章を入力してください…"}
            style={{
              flex: 1,
              width: "100%",
              padding: "1rem",
              fontSize: "0.9375rem",
              lineHeight: 1.8,
              border: "none",
              resize: "none",
              fontFamily: "inherit",
              background: "transparent",
              color: C.ink,
              outline: "none",
              caretColor: C.accent,
            }}
          />

          <div
            style={{
              borderTop: `1px solid ${C.rule}`,
              padding: "0.5rem 1rem",
              background: "#F8F9FB",
            }}
          >
            <div style={{ fontSize: "0.6875rem", color: C.inkLight, marginBottom: "0.375rem", letterSpacing: "0.06em" }}>
              例文
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.1rem" }}>
              {EXAMPLES.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => setInputText(example)}
                  style={{
                    textAlign: "left",
                    background: "none",
                    border: "none",
                    padding: "0.2rem 0.25rem",
                    fontSize: "0.8125rem",
                    color: C.accent,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    lineHeight: 1.6,
                    textDecoration: "underline",
                    textDecorationColor: "transparent",
                    transition: "text-decoration-color 0.12s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.textDecorationColor = C.accent;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.textDecorationColor = "transparent";
                  }}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 中央カラム：スタイル選択 */}
        <div
          style={{
            width: "200px",
            minWidth: "200px",
            display: "flex",
            flexDirection: "column",
            background: C.panelBg,
            border: `1px solid ${C.rule}`,
            borderRadius: "2px",
            overflow: "hidden",
          }}
        >
          <PanelHeader title="変換スタイル" />
          <div style={{ flex: 1, overflowY: "auto" }}>
            {STYLES.map((style, index) => {
              const isActive = activeStyle === style.id;
              const isHovered = hoveredStyle === style.id;
              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => handleStyleClick(style)}
                  disabled={isLoading && !isActive}
                  onMouseEnter={() => setHoveredStyle(style.id)}
                  onMouseLeave={() => setHoveredStyle(null)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    padding: "0.6rem 1rem",
                    border: "none",
                    borderLeft: `3px solid ${isActive ? C.rowActiveBorder : "transparent"}`,
                    borderBottom: `1px solid ${C.rule}`,
                    background: isActive ? C.rowActive : isHovered ? C.rowHover : "transparent",
                    color: isActive ? C.accent : style.highlight ? C.highlight : C.ink,
                    cursor: isLoading && !isActive ? "not-allowed" : "pointer",
                    opacity: isLoading && !isActive ? 0.5 : 1,
                    fontFamily: "inherit",
                    fontSize: "0.875rem",
                    fontWeight: isActive ? 700 : 400,
                    textAlign: "left",
                    transition: "background 0.1s ease",
                    gap: "0.5rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.65rem",
                      color: C.inkLight,
                      minWidth: "1.5rem",
                      fontFamily: "monospace",
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {style.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 右カラム：出力 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            background: C.panelBg,
            border: `1px solid ${C.rule}`,
            borderRadius: "2px",
            overflow: "hidden",
          }}
          aria-live="polite"
        >
          <PanelHeader
            title="変換結果"
            sub={hasOutput ? `${outputText.length} 文字` : undefined}
          />

          <div
            ref={outputRef}
            style={{
              flex: 1,
              padding: "1rem",
              overflowY: "auto",
              position: "relative",
            }}
          >
            {!hasOutput && !isLoading && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                  userSelect: "none",
                }}
              >
                <p
                  style={{
                    fontSize: "0.8125rem",
                    color: C.inkLight,
                    letterSpacing: "0.06em",
                    lineHeight: 2,
                    textAlign: "center",
                    margin: 0,
                  }}
                >
                  原文を入力し、スタイルを選択してください
                </p>
              </div>
            )}
            {(hasOutput || isLoading) && (
              <p
                style={{
                  fontSize: "0.9375rem",
                  lineHeight: 1.8,
                  color: C.ink,
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-all",
                }}
              >
                {outputText}
                {isLoading && <StreamCursor />}
              </p>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        textarea::placeholder { color: ${C.inkLight}; }
        textarea:focus { outline: none; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.rule}; border-radius: 0; }
      `}</style>
    </div>
  );
}
