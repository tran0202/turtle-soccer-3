import React from 'react'
import { Container, Row, Col } from 'reactstrap'
import { getRandomMensTeamArray } from './core/TeamHelper'
import Page from './core/Page'
import Table from './ranking/Table'

class RankingsApp extends React.Component {
    constructor(props) {
        super(props)
        document.title = 'Rankings - Turtle Soccer'

        this.state = { allRankings: [], rankings: [], config: { team_type_id: 'MNT' } }
    }

    getData = () => {
        const allRankings = getRandomMensTeamArray()
        this.setState({ allRankings, rankings: allRankings })
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
                    <h1 className="h1-ff5 text-center mt-3 mb-3">Rankings: Men's National Teams</h1>
                    <Row className="mt-3 mb-3 text-start rankings-page-box">
                        <Col sm="12" md="12">
                            <section className="rankings section-bg">
                                <div className="container">
                                    <Table state={this.state} func={this.setData} />
                                </div>
                            </section>
                        </Col>
                    </Row>
                </Container>
            </Page>
        )
    }
}

export default RankingsApp
