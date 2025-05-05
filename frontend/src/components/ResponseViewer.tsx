import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css"; // 원하는 highlight.js 테마 import
import CopyableCodeBlock from "./CopyableCodeBlock";

type Props = {
  content: string;
};

export default function ResponseViewer({ content }: Props) {
  return (
    <div
      style={{
        background: "#333",
        padding: "1.5rem 2rem",
        borderRadius: "12px",
        maxHeight: "400px",
        overflowY: "auto",
        overflowX: "auto",
        color: "#eee",
      }}
    >
      <ReactMarkdown
        children={content}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          code({ node, className, children, ...props }) {
            const isInline = node?.position?.start?.line === node?.position?.end?.line;
            const language = /language-(\w+)/.exec(className || "")?.[1];
            
            return isInline ? (
              <code
                className={className}
                style={{
                  background: "#0d1117",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontSize: "0.9rem",
                }}
                {...props}
              >
                <CopyableCodeBlock
                language={language}
                value={children}
              />
              </code>
            ) : (
              <code className={className} {...props}>
                <CopyableCodeBlock
                language={language}
                value={children}
              />
              </code>
            );
          },
        }}
      />
    </div>
  );
}
