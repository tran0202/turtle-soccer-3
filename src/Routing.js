import React from 'react'
import { BrowserRouter as Router, Switch, Route, useParams } from 'react-router-dom'
import App from './App'
import SoccerApp from './soccer/SoccerApp'
import CompetitionApp from './soccer/CompetitionApp'
import TournamentApp from './soccer/TournamentApp'
import TennisApp from './TennisApp'
import FootballApp from './FootballApp'
import FSApp from './firestore'
import FSSportApp from './firestore/Sport'
import FSGroupTypeApp from './firestore/GroupType'
import FSGroupApp from './firestore/Group'
import FSCompetitionApp from './firestore/Competition'
import FSTournamentApp from './firestore/tournament/'
import FSConfederationApp from './firestore/Confederation'
import FSNationApp from './firestore/nation/'
import FSTeamApp from './firestore/team/'

function TournamentRoute(props) {
  const page = props.page ? props.page : 'about'
  const qPage = props.qPage ? props.qPage : 'about'
  // console.log('useParams()', useParams())
  const { id, cid } = useParams()
  const _cid = cid ? cid : 'QUALIFIED'
  const query = { id, cid: _cid, page, qPage }
  return <TournamentApp query={query} />
}

function CompetitionRoute(props) {
  const page = props.page ? props.page : 'about'
  const { id } = useParams()
  const query = { id, page }
  return <CompetitionApp query={query} />
}

export default function Routing() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" children={<App />} />
        <Route exact path="/soccer" children={<SoccerApp />} />
        <Route exact path="/soccer/competition/:id" children={<CompetitionRoute />} />
        <Route path="/soccer/competition/:id/alltimestandings" children={<CompetitionRoute page="alltimestandings" />} />
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
        <Route path="/admin/competition" children={<FSCompetitionApp />} />
        <Route exact path="/admin/tournament" children={<FSTournamentApp />} />
        <Route exact path="/admin/confederation" children={<FSConfederationApp />} />
        <Route exact path="/admin/nation" children={<FSNationApp />} />
        <Route exact path="/admin/team" children={<FSTeamApp />} />
      </Switch>
    </Router>
  )
}
