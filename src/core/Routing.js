import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import App from '../App'
import RankingsApp from '../RankingsApp'
import WorldCupApp from '../WorldCupApp'

export default function Routing() {
    return (
        <Router>
            <Switch>
                <Route exact path="/" children={<App />} />
                <Route exact path="/rankings" children={<RankingsApp />} />
                <Route exact path="/worldcup" children={<WorldCupApp />} />
            </Switch>
        </Router>
    )
}
