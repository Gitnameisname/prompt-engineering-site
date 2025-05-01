"use client";

import { marked } from "marked";
import { useState } from "react";

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
      console.log("data", res.body);
      const reader = res.body.getReader();
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
    <main style={{ padding: "2rem" }}>
      <h1>시스템 프롬프트</h1>
      <textarea
        placeholder="(예) 당신은 매우 정중한 비서입니다."
        value={systemPrompt}
        onChange={(e) => setSystemPrompt(e.target.value)}
        style={{ width: "100%", height: "150px" }}
        // shift + enter로 전송
        onKeyDown={(e) => {
          if (e.shiftKey && e.key === "Enter") {
            e.preventDefault(); // 줄바꿈 방지
            sendPrompt();
          }
        }}
      />
      <h1>사용자 입력</h1>
      <textarea
        placeholder="Write your prompt here..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{ width: "100%", height: "150px" }}
        // shift + enter로 전송
        onKeyDown={(e) => {
          if (e.shiftKey && e.key === "Enter") {
            e.preventDefault(); // 줄바꿈 방지
            sendPrompt();
          }
        }}
      />
      <p style={{ fontSize: "0.9rem", color: "#888" }}>
      Shift + Enter 를 눌러 전송할 수 있습니다.
      </p>
      <div style={{ marginTop: "1rem" }}>
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
      <div style={{ marginTop: "1rem" }}>
        <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span>스트리밍 응답 사용</span>
          <div
            onClick={() => setUseStream(!useStream)}
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
        </label>
      </div>
      <button style={{ marginTop: "1rem" }} onClick={sendPrompt}>
        전송
      </button>
      <div style={{ marginTop: "2rem", whiteSpace: "pre-wrap" }}>
        <h2>인공지능 답변:</h2>
        <div
          dangerouslySetInnerHTML={{ __html: marked.parse(response) }}
          // dangerouslySetInnerHTML={{
          //   __html: useStream ? response : marked.parse(response)
          // }}
          style={{
            padding: "1rem",
            borderRadius: "8px",
            whiteSpace: "pre-wrap",
          }}
        />
      </div>
      <button onClick={saveCurrentPrompt}>저장</button>

      <div style={{ marginTop: "1rem" }}>
        <h3>저장된 프롬프트</h3>
        <ul>
          {savedPrompts.map(item => (
            <li key={item.id} style={{ marginBottom: "0.5rem" }}>
              <button
                onClick={() => {
                  setSystemPrompt(item.system);
                  setPrompt(item.user);
                }}
              >
                불러오기
              </button>
              <span style={{ marginLeft: "1rem" }}>{item.user.slice(0, 30)}...</span>
              <button
                style={{ marginLeft: "1rem", color: "red" }}
                onClick={() => {
                  const newList = savedPrompts.filter(p => p.id !== item.id);
                  setSavedPrompts(newList);
                  localStorage.setItem("promptList", JSON.stringify(newList));
                }}
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
