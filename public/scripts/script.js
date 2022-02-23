function displayRoomId() {
  document.getElementById("print-room-id").innerHTML = ROOM_ID;
}

displayRoomId();

function copyRoomId() {
  navigator.clipboard.writeText(ROOM_ID);

  let tooltip = document.getElementById("clipboard-tooltip");
  tooltip.innerHTML = "Copied to clipboard";
}

function outFunc() {
  let tooltip = document.getElementById("clipboard-tooltip");
  tooltip.innerHTML = "Copy to clipboard";
}