const vec_LookAt = new THREE.Vector3(18.22, 12.4, 4.5);

var viewer = WALK.getViewer();
viewer.onSceneReadyToDisplay(showUI01);
viewer.play();
// viewer.anchorsVisible = false;
viewer.onViewSwitchStarted(() => {
  if (!isNavigating) {
    reset_btn_seatmap();
  }
});

viewer.menuVisible = true;
viewer.helpVisible = false;
let currentSeatViewId = null;
let isNavigating = false;

function showUI01() {
  const banner = document.getElementById('start-banner');
  const selectOverlay = document.getElementById('service-select-overlay');

  // 오버레이는 Z-index 180 아래 레이어에 미리 flex로 숨겨 배치
  if (selectOverlay) {
    selectOverlay.classList.remove('show');
    selectOverlay.style.display = 'flex';
  }

  // 1) 즉시 배너 로고(banner-inner)만 0.5초 동안 먼저 페이드 아웃
  if (banner) {
    const bannerInner = banner.querySelector('.banner-inner');
    if (bannerInner) {
      bannerInner.style.animation = 'none'; // forwards 상태 해제
      bannerInner.offsetHeight; // 리플로우
      bannerInner.style.transition = 'opacity 0.5s ease-in-out';
      bannerInner.style.opacity = '0';
    }
  }

  // // 2) 1.2초 뒤에 배너 자체의 페이드 아웃 및 오버레이 페이드 인을 동시에 시작
  // setTimeout(() => {
  //   if (banner) {
  //     // banner.style.transition = 'opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
  //     banner.style.opacity = '0';
  //   }
  // }, 1500);

  setTimeout(() => {
    if (selectOverlay) {
      selectOverlay.classList.add('show');
    }
  }, 1000);

  // 3) 전환이 모두 종료되는 1.2초(1200ms) 시점에 배너 display 숨김
  setTimeout(() => {
    if (banner) banner.style.display = 'none';
  }, 1500);

  // setTimeout(() => {
  //   let nodeNames001 = ['curtain:그룹#152']
  //   nodeNames001.forEach((name) => { for (const node of viewer.findNodesOfType(name)) { node.hide(); } })
  //   viewer.requestFrame();
  // }, 1550);
  // setTimeout(() => {
  //   let nodeNames001 = ['curtain:그룹#152']
  //   nodeNames001.forEach((name) => { for (const node of viewer.findNodesOfType(name)) { node.show(); } })
  //   viewer.requestFrame();
  // }, 1650);


  // 초기 활성화
  setTimeout(() => {
    ['curtain:그룹#152', 'curtain_1', 'curtain_2', 'curtian_3'].forEach((name) => { for (const node of viewer.findNodesOfType(name)) { node.show(); } })
    viewer.requestFrame()
  }, 1550);
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


document.addEventListener('DOMContentLoaded', () => {
  // Mode Selection Buttons Logic
  const btnFreeMove = document.getElementById('btn-freemove');
  const btnSeatView = document.getElementById('btn-seatview');
  const btnAutoTour = document.getElementById('btn-autotour');
  const serviceOverlay = document.getElementById('service-select-overlay');
  const customUI = document.getElementById('custom-ui-container');

  if (serviceOverlay && customUI) {
    if (btnFreeMove) {
      btnFreeMove.addEventListener('click', () => {
        //serviceOverlay.style.display = 'none';
        serviceOverlay.classList.remove('show');
        customUI.style.display = 'block';
        showCustomUI();
        viewer.menuVisible = true;
      });
    }

    if (btnSeatView) {
      btnSeatView.addEventListener('click', () => {
        serviceOverlay.classList.remove('show');
        customUI.style.display = 'block';
        setTimeout(() => {
          const viewer = WALK.getViewer();
          if (viewer) viewer.play();
          // Instantly open the seat selection popup overlay
          const seatmapOverlay = document.getElementById('seatmap-overlay');
          if (seatmapOverlay) seatmapOverlay.classList.add('active');
          hideCustomUI();
          viewer.menuVisible = false;
          if (window.setZoomLevel) window.setZoomLevel(0, true);
        }, 500);
      });
    }

    if (btnAutoTour) {
      btnAutoTour.addEventListener('click', () => {
        serviceOverlay.classList.remove('show');
        customUI.style.display = 'block';
        const viewer = WALK.getViewer();
        if (viewer) {
          if (viewer._autoTour.isRunning() == false) {
            viewer._autoTour.start();
          }
        }
        showCustomUI();
        viewer.menuVisible = true;
      });
    }
  }

  function btnSeatmapClose() {
    const seatmapOverlay = document.getElementById('seatmap-overlay');
    if (seatmapOverlay) seatmapOverlay.classList.remove('active');

    // 라인 이미지 및 구역 선택 상태 모두 초기화
    hideAllZoneLines();
    sectionButtons.forEach(sb => sb.classList.remove('active'));
    reset_btn_seatmap();
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

      view.rotation.z = ves.z;
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

  const btnSeatmap = document.getElementById('btn_seatmap');
  const seatmapOverlay = document.getElementById('seatmap-overlay');
  const seatmapCloseButton = document.getElementById('seatmap-close-button');
  const btn_menu_bar_folder = document.getElementById('menu-bar-folder');

  if (btnSeatmap && seatmapOverlay && seatmapCloseButton && btn_menu_bar_folder) {

    btn_menu_bar_folder.addEventListener('click', () => {
      toogle_menu_bar();
    });

    seatmapCloseButton.addEventListener('click', () => {
      btnSeatmapClose();
    });

    btnSeatmap.addEventListener('click', () => {
      seatmapOverlay.classList.add('active');
      reset_seatmap();
      hideCustomUI();
      if (window.setZoomLevel) window.setZoomLevel(0, true);
      if (viewer._autoTour.isRunning() == true) {
        viewer._autoTour.stop();
      }
    });

    // Close when clicking outside the popup
    seatmapOverlay.addEventListener('click', (e) => {
      if (e.target === seatmapOverlay) {
        //seatmapOverlay.classList.remove('active');
        //reset_btn_seatmap();
        btnSeatmapClose();
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

  const hideAllZoneLines = () => {
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
      btnSeatmapClose();
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

window.hideCustomUI = function () {
  const topLeft = document.querySelector('.custom-ui-top-left');
  const bottomLeft = document.querySelector('.custom-ui-bottom-left');

  if (topLeft) topLeft.classList.add('hide-ani');
  if (bottomLeft) bottomLeft.classList.add('hide-ani');
  setTimeout(() => {
    viewer.menuVisible = false;
  }, 100);

};

window.showCustomUI = function () {
  // viewer.menuVisible = true;
  const topLeft = document.querySelector('.custom-ui-top-left');
  const bottomLeft = document.querySelector('.custom-ui-bottom-left');
  if (topLeft) topLeft.classList.remove('hide-ani');
  if (bottomLeft) bottomLeft.classList.remove('hide-ani');
};

function btn_menu_show() {
  document.getElementById('service-select-overlay').classList.add('show');
  //hideCustomUI();
  if (viewer._autoTour.isRunning() == true) {
    viewer._autoTour.stop();
  }
  reset_btn_seatmap();

  document.querySelectorAll('svg rect.selected-active').forEach(el => {
    el.classList.remove('selected-active');
  });
}

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


var stage_change_step = 0;
// const nodeNames1 = ['curtain_3:그룹#30']  // ['curtain_3:그룹#34']   curtian_3:그룹#30
// const nodeNames2 = ['curtain_2:그룹#28']
// const nodeNames3 = ['curtain_1:그룹#141']
// const nodeNames = ['curtain_1:그룹#141', 'curtain_2:그룹#28', 'curtain_3:그룹#30']


const nodeNames1 = ['curtian_3']
const nodeNames2 = ['curtain_2']
const nodeNames3 = ['curtain_1']
const nodeNames = ['curtain_1', 'curtain_2', 'curtian_3']

function btn_stage_change() {
  // 무대장치 onoff 시 좌석해제
  //reset_btn_seatmap();

  if (stage_change_step == 0) {
    nodeNames1.forEach((name) => { for (const node of viewer.findNodesOfType(name)) { node.hide(); } })
    viewer.requestFrame()
    stage_change_step = 1
  } else if (stage_change_step == 1) {
    nodeNames2.forEach((name) => { for (const node of viewer.findNodesOfType(name)) { node.hide(); } })
    viewer.requestFrame()
    stage_change_step = 2
  } else if (stage_change_step == 2) {
    nodeNames3.forEach((name) => { for (const node of viewer.findNodesOfType(name)) { node.hide(); } })
    viewer.requestFrame()
    stage_change_step = 3
  } else if (stage_change_step == 3) {
    nodeNames.forEach((name) => { for (const node of viewer.findNodesOfType(name)) { node.show(); } })
    viewer.requestFrame()
    stage_change_step = 0
  }

  // 무대변경 메시지 팝업 표시
  const btnStage = document.getElementById('btn_stage_change');
  if (btnStage) {
    btnStage.setAttribute('data-msg', '무대장치' + stage_change_step);
    btnStage.classList.add('show-msg');
    setTimeout(() => {
      btnStage.classList.remove('show-msg');
    }, 2000);
  }
};
