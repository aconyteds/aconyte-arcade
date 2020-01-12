import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/scss/font-awesome.scss';
import './index.scss';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import AconyteArcade from './Components/AconyteArcade';
import Lobby from './Components/Lobby';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <Router>
    <div>
      <Route exact path="/">
        <AconyteArcade />
      </Route>
      <Route path="/join/:roomCode" component={Lobby} />
    </div>
  </Router>
  , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
