#!/bin/bash

# 실행 경로 기준으로 백엔드/프론트엔드 경로 지정
BACKEND_DIR="./backend"
FRONTEND_DIR="./frontend"

# 색상 함수
green() { echo -e "\033[32m$1\033[0m"; }
red()   { echo -e "\033[31m$1\033[0m"; }

# 백엔드 실행
run_backend() {
  if [ -d "$BACKEND_DIR" ]; then
    cd "$BACKEND_DIR" || exit
    green "🚀 백엔드 서버 시작: uvicorn main:app --reload --port 8000"
    uvicorn main:app --reload --port 8000 &
    BACKEND_PID=$!
    cd - > /dev/null || exit
  else
    red "❌ backend 디렉토리를 찾을 수 없습니다."
  fi
}

# 프론트엔드 실행
run_frontend() {
  if [ -d "$FRONTEND_DIR" ]; then
    cd "$FRONTEND_DIR" || exit
    green "🌐 프론트엔드 서버 시작: npm run dev"
    npm run dev &
    FRONTEND_PID=$!
    cd - > /dev/null || exit
  else
    red "❌ frontend 디렉토리를 찾을 수 없습니다."
  fi
}

# 종료 처리
cleanup() {
  echo ""
  red "🛑 서버를 종료합니다..."
  [[ -n "$BACKEND_PID" ]] && kill "$BACKEND_PID"
  [[ -n "$FRONTEND_PID" ]] && kill "$FRONTEND_PID"
  exit 0
}

# 시그널 처리
trap cleanup SIGINT SIGTERM

# 실행
run_backend
run_frontend

# 둘 다 백그라운드로 돌리면서 대기
wait
