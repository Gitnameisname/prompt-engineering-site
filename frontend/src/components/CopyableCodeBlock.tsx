import { useState, useEffect } from "react";

type Props = {
    language?: string;
    value: any; // ReactNode 또는 string
  };
  
// 텍스트 추출 함수
function extractText(children: any): string {
  if (typeof children === "string") {
    return children;
  }

  if (Array.isArray(children)) {
    return children
      .map((child) => {
        if (typeof child === "string") {
          return child;
        }
        if (typeof child === "object" && child?.props?.children) {
          const inner = child.props.children;
          return typeof inner === "string" ? inner : "";
        }
        return "";
      })
      .join("");
  }

  if (typeof children === "object" && children?.props?.children) {
    const inner = children.props.children;
    return typeof inner === "string" ? inner : "";
  }

  return "";
}

export default function CopyableCodeBlock({ language, value }: { language?: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const rawText = extractText(value); // 텍스트 추출

  // 테스트용
  useEffect(() => {
      console.log("value: ", );
  }, [rawText]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rawText.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("복사 실패:", err);
      alert("클립보드 복사에 실패했습니다.");
    }
  };
  

  return (
    <div style={{ position: "relative", marginBottom: "1rem" }}>
      {language && (
        <div style={{
          position: "absolute", top: "8px", left: "8px",
          background: "#444", color: "white", fontSize: "0.75rem",
          padding: "2px 6px", borderRadius: "4px", zIndex: 2
        }}>
          {language.toUpperCase()}
        </div>
      )}

      <button onClick={handleCopy} style={{
        position: "absolute", top: "8px", right: "8px", zIndex: 2,
        background: "#ccc", border: "none", padding: "4px 8px",
        borderRadius: "4px", cursor: "pointer", fontSize: "0.8rem"
      }}>
        {copied ? "✅ 복사됨!" : "📋 복사"}
      </button>

      <pre style={{
        background: "#0d1117", color: "#f8f8f2",
        padding: "3rem 2rem 1rem", borderRadius: "8px",
        overflowX: "auto"
      }}>
        <code className={language ? `language-${language}` : undefined}>
          {value}
        </code>
      </pre>
    </div>
  );
}
