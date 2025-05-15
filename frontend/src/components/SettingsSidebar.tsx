import LLMControls from "./LLMControls";
import LLMPresetManager from "./LLMPresetManager";

import "../css/SettingsSidebar.css";

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
    onClose: () => void;
    config: { temperature: number; topP: number; maxTokens: number; presencePenalty: number; useStream: boolean };
    onChange: {
      setTemperature: (v: number) => void;
      setTopP: (v: number) => void;
      setMaxTokens: (v: number) => void;
      setPresencePenalty: (v: number) => void;
      setUseStream: (v: boolean) => void;
    };
    resetToDefault: () => void;
  };
  
  export default function SettingsSidebar({ onClose, config, onChange, resetToDefault }: Props) {
    return (
      <div className="settings-sidebar">
        <div className="settings-header">
          <h2>설정</h2>
          <button onClick={onClose}>닫기</button>
        </div>
        <LLMControls
          temperature={config.temperature}
          onTemperatureChange={onChange.setTemperature}
          topP={config.topP}
          onTopPChange={onChange.setTopP}
          presencePenalty={config.presencePenalty}
          onPresencePenaltyChange={onChange.setPresencePenalty}
          maxTokens={config.maxTokens}
          onMaxTokensChange={onChange.setMaxTokens}
          useStream={config.useStream}
          onStreamToggle={() => onChange.setUseStream(!config.useStream)}
          onReset={resetToDefault}
        />
        <LLMPresetManager
          config={config}
          onLoad={(preset) => {
            onChange.setTemperature(preset.config.temperature);
            onChange.setTopP(preset.config.topP);
            onChange.setMaxTokens(preset.config.maxTokens);
            onChange.setPresencePenalty(preset.config.presencePenalty);
            onChange.setUseStream(preset.config.useStream);
          }}
        />
      </div>
    );
  }
  