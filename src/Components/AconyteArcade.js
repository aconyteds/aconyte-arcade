import React from 'react';
import ReactDOM from 'react-dom';
import JoinGame from './JoinGame';
import Lobby from './Lobby';

class AconyteArcade extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    	screenName:(window.localStorage.avatar||""),
    	menuOptions:[
      	{label:"Create Game", action:"hostGame"},
        {label:"Join Game", action:"joinGame"}
      ]
    }
     this.screenNameChange = this.screenNameChange.bind(this);
    this.handleAction = this.handleAction.bind(this);
  }

  screenNameChange(event){
    this.setState({screenName:event.target.value});
  }

  handleAction(action){
    	window.localStorage.avatar = this.state.screenName;
      //Perform the action
      switch(action){
      	case "hostGame":
        	ReactDOM.render(<Lobby roomCode={Math.random().toString(36).substring(2, 10).toUpperCase()} />, document.getElementById('root'));
          break;
        case "joinGame":
        default:
        	ReactDOM.render(<JoinGame />, document.getElementById('root'));
          break;
      }
    }

  render() {


    return (
      <div>
        <h2>Aconyte DS Arcade</h2>
        <label htmlFor="avatarName">Screen Name:</label>
        <input type="text" id="avatarName" defaultValue={this.state.screenName} onChange={this.screenNameChange}/>
        <div>{this.state.menuOptions.map((option, indx) =>(
        	<button type="button" className="btn btn-primary" key={indx} onClick={()=>this.handleAction(option.action)}>{option.label}</button>
        ))}</div>
      </div>
    )
  }
}

export default AconyteArcade;
