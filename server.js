const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { v4: uuidV4 } = require('uuid');

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`);
});

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room });
});

// Runs any time someone connects to web page
io.on('connection', socket => {
  // Event: When someone connects to a room
  socket.on('join-room', (roomId, userId) => {
    console.log(roomId, userId)
  })
})

server.listen(3000);