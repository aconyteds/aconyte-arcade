import React from 'react';
import JoinGame from './JoinGame';
import Lobby from './Lobby';

class AconyteArcade extends React.Component {
  constructor(props) {
    super(props)
    var roomCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    if(!!props.match && !!props.match.params){
      roomCode = props.match.params.roomCode
    }
    console.log(props);
    this.state = {
      displayMode:props.displayMode||"default",
      host:false,
      roomCode:roomCode,
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

  handleAction(action, host){
  	window.localStorage.avatar = this.state.screenName;
    //Perform the action
    switch(action){
    	case "hostGame":
        this.setState({
          displayMode:action,
          host:true
        });
        break;
      case "joinGame":
      default:
        this.setState({
          displayMode:"joinGame"
        });
        break;
    }
  }

  DisplayMode(){
    switch(this.state.displayMode){
      case "hostGame":
        return (<Lobby roomCode={this.state.roomCode} host={this.state.host} />)
      case "joinGame":
        return (<JoinGame />)
      case "default":
      default:
        return (<div id="mainContainer">
          <div className="row">
            <div className="col input-group align-middle">
              <label htmlFor="avatarName">Screen Name:</label>
              <input type="text" id="avatarName" defaultValue={this.state.screenName} onChange={this.screenNameChange}/>
            </div>
          </div>
          <div className="row align-items-center" style={{marginTop:"10px"}}>{this.state.menuOptions.map((option, indx) =>(
            <div className="col" key={indx}><button type="button" className="btn btn-primary"  onClick={()=>this.handleAction(option.action)}>{option.label}</button></div>
          ))}</div>
        </div>)
    }
  }

  render() {


    return (
      <div>
        <div>
          {this.DisplayMode()}
        </div>
      </div>
    )
  }
}

export default AconyteArcade;
