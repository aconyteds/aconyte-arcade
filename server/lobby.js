var express = require('express');


module.exports = {
  initialPort: 8100,
  currentPort: 8100,
  maximumPort: 8200,
  reservedPorts: [],
  listeners: [],
  defaultTimeout: 1000000,
  getPort: function() {
    this.currentPort++;

    if (this.currentPort > this.maximumPort) {
      //Reset when the number gets to high
      this.currentPort = this.initialPort;
    }

    while (this.reservedPorts.indexOf(this.currentPort) !== -1) {
      //Skip ports that have been blocked
      this.currentPort++;
    };

    return this.currentPort;
  },
  createLobby: function(roomCode, openRooms) {
    //Creates a new lobby at the current port: ws://<localhost>:8100/lobby/roomCode
    var lobbyApp = express();
    var expressWs = require('express-ws')(lobbyApp);
    var timeout = new Date().getTime(),
      currPort = this.getPort(),
      defaultTimeout = this.defaultTimeout;

    function countUsers() {
      var currUsers = 0;
      expressWs.getWss().clients.forEach(client => (currUsers++));

      return currUsers;
    }

    function closeRoom(interval) {
      expressWs.getWss().clients.forEach(client => {
        client.send("Closing connection, timeout lapsed.");
        client.close();
      });
      currentListener.close();
      var roomIndex = false;
      openRooms.some((room, indx) => {
        if (room.roomCode === roomCode) {
          roomIndex = indx;
          return true;
        }
      });
      if (roomIndex !== false) {
        openRooms.splice(roomIndex, 1);
      }

      console.log("Closed Room: " + roomCode);
    }

    function resetTimeout() {
      timeout = new Date().getTime();
    }

    //Setup the lobby Handlers
    lobbyApp.ws('/lobby/' + roomCode, function(ws, req) {
      resetTimeout();

      //Setup a handler for when a user Connects to the lobby to update the players list
      ws.on("open", function(){
        console.log("New Connection Opened");
      });


      ws.on('message', function(msg) {
        console.log(msg);
        resetTimeout();
        var connections = expressWs.getWss().clients;
        if(msg.type){
          switch(msg.type){
            case "chat":
              connections.forEach(client => (client.send({
                type:"chat",
                user:msg.avatar,
                message:msg.message
              })));
              break;
            case "connect":
              connections.forEach(client => (client.send({
                type:"connect",
                user:msg.avatar
              })));
              break;
            case "gameChoice":
              connections.forEach(client => (client.send({
                  type:"gameChange",
                  value:msg.value
              })));
              break;
            case "launchGame":
              connections.forEach(client => (client.send({
                type:"launchGame"
              })));
              break;
          }
        }
        else{
          //Setup a handler for when users message each other to broadcast that message to each other
          connections.forEach(client => (client.send("User Submitted: '" + msg + "' to " + countUsers() + " users in room " + roomCode)));
        }
      });

      //Setup a handler for when the Host Changes the Game

      //Setup a handler for when the host launches the game

    });

    console.log('Room ' + roomCode + " created on port " + currPort);
    var currentListener = lobbyApp.listen(currPort);
    this.listeners.push(currentListener);

    //Close the server after it has been idle for too long
    setInterval(function() {
      if ((new Date().getTime() - timeout) > defaultTimeout) {
        //Server has been idle for too long, shut it down
        closeRoom(this);
        clearInterval(this);
      }
    }, 1000);

    var currentRoom = {
      port: currPort,
      roomCode: roomCode
    };
    openRooms.push(currentRoom);
    return currentRoom;
  }
};
