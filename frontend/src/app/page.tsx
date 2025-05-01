"use client";

import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [temperature, setTemperature] = useState(0.7);
  const [response, setResponse] = useState("");

  async function sendPrompt() {
    const res = await fetch("http://localhost:8000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: temperature,
      }),
    });
    const data = await res.json();
    setResponse(data.choices[0].message.content);
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Prompt Lab</h1>
      <textarea
        placeholder="Write your prompt here..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{ width: "100%", height: "150px" }}
      />
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
      <button style={{ marginTop: "1rem" }} onClick={sendPrompt}>
        Submit
      </button>
      <div style={{ marginTop: "2rem", whiteSpace: "pre-wrap" }}>
        <h2>Result:</h2>
        {response}
      </div>
    </main>
  );
}
