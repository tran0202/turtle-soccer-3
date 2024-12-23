import React, { useState } from 'react'
import { Container, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import classnames from 'classnames'
import { getTournament, getTournamentData } from './core/TeamHelper'
import Page from './core/Page'
import Header from './tournament/Header'
import Awards from './tournament/Awards'

const TournamentTabs = (props) => {
    const { tournament, config } = props
    const [activeTab, setActiveTab] = useState('Awards')
    const toggle = (tab) => {
        if (activeTab !== tab) setActiveTab(tab)
    }

    return (
        <React.Fragment>
            <Nav tabs className="mt-4 mb-4">
                <NavItem>
                    <NavLink
                        className={classnames({ active: activeTab === 'Awards' })}
                        onClick={() => {
                            toggle('Awards')
                        }}
                    >
                        Awards
                    </NavLink>
                </NavItem>
            </Nav>
            <TabContent activeTab={activeTab}>
                <TabPane tabId="Awards">
                    <Awards tournament={tournament} config={config} />
                </TabPane>
            </TabContent>
        </React.Fragment>
    )
}

class TournamentApp extends React.Component {
    constructor(props) {
        super(props)
        document.title = 'Tournament - Turtle Soccer'

        this.state = {
            tournament: {},
            config: { details: {}, hero_images: [], competition: { tournaments: [] }, previous_tournament: {}, next_tournament: {} },
        }
    }

    getPreviousTournament = (tournaments, current_id) => {
        const current_tournament_index = tournaments.findIndex((t) => t.id === current_id)
        return current_tournament_index !== -1 && current_tournament_index !== 0
            ? { id: tournaments[current_tournament_index - 1].id, year: tournaments[current_tournament_index - 1].year }
            : {}
    }

    getNextTournament = (tournaments, current_id) => {
        const current_tournament_index = tournaments.findIndex((t) => t.id === current_id)
        return current_tournament_index !== -1 && current_tournament_index !== tournaments.length - 1
            ? { id: tournaments[current_tournament_index + 1].id, year: tournaments[current_tournament_index + 1].year }
            : {}
    }

    getData = () => {
        const id = this.props.query.id
        const tournament = getTournament(id)
        tournament.previous_tournament = this.getPreviousTournament(tournament.competition.tournaments, id)
        tournament.next_tournament = this.getNextTournament(tournament.competition.tournaments, id)
        this.setState({ tournament: getTournamentData(id), config: tournament })
    }

    setData = (rankings) => {
        this.setState({ rankings })
    }

    componentDidMount() {
        this.getData()
    }

    componentDidUpdate() {
        window.tournamentStore = this.state
    }

    render() {
        return (
            <Page>
                <Container>
                    <Header tournament={this.state.tournament} config={this.state.config} />
                    <TournamentTabs tournament={this.state.tournament} config={this.state.config} />
                </Container>
            </Page>
        )
    }
}

export default TournamentApp
