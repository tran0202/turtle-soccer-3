import React from 'react'
import { Container, Row, Col, Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import { NumericFormat } from 'react-number-format'
import { getActiveTeams, getRandomRankings, getConfederations, getTeamFlagName, getConfederationLogo } from './core/TeamHelper'
import Page from './core/Page'

class TournamentApp extends React.Component {
    constructor(props) {
        super(props)
        document.title = 'Tournament - Turtle Soccer'

        this.state = { rankings: [], config: { confederations: [], all_rankings: [] } }
    }

    getData = () => {
        // const teamTypeId = 'MNT'
        // const teamArray = getActiveTeams(teamTypeId)
        // const allRankings = getRandomRankings(teamArray)
        // this.setState({ rankings: allRankings, config: { confederations: getConfederations(), all_rankings: allRankings, team_type_id: teamTypeId } })
    }

    setData = (rankings) => {
        this.setState({ rankings })
    }

    componentDidMount() {
        this.getData()
    }

    componentDidUpdate() {
        window.rankingsStore = this.state
    }

    render() {
        return (
            <Page>
                <Container>
                    <h1 className="h1-ff5 text-center mt-3 mb-3">*** Tournament ***</h1>
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
