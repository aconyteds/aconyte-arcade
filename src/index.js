import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/scss/font-awesome.scss';
import './index.scss';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import AconyteArcade from './Components/AconyteArcade';
import JoinGame from './Components/JoinGame';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <Router>
    <div className="container">
      <div className="jumbotron">
        <h2><a href="/">Aconyte DS Arcade</a></h2>
      </div>
      <div className="row">
        <div className="col" id="mainContainer">
          <Route exact path="/">
              <AconyteArcade />
          </Route>
          <Route exact path="/:roomCode" render={(props) =>(
            <AconyteArcade {...props} displayMode="hostGame" /> )} />
          <Route path="/join/:roomCode" component={JoinGame} />
        </div>
      </div>
    </div>
  </Router>
  , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
