import React from 'react'
import { Container, Row, Col, Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import { NumericFormat } from 'react-number-format'
import { getRandomMensTeamArray, getConfederationLogo, getTeamFlagName2 } from './core/TeamHelper'
import Page from './core/Page'

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

    componentDidMount() {
        this.getData()
    }

    componentDidUpdate() {
        window.rankingsStore = this.state
    }

    RankingsPageHead = (props) => {
        return (
            <Row className="no-gutters ranking-tbl-header team-row padding-tb-md text-start">
                <Col>
                    <Row className="no-gutters">
                        <Col className="col-box-4"></Col>
                        <Col className="col-box-24 padding-top-sm">Rank</Col>
                        <Col className="col-box-24 padding-top-sm">Team</Col>
                        <Col className="col-box-24 padding-top-sm">Points</Col>
                        <Col className="col-box-24">
                            <UncontrolledDropdown group>
                                <Button color="primary" className="font-custom2">
                                    Confederation
                                </Button>
                                <DropdownToggle caret color="primary" />
                                <DropdownMenu>
                                    <DropdownItem onClick={() => this.filterTeam('All')}>
                                        <img
                                            className="conf-logo-sm margin-bottom-xs-4"
                                            src={'/images/confederation_logos/640px-Flag_of_FIFA.svg.png'}
                                            alt={`FIFA`}
                                        />
                                    </DropdownItem>
                                    <DropdownItem onClick={() => this.filterTeam('AFC')}>
                                        <img
                                            className="conf-logo-sm margin-bottom-xs-4"
                                            src={'/images/confederation_logos/640px-Asian_Football_Confederation_(logo).svg.png'}
                                            alt={`AFC`}
                                        />
                                    </DropdownItem>
                                    <DropdownItem onClick={() => this.filterTeam('CAF')}>
                                        <img
                                            className="conf-logo-sm margin-bottom-xs-4"
                                            src={'/images/confederation_logos/516px-Confederation_of_African_Football_logo.svg.png'}
                                            alt={`CAF`}
                                        />
                                    </DropdownItem>
                                    <DropdownItem onClick={() => this.filterTeam('CONCACAF')}>
                                        <img
                                            className="conf-logo-sm margin-bottom-xs-4"
                                            src={'/images/confederation_logos/552px-Concacaf_logo.svg.png'}
                                            alt={`CONCACAF`}
                                        />
                                    </DropdownItem>
                                    <DropdownItem onClick={() => this.filterTeam('CONMEBOL')}>
                                        <img
                                            className="conf-logo-sm margin-bottom-xs-4"
                                            src={'/images/confederation_logos/555px-CONMEBOL_logo_(2017).svg.png'}
                                            alt={`CONMEBOL`}
                                        />
                                    </DropdownItem>
                                    <DropdownItem onClick={() => this.filterTeam('OFC')}>
                                        <img
                                            className="conf-logo-sm margin-bottom-xs-4"
                                            src={'/images/confederation_logos/640px-Oceania_Football_Confederation_logo.svg.png'}
                                            alt={`OFC`}
                                        />
                                    </DropdownItem>
                                    <DropdownItem onClick={() => this.filterTeam('UEFA')}>
                                        <img
                                            className="conf-logo-sm margin-bottom-xs-4"
                                            src={'/images/confederation_logos/640px-UEFA_logo.svg.png'}
                                            alt={`UEFA`}
                                        />
                                    </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </Col>
                    </Row>
                </Col>
            </Row>
        )
    }

    filterTeam(conf) {
        let result = this.state.allRankings
        if (conf !== 'All') {
            result = this.state.allRankings.filter((t) => t.confederation.id === conf)
        }
        this.setState({ rankings: result })
    }

    render() {
        const { rankings, config } = this.state
        return (
            <Page>
                <Container>
                    <h1 className="h1-ff5 text-center mt-3 mb-3">Rankings: Men's National Teams</h1>
                    <Row className="mt-3 mb-3 text-start rankings-page-box">
                        <Col sm="12" md="12">
                            <section className="rankings section-bg">
                                <div className="container">
                                    {this.RankingsPageHead()}
                                    {rankings.map((r) => (
                                        <Row key={r.id} className="no-gutters ranking-tbl team-row padding-tb-xs text-start">
                                            <Col>
                                                <div className="col-12">
                                                    <div className="box-sm">
                                                        <Row className="no-gutters">
                                                            <Col className="col-box-4"></Col>
                                                            <Col className="col-box-24">{r.rank}</Col>
                                                            <Col className="col-box-24">{getTeamFlagName2(r, config)}</Col>
                                                            <Col className="col-box-24">
                                                                <NumericFormat displayType="text" value={r.points} decimalScale={2} fixedDecimalScale />
                                                            </Col>
                                                            <Col className="col-box-24">{getConfederationLogo(r)}</Col>
                                                        </Row>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    ))}
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
