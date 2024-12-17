import React from 'react'
import { Container, Row, Col } from 'reactstrap'
import { getActiveFIFATeamArray, getRandomMensTeamArray, getConfederations } from './core/TeamHelper'
import Page from './core/Page'
import RankingsTable from './rankings/RankingsTable'

class RankingsApp extends React.Component {
    constructor(props) {
        super(props)
        document.title = 'Rankings - Turtle Soccer'

        this.state = { allRankings: [], rankings: [], config: { team_type_id: 'MNT', confederations: [] } }
    }

    getData = () => {
        const teamArray = getActiveFIFATeamArray()
        const allRankings = getRandomMensTeamArray(teamArray)
        this.setState({ allRankings, rankings: allRankings, config: { ...this.state.config, confederations: getConfederations() } })
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
                    <h1 className="h1-ff5 text-center mt-3 mb-3">*** Men's National Teams World Rankings ***</h1>
                    <Row className="mt-3 mb-3 text-start rankings-page-box">
                        <Col sm="12" md="12">
                            <div className="container">
                                <RankingsTable state={this.state} func={this.setData} />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </Page>
        )
    }
}

export default RankingsApp
