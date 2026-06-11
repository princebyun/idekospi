<div align="center">
  <h1 align="center">🕵️‍♂️ IDE-KOSPI 📈</h1>
  <p><strong>가장 전문적인 척하는 실시간 주식/코인 모니터링 시스템</strong></p>
  <p><i>"코딩하는 줄 알았지? 떡상 가즈아!"</i></p>
  
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
  [![Zustand](https://img.shields.io/badge/Zustand-764ABC?style=for-the-badge&logo=react&logoColor=white)](https://github.com/pmndrs/zustand)
</div>

<br/>

## 🕵️‍♂️ 프로젝트 소개 (About IDE-KOSPI)

**IDE-KOSPI**는 겉보기에는 VS Code, IntelliJ와 같은 전문적인 통합 개발 환경(IDE)처럼 생겼지만, 그 실체는 **실시간 주식 및 가상화폐(코인) 시세를 확인하고 동료들과 채팅을 나눌 수 있는 완벽한 위장용 웹 애플리케이션**입니다. 

사무실에서 상사의 눈치를 보지 않고 당당하게 시장의 흐름을 파악하세요. 복잡한 소스 코드(처럼 보이는 시세 데이터)와 분주하게 올라가는 시스템 로그(처럼 보이는 체결 내역)가 당신을 이달의 우수 사원으로 보이게 만들어 줄 것입니다!

<br/>

## ✨ 핵심 기능 (Key Features)

### 🎨 1. 완벽한 위장 테마 (Perfect Camouflage)
- **VS Code (Dark)**, **IntelliJ**, **Light** 등 실제 개발자들이 애용하는 에디터 테마를 완벽히 재현했습니다.
- 좌측 탐색기(Sidebar), 우측 채팅창(Panel), 하단 터미널(Terminal), 상태표시줄(StatusBar) 등 실제 IDE의 레이아웃을 그대로 채용했습니다.

### 📈 2. 실시간 시세 연동 (Real-time Market Data)
- **국내/해외 주식**: Yahoo Finance API 연동을 통해 코스피, 코스닥, 나스닥 종목의 실시간 시세를 추적합니다.
- **장전/장후 시세**: 정규장뿐만 아니라 미국장의 프리마켓(PRE) 및 애프터마켓(AFT) 시세 데이터를 뱃지와 함께 제공합니다.
- **가상화폐**: Upbit API를 사용하여 실시간 코인 시세를 1초 단위로 업데이트합니다.

### 🚨 3. 보스 모드 (Panic Mode - 이중 위장)
- 상사가 등 뒤로 다가오면 **`ESC` 키를 연속 두 번(따닥!)** 누르세요.
- 즉시 화면 전체가 주식 데이터가 일절 없는 **'실제 복잡한 Java Spring Boot 보안 설정 코드'** 와 **'Gradle Build 로그'** 로 덮어씌워지는 궁극의 방어 시스템입니다.
- 다시 `ESC`를 연속으로 누르면 0.1초 만에 원래 화면으로 복귀합니다.

### 💻 4. 터미널 조작 및 차트 (Terminal & Chart)
- **명령어 지원**: 하단 터미널에서 `add 삼성전자`, `rm 비트코인`, `help` 등의 텍스트 기반 명령어로 관심 종목을 추가/제거할 수 있습니다.
- **TradingView 연동**: 종목명 우클릭(또는 돋보기 아이콘)을 통해 실제 전문가용 TradingView 차트를 에디터 탭으로 열어 분석할 수 있습니다.

### 💬 5. 실시간 익명 채팅 (Live Anonymous Chat)
- 우측 패널(`Ctrl + L` 로 토글)을 열어 접속 중인 다른 유저들과 실시간으로 시장 동향에 대해 잡담을 나눌 수 있습니다.
- 자동 생성되는 해시(Hash) 기반의 익명 ID로 프라이버시가 보호됩니다.

### 🔄 6. 자동 릴리즈 노트 동기화
- 실제 Git 커밋 로그(`git log`)를 읽어와 IDE의 Release Notes 탭에 자동으로 Java 메소드(`@Update`) 형태로 포맷팅하여 노출합니다.

<br/>

## 🚀 시작하기 (Getting Started)

### 사전 요구 사항
- Node.js 18 이상
- Git

### 설치 및 실행

```bash
# 1. 저장소 클론
git clone https://github.com/princebyun/idekospi.git

# 2. 디렉토리 이동
cd idekospi

# 3. 의존성 설치
npm install

# 4. 프론트엔드 및 백엔드(Proxy Server) 동시 실행
npm run dev
```

> **Note**: 실행 후 브라우저에서 `http://localhost:5174` 로 접속하세요. 백엔드 주식 조회 서버는 `3001` 포트에서 백그라운드로 돌아갑니다.

<br/>

## ⌨️ 단축키 안내 (Shortcuts)

- `ESC` (2회 연속): **보스 모드 (긴급 화면 위장)**
- `Ctrl + P` (Mac: `Cmd + P`): 종목 빠른 검색 (Quick Open)
- `Ctrl + B` (Mac: `Cmd + B`): 좌측 탐색기 열기/닫기
- `Ctrl + L` (Mac: `Cmd + L`): 우측 채팅 패널 열기/닫기
- `Ctrl + \` (Mac: `Cmd + \`): 하단 터미널 열기/닫기

<br/>

---
**Disclaimer**: 본 프로젝트는 재미와 개인 학습, 그리고 조용한 직장 생활을 목적으로 제작되었습니다. 지나친 주식/코인 모니터링은 업무 효율을 저하시킬 수 있으니 상사의 눈길이 닿지 않는 곳에서 유용하게 사용하시기 바랍니다. 😉
