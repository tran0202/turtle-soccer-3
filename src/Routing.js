import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import App from './App'
import TennisApp from './TennisApp'
import FootballApp from './FootballApp'
import FirestoreApp from './firestore/Sport'

export default function Routing() {
  return (
    <Router>
      <Switch>
          <Route exact path="/">
            <App />
          </Route>
          <Route path="/tennis">
            <TennisApp />
          </Route>
          <Route path="/football">
            <FootballApp />
          </Route>
          <Route path="/admin">
            <FirestoreApp />
          </Route>
        </Switch>
    </Router>
  );
}
