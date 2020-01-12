import React from 'react';

class HostGame extends React.Component{
	constructor(props){
  	super(props)

    this.state ={
    	roomCode:(Math.random().toString(36).substring(2, 10).toUpperCase()),
    	players:[
      	{screenName:window.localStorage.avatar}
      ]
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

export default HostGame;
