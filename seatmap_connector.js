
function showUI01() {
  const banner = document.getElementById('start-banner');
  const selectOverlay = document.getElementById('service-select-overlay');
  if (banner) banner.style.opacity = '0';
  setTimeout(() => {
    if (banner) banner.style.display = 'none';
    if (selectOverlay) selectOverlay.style.display = 'flex';
  }, 500);
};

const vec_LookAt = new THREE.Vector3(18.22, 12.4, 4.5);

var viewer = WALK.getViewer();
viewer.onSceneReadyToDisplay(showUI01);

viewer.play();

viewer.menuVisible = false;
viewer.helpVisible = false;

let currentSeatViewId = null;
let isNavigating = false;
let hoverSeatText = "";


function showViewId(viewId) {
  currentSeatViewId = viewId;

  // Highlight selected seat on map
  document.querySelectorAll('.seatmap-img-seat-btn').forEach(btn => btn.classList.remove('selected'));
  const selectedBtn = document.getElementById(viewId);
  if (selectedBtn) {
    selectedBtn.classList.add('selected');
  }
  const seat = GS_ARTS_CENTER_SEAT_MAP_DATA.find(s => s.View_ID === viewId);
  if (seat) {
    const floorText = seat.Floor.replace('F', '층');
    const displayText = `${floorText} ${seat.Zone}블록 ${seat.Row} ${seat.Seat_Number}좌석`;
    const btn_seatmap = document.getElementById('btn_seatmap');
    if (btn_seatmap) {
      if (hoverSeatText) {
        hoverSeatText = displayText;
      } else {
        btn_seatmap.innerText = displayText;
      }
    }

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
    viewer.switchToView(view)

    // Close the popup
    const seatmapOverlay = document.getElementById('seatmap-overlay');
    if (seatmapOverlay) {
      seatmapOverlay.classList.remove('active');
    }
  }
}
