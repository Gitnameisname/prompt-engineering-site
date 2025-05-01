type Props = {
    value: string;
    onChange: (v: string) => void;
    sendPrompt: () => void;
  };
  
  export default function SystemPromptInput({ value, onChange, sendPrompt }: Props) {
    return (
      <>
        <label>시스템 프롬프트</label>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="예: 당신은 친절한 도우미입니다."
          style={{ width: "100%", height: "80px", marginBottom: "1rem" }}
          onKeyDown={(e) => {
            if (e.shiftKey && e.key === "Enter") {
                e.preventDefault(); // 줄바꿈 방지
                sendPrompt();
            }
            }}
        />
      </>
    );
  }
  