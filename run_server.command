#!/usr/bin/env bash

# =======================================================
# GS Art Center v4 로컬 웹 서버 실행 스크립트 (macOS 전용)
# =======================================================

# 1. 스크립트가 위치한 현재 폴더 경로로 이동합니다.
# (맥 Finder에서 더블클릭으로 실행할 때 올바른 위치에서 서버가 켜지도록 합니다)
cd "$(dirname "$0")"

# 2. 터미널 화면에 안내 메시지를 출력합니다.
echo "======================================================="
echo "   GS Art Center v4 3D 좌석 시야 로컬 서버를 시작합니다"
echo "======================================================="
echo ""
echo " * 현재 폴더: $(pwd)"
echo " * 로컬 접속 주소: http://localhost:8082/index.html"
echo ""
echo " * 서버를 종료하려면 이 터미널 창에서 Ctrl + C 를 누르세요."
echo "-------------------------------------------------------"

# 3. 잠시 후 자동으로 기본 웹 브라우저를 열어 웹페이지를 띄웁니다.
(sleep 1 && open "http://localhost:8082/index.html") &

# 4. 파이썬3 8082 포트로 로컬 웹 서버를 실행합니다.
# (맥OS에는 기본적으로 python3 명령어가 사용됩니다)
if command -v python3 &>/dev/null; then
    python3 -m http.server 8082
elif command -v python &>/dev/null; then
    python -m http.server 8082
else
    echo "Error: 파이썬(Python)이 설치되어 있지 않습니다. 파이썬을 먼저 설치해 주세요."
    read -p "엔터 키를 누르면 종료합니다..."
fi
