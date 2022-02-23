function showCurrentTime() {
  let currentTime = new Date()
  let hours = currentTime.getHours()
  let minutes = currentTime.getMinutes() < 10 ? "0" + currentTime.getMinutes() : currentTime.getMinutes()

  let clockTime = hours + ":" + minutes
  
  document.getElementById("print-clock").innerHTML = clockTime
}

function updateClock() {
  showCurrentTime()
}

updateClock()

let oneSecond = 1000

setInterval (updateClock, oneSecond)