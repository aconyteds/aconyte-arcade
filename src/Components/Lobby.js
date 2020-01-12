import React from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";

class Lobby extends React.Component{

	constructor(props){
  	super(props);
    let lobbyData = props;
    if(!!props.match){
      lobbyData = props.match.params;
      this.host = false;
    }
    else{
      this.host = true;
    }

    this.state ={
    	roomCode:lobbyData.roomCode,
    	players:[
      	{screenName:window.localStorage.avatar}
      ]
    }
  }

  componentDidMount(){
    const client = new W3CWebSocket("ws://localhost:8000");
    let roomCode = this.state.roomCode;

    client.onopen = function(connection){
      console.log('WebSocket Client Connected');
      console.log(connection);
      client.send({
        type:"Lobby",
        roomCode:roomCode
      });
    };

    client.onmessage = function(e){
      console.log(e.data);
    }
  }

  updatePlayers(){

  }

	//Create Lobby with a unique game
  render() {
  	return (
      <div>
        <h2>Lobby</h2>
        <h3>Room Code:{this.state.roomCode}</h3>
        <h5>Players:</h5>
        <ol>
          {this.state.players.map((player, indx) =>(
          	<li key={indx}><span className={!indx?"fa fa-users":"fa fa-user"}> </span> {player.screenName}</li>
          ))}
        </ol>
      </div>
    )
  }
}

export default Lobby;
