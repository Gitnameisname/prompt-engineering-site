#!/bin/bash

echo "🚀 프론트엔드 환경 설치를 시작합니다..."

# 1. Node.js 설치 확인
if ! command -v node &> /dev/null; then
  echo "❌ Node.js가 설치되어 있지 않습니다. 설치 후 다시 시도해주세요."
  exit 1
else
  echo "✅ Node.js 버전: $(node -v)"
fi

# 2. npm 설치 확인
if ! command -v npm &> /dev/null; then
  echo "❌ npm이 설치되어 있지 않습니다. 설치 후 다시 시도해주세요."
  exit 1
else
  echo "✅ npm 버전: $(npm -v)"
fi

# 3. 프로젝트 디렉토리 이동
SCRIPT_DIR=$(dirname "$0")
cd "$SCRIPT_DIR" || exit

# 4. node_modules가 없을 경우만 설치
if [ ! -d "node_modules" ]; then
  echo "📦 의존성 설치 중..."
  npm install
else
  echo "✅ node_modules가 이미 존재합니다. 설치를 건너뜁니다."
fi

# 5. 개발 서버 실행 여부 선택
read -p "🌐 개발 서버를 즉시 실행하시겠습니까? (y/n): " run_server

if [[ "$run_server" =~ ^[Yy]$ ]]; then
  echo "🚀 개발 서버를 시작합니다..."
  npm run dev || npm run start
else
  echo "ℹ️ 나중에 다음 명령어로 서버를 실행할 수 있습니다:"
  echo "   npm run dev"
fi

echo "✅ 프론트엔드 설정이 완료되었습니다!"
