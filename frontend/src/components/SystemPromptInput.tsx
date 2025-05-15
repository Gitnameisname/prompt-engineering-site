type Props = {
    value: string;
    onChange: (v: string) => void;
    sendPrompt: () => void;
  };
  
  export default function SystemPromptInput({ value, onChange, sendPrompt }: Props) {
    return (
      <>
        <h2>시스템 프롬프트</h2>
        <textarea
          className="prompt-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="예: 당신은 친절한 도우미입니다."
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
  