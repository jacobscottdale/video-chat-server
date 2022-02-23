// Server is set up at root path
const socket = io('/');

// peerjs server to create users
const myPeer = new Peer(undefined);

const ownVideo = document.getElementById('own-video')
// Mutes user's own video audio
//ownVideo.muted = true

const peerVideo = document.getElementById('peer-video')

const peers = {}

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(ownStream => {
  addVideoStream(ownVideo, ownStream)

  // When someone tries to call, this answers and sends stream
  myPeer.on('call', call => {
    call.answer(ownStream)
    toggleVideoSizes()
    call.on('stream', peerVideoStream => {
      addVideoStream(peerVideo, peerVideoStream)
      peerVideo.classList.remove('hidden')
    })
    
  })

  socket.on('user-connected', userId => {
    // Sends current video stream to new user
    connectToNewUser(userId, ownStream)
    toggleVideoSizes()
  })
  
})

// When user disconnects, remove id/call association in peers object
socket.on('user-disconnected', userId => {
  console.log(userId, ' disconnected')
  if (peers[userId]) peers[userId].close()
})

// When connected to peer server and id is generated
myPeer.on('open', id => {
  // Sends event to server
  socket.emit('join-room', ROOM_ID, id);
});

function connectToNewUser(userId, ownStream) {
  // Calls user with userId and sends video stream
  const call = myPeer.call(userId, ownStream)
  
  // When called user sends back their stream this event takes in their stream
  call.on('stream', peerVideoStream => {
    addVideoStream(peerVideo, peerVideoStream)

    peerVideo.classList.remove('hidden')
  })

  // When someone leaves the call, their video element is hidden
  call.on('close', () => {
    peerVideo.classList.add('hidden')
    toggleVideoSizes()
  })

  // Every userId is linked to a call
  peers[userId] = call
}

function addVideoStream(video, stream) {
  video.srcObject = stream

  // Once stream is loaded, play the video
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
}

function toggleVideoSizes() {
  console.log('toggling')
  ownVideo.classList.toggle('small-video')
  ownVideo.classList.toggle('large-video')
  peerVideo.classList.toggle('small-video')
  peerVideo.classList.toggle('large-video')
}

function handleDisconnect() {

}