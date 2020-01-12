import React from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";

const client = new W3CWebSocket("ws://localhost:8000");

class JoinGame extends React.Component{
  componentDidMount(){
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    client.onmessage = (message) => {
      console.log(message);
    };
  }
  
	constructor(props){
  	super(props)
    this.state = {
    	screenName:window.localStorage.avatar,
      roomCode:""
    }
    this.screenNameChange = this.screenNameChange.bind(this);
    this.roomCodeChange = this.roomCodeChange.bind(this);
    this.joinGame = this.joinGame.bind(this);
  }

  screenNameChange(event){
  	this.setState({screenName:event.target.value});
  }

  roomCodeChange(event){
  	this.setState({roomCode:event.target.value});
  }

  joinGame(){
  	console.log(this.state)
  }

	render() {
  	return (
    	<div>
    	  <form>
          <div>
            <label htmlFor="screenName">Screen Name:</label>
            <input type="text" id="screenName" defaultValue={this.state.screenName} onChange={this.screenNameChange}/>
          </div>
    	    <div>
    	      <label htmlFor="roomCode">Room Code:</label>
            <input type="text" id="roomCode" onChange={this.roomCodeChange}/>
    	    </div>
          <button type="button" onClick={this.joinGame}>Join Game</button>
    	  </form>
    	</div>
    )
  }
}

export default JoinGame;
