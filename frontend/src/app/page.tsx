"use client";

import SystemPromptInput from "../components/SystemPromptInput";
import UserPromptInput from "../components/UserPromptInput";
import StreamToggle from "../components/StreamToggle";
import ResponseViewer from "../components/ResponseViewer";
import PromptSaver from "../components/PromptSaver";
import { ThemeProvider } from "../components/ThemeContext";
import ThemeSelector from "../components/ThemeSelector";
import LLMControls from "@/components/LLMControls";

import { useState, useEffect } from "react";

export default function Home() {
  const [systemPrompt, setSystemPrompt] = useState("");
  const [prompt, setPrompt] = useState("");
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(0.6);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [presencePenalty, setPresencePenalty] = useState(0);
  const [response, setResponse] = useState("");
  const [useStream, setUseStream] = useState(true);
  const [savedPrompts, setSavedPrompts] = useState<{
    id: number;
    name: string;
    system: string;
    user: string;
    date: string;
  }[]>([]);

  // 초기 로드
  useEffect(() => {
    const stored = localStorage.getItem("promptList");
    if (stored) {
      setSavedPrompts(JSON.parse(stored));
    }
  }, []);

  async function sendPrompt() {
    setResponse("");  // 초기화
  
    const payload = {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      temperature: temperature,
      top_p: topP,
      max_tokens: maxTokens,
      presence_penalty: presencePenalty,
      stream: useStream,  // 스트리밍 여부 포함
    };
  
    const res = await fetch("http://localhost:8000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    
    if (!useStream) {
      const data = await res.json();
      // 콘솔에 응답 출력
      console.log("Response:", data);
      setResponse(data.choices[0].message.content);
    } else {

      const reader = res.body? res.body.getReader() : null;

      if (!reader) {
        console.error("Response body is null.");
        return;
      }
      const decoder = new TextDecoder("utf-8");
      let fullText = "";
  
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
  
        const chunk = decoder.decode(value);
        const lines = chunk
          .split("\n")
          .filter(line => line.trim().startsWith("data: "))
          .map(line => line.replace("data: ", ""));
  
        for (let line of lines) {
          if (line === "[DONE]") break;
          try {
            const json = JSON.parse(line);
            const delta = json.choices[0].delta?.content || "";
            fullText += delta;
            setResponse(fullText);  // 실시간 업데이트
          } catch (err) {
            console.error("JSON parse error", err, line);
          }
        }
      }
    }
  }  

  return (
    <ThemeProvider>
      <div className="page">
        {/* 헤더 */}
        <header className="header">
          <h1>프롬프트 엔지니어링 놀이터</h1>
          <ThemeSelector />
        </header>
        {/* 좌측: 저장된 프롬프트 / 중앙: 입력창 및 응답 */}
        <div className="layout">
          <aside className="sidebar">
            <PromptSaver
              current={{ system: systemPrompt, user: prompt }}
              savedPrompts={savedPrompts}
              setSavedPrompts={setSavedPrompts}
              onLoad={(system) => {
                setSystemPrompt(system);
              }}
            />
          </aside>
          <main className="main">
            <SystemPromptInput value={systemPrompt} onChange={setSystemPrompt} sendPrompt={sendPrompt} />
            <UserPromptInput value={prompt} onChange={setPrompt} sendPrompt={sendPrompt} />
            
            <div className="send-btn-container">
              <p className="hint-text">Shift + Enter 를 눌러 전송할 수 있습니다.</p>
              <button className="send-btn" onClick={sendPrompt}>전송</button>
            </div>
            
            <LLMControls
              temperature={temperature} onTemperatureChange={setTemperature}
              topP={topP} onTopPChange={setTopP}
              maxTokens={maxTokens} onMaxTokensChange={setMaxTokens}
              presencePenalty={presencePenalty} onPresencePenaltyChange={setPresencePenalty}
              useStream={useStream} onStreamToggle={() => setUseStream(!useStream)}
            />
  
            <ResponseViewer content={response} />
  
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
