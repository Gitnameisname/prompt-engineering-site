import { useState, useEffect } from "react";
import "../css/PromptSaver.css";

type PromptItem = {
  id: number;
  name: string;
  system: string;
  user: string;
  date: string;
};

type Props = {
  current: { system: string; user: string };
  savedPrompts: PromptItem[];
  setSavedPrompts: React.Dispatch<React.SetStateAction<PromptItem[]>>;
  onLoad: (system: string) => void;
};

export default function PromptSaver({ current, savedPrompts, setSavedPrompts, onLoad }: Props) {
  const [promptName, setPromptName] = useState("");

  // 저장 함수
  function savePrompt() {
    const trimmedName = promptName.trim() || `임시 프롬프트 ${savedPrompts.length + 1}`;

    const newItem: PromptItem = {
      id: Date.now(),
      name: trimmedName,
      system: current.system,
      user: current.user,
      date: new Date().toISOString(),
    };

    const updated = [...savedPrompts, newItem];
    setSavedPrompts(updated);
    localStorage.setItem("promptList", JSON.stringify(updated));
    setPromptName(""); // 저장 후 초기화
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
      <input
        type="text"
        placeholder="프롬프트 이름"
        value={promptName}
        onChange={(e) => setPromptName(e.target.value)}
        className="prompt-name-input"
        onKeyDown={(e) => {
          if ( e.shiftKey && e.key === "Enter") {
            e.preventDefault(); // 줄바꿈 방지
            savePrompt();
          }
        }}
      />
      <button className="save-btn" onClick={savePrompt}>
        저장
      </button>
      <div className="prompt-list">
        {savedPrompts.map((item) => (
          <div key={item.id} className="prompt-card-body">
            <div
              className="prompt-card"
              onClick={() => onLoad(item.system)}
            >
              <div className="prompt-card-section">
                {item.name}
              </div>
              <div className="prompt-card-section">
                <strong>System:</strong>
                <p>{item.system || "(비어 있음)"}</p>
              </div>
              <div className="delete-btn-container">
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
