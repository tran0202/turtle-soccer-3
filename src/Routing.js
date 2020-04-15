import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import App from './App'
import SoccerApp from './SoccerApp'
import TennisApp from './TennisApp'
import FootballApp from './FootballApp'
import FSApp from './firestore'
import FSSportApp from './firestore/Sport'
import FSGroupTypeApp from './firestore/GroupType'
import FSGroupApp from './firestore/Group'
import FSTournamentTypeApp from './firestore/TournamentType'
import FSTournamentApp from './firestore/tournament/'
import FSNationApp from './firestore/nation/'
import FSTeamApp from './firestore/team/'

export default function Routing() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <App />
        </Route>
        <Route path="/soccer">
          <SoccerApp />
        </Route>
        <Route path="/tennis">
          <TennisApp />
        </Route>
        <Route path="/football">
          <FootballApp />
        </Route>
        <Route exact path="/admin">
          <FSApp />
        </Route>
        <Route path="/admin/sport">
          <FSSportApp />
        </Route>
        <Route path="/admin/group_type">
          <FSGroupTypeApp />
        </Route>
        <Route exact path="/admin/group">
          <FSGroupApp />
        </Route>
        <Route path="/admin/tournament_type">
          <FSTournamentTypeApp />
        </Route>
        <Route exact path="/admin/tournament">
          <FSTournamentApp />
        </Route>
        <Route exact path="/admin/nation">
          <FSNationApp />
        </Route>
        <Route exact path="/admin/team">
          <FSTeamApp />
        </Route>
      </Switch>
    </Router>
  )
}
