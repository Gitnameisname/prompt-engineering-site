import { useEffect, useRef, useState } from "react";
import { marked } from "marked";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css"; // 선택한 테마

type Props = {
    content: string;
    renderMarkdown?: boolean;
    isStreaming?: boolean;
  };

const renderer = new marked.Renderer();

renderer.code = ({ text, lang }) => {
  const validLang = hljs.getLanguage(lang || "") ? lang : "plaintext";
  const highlighted = hljs.highlight(text, { language: validLang || "plaintext" }).value;

  return `<pre><code class="hljs language-${validLang}">${highlighted}</code></pre>`;
};
  
  marked.setOptions({ renderer });

export default function ResponseViewer({ content, renderMarkdown = true, isStreaming }: Props) {
  const scrollBoxRef = useRef<HTMLDivElement>(null);
  const [html, setHtml] = useState("");
  

  useEffect(() => {
    hljs.highlightAll();
  }, []); // Ensure this runs only once on component mount

  useEffect(() => {
    const el = scrollBoxRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [html]);

  // 코드 복사 기능
  useEffect(() => {
    if (renderMarkdown) {
      const rawHtml = marked.parse(content);
      setHtml(rawHtml);
    } else {
      setHtml(content);
    }
  }, [content, renderMarkdown]);

  // HTML 렌더링 완료 후, 코드 블럭에 버튼 붙이기
  useEffect(() => {
    // if (isStreaming) return; // 스트리밍 중이면 복사 버튼 추가 안 함
    const container = scrollBoxRef.current;
    if (!container) return;

    // 1. 원본 content에서 완성된 코드블럭 추출
    const completeCodeBlocks = [...content.matchAll(/```(\w+)?\n[\s\S]*?```/g)];
    const completeTexts = completeCodeBlocks.map((m) => m[0].trim());

    // 2. 코드블럭 DOM 탐색
    const blocks = container.querySelectorAll("pre > code");

    blocks.forEach((codeBlock) => {
      const pre = codeBlock.parentElement;
      if (!pre || pre.querySelector(".copy-btn")) return; // 중복 방지

      const text = codeBlock.textContent?.trim();
      if (!text || !completeTexts.some((t) => t.includes(text))) {
        return; // ⛔ 완성된 블럭 아니면 무시
      }

      // 언어 감지
      const lang = (codeBlock.className.match(/language-(\w+)/)?.[1] || "").toUpperCase();

      const button = document.createElement("button");
      button.textContent = "📋 복사";
      button.className = "copy-btn";
      Object.assign(button.style, {
        position: "absolute",
        top: "8px",
        right: "8px",
        background: "#ccc",
        border: "none",
        padding: "4px 8px",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "0.8rem",
        zIndex: "2",
        });

      button.onclick = () => {
        navigator.clipboard.writeText(codeBlock.textContent || "");
        button.textContent = "✅ 복사됨!";
        setTimeout(() => (button.textContent = "📋 복사"), 2000);
      };

      // 언어명 표시 div
      if (lang) {
        const label = document.createElement("div");
        label.textContent = lang;
        Object.assign(label.style, {
          position: "absolute",
          top: "8px",
          left: "8px",
          background: "#444",
          color: "white",
          fontSize: "0.75rem",
          padding: "2px 6px",
          borderRadius: "4px",
          zIndex: "2",
        });
        pre.appendChild(label);
      }

      pre.style.position = "relative";
      pre.style.background = "#0d1117";
      pre.style.color = "#f8f8f2";
      pre.style.padding = "3rem 2rem 1rem 2rem";
      pre.style.borderRadius = "8px";
      pre.style.marginBottom = "1rem";
      pre.style.overflowX = "auto";

      pre.appendChild(button);
    });
  }, [html, isStreaming]);

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>인공지능 답변</h2>
      <div
        ref={scrollBoxRef}
        style={{
            background: "#333333",
            padding: "1.5rem 3rem",
            borderRadius: "8px",
            whiteSpace: "pre-wrap",
            maxHeight: "400px",
            overflowY: "auto",
            overflowX: "auto",
            wordBreak: "break-word",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
          }}
          dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
