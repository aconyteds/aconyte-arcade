import React from 'react';
import $ from "jquery";
import { w3cwebsocket as W3CWebSocket } from "websocket";

class Lobby extends React.Component{

	constructor(props){
  	super(props);
    let lobbyData = props;
    if(!!props.match){
      lobbyData = props.match.params;
    }

    this.state ={
    	roomCode:lobbyData.roomCode,
			port:lobbyData.port,
			host:lobbyData.host||false,
			gameChoice:"Liar's Dice",
    	players:[
      	{screenName:window.localStorage.avatar}
      ]
    }
  }

  componentDidMount(){
		//Send a request to the server for the room code
		if(this.state.roomCode && this.state.port){
			this.connectToLobby(this.state.port, this.state.roomCode);
		}
		else{
			$.get({
				url:"//localhost:8000/"+(this.state.host?"create":"join")+"/"+this.state.roomCode,
				crossDomain:true,
				success:(response)=>{
					//Check the response for information
					if(!!response.port && !! response.roomCode){
						//setup the WS connection
						this.connectToLobby(response.port, response.roomCode);
					}
					else{
						//TODO:: Come up with something better than this
						alert("Unable to create new room, server has encountered an unknown error.");
					}
				}
			});
		}
  }

	shareRoomCode(){
		var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(window.location.origin + "/join/"+ this.state.roomCode).select();
    document.execCommand("copy");
    $temp.remove();
	}

	connectToLobby(port, roomCode){
		//Method to create the lobby handlers for the Web Socket connection
		var client = new W3CWebSocket("ws://localhost:"+port+"/lobby/"+roomCode);
		client.onopen = () => {
			console.log('WebSocket Client Connected');
		};
		client.onmessage = (response) => {
			console.log(response);
			switch(response.type){

				case "connect":
					this.updatePlayers(response.user);
					break;
				case "gameChoice":
					this.updateGame(response.value);
					break;
				case "launchGame":
					//Launch the specified game
					break;
				case "chat":
				default:
					this.updateChat(response.user, response.message);
					break;
			}
		};
	}

	updateChat(user, message){
		//Method to update the chat display with the message that was sent
	}

  updatePlayers(user){
		//Method for updating the players in the game

  }

	updateGame(gameName){
		//Method to update the displayed game name

	}

	renderGameSelection(){
		return (<div className="col">{this.state.gameChoice}</div>)
	}

	renderLaunchGameButton(){
		//Button used to launch the game by the host
		if(this.state.host){
			return (
				<div className="row">
					<div className="col">
						<button className="btn btn-primary">Launch Game</button>
					</div>
				</div>
			)
		}
		else{
			return (
				<div className="row">
					<div className="col">Waiting for host to launch game.</div>
				</div>
			)
		}
	}

	//Create Lobby with a unique game
  render() {
  	return (
      <div>
				<div className="row">
					<div className="col">
		        <h2>Lobby</h2>
		        <h3><a href="#" onClick={this.shareRoomCode()}>Room Code: {this.state.roomCode}</a></h3>
					</div>
					{this.renderGameSelection()}
				</div>
				<div className="row">
					<div className="col">
		        <h5>Players:</h5>
		        <ol>
		          {this.state.players.map((player, indx) =>(
		          	<li key={indx}><span className={!indx?"fa fa-users":"fa fa-user"}> </span> {player.screenName}</li>
		          ))}
		        </ol>
					</div>
				</div>
				{this.renderLaunchGameButton()}
      </div>
    )
  }
}

export default Lobby;
