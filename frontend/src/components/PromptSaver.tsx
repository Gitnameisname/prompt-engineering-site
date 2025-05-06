import { useState, useEffect } from "react";
import "../css/PromptSaver.css";

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
    <div className="prompt-saver">
      <h2>저장된 프롬프트</h2>
      <div className="prompt-list">
        {savedPrompts.map((item) => (
          <div key={item.id} className="prompt-card-body">
            <div
              
              className="prompt-card"
              onClick={() => onLoad(item.system, item.user)}
            >
              <div className="prompt-card-section">
                <strong>System:</strong>
                <p>{item.system || "(비어 있음)"}</p>
              </div>
              <div className="prompt-card-section">
                <strong>User:</strong>
                <p>{item.user || "(비어 있음)"}</p>
              </div>
              <div className="delte-btn-container">
                  {/* 삭제 버튼 */}
                  <button className="delete-btn"
                  onClick={() => deletePrompt(item.id)}
                  >
                  삭제
                  </button>
                </div>
            </div>
          </div>  
        ))}
      </div>
    </div>
  );
}
