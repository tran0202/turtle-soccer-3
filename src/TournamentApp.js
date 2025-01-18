import React, { useState } from 'react'
import { Container, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import classnames from 'classnames'
import { getTournament } from './core/TournamentHelper'
import Page from './core/Page'
import Header from './tournament/Header'
import Awards from './tournament/Awards'
import RoundRobin from './tournament/RoundRobin'

const TournamentTabs = (props) => {
    const { tournament, config } = props
    const { stages } = tournament
    const first_final_stage = stages && stages.length > 0 ? stages[0].name : 'Group Stage'
    const [activeTab, setActiveTab] = useState(first_final_stage)
    const toggle = (tab) => {
        if (activeTab !== tab) setActiveTab(tab)
    }

    return (
        <React.Fragment>
            <Nav tabs className="mt-4 mb-4">
                {stages &&
                    stages.map((s) => {
                        return (
                            <NavLink
                                key={s.name}
                                className={classnames({ active: activeTab === s.name })}
                                onClick={() => {
                                    toggle(s.name)
                                }}
                            >
                                {s.name}
                            </NavLink>
                        )
                    })}
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
                {stages &&
                    stages.map((s) => {
                        return (
                            <TabPane key={s.name} tabId={s.name}>
                                {s.type === 'roundrobin_final' && <RoundRobin stage={s} config={config} />}
                            </TabPane>
                        )
                    })}
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

        this.state = {
            tournament: {},
            config: {
                details: { host: [] },
                hero_images: [],
                competition: { tournaments: [], team_type_id: '' },
                previous_tournament: {},
                next_tournament: {},
                statistics: {},
                final_standings: {},
                awards: {
                    golden_boot: [],
                    silver_boot: [],
                    bronze_boot: [],
                    golden_ball: [],
                    best_young_player: {},
                    golden_glove: [],
                    fair_play_team: [],
                    award_category_highlighted: [],
                },
            },
        }
    }

    getData = () => {
        const id = this.props.query.id
        this.setState(getTournament(id))
    }

    setData = () => {
        this.setState()
    }

    componentDidMount() {
        this.getData()
    }

    componentDidUpdate() {
        const { config } = this.state
        document.title = config.name + ' Tournament - Turtle Soccer'
        window.tournamentStore = this.state
    }

    render() {
        return (
            <Page>
                <Container>
                    <Header tournament={this.state.tournament} config={this.state.config} />
                    {this.state.tournament.stages && <TournamentTabs tournament={this.state.tournament} config={this.state.config} />}
                </Container>
            </Page>
        )
    }
}

export default TournamentApp
