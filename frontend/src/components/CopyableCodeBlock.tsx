import { useState } from "react";

export default function CopyableCodeBlock({ language, value }: { language?: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        background: "#2d2d2d", color: "#f8f8f2",
        padding: "3rem 2rem 1rem", borderRadius: "8px",
        overflowX: "auto"
      }}>
        <code className={`language-${language}`}>{value}</code>
      </pre>
    </div>
  );
}
