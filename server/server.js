const express = require('express')
const app = express();
const lobby = require('./lobby');

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  },(err, request, response, next) => {
    // log the error, for now just console.log
    console.log(err)
    response.status(500).send('Something broke!');
});

app.get('/', (request, response) => {
  console.log("New Client connected: ",request.headers);

  response.send("Connected to Server.");
});

const openRooms = [];

app.get("/create/:roomCode", (request, response) => {
  var roomCode = request.params.roomCode;
  console.log("Request for new Lobby: " + roomCode);
  var currRoom = false;
  openRooms.some(room => {
    if(room.roomCode === roomCode){
      currRoom = room;
      return true;
    }
  });
  if(!currRoom){
    //New Lobby
    var currRoom = lobby.createLobby(roomCode, openRooms);
  }
  else{
    console.log("Lobby already exists for room: "+roomCode);
  }
  response.status(200).send(currRoom);
});

app.get("/join/:roomCode", (request, response) => {
  var roomCode = request.params.roomCode;
  if (!openRooms.some(room => {
      if (room.roomCode === roomCode) {
        response.status(200).send(room);
        return true;
      }
    })) {
    response.status(200).send("Room no longer exists");
  }
});



app.listen(8000);
