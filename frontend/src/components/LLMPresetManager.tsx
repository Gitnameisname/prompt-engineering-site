import { useState, useEffect } from "react";
import "../css/LLMPresetManager.css";

type Preset = {
  id: number;
  name: string;
  config: {
    temperature: number;
    topP: number;
    maxTokens: number;
    presencePenalty: number;
    useStream: boolean;
  };
};

type Props = {
  config: {
    temperature: number;
    topP: number;
    maxTokens: number;
    presencePenalty: number;
    useStream: boolean;
  };
  onLoad: (preset: Preset) => void;
};

export default function LLMPresetManager({ config, onLoad }: Props) {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [presetName, setPresetName] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("llmPresets");
    if (stored) setPresets(JSON.parse(stored));
  }, []);

  function savePreset() {
    const id = Date.now();
    const newPreset: Preset = {
      id,
      name: presetName || `프리셋 ${presets.length + 1}`,
      config,
    };
    const updated = [...presets, newPreset];
    setPresets(updated);
    localStorage.setItem("llmPresets", JSON.stringify(updated));
    setPresetName("");
  }

  function deletePreset(id: number) {
    const filtered = presets.filter(p => p.id !== id);
    setPresets(filtered);
    localStorage.setItem("llmPresets", JSON.stringify(filtered));
  }

  return (
    <div className="preset-manager">
      <h3>LLM 프리셋 관리</h3>
      <div className="preset-save">
        <input
          type="text"
          value={presetName}
          onChange={(e) => setPresetName(e.target.value)}
          placeholder="프리셋 이름"
          onKeyDown={(e) => {
            if (e.shiftKey && e.key === "Enter") {
                e.preventDefault(); // 줄바꿈 방지
                savePreset();
            }
          }}
        />
        <button className="save-btn" onClick={savePreset}>저장</button>
      </div>
      <div className="preset-list">
        {presets.map(p => (
          <div key={p.id} className="preset-card">
            <div className="preset-name">{p.name}</div>
            <div className="preset-actions">
              <button className="load-btn" onClick={() => onLoad(p)}>불러오기</button>
              <button className="delete-btn" onClick={() => deletePreset(p.id)}>삭제</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
