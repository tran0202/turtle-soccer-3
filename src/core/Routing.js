import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import App from '../App'
import RankingsApp from '../RankingsApp'
import WorldCupApp from '../WorldCupApp'
import OrganizationApp from '../OrganizationApp'

export default function Routing() {
    return (
        <Router>
            <Switch>
                <Route exact path="/" children={<App />} />
                <Route exact path="/rankings" children={<RankingsApp />} />
                <Route exact path="/worldcup" children={<WorldCupApp />} />
                <Route exact path="/organization" children={<OrganizationApp />} />
            </Switch>
        </Router>
    )
}
