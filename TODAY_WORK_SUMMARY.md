# 금일 날짜: 2026-09-03

## 작업 내용

### 1. 좌석 배치도 오픈 시 UI 상태 및 상위 컨테이너 애니메이션 연동
- `btn_seatmap_open()` 실행 시 내부 `reset_seatmap()`을 제거하고 `#box_seatmap_btn`의 `hide-ani`를 해제하여, 상위 컨테이너(`.custom-ui-bottom-left.hide-ani`)의 일괄 애니메이션으로 자연스럽게 숨겨지도록 수정
- `#box_seatmap_btn`의 CSS transition 시간을 `.custom-ui-bottom-left`와 동일하게 `1s ease`로 일치시켜 UI 전환 시 일체감 강화
- `#box_seatmap_btn.hide-ani` 및 `.custom-ui-top-right.hide-ani` 슬라이드 오프셋(`transform: translateX(-150%)`) 보정

### 2. 키보드 및 ESC 입력 시 좌석 세부 정보 숨김 처리
- 좌석 세부 정보 바가 열려있는 상태에서 키보드(ESC 및 일반 키) 조작 시 `reset_seatmap()` 호출을 통한 자동 숨김 처리

### 3. 상단/우측 UI 레이아웃 및 스타일 개선
- 좌측 하단 3개 버튼 그룹을 우측 상단 메뉴(`view-list-items2-box`)로 위치 이동 및 레이아웃 재배치
- 뷰 목록 아이템(`view-list-items`) 폰트 두께(font-weight) 및 배경 투명도(opacity) 스타일 최적화
- 안내 문구 디자인 및 CSS 스타일 다듬기

### 4. 3D 모델 및 씬 에셋 업데이트
- 씬 모델 업데이트(v7, v8) 반영 및 이전 씬 데이터/텍스처 정리
- Shapespark webwalk 라이브러리 및 3D 에셋 빌드 동기화

### 5. 프로젝트 파일 정리
- 미사용 진단 스크립트(`materials-diagnostic-provider.js`) 제거
- 이전 임시/테스트 HTML 파일(`index_old.html`, `index_test_v6.html`, `index_v4.html` ~ `index_v9.html`) 정리 및 삭제


---

# 일자: 2026-09-02 (어제)

## 작업 내용

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

### 8. 좌석 선택 컨트롤(#box_seatmap_btn) 키보드 입력 숨김 처리
- 좌석 선택 네비게이션이 노출된 상태에서 ESC뿐만 아니라 임의의 키보드 입력 발생 시 `reset_seatmap()`을 호출하여 좌석 선택 바 자동 숨김

