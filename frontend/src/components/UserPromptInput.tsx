type Props = {
    value: string;
    onChange: (v: string) => void;
    sendPrompt: () => void;
  };
  
  export default function UserPromptInput({ value, onChange, sendPrompt }: Props) {
    return (
      <>
        <h1>사용자 입력</h1>
        <textarea
            placeholder="Write your prompt here..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{ width: "100%", height: "150px" }}
            // shift + enter로 전송
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