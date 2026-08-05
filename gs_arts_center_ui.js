const vec_LookAt = new THREE.Vector3(18.97, 10.2, 0.7);

var viewer = WALK.getViewer();
viewer.onSceneReadyToDisplay(initUIOnSceneReady);
viewer.play();
viewer.onViewSwitchStarted(() => {
  if (!isNavigating) {
    reset_btn_seatmap();
  }
});

viewer.anchorsVisible = false;
viewer.menuVisible = true;
viewer.helpVisible = false;
let currentSeatViewId = null;
let isNavigating = false;

function initUIOnSceneReady() {
  const banner = document.getElementById('start-banner');

  // 시작 배너 로고(banner-inner) 0.5초간 페이드아웃 애니메이션 발동
  if (banner) {
    const bannerInner = banner.querySelector('.banner-inner');
    if (bannerInner) {
      bannerInner.style.animation = 'none'; // 애니메이션 상태 리셋
      bannerInner.offsetHeight;             // 브라우저 리플로우(Reflow) 강제 실행
      bannerInner.style.transition = 'opacity 0.5s ease-in-out';
      bannerInner.style.opacity = '0';
    }
    setTimeout(() => {
      banner.classList.add('hide');
    }, 500);
  }

  // =========================================================================
  // [시퀀스 2] T = 1000ms (1.0초 후): 메인 커스텀 UI 및 뷰어 메뉴 활성화
  // =========================================================================
  setTimeout(() => {
    showCustomUI();
    viewer.menuVisible = true;
  }, 1000);

  // =========================================================================
  // [시퀀스 3] T = 1500ms (1.5초 후): 시작 배너 DOM 요소 숨김 (display: none)
  // =========================================================================
  setTimeout(() => {
    if (banner) {
      banner.style.display = 'none';
    }
    btn_seatmap_open();
  }, 1500);

  // =========================================================================
  // [시퀀스 4] T = 1550ms (1.55초 후): 3D 무대 커튼 노드 초기화 및 씬 렌더링 갱신
  // =========================================================================
  // setTimeout(() => {
  //   const curtainNodes = ['curtain:그룹#152', 'curtain_1', 'curtain_2', 'curtian_3'];
  //   curtainNodes.forEach((name) => {
  //     for (const node of viewer.findNodesOfType(name)) {
  //       node.show();
  //     }
  //   });
  //   viewer.requestFrame();
  // }, 1550);
};

function reset_seatmap() {
  currentSeatViewId = null;

  const btn_seatmap_floor = document.getElementById('btn_seatmap_floor');
  const btn_seatmap_text = document.getElementById('btn_seatmap_text');
  btn_seatmap_floor.innerText = '';
  btn_seatmap_text.innerText = '';
  const btn_seatmap_select_title = document.getElementById('btn_seatmap_select_title');
  btn_seatmap_select_title.style.display = 'block';

  const btn_seatmap = document.getElementById('btn_seatmap');
  if (btn_seatmap) btn_seatmap.classList.remove('has-selection');
}

function reset_btn_seatmap() {
  currentSeatViewId = null;

  const btn_seatmap_floor = document.getElementById('btn_seatmap_floor');
  const btn_seatmap_text = document.getElementById('btn_seatmap_text');
  btn_seatmap_floor.innerText = '';
  btn_seatmap_text.innerText = '';
  const btn_seatmap_select_title = document.getElementById('btn_seatmap_select_title');
  btn_seatmap_select_title.style.display = 'block';

  const btn_seatmap = document.getElementById('btn_seatmap');
  if (btn_seatmap) btn_seatmap.classList.remove('has-selection');

  showCustomUI();
  viewer.menuVisible = true;
}

function btn_autotour() {
  reset_seatmap();
}

function btn_stage_look() {
  if (isNavigating) return;
  // move 3D 
  const view = new WALK.View();
  view.position = viewer.getCameraPosition();

  const m = new THREE.Matrix4();
  m.lookAt(view.position, vec_LookAt, new THREE.Vector3(0, 0, 1));
  let ves = new THREE.Euler();
  ves.setFromRotationMatrix(m, 'ZYX');

  // 1. 카메라에서 바라볼 목표점(vec_LookAt)까지의 상대 거리 벡터 계산
  var dx = vec_LookAt.x - view.position.x;
  var dy = vec_LookAt.y - view.position.y;
  var dz = vec_LookAt.z - view.position.z;

  // 2. 수평 거리(바닥면 거리) 계산
  var horizontalDistance = Math.sqrt(dx * dx + dy * dy);

  // 3. 삼각함수를 통한 정확한 Yaw 및 Pitch 값 추출
  // Shapespark 좌표계 기준에 맞춘 아크탄젠트/아크사인 계산
  //view.rotation.yaw = Math.atan2(dy, dx);
  view.rotation.yaw = ves.z;
  view.rotation.pitch = Math.atan2(dz, horizontalDistance); // 높이차(dz)와 수평거리 비율로 피치 계산

  isNavigating = true;
  viewer.switchToView(view);
  setTimeout(() => {
    isNavigating = false;
  }, 1200);
}


const btnSeatmap = document.getElementById('btn_seatmap');
const seatmapOverlay = document.getElementById('seatmap-overlay');
const seatmapCloseButton = document.getElementById('seatmap-close-button');
const btn_menu_bar_folder = document.getElementById('menu-bar-folder');

function btn_seatmap_open() {
  seatmapOverlay.classList.add('active');
  reset_seatmap();
  hideCustomUI();
  if (window.setZoomLevel) window.setZoomLevel(0, true);
  if (viewer._autoTour.isRunning() == true) {
    viewer._autoTour.stop();
  }
}

document.addEventListener('DOMContentLoaded', () => {

  function btnSeatmap_close() {
    if (seatmapOverlay) seatmapOverlay.classList.remove('active');
    // 라인 이미지 및 구역 선택 상태 모두 초기화
    sectionButtons.forEach(sb => sb.classList.remove('active'));
    reset_btn_seatmap();
    hideAllZoneLines();
  }

  function showViewId(viewId) {
    currentSeatViewId = viewId;

    // Highlight selected seat on map
    document.querySelectorAll('svg rect.selected-active').forEach(el => {
      el.classList.remove('selected-active');
    });
    const rect = document.getElementById(viewId);
    if (rect) {
      rect.classList.add('selected-active');
    }
    const seat = GS_ARTS_CENTER_SEAT_MAP_DATA.find(s => s.View_ID === viewId);
    if (seat) {
      const floorText = seat.Floor.replace('F', '층');
      const displayText = ` ${seat.Zone}블록 ${seat.Row} ${seat.Display_Text}좌석`;
      const btn_seatmap_floor = document.getElementById('btn_seatmap_floor');
      const btn_seatmap_text = document.getElementById('btn_seatmap_text');
      const btn_seatmap_select_title = document.getElementById('btn_seatmap_select_title');
      btn_seatmap_select_title.style.display = 'none';
      btn_seatmap_floor.innerText = floorText;
      btn_seatmap_text.innerText = displayText;
      btn_seatmap_select_title.style.display = 'none';

      const btn_seatmap = document.getElementById('btn_seatmap');
      if (btn_seatmap) btn_seatmap.classList.add('has-selection');

      // move 3D 
      const view = new WALK.View();
      view.position.x = seat.X;
      view.position.y = seat.Y;
      view.position.z = seat.Z;

      const m = new THREE.Matrix4();
      m.lookAt(view.position, vec_LookAt, new THREE.Vector3(0, 0, 1));
      let ves = new THREE.Euler();
      ves.setFromRotationMatrix(m, 'ZYX');
      //view.rotation.z = ves.z;

      // 1. 카메라에서 바라볼 목표점(vec_LookAt)까지의 상대 거리 벡터 계산
      var dx = vec_LookAt.x - view.position.x;
      var dy = vec_LookAt.y - view.position.y;
      var dz = vec_LookAt.z - view.position.z;

      // 2. 수평 거리(바닥면 거리) 계산
      var horizontalDistance = Math.sqrt(dx * dx + dy * dy);

      // 3. 삼각함수를 통한 정확한 Yaw 및 Pitch 값 추출
      // Shapespark 좌표계 기준에 맞춘 아크탄젠트/아크사인 계산
      //view.rotation.yaw = Math.atan2(dy, dx);
      view.rotation.yaw = ves.z;
      view.rotation.pitch = Math.atan2(dz, horizontalDistance); // 높이차(dz)와 수평거리 비율로 피치 계산

      isNavigating = true;
      viewer.switchToView(view);
      setTimeout(() => {
        isNavigating = false;
      }, 1200);

      // Close the popup
      const seatmapOverlay = document.getElementById('seatmap-overlay');
      if (seatmapOverlay) seatmapOverlay.classList.remove('active');

      // 라인 이미지 및 구역 선택 상태 모두 초기화
      hideAllZoneLines();
      sectionButtons.forEach(sb => sb.classList.remove('active'));

      showCustomUI();
      viewer.menuVisible = true;
    }
  }

  if (btnSeatmap && seatmapOverlay && seatmapCloseButton && btn_menu_bar_folder) {

    btn_menu_bar_folder.addEventListener('click', () => {
      toogle_menu_bar();
    });

    seatmapCloseButton.addEventListener('click', () => {
      btnSeatmap_close();
    });

    btnSeatmap.addEventListener('click', () => {
      btn_seatmap_open();
    });


    // Close when clicking outside the popup
    seatmapOverlay.addEventListener('click', (e) => {
      if (e.target === seatmapOverlay) {
        //seatmapOverlay.classList.remove('active');
        //reset_btn_seatmap();
        btnSeatmap_close();
      }
    });
  }

  const manualOverlay = document.getElementById('manual-ui-overlay');
  if (manualOverlay) {
    manualOverlay.addEventListener('click', (e) => {
      if (e.target === manualOverlay) {
        btn_help_hide();
      }
    });
  }

  // 1. 비동기 패치를 통해 단일 인라인 SVG 구조 주입 (1F, 2F, 3F)
  Promise.all([
    fetch('img/seatmap/1f/SVP_svg_1f_OP.svg').then(res => res.text()),
    fetch('img/seatmap/1f/SVP_svg_1f_A.svg').then(res => res.text()),
    fetch('img/seatmap/1f/SVP_svg_1f_B.svg').then(res => res.text()),
    fetch('img/seatmap/1f/SVP_svg_1f_C.svg').then(res => res.text()),
    fetch('img/seatmap/2f/SVP_svg_2f_A.svg').then(res => res.text()),
    fetch('img/seatmap/2f/SVP_svg_2f_B.svg').then(res => res.text()),
    fetch('img/seatmap/2f/SVP_svg_2f_C.svg').then(res => res.text()),
    fetch('img/seatmap/3f/SVP_svg_3f_A.svg').then(res => res.text()),
    fetch('img/seatmap/3f/SVP_svg_3f_B.svg').then(res => res.text()),
    fetch('img/seatmap/3f/SVP_svg_3f_C.svg').then(res => res.text())
  ])
    .then(([svg1OP, svg1A, svg1B, svg1C, svg2A, svg2B, svg2C, svg3A, svg3B, svg3C]) => {
      document.getElementById('floor1f-zone-op').innerHTML = svg1OP;
      document.getElementById('floor1f-zone-a').innerHTML = svg1A;
      document.getElementById('floor1f-zone-b').innerHTML = svg1B;
      document.getElementById('floor1f-zone-c').innerHTML = svg1C;
      document.getElementById('floor2f-zone-a').innerHTML = svg2A;
      document.getElementById('floor2f-zone-b').innerHTML = svg2B;
      document.getElementById('floor2f-zone-c').innerHTML = svg2C;
      document.getElementById('floor3f-zone-a').innerHTML = svg3A;
      document.getElementById('floor3f-zone-b').innerHTML = svg3B;
      document.getElementById('floor3f-zone-c').innerHTML = svg3C;

      bindSeatClickEvents();
    })
    .catch(error => {
      console.error("좌석배치도 로드 중 오류 발생:", error);
    });

  // 2. 좌석 클릭 이벤트 리스너 바인딩 (이벤트 위임을 통해 1F/2F/3F 모두 통합 지원)
  function bindSeatClickEvents() {
    const mapContainer = document.getElementById('seatmap-map-container');

    mapContainer.addEventListener('click', (e) => {
      const rect = e.target.closest('rect[id^="View_"]');
      if (!rect) return;

      const viewId = rect.id;

      document.querySelectorAll('svg rect.selected-active').forEach(el => {
        el.classList.remove('selected-active');
      });
      rect.classList.add('selected-active');

      showViewId(viewId);
    });
  }

  // 3. 확대/축소 및 드래그 마우스 이벤트 제어 로직 구현
  const mapContainer = document.getElementById('seatmap-map-container');
  const zoomContent = document.getElementById('seatmap-zoom-content');
  let currentScale = 0.45; // 초기 전체 피팅 스케일 적용
  let posX = 0;
  let posY = 0;
  let isDragging = false;
  let startX, startY;

  function getBaseScale() {
    //const activeFloorBtn = document.querySelector('.floor-btn.active');
    //const activeFloor = activeFloorBtn ? activeFloorBtn.getAttribute('data-floor') : '1F';
    return 0.6;
  }

  let zoomLevel = 0; // 0: 초기 상태, 1: 1단계, 2: 2단계

  window.setZoomLevel = function (level, resetPosition = false) {
    zoomLevel = Math.max(0, Math.min(2, level));
    const baseScale = getBaseScale();

    if (zoomLevel === 0) {
      currentScale = baseScale;
    } else if (zoomLevel === 1) {
      currentScale = baseScale * 1.5;
    } else if (zoomLevel === 2) {
      currentScale = baseScale * 2.5;
    }

    if (resetPosition) {
      posX = 0;
      posY = 0;
    }

    applyZoomAndPan();
    updateZoomButtons();
  };

  window.updateZoomButtons = function () {
    const zoomInBtn = document.getElementById('seatmap-zoom-in');
    const zoomOutBtn = document.getElementById('seatmap-zoom-out');

    if (zoomOutBtn) {
      zoomOutBtn.disabled = (zoomLevel === 0);
    }
    if (zoomInBtn) {
      zoomInBtn.disabled = (zoomLevel === 2);
    }
  };

  function clampPos(x, y) {
    const containerW = mapContainer.clientWidth;
    const containerH = mapContainer.clientHeight;

    if (containerW === 0 || containerH === 0) {
      return { x, y };
    }

    const activeFloorBtn = document.querySelector('.floor-btn.active');
    const activeFloor = activeFloorBtn ? activeFloorBtn.getAttribute('data-floor') : '1F';
    const sectionW = 1424;
    const sectionH = (activeFloor === '1F') ? 1252 : 930;

    const scaledW = sectionW * currentScale;
    const scaledH = sectionH * currentScale;

    let minX, maxX;
    if (scaledW > containerW) {
      minX = - (scaledW - containerW) / 2;
      maxX = (scaledW - containerW) / 2;
    } else {
      minX = 0;
      maxX = 0;
    }

    let minY, maxY;
    if (scaledH > containerH) {
      minY = - (scaledH - containerH) / 2;
      maxY = (scaledH - containerH) / 2;
    } else {
      minY = 0;
      maxY = 0;
    }

    return {
      x: Math.max(minX, Math.min(maxX, x)),
      y: Math.max(minY, Math.min(maxY, y))
    };
  }

  function applyZoomAndPan() {
    const clamped = clampPos(posX, posY);
    posX = clamped.x;
    posY = clamped.y;
    zoomContent.style.transform = `translate(${posX}px, ${posY}px) scale(${currentScale})`;
  }

  // 초기 버튼 상태 업데이트
  updateZoomButtons();
  applyZoomAndPan();

  // 마우스 드래그 시작
  mapContainer.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    isDragging = true;
    startX = e.clientX - posX;
    startY = e.clientY - posY;
    zoomContent.classList.add('dragging');
    mapContainer.style.cursor = 'move';
  });

  // 마우스 드래그 중
  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    posX = e.clientX - startX;
    posY = e.clientY - startY;
    applyZoomAndPan();
  });

  // 마우스 드래그 종료
  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    zoomContent.classList.remove('dragging');
    mapContainer.style.cursor = 'grab';
  });

  // 휠 확대/축소 지원 (+/- 버튼과 동일하게 단계별 줌 처리)
  let lastWheelTime = 0;
  mapContainer.addEventListener('wheel', (e) => {
    e.preventDefault();
    const now = Date.now();
    if (now - lastWheelTime < 150) return; // 휠 속도에 의한 급격한 단계 변화 방지 (150ms 쿨다운)
    lastWheelTime = now;

    if (e.deltaY < 0) {
      if (zoomLevel < 2) {
        setZoomLevel(zoomLevel + 1);
      }
    } else {
      if (zoomLevel > 0) {
        setZoomLevel(zoomLevel - 1);
      }
    }
  }, { passive: false });

  // 모바일 터치 드래그 지원
  mapContainer.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      startX = e.touches[0].clientX - posX;
      startY = e.touches[0].clientY - posY;
      zoomContent.classList.add('dragging');
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    posX = e.touches[0].clientX - startX;
    posY = e.touches[0].clientY - startY;
    applyZoomAndPan();
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
    zoomContent.classList.remove('dragging');
  });

  // 줌 컨트롤 버튼 핸들링
  document.getElementById('seatmap-zoom-in').addEventListener('click', (e) => {
    e.stopPropagation();
    if (zoomLevel < 2) {
      setZoomLevel(zoomLevel + 1);
    }
  });

  document.getElementById('seatmap-zoom-out').addEventListener('click', (e) => {
    e.stopPropagation();
    if (zoomLevel > 0) {
      setZoomLevel(zoomLevel - 1);
    }
  });

  document.getElementById('seatmap-zoom-reset').addEventListener('click', (e) => {
    e.stopPropagation();
    setZoomLevel(0, true);
  });

  // 5. 구역 선택 버튼 (.section-btn) 및 구역 라인 이미지 셋업
  const sectionButtons = document.querySelectorAll('.section-btn');
  const zoneLines = {
    '1F': {
      'OP': "seatmap_1f_line_op",
      'A': "seatmap_1f_line_a",
      'B': "seatmap_1f_line_b",
      'C': "seatmap_1f_line_c"
    },
    '2F': {
      'A': "seatmap_2f_line_a",
      'B': "seatmap_2f_line_b",
      'C': "seatmap_2f_line_c"
    },
    '3F': {
      'A': "seatmap_3f_line_a",
      'B': "seatmap_3f_line_b",
      'C': "seatmap_3f_line_c"
    }
  };
  function hideAllZoneLines() {
    for (const floor in zoneLines) {
      for (const zone in zoneLines[floor]) {
        const img = document.getElementById(zoneLines[floor][zone]);
        if (img) img.style.display = 'none';
      }
    }
  };

  // 4. 층 선택 버튼 (.floor-btn) 클릭 시 층 전환 이벤트 바인딩
  const floorButtons = document.querySelectorAll('.floor-btn');
  const floorSections = document.querySelectorAll('.seatmap-img-floor-section');

  floorButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetFloor = btn.getAttribute('data-floor'); // '1F', '2F', '3F'

      // 층 버튼 클래스 활성화 상태 업데이트
      floorButtons.forEach(fb => fb.classList.remove('active'));
      btn.classList.add('active');

      // 라인 이미지 및 구역 선택 상태 모두 초기화
      hideAllZoneLines();
      sectionButtons.forEach(sb => sb.classList.remove('active'));

      // 해당하는 층 배치도 섹션만 active 전환
      floorSections.forEach(section => {
        section.classList.remove('active');
        if (section.id === `floor-section-${targetFloor}`) {
          section.classList.add('active');
        }
      });

      // 층 변경 시 줌 및 드래그 위치 정중앙 리셋 (flex-center 정렬)
      setZoomLevel(0, true);
    });
  });

  const zoneCoords = {
    '1F': {
      'A': { left: 355, top: 442, width: 186, height: 565 },
      'B': { left: 584, top: 467, width: 258, height: 556 },
      'C': { left: 886, top: 442, width: 186, height: 565 }
    },
    '2F': {
      'A': { left: 298, top: 452, width: 186, height: 264 },
      'B': { left: 584, top: 452, width: 258, height: 220 },
      'C': { left: 948, top: 452, width: 186, height: 264 }
    },
    '3F': {
      'A': { left: 338, top: 382, width: 150, height: 184 },
      'B': { left: 584, top: 382, width: 258, height: 196 },
      'C': { left: 908, top: 382, width: 150, height: 184 }
    }
  };
  sectionButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetFloor = btn.getAttribute('data-floor'); // '1F', '2F', '3F'
      const targetZone = btn.getAttribute('data-zone');   // 'A', 'B', 'C'

      // 1) 구역 버튼 active 클래스 활성화 전환
      sectionButtons.forEach(sb => sb.classList.remove('active'));
      btn.classList.add('active');

      // 2) 구역 라인 이미지 표시 (active)
      hideAllZoneLines();
      const lineId = zoneLines[targetFloor][targetZone];
      const lineImg = document.getElementById(lineId);
      if (lineImg) {
        lineImg.style.display = 'block';
      }

      // 3) 층 버튼 및 층 섹션 동기화 활성화
      floorButtons.forEach(fb => {
        fb.classList.remove('active');
        if (fb.getAttribute('data-floor') === targetFloor) {
          fb.classList.add('active');
        }
      });

      floorSections.forEach(section => {
        section.classList.remove('active');
        if (section.id === `floor-section-${targetFloor}`) {
          section.classList.add('active');
        }
      });

      // 3) 구역 선택 시 줌인하지 않고, 층 변경과 동일하게 정중앙 리셋(기본 줌) 처리
      setZoomLevel(0, true);
    });
  });

  // Toggle Custom UI Panel Visibility
  const btnToggleUI = document.getElementById('btn-toggle-ui');
  if (btnToggleUI) {
    btnToggleUI.addEventListener('click', (e) => {
      e.stopPropagation();
      const bottomRight = document.querySelector('.custom-ui-bottom-right');
      if (bottomRight) {
        if (bottomRight.classList.contains('hide-ani')) {
          showCustomUI();
        } else {
          hideCustomUI();
        }
      }
    });
  }

  // view-list-items 클릭 시 reset_btn_seatmap 실행 (캡처링 페이즈를 사용하여 stopPropagation 우회)
  document.addEventListener('click', (e) => {
    const viewEl = e.target.closest('#view-list-items .view');
    if (viewEl) {
      reset_btn_seatmap();
    }
  }, true);


  document.getElementById('btn_prev_seat').addEventListener('click', () => {
    if (isNavigating || !currentSeatViewId) return;
    const index = GS_ARTS_CENTER_SEAT_MAP_DATA.findIndex(s => s.View_ID === currentSeatViewId);

    let prevIndex = index - 1;
    while (prevIndex >= 0 && GS_ARTS_CENTER_SEAT_MAP_DATA[prevIndex].Seat_Type === "none") {
      prevIndex--;
    }

    if (prevIndex >= 0) {
      isNavigating = true;
      showViewId(GS_ARTS_CENTER_SEAT_MAP_DATA[prevIndex].View_ID);
      setTimeout(() => { isNavigating = false; }, 1000);
    }
  });

  document.getElementById('btn_next_seat').addEventListener('click', () => {
    if (isNavigating || !currentSeatViewId) return;
    const index = GS_ARTS_CENTER_SEAT_MAP_DATA.findIndex(s => s.View_ID === currentSeatViewId);

    let nextIndex = index + 1;
    while (nextIndex < GS_ARTS_CENTER_SEAT_MAP_DATA.length && GS_ARTS_CENTER_SEAT_MAP_DATA[nextIndex].Seat_Type === "none") {
      nextIndex++;
    }

    if (nextIndex < GS_ARTS_CENTER_SEAT_MAP_DATA.length) {
      isNavigating = true;
      showViewId(GS_ARTS_CENTER_SEAT_MAP_DATA[nextIndex].View_ID);
      setTimeout(() => { isNavigating = false; }, 1000);
    }
  });

  window.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      // const seatmapOverlay = document.getElementById('seatmap-overlay');
      // if (seatmapOverlay) seatmapOverlay.classList.remove('active');
      // reset_btn_seatmap();
      btnSeatmap_close();
    }
  });
});

//------------------------------------------
window.toggleFullScreen = function () {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      console.error(`Error attempting to enable full-screen mode: ${err.message}`);
    });
  } else {
    document.exitFullscreen();
  }
};

function toogle_menu_bar() {
  if (viewer.menuVisible) {
    hideCustomUI();
  } else {
    showCustomUI();
  }
}


const topLeft = document.querySelector('.custom-ui-top-left');
const bottomLeft = document.querySelector('.custom-ui-bottom-left');

function hideCustomUI() {
  if (topLeft) topLeft.classList.add('hide-ani');
  if (bottomLeft) bottomLeft.classList.add('hide-ani');
  setTimeout(() => {
    viewer.menuVisible = false;
  }, 100);
};

function showCustomUI() {
  if (topLeft) topLeft.classList.remove('hide-ani');
  if (bottomLeft) bottomLeft.classList.remove('hide-ani');
};

function btn_help_show() {
  document.getElementById('manual-ui-overlay').style.display = 'flex';
  document.getElementById('manual-ui-overlay').classList.add('show');
  reset_btn_seatmap();
}
function btn_help_hide() {
  document.getElementById('manual-ui-overlay').classList.remove('show');
  setTimeout(() => {
    document.getElementById('manual-ui-overlay').style.display = 'none';
  }, 500);
}


var stage_change_step = 1;
// 무대_일반공연:그룹#6
// 무대_뮤지컬:그룹#5
// 무대_음악공연:그룹#169
const nodeNames1 = ['무대_일반공연:그룹#6']
const nodeNames2 = ['무대_뮤지컬:그룹#5']
const nodeNames3 = ['무대_음악공연:그룹#169']
const nodeNames = ['무대_일반공연:그룹#6', '무대_뮤지컬:그룹#5', '무대_음악공연:그룹#169']
const btnStageChange = document.getElementById('btn_stage_change');

function btn_stage_change() {
  nodeNames.forEach((name) => { for (const node of viewer.findNodesOfType(name)) { node.hide(); } })
  viewer.requestFrame();

  if (stage_change_step == 0) {
    nodeNames1.forEach((name) => { for (const node of viewer.findNodesOfType(name)) { node.show(); } })
    viewer.requestFrame();
    stage_change_step = 1
    btnStageChange.textContent = "일반";
  } else if (stage_change_step == 1) {
    nodeNames2.forEach((name) => { for (const node of viewer.findNodesOfType(name)) { node.show(); } })
    viewer.requestFrame();
    stage_change_step = 2
    btnStageChange.textContent = "뮤지컬";
  } else if (stage_change_step == 2) {
    nodeNames3.forEach((name) => { for (const node of viewer.findNodesOfType(name)) { node.show(); } })
    viewer.requestFrame();
    stage_change_step = 0
    btnStageChange.textContent = "클래식";
  }

  // 무대변경 메시지 팝업 표시
  // const btnStage = document.getElementById('btn_stage_change');
  // if (btnStage) {
  //   btnStage.setAttribute('data-msg', '무대장치' + stage_change_step);
  //   btnStage.classList.add('show-msg');
  //   setTimeout(() => {
  //     btnStage.classList.remove('show-msg');
  //   }, 2000);
  // }
};


var op_change_step = 1;
const nodeOPNames1 = ['op_일반:Group#378']
const nodeOPNames2 = ['op_객석:그룹#366']
const nodeOPNames3 = ['op_오케스트라:Group#312']
const nodeOPNames = ['op_오케스트라:Group#312', 'op_객석:그룹#366', 'op_일반:Group#378']
const btnOPChange = document.getElementById('btn_op_change');

function btn_op_change() {
  nodeOPNames.forEach((name) => { for (const node of viewer.findNodesOfType(name)) { node.hide(); } })
  // OP좌석  onoff 시
  if (op_change_step == 0) {
    nodeOPNames1.forEach((name) => { for (const node of viewer.findNodesOfType(name)) { node.show(); } })
    viewer.requestFrame()
    btnOPChange.textContent = "무대";
    op_change_step = 1
  } else if (op_change_step == 1) {
    nodeOPNames2.forEach((name) => { for (const node of viewer.findNodesOfType(name)) { node.show(); } })
    viewer.requestFrame()
    btnOPChange.textContent = "객석";
    op_change_step = 2
  } else if (op_change_step == 2) {
    nodeOPNames3.forEach((name) => { for (const node of viewer.findNodesOfType(name)) { node.show(); } })
    viewer.requestFrame()
    btnOPChange.textContent = "오케스트라";
    op_change_step = 0
  }

  // if (btnStage) {
  //   btnStage.setAttribute('data-msg', 'OP좌석' + op_change_step);
  //   btnStage.classList.add('show-msg');
  //   setTimeout(() => {
  //     btnStage.classList.remove('show-msg');
  //   }, 2000);
  // }
};