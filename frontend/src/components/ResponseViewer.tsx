import { marked } from "marked";

type Props = {
  content: string;
  renderMarkdown?: boolean;
};

export default function ResponseViewer({ content, renderMarkdown = true }: Props) {
  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>인공지능 답변</h2>
      <div
        dangerouslySetInnerHTML={{ __html: marked.parse(content) }}
        // dangerouslySetInnerHTML={{
        //     __html: renderMarkdown ? marked.parse(content) : content,
        //   }}
        style={{
          background: "#333333",
          padding: "1rem",
          borderRadius: "8px",
          whiteSpace: "pre-wrap",
        }}
      />
    </div>
  );
}
