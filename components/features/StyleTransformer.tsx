"use client";

import { useEffect, useRef, useState } from "react";

type Style = {
  id: string;
  label: string;
  prompt: string;
  highlight?: boolean;
};

// ---- 例文リスト（ここを編集して例文を追加・変更できます） ----
const EXAMPLES: string[] = [
  "今日めっちゃいいことあった！聞いて聞いて！",
  "君、怒りすぎだよ。",
  "なんかうまくいってる気がしない。どうしよう。",
  "体調が悪いので今日は早退したいです。",
  "もう少し時間をいただけると助かります。",
];
const DEFAULT_INPUT = EXAMPLES[0] ?? "";

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
  bg: "#F7F5F0",
  ink: "#1A1814",
  inkMid: "#6B6560",
  inkLight: "#B8B3AC",
  rule: "#E2DDD7",
  accent: "#C0392B",
  accentBg: "#FFF0EE",
  accentBorder: "#E8B9A8",
  highlight: "#1B5E20",
  highlightBg: "#F0F7F0",
  highlightBorder: "#A5C8A8",
  panelBg: "#FFFFFF",
  cursor: "#C0392B",
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

function getButtonColors(
  isActive: boolean,
  highlight: boolean,
  hovered: boolean,
  disabled: boolean,
): React.CSSProperties {
  if (isActive && highlight) {
    return { borderColor: C.highlight, background: C.highlight, color: "#fff" };
  }
  if (isActive) {
    return { borderColor: C.accent, background: C.accent, color: "#fff" };
  }
  if (highlight) {
    return {
      borderColor: hovered ? C.highlight : C.rule,
      background: hovered ? C.highlightBg : C.panelBg,
      color: C.highlight,
    };
  }
  return {
    borderColor: hovered ? C.inkMid : C.rule,
    background: hovered && !disabled ? C.bg : C.panelBg,
    color: hovered && !disabled ? C.ink : C.inkMid,
  };
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
        height: "1.1em",
        background: visible ? C.cursor : "transparent",
        marginLeft: "2px",
        verticalAlign: "text-bottom",
        borderRadius: "1px",
      }}
    />
  );
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
  const [hovered, setHovered] = useState(false);
  const colors = getButtonColors(isActive, !!style.highlight, hovered, disabled);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled && !isActive}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "0.45rem 1.1rem",
        fontSize: "0.8125rem",
        fontWeight: isActive ? 700 : 400,
        letterSpacing: "0.02em",
        border: "1.5px solid",
        borderRadius: "9999px",
        cursor: disabled && !isActive ? "not-allowed" : "pointer",
        opacity: disabled && !isActive ? 0.45 : 1,
        transition: "all 0.18s ease",
        whiteSpace: "nowrap",
        lineHeight: 1,
        outline: "none",
        fontFamily: "inherit",
        userSelect: "none",
        ...colors,
      }}
    >
      {style.label}
    </button>
  );
}

function ModalGate({ show, onClose }: { show: boolean; onClose: () => void }) {
  const [closing, setClosing] = useState(false);

  if (!show && !closing) return null;

  function handleClose() {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 220);
  }

  return <ConceptModal onClose={handleClose} closing={closing} />;
}

function ConceptModal({ onClose, closing }: { onClose: () => void; closing: boolean }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(26, 24, 20, 0.62)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "2rem 1.5rem",
        backdropFilter: "blur(2px)",
        animation: closing ? "modalFadeOut 0.22s ease forwards" : "modalFadeIn 0.22s ease forwards",
      }}
    >
      <dialog
        open
        aria-labelledby="modal-title"
        style={{
          background: "#FDFAF6",
          borderRadius: "2px",
          maxWidth: "560px",
          width: "100%",
          padding: "2rem 2.5rem 1.75rem",
          boxShadow: "0 2px 8px rgba(26,24,20,0.08), 0 24px 64px rgba(26,24,20,0.22)",
          position: "relative",
          border: `1px solid ${C.rule}`,
          maxHeight: "90dvh",
          overflowY: "auto",
        }}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="閉じる"
          style={{
            position: "absolute",
            top: "1.25rem",
            right: "1.25rem",
            width: "2rem",
            height: "2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "transparent",
            border: `1px solid ${C.rule}`,
            borderRadius: "2px",
            cursor: "pointer",
            color: C.inkMid,
            fontFamily: "inherit",
            fontSize: "1.125rem",
            lineHeight: 1,
            outline: "none",
            padding: 0,
          }}
        >
          ×
        </button>

        {/* Decorative accent rule */}
        <div style={{ width: "2rem", height: "2px", background: C.accent, marginBottom: "1rem" }} />

        <h1
          id="modal-title"
          style={{
            fontSize: "1.25rem",
            fontWeight: 700,
            color: C.ink,
            letterSpacing: "0.08em",
            lineHeight: 1.4,
            margin: "0 0 1.25rem",
            fontFamily: "'Noto Serif JP', 'Hiragino Mincho ProN', 'Yu Mincho', serif",
            animation: "textWipeIn 0.4s ease both",
            animationDelay: "0.15s",
          }}
        >
          ことばは、橋になる。
        </h1>

        <div
          style={{
            fontSize: "0.875rem",
            color: C.ink,
            lineHeight: 1.8,
            letterSpacing: "0.03em",
            fontFamily: "'Noto Serif JP', 'Hiragino Mincho ProN', 'Yu Mincho', serif",
          }}
        >
          <p
            style={{
              margin: "0 0 1rem",
              animation: "textWipeIn 0.4s ease both",
              animationDelay: "0.25s",
            }}
          >
            人は、同じ気持ちを持っていても、相手によって言葉を変えます。
            <br />
            上司には丁寧に、友人には気軽に、子どもにはやさしく。
            <br />
            そのたびに私たちは、言葉を「翻訳」しています。
          </p>
          <p
            style={{
              margin: "0 0 1rem",
              paddingLeft: "1rem",
              borderLeft: `2px solid ${C.rule}`,
              color: C.inkMid,
              fontStyle: "italic",
              animation: "textWipeIn 0.4s ease both",
              animationDelay: "0.38s",
            }}
          >
            これが、communicationの本質です。
          </p>
          <p
            style={{
              margin: "0 0 1rem",
              animation: "textWipeIn 0.4s ease both",
              animationDelay: "0.5s",
            }}
          >
            このツールは、その翻訳を可視化します。
            <br />
            ひとつの文章が、受け取る人によってどう形を変えるか——
            <br />
            文体を変えることは、相手を想像することです。
            <br />
            相手の立場に立つこと。それが、真のcommunicationだと私たちは考えます。
          </p>
          <p
            style={{
              margin: "0 0 1rem",
              animation: "textWipeIn 0.4s ease both",
              animationDelay: "0.65s",
            }}
          >
            そして「
            <span
              style={{
                fontWeight: 700,
                color: C.highlight,
                background: C.highlightBg,
                padding: "0 0.25rem",
                borderRadius: "1px",
                border: `1px solid ${C.highlightBorder}`,
              }}
            >
              やさしい日本語
            </span>
            」。
            <br />
            日本には約300万人の外国人住民がいます。
            <br />
            難しい行政文書、複雑な案内、伝わらない言葉——
            <br />
            やさしい日本語は、その壁を取り除くための社会的な技術です。
            <br />
            このツールは、それをワンクリックで実現します。
          </p>
          <p style={{ margin: 0, animation: "textWipeIn 0.4s ease both", animationDelay: "0.8s" }}>
            communicationとは、ことばのトーンを合わせることで、人と人をつなぐことです。
          </p>
        </div>

        <div
          style={{
            marginTop: "1.5rem",
            paddingTop: "1.25rem",
            borderTop: `1px solid ${C.rule}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            animation: "textWipeIn 0.4s ease both",
            animationDelay: "0.95s",
          }}
        >
          <span
            style={{
              fontSize: "0.6875rem",
              color: C.inkLight,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Japanese Style Transformer
          </span>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "0.625rem 2.25rem",
              fontSize: "0.875rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              background: C.ink,
              color: "#FDFAF6",
              border: "none",
              borderRadius: "2px",
              cursor: "pointer",
              fontFamily: "inherit",
              outline: "none",
            }}
          >
            使ってみる
          </button>
        </div>
      </dialog>
    </div>
  );
}

export function StyleTransformer() {
  const [inputText, setInputText] = useState(DEFAULT_INPUT);
  const [outputText, setOutputText] = useState("");
  const [activeStyle, setActiveStyle] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(true);
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
        height: "100dvh",
        width: "100%",
        background: C.bg,
        fontFamily: "'Noto Serif JP', 'Hiragino Mincho ProN', 'Yu Mincho', serif",
        overflow: "hidden",
      }}
    >
      <ModalGate show={showModal} onClose={() => setShowModal(false)} />
      {/* 左サイドバー */}
      <aside
        style={{
          width: "52px",
          minWidth: "52px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "2rem 0",
          borderRight: `1px solid ${C.rule}`,
          background: C.panelBg,
        }}
      >
        <div
          style={{
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            fontSize: "0.6875rem",
            fontWeight: 700,
            letterSpacing: "0.18em",
            color: C.ink,
            textTransform: "uppercase",
            userSelect: "none",
          }}
        >
          文 体 変 換
        </div>
        <div
          style={{
            writingMode: "vertical-rl",
            fontSize: "0.625rem",
            color: C.inkLight,
            letterSpacing: "0.12em",
          }}
        >
          Style
        </div>
      </aside>

      {/* メインエリア */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* トップバー */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 2rem",
            height: "52px",
            minHeight: "52px",
            borderBottom: `1px solid ${C.rule}`,
            background: C.panelBg,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span
              style={{ fontSize: "1rem", fontWeight: 700, color: C.ink, letterSpacing: "0.04em" }}
            >
              文体変換
            </span>
            <span
              style={{
                fontSize: "0.6875rem",
                color: C.inkLight,
                letterSpacing: "0.06em",
                paddingTop: "1px",
              }}
            >
              Japanese Style Transformer
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {isLoading && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  fontSize: "0.75rem",
                  color: C.accent,
                }}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: C.accent,
                    animation: "pulse 1s ease-in-out infinite",
                  }}
                />
                生成中
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
                style={{ height: "36px", width: "36px", objectFit: "contain" }}
              />
              <span
                style={{
                  fontSize: "0.8125rem",
                  fontWeight: 700,
                  color: C.ink,
                  letterSpacing: "0.04em",
                }}
              >
                forest-2
              </span>
            </a>
          </div>
        </header>

        {/* 左右分割コンテンツ */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden", padding: "1.25rem", gap: 0 }}>
          {/* 左パネル：入力 */}
          <section
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
              border: `1px solid ${C.rule}`,
              borderRadius: "4px",
              background: C.bg,
              boxShadow: "0 1px 4px rgba(26,24,20,0.06)",
            }}
          >
            <div
              style={{
                padding: "0 1.75rem",
                borderBottom: `1px solid ${C.rule}`,
                background: "#D4CEC6",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                height: "52px",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  color: C.inkMid,
                  textTransform: "uppercase",
                }}
              >
                原文
              </span>
              <span style={{ fontSize: "0.6875rem", color: C.inkMid, letterSpacing: "0.04em" }}>
                {inputText.length} 文字
              </span>
            </div>

            <div style={{ flex: 1, minHeight: "140px", position: "relative", overflow: "hidden" }}>
              <textarea
                id="input"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  "ここに変換したい文章を入力してください…\n\n例：「明日の会議に少し遅れそうです」"
                }
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  padding: "1.5rem 1.75rem",
                  fontSize: "1rem",
                  lineHeight: 1.85,
                  border: "none",
                  resize: "none",
                  fontFamily: "inherit",
                  background: "transparent",
                  color: C.ink,
                  outline: "none",
                  caretColor: C.accent,
                }}
              />
            </div>

            {/* 例文エリア */}
            <div
              style={{
                borderTop: `1px solid ${C.rule}`,
                padding: "0.75rem 1.75rem",
                background: C.bg,
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <div
                style={{
                  fontSize: "0.625rem",
                  letterSpacing: "0.14em",
                  color: C.inkLight,
                  textTransform: "uppercase",
                }}
              >
                例文
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                {EXAMPLES.map((example) => (
                  <button
                    key={example}
                    type="button"
                    onClick={() => setInputText(example)}
                    style={{
                      textAlign: "left",
                      background: "none",
                      border: "none",
                      padding: "0.2rem 0",
                      fontSize: "0.8125rem",
                      color: C.inkMid,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      lineHeight: 1.6,
                      borderBottom: "1px solid transparent",
                      transition: "color 0.15s, border-color 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = C.ink;
                      e.currentTarget.style.borderBottomColor = C.rule;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = C.inkMid;
                      e.currentTarget.style.borderBottomColor = "transparent";
                    }}
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            {/* スタイルボタンエリア */}
            <div
              style={{
                borderTop: `1px solid ${C.rule}`,
                padding: "1rem 1.75rem 1.25rem",
                background: C.panelBg,
              }}
            >
              <div
                style={{
                  fontSize: "0.625rem",
                  letterSpacing: "0.14em",
                  color: C.inkLight,
                  textTransform: "uppercase",
                  marginBottom: "0.75rem",
                }}
              >
                変換スタイルを選択
              </div>
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
          </section>

          {/* パネル間 ▶︎ アイコン */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "2rem",
              flexShrink: 0,
              color: C.accent,
              fontSize: "0.75rem",
              pointerEvents: "none",
              userSelect: "none",
            }}
          >
            ▶
          </div>

          {/* 右パネル：出力 */}
          <section
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              background: C.bg,
              border: `1px solid ${C.rule}`,
              borderRadius: "4px",
              boxShadow: "0 1px 4px rgba(26,24,20,0.06)",
            }}
            aria-live="polite"
          >
            <div
              style={{
                padding: "0 1.75rem",
                borderBottom: `1px solid ${C.rule}`,
                background: "#D4CEC6",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                height: "52px",
                flexShrink: 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span
                  style={{
                    fontSize: "0.6875rem",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    color: C.inkMid,
                    textTransform: "uppercase",
                  }}
                >
                  変換後
                </span>
                {activeStyleObj && (
                  <span
                    style={{
                      fontSize: "0.6875rem",
                      padding: "0.125rem 0.5rem",
                      borderRadius: "9999px",
                      border: `1px solid ${activeStyleObj.highlight ? C.highlight : C.accent}`,
                      color: activeStyleObj.highlight ? C.highlight : C.accent,
                      letterSpacing: "0.04em",
                      lineHeight: 1.6,
                    }}
                  >
                    {activeStyleObj.label}
                  </span>
                )}
              </div>
              {hasOutput && !isLoading && (
                <button
                  type="button"
                  onClick={handleCopy}
                  style={{
                    fontSize: "0.6875rem",
                    padding: "0.3rem 0.8rem",
                    border: `1px solid ${copied ? C.accent : C.rule}`,
                    borderRadius: "9999px",
                    background: copied ? C.accentBg : "transparent",
                    color: copied ? C.accent : C.inkMid,
                    cursor: "pointer",
                    transition: "all 0.18s ease",
                    fontFamily: "inherit",
                    letterSpacing: "0.04em",
                    outline: "none",
                  }}
                >
                  {copied ? "コピー済み ✓" : "コピー"}
                </button>
              )}
            </div>

            <div
              ref={outputRef}
              style={{
                flex: 1,
                padding: "1.5rem 1.75rem",
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
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.75rem",
                    pointerEvents: "none",
                    userSelect: "none",
                  }}
                >
                  <div style={{ width: "48px", height: "1px", background: C.rule }} />
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
                    原文を入力し
                    <br />
                    スタイルを選択してください
                  </p>
                  <div style={{ width: "48px", height: "1px", background: C.rule }} />
                </div>
              )}
              {(hasOutput || isLoading) && (
                <p
                  style={{
                    fontSize: "1rem",
                    lineHeight: 1.85,
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
          </section>
        </div>
      </main>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes modalFadeIn {
          from { opacity: 0; filter: blur(12px); transform: scale(1.04); }
          to   { opacity: 1; filter: blur(0px); transform: scale(1); }
        }
        @keyframes modalFadeOut {
          from { opacity: 1; filter: blur(0px); transform: scale(1); }
          to   { opacity: 0; filter: blur(16px); transform: scale(1.06); }
        }
        @keyframes textWipeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        textarea::placeholder { color: #B8B3AC; font-style: italic; }
        textarea:focus { outline: none; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #E2DDD7; border-radius: 2px; }
      `}</style>
    </div>
  );
}
