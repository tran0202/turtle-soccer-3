import React from 'react'
import { Container, Row, Col, Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import { getTournament, getTournamentData } from './core/TeamHelper'
import Page from './core/Page'
import Header from './tournament/Header'

class TournamentApp extends React.Component {
    constructor(props) {
        super(props)
        document.title = 'Tournament - Turtle Soccer'

        this.state = { tournament: {}, config: { details: {}, competition: { tournaments: [] }, previous_tournament: {}, next_tournament: {} } }
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
                    {/* <h1 className="h1-ff5 text-center mt-3 mb-3">*** Tournament ***</h1> */}
                    {/* <Row className="mt-3 mb-3 text-start rankings-page-box">
                        <Col sm="12" md="12">
                            <div className="container">
                                <RankingsTable state={this.state} func={this.setData} />
                            </div>
                        </Col>
                    </Row> */}
                </Container>
            </Page>
        )
    }
}

export default TournamentApp
