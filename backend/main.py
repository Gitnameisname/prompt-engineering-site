from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import httpx
import os
import json

from LogManager import LogManager

app = FastAPI()
logManager = LogManager()

# CORS 허용 (필요시 조정)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 환경변수에서 OpenAI API 키 가져오기
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"

headers = {
    "Authorization": f"Bearer {OPENAI_API_KEY}",
    "Content-Type": "application/json"
}

@app.post("/api/chat")
async def chat(request: Request):
    body = await request.json()
    stream = body.get("stream", True)
    logManager.log_info(f"Request Body: \n{body}")

    if not stream:
        # 비스트리밍 요청
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(OPENAI_API_URL, headers=headers, json=body)
            return JSONResponse(content=response.json())
    else:
        # 스트리밍 요청
        async def event_stream():
            async with httpx.AsyncClient(timeout=None) as client:
                async with client.stream("POST", OPENAI_API_URL, headers=headers, json=body) as resp:
                    ai_response = ""
                    async for line in resp.aiter_lines():
                        if line.strip() == "":
                            continue
                        if line.startswith("data: "):
                            if line == "data: [DONE]":
                                break
                            tmp_response = json.loads(line[6:]).get("choices", [{}])[0].get("delta", {}).get("content", "")
                            ai_response += tmp_response
                            yield line + "\n"

                    logManager.log_info(f"AI Response:\n{ai_response}")

        return StreamingResponse(event_stream(), media_type="text/event-stream")
