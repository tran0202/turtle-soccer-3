import React from 'react'
import { BrowserRouter as Router, Switch, Route, useParams } from 'react-router-dom'
import App from '../App'
import RankingsApp from '../RankingsApp'
import ImagineApp from '../ImagineApp'
import OrganizationApp from '../OrganizationApp'
import CompetitionApp from '../CompetitionApp'
import TournamentApp from '../TournamentApp'

function CompetitionRoute(props) {
    const { id } = useParams()
    const query = { id }
    return <CompetitionApp query={query} />
}

function TournamentRoute(props) {
    const { id } = useParams()
    const query = { id }
    return <TournamentApp query={query} />
}

export default function Routing() {
    return (
        <Router>
            <Switch>
                <Route exact path="/" children={<App />} />
                <Route exact path="/rankings" children={<RankingsApp />} />
                <Route exact path="/imagine" children={<ImagineApp />} />
                <Route exact path="/organization" children={<OrganizationApp />} />
                <Route exact path="/competition/:id" children={<CompetitionRoute />} />
                <Route exact path="/tournament/:id" children={<TournamentRoute />} />
            </Switch>
        </Router>
    )
}
