import React from 'react';
import ReactDOM from 'react-dom';
import $ from "jquery";
import Lobby from './Lobby';

class JoinGame extends React.Component{
  componentDidMount(){
  }

	constructor(props){
  	super(props)
    var lobbyData = props;
    if(!!props.match){
      lobbyData = props.match.params;
    }

    this.state = {
    	screenName:window.localStorage.avatar,
      roomCode:lobbyData.roomCode
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
    $.get({
			url:"//localhost:8000/join/"+this.state.roomCode,
			crossDomain:true,
			success:(response)=>{
        console.log(response);
				//Check the response for information
				if(response && (!!response.port && !! response.roomCode)){
					//setup the WS connection
          window.location.replace(window.location.origin+"/"+response.roomCode);
				}
				else{
					//TODO:: Come up with something better than this
					alert(response);
				}
			}
    });
  }

	render() {
  	return (
    	<div>
    	  <form>
          <div className="row">
            <div className="col">
              <div className="input-group">
                <label htmlFor="screenName">Screen Name:</label>
                <input type="text" id="screenName" defaultValue={this.state.screenName} onChange={this.screenNameChange}/>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div className="input-group">
        	      <label htmlFor="roomCode">Room Code:</label>
                <input type="text" id="roomCode" onChange={this.roomCodeChange} defaultValue={this.state.roomCode}/>
        	    </div>
            </div>
          </div>
          <div className="row">
            <div className="col center">
              <button type="button" className="btn btn-primary" onClick={this.joinGame}>Join Game</button>
            </div>
          </div>
    	  </form>
    	</div>
    )
  }
}

export default JoinGame;
