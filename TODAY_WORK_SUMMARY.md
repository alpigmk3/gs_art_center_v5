# 오늘 작업 요약 (2026-09-02)

---

### 1. 무대 바라보기 버튼 제거
- `index.html`, `gs_arts_center_ui.css`, `gs_arts_center_ui.js`에서 `#btn_stage_look` 버튼, CSS 규칙 및 삼각함수 시선 연산 함수 제거

### 2. 하단 좌측 컨트롤 UI (`custom-ui-bottom-left`) 개선
- 버튼 너비(318px) 및 높이(42/44px) 규격 통일
- `#box_seatmap_btn` (좌석 이전/다음 이동 바): 초기 및 미선택 시 숨김(`display: none`), 좌석 선택 시 표시(`display: flex`)
- `#box_seatmap_open_btn` (좌석 선택 열기 버튼): 상시 노출 유지

### 3. 무대 장르 개별 버튼 분리 및 제어
- `btn_stage_change` 토글 버튼을 3개 개별 버튼으로 분리:
  - **일반**: `무대_일반공연` 노드 표시
  - **클래식**: `무대_음악공연` 노드 표시
  - **뮤지컬**: `무대_뮤지컬` 노드 표시
- 씬 로드 시 `일반` 모드 기본 활성화

### 4. OP석 타입 개별 버튼 분리 및 제어
- `btn_op_change` 토글 버튼을 3개 개별 버튼으로 분리:
  - **무대모드**: `op_일반` 노드 표시
  - **객석모드**: `op_객석` 노드 표시
  - **오케스트라**: `op_오케스트라` 노드 표시
- 씬 로드 시 `무대모드` 기본 활성화

### 5. 우측 상단 메뉴 UI 레이아웃 개편
- `view-list-items2-box` 구조 도입:
  - `공연장르` / `OP석타입` 세로 라벨 패널 및 3열 버튼 그룹화

### 6. 좌석 View_ID 추출 파일 생성
- `gs_arts_center_seatmap.js` 내 총 **1,296개** 좌석 `View_ID`를 홑따옴표와 쉼표로 나열한 `view_ids.txt` 파일 생성

### 7. URL 파라미터 `autoClick` 자동화 기능 고도화
- `allowedButtons` 및 정규식(`^View_[123]F_`) 기반 1,296개 좌석 View_ID 자동 판별
- DOM 렌더링 대기(`waitForElement`) 및 2,000ms 간격 순차 클릭 실행 로직 적용
