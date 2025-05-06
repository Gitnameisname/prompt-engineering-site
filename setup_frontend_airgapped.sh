#!/bin/bash

echo "🛠 프론트엔드 환경 설치를 시작합니다..."

# Node.js 확인
if ! command -v node &> /dev/null; then
  echo "❌ Node.js가 설치되어 있지 않습니다. 설치 후 다시 시도해주세요."
  exit 1
fi

if ! command -v npm &> /dev/null; then
  echo "❌ npm이 설치되어 있지 않습니다. 설치 후 다시 시도해주세요."
  exit 1
fi

echo "✅ Node: $(node -v), npm: $(npm -v)"

# 현재 디렉토리 이동
SCRIPT_DIR=$(dirname "$0")
cd "$SCRIPT_DIR" || exit 1

# 설치 여부 결정
if [ -d "node_modules" ]; then
  echo "✅ 이미 node_modules가 존재합니다. 설치를 건너뜁니다."
else
  if [ -f "node_modules.tar.gz" ]; then
    echo "📦 오프라인 설치 모드: node_modules.tar.gz 파일을 감지했습니다."
    tar -xzf node_modules.tar.gz
    echo "✅ 압축 해제 완료: node_modules 복원"
  else
    echo "🌐 온라인 설치 모드: 인터넷을 통해 의존성을 설치합니다."
    npm install
    if [ $? -ne 0 ]; then
      echo "❌ npm install 실패. 인터넷 연결을 확인하거나 node_modules.tar.gz를 준비하세요."
      exit 1
    fi
  fi
fi

# 개발 서버 실행 여부
read -p "🚀 개발 서버를 실행하시겠습니까? (y/n): " run_server
if [[ "$run_server" =~ ^[Yy]$ ]]; then
  npm run dev || npm run start
else
  echo "💡 나중에 다음 명령어로 실행할 수 있습니다: npm run dev"
fi

echo "🎉 프론트엔드 설치 완료!"
