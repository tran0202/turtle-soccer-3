import React from 'react'
import { BrowserRouter as Router, Switch, Route, useParams } from 'react-router-dom'
import App from './App'
import SoccerApp from './soccer/SoccerApp'
import TournamentApp from './soccer/TournamentApp'
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

function TournamentRoute(props) {
  const page = props.page ? props.page : 'intro'
  const qPage = props.qPage ? props.qPage : 'intro'
  // console.log('useParams()', useParams())
  const { id, cid } = useParams()
  const _cid = cid ? cid : 'QUALIFIED'
  const query = { id, cid: _cid, page, qPage }
  return <TournamentApp query={query} />
}

export default function Routing() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" children={<App />} />
        <Route exact path="/soccer" children={<SoccerApp />} />
        <Route exact path="/soccer/tournament/:id" children={<TournamentRoute />} />
        <Route path="/soccer/tournament/:id/matches" children={<TournamentRoute page="matches" />} />
        <Route path="/soccer/tournament/:id/groups" children={<TournamentRoute page="groups" />} />
        <Route path="/soccer/tournament/:id/finalstandings" children={<TournamentRoute page="finalstandings" />} />
        <Route exact path="/soccer/tournament/:id/qualification" children={<TournamentRoute page="qualification" />} />
        <Route exact path="/soccer/tournament/:id/qualification/:cid" children={<TournamentRoute page="qualification" />} />
        <Route path="/soccer/tournament/:id/qualification/:cid/matches" children={<TournamentRoute page="qualification" qPage="matches" />} />
        <Route path="/soccer/tournament/:id/qualification/:cid/groups" children={<TournamentRoute page="qualification" qPage="groups" />} />
        <Route path="/soccer/tournament/:id/qualification/:cid/standings" children={<TournamentRoute page="qualification" qPage="standings" />} />
        <Route path="/tennis" children={<TennisApp />} />
        <Route path="/football" children={<FootballApp />} />
        <Route exact path="/admin" children={<FSApp />} />
        <Route path="/admin/sport" children={<FSSportApp />} />
        <Route path="/admin/group_type" children={<FSGroupTypeApp />} />
        <Route exact path="/admin/group" children={<FSGroupApp />} />
        <Route path="/admin/tournament_type" children={<FSTournamentTypeApp />} />
        <Route exact path="/admin/tournament" children={<FSTournamentApp />} />
        <Route exact path="/admin/nation" children={<FSNationApp />} />
        <Route exact path="/admin/team" children={<FSTeamApp />} />
      </Switch>
    </Router>
  )
}
