// Server is set up at root path
const socket = io('/');

const videoGrid = document.getElementById('video-grid')

// peerjs server to create users
const myPeer = new Peer(undefined, {
  host: '/',
  port: '3001'
});

const myVideo = document.createElement('video')
// Mutes user's own video audio
myVideo.muted = true

const peers = {}

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  addVideoStream(myVideo, stream)

  // When someone tries to call, this answers and sends stream
  myPeer.on('call', call => {
    call.answer(stream)
    
    // New video element
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })

  socket.on('user-connected', userId => {
    // Sends current video stream to new user
    connectToNewUser(userId, stream)
  })
})

// When user disconnects, remove id/call association in peers object
socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})

// When connected to peer server and id is generated
myPeer.on('open', id => {
  // Sends event to server
  socket.emit('join-room', ROOM_ID, id);
});

function connectToNewUser(userId, stream) {
  // Calls user with userId and sends video stream
  const call = myPeer.call(userId, stream)
  
  // Creates new video element for new user's stream
  const video = document.createElement('video')
  
  // When called user sends back their stream this event takes in their stream
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })

  // When someone leaves the call, their video is removed
  call.on('close', () => {
    video.remove()
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

  // Append new video to grid of existing videos
  videoGrid.append(video)
}