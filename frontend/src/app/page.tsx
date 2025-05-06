"use client";

import SystemPromptInput from "../components/SystemPromptInput";
import UserPromptInput from "../components/UserPromptInput";
import StreamToggle from "../components/StreamToggle";
import ResponseViewer from "../components/ResponseViewer";
import PromptSaver from "../components/PromptSaver";
import { ThemeProvider } from "../components/ThemeContext";
import ThemeSelector from "../components/ThemeSelector";

import { useState, useEffect } from "react";

export default function Home() {
  const [systemPrompt, setSystemPrompt] = useState("");
  const [prompt, setPrompt] = useState("");
  const [temperature, setTemperature] = useState(0.7);
  const [response, setResponse] = useState("");
  const [useStream, setUseStream] = useState(false);
  const [savedPrompts, setSavedPrompts] = useState<{ id: number; system: string; user: string }[]>([]);

  function saveCurrentPrompt() {
    const item = {
      id: Date.now(),
      system: systemPrompt,
      user: prompt,
    };
  
    const newList = [...savedPrompts, item];
    setSavedPrompts(newList);
    localStorage.setItem("promptList", JSON.stringify(newList));
  }

  async function sendPrompt() {
    setResponse("");  // 초기화
  
    const payload = {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      temperature: temperature,
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
              onLoad={(system, user) => {
                setSystemPrompt(system);
                setPrompt(user);
              }}
            />
          </aside>
          <main className="main">
            <SystemPromptInput value={systemPrompt} onChange={setSystemPrompt} sendPrompt={sendPrompt} />
            <UserPromptInput value={prompt} onChange={setPrompt} sendPrompt={sendPrompt} />
            
            <p className="hint-text">Shift + Enter 를 눌러 전송할 수 있습니다.</p>
            <div className="temperature-slider">
              <label>Temperature: {temperature}</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
              />
            </div>
  
            <StreamToggle value={useStream} onToggle={() => setUseStream(!useStream)} />
            <button className="send-btn" onClick={sendPrompt}>전송</button>
  
            <ResponseViewer content={response} />
  
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
