import React from 'react'
import { BrowserRouter as Router, Switch, Route, useParams } from 'react-router-dom'
import App from '../App'
import RankingsApp from '../RankingsApp'
import WorldCupApp from '../WorldCupApp'
import OrganizationApp from '../OrganizationApp'
import CompetitionApp from '../CompetitionApp'

function CompetitionRoute(props) {
    const { id } = useParams()
    const query = { id }
    return <CompetitionApp query={query} />
}

export default function Routing() {
    return (
        <Router>
            <Switch>
                <Route exact path="/" children={<App />} />
                <Route exact path="/rankings" children={<RankingsApp />} />
                <Route exact path="/worldcup" children={<WorldCupApp />} />
                <Route exact path="/organization" children={<OrganizationApp />} />
                <Route exact path="/competition/:id" children={<CompetitionRoute />} />
            </Switch>
        </Router>
    )
}
