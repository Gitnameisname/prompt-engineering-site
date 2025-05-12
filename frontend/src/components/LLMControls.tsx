import { useState, useEffect } from "react";
import "../css/LLMControls.css";

type Props = {
    temperature: number;
    onTemperatureChange: (value: number) => void;
    topP: number;
    onTopPChange: (value: number) => void;
    presencePenalty: number;
    onPresencePenaltyChange: (value: number) => void;
    maxTokens: number;
    onMaxTokensChange: (value: number) => void;
    useStream: boolean;
    onStreamToggle: () => void;
};

const MAX_TEMPERATURE = 2;
const MIN_TEMPERATURE = 0;
const MAX_TOP_P = 1;
const MIN_TOP_P = 0;
const MAX_PRESENCE_PENALTY = 2;
const MIN_PRESENCE_PENALTY = -2;
const MAX_TOKEN_LIMIT = 4096;
const MIN_TOKEN_LIMIT = 1;
  
export default function LLMControls({
    temperature,
    onTemperatureChange,
    topP,
    onTopPChange,
    presencePenalty,
    onPresencePenaltyChange,
    maxTokens,
    onMaxTokensChange,
    useStream,
    onStreamToggle,
    }: Props) {

    const [tempInput, setTempInput] = useState(temperature.toString());
    const [topPInput, setTopPInput] = useState(topP.toString());
    const [presencePenaltyInput, setPresencePenaltyInput] = useState(presencePenalty.toString());
    const [maxTokensInput, setMaxTokensInput] = useState(maxTokens.toString());
    const [useStreamInput, setUseStreamInput] = useState(useStream);

    useEffect(() => setTempInput(temperature.toString()), [temperature]);
    useEffect(() => setTopPInput(topP.toString()), [topP]);
    useEffect(() => setPresencePenaltyInput(presencePenalty.toString()), [presencePenalty]);
    useEffect(() => setMaxTokensInput(maxTokens.toString()), [maxTokens]);
    useEffect(() => setUseStreamInput(useStream), [useStream]);

    return (
        <div className="llm-controls">
            <div className="llm-controls-section">
                <label>Temperature</label>
                <div className="llm-slider-group">
                    <input
                        type="range"
                        min={MIN_TEMPERATURE}
                        max={MAX_TEMPERATURE}
                        step="0.01"
                        value={temperature}
                        onChange={(e) => onTemperatureChange(parseFloat(e.target.value))}
                    />
                    <input
                        type="number"
                        min={MIN_TEMPERATURE}
                        max={MAX_TEMPERATURE}
                        step="0.01"
                        value={temperature}
                        onChange={(e) => {
                            const v = parseFloat(e.target.value);
                            const safe = isNaN(v)
                            ? MIN_TEMPERATURE 
                            : Math.max(MIN_TEMPERATURE, Math.min(MAX_TEMPERATURE, v));
                            onTemperatureChange(safe);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                            const v = parseFloat(tempInput);
                            const safe = isNaN(v)
                                ? temperature
                                : Math.max(MIN_TEMPERATURE, Math.min(MAX_TEMPERATURE, v));
                            onTemperatureChange(safe);
                            setTempInput(safe.toString());
                            }
                        }}
                        onBlur={() => {
                            const v = parseFloat(tempInput);
                            const safe = isNaN(v)
                                ? temperature
                                : Math.max(MIN_TEMPERATURE, Math.min(MAX_TEMPERATURE, v));
                            onTemperatureChange(safe);
                            setTempInput(safe.toString());
                        }}
                        className="llm-number-input"
                    />
                </div>
            </div>

            <div className="llm-controls-section">
                <label>Top-p</label>
                <div className="llm-slider-group">
                    <input
                        type="range"
                        min={MIN_TOP_P}
                        max={MAX_TOP_P}
                        step="0.01"
                        value={topP}
                        onChange={(e) => onTopPChange(parseFloat(e.target.value))}
                    />
                    <input
                        type="number"
                        min={MIN_TOP_P}
                        max={MAX_TOP_P}
                        step="0.01"
                        value={topP}
                        onChange={(e) => {
                            const v = parseFloat(e.target.value);
                            const safe = isNaN(v)
                            ? MIN_TOP_P
                            : Math.max(MIN_TOP_P, Math.min(MAX_TOP_P, v));
                            onTopPChange(safe);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                            const v = parseFloat(tempInput);
                            const safe = isNaN(v)
                                ? topP
                                : Math.max(MIN_TOP_P, Math.min(MAX_TOP_P, v));
                            onTopPChange(safe);
                            setTopPInput(safe.toString());
                            }
                        }}
                        onBlur={() => {
                            const v = parseFloat(tempInput);
                            const safe = isNaN(v)
                                ? topP
                                : Math.max(MIN_TOP_P, Math.min(MAX_TOP_P, v));
                            onTopPChange(safe);
                            setTopPInput(safe.toString());
                        }}
                        className="llm-number-input"
                    />
                </div>
            </div>

            <div className="llm-controls-section">
                <label>Presence Penalty</label>
                <div className="llm-slider-group">
                    <input
                        type="range"
                        min={MIN_PRESENCE_PENALTY}
                        max={MAX_PRESENCE_PENALTY}
                        step="0.1"
                        value={presencePenalty}
                        onChange={(e) => onPresencePenaltyChange(parseFloat(e.target.value))}
                    />
                    <input
                        type="number"
                        min={MIN_PRESENCE_PENALTY}
                        max={MAX_PRESENCE_PENALTY}
                        step="1"
                        value={presencePenalty}
                        onChange={(e) => {
                            const v = parseFloat(e.target.value);
                            const safe = isNaN(v)
                            ? MIN_PRESENCE_PENALTY
                            : Math.max(MIN_PRESENCE_PENALTY, Math.min(MAX_PRESENCE_PENALTY, v));
                            onPresencePenaltyChange(safe);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                            const v = parseFloat(tempInput);
                            const safe = isNaN(v)
                                ? MIN_TOP_P
                                : Math.max(MIN_PRESENCE_PENALTY, Math.min(MAX_TOP_P, v));
                            onTopPChange(safe);
                            setTopPInput(safe.toString());
                            }
                        }}
                        onBlur={() => {
                            const v = parseFloat(tempInput);
                            const safe = isNaN(v)
                                ? MIN_TOP_P
                                : Math.max(MIN_TOP_P, Math.min(MAX_TOP_P, v));
                            onTopPChange(safe);
                            setTopPInput(safe.toString());
                        }}
                        className="llm-number-input"
                    />
                </div>
            </div>

            <div className="llm-controls-section">
                <label>Max Tokens</label>
                <input
                    type="number"
                    min={MIN_TOKEN_LIMIT}
                    max={MAX_TOKEN_LIMIT}
                    step="1"
                    value={maxTokens}
                    onChange={(e) => {
                        const v = parseFloat(e.target.value);
                        const safe = isNaN(v)
                         ? MIN_TOKEN_LIMIT
                         : Math.max(MIN_TOKEN_LIMIT, Math.min(MAX_TOKEN_LIMIT, v));
                        onMaxTokensChange(safe);
                    }}
                    className="llm-number-input"
                />
            </div>

            <div className="llm-controls-section">
                <span>스트리밍</span>
                <div
                onClick={onStreamToggle}
                style={{
                    width: "50px",
                    height: "28px",
                    borderRadius: "9999px",
                    backgroundColor: useStream ? "#4CAF50" : "#ccc",
                    position: "relative",
                    cursor: "pointer",
                    transition: "background-color 0.3s",
                }}
                >
                <div
                    style={{
                    position: "absolute",
                    top: "3px",
                    left: useStream ? "26px" : "3px",
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    backgroundColor: "white",
                    transition: "left 0.3s",
                    }}
                    />
                </div>
            </div>
        </div>
    );
}
  