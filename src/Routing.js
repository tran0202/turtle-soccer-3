import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import App from './App'

export default function Routing() {
    return (
        <Router>
            <Switch>
                <Route exact path="/" children={<App />} />
            </Switch>
        </Router>
    )
}
