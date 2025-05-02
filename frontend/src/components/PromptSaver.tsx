import { useState, useEffect } from "react";

type PromptItem = {
    id: number;
    system: string;
    user: string;
};

type Props = {
  current: { system: string; user: string };
  onLoad: (system: string, user: string) => void;
};

export default function PromptSaver({ current, onLoad }: Props) {
  const [savedPrompts, setSavedPrompts] = useState<PromptItem[]>([]);

  // 초기 로드
  useEffect(() => {
    const stored = localStorage.getItem("promptList");
    if (stored) {
      setSavedPrompts(JSON.parse(stored));
    }
  }, []);

  // 저장 함수
  const savePrompt = () => {
    const systemText = current.system.trim();
    const userText = current.user.trim();
    const name = userText || systemText || "이름 없는 프롬프트";

    // 저장 전에 간단한 alert로 확인
    if (!window.confirm(`"${name}" 프롬프트를 저장하시겠습니까?`)) return;
    
    // 둘 다 비어있으면 저장 안 함
    if (!systemText && !userText) return;

    const newItem: PromptItem = {
      id: Date.now(),
      system: current.system,
      user: current.user,
    };

    const updated = [...savedPrompts, newItem];
    setSavedPrompts(updated);
    localStorage.setItem("promptList", JSON.stringify(updated));
  };

  // 삭제 함수
  const deletePrompt = (id: number) => {
    const updated = savedPrompts.filter((p) => p.id !== id);
    setSavedPrompts(updated);
    localStorage.setItem("promptList", JSON.stringify(updated));
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3>저장된 프롬프트</h3>
      <button onClick={savePrompt}>현재 프롬프트 저장</button>
      <ul style={{ marginTop: "1rem", paddingLeft: "1rem" }}>
        {savedPrompts.map((item) => (
          <li key={item.id} style={{ marginBottom: "0.75rem" }}>
            <div>
                <strong>System:</strong>{" "}
                {item.system ? item.system.slice(0, 30) : "(없음)"}
            </div>
            <div>
                <strong>User:</strong>{" "}
                {item.user ? item.user.slice(0, 50) : <em style={{ color: "#888" }}>이름 없는 프롬프트</em>}
            </div>
            <div style={{ marginTop: "0.25rem" }}>
                <button onClick={() => onLoad(item.system, item.user)}>불러오기</button>
                <button
                onClick={() => deletePrompt(item.id)}
                style={{ marginLeft: "1rem", color: "red" }}
                >
                삭제
                </button>
            </div>
            </li>
        ))}
      </ul>
    </div>
  );
}
