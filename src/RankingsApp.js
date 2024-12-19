import React from 'react'
import { Container, Row, Col, Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import { NumericFormat } from 'react-number-format'
import { getActiveTeams, getRandomRankings, getConfederations, getTeamFlagName, getConfederationLogo } from './core/TeamHelper'
import Page from './core/Page'

const RankingsRow = (props) => {
    const { ranking } = props
    return (
        <Row className="no-gutters ranking-tbl team-row padding-tb-xs text-start">
            <Col>
                <div className="col-12">
                    <div className="box-sm">
                        <Row className="no-gutters">
                            <Col className="col-box-4"></Col>
                            <Col className="col-box-14">{ranking.rank}</Col>
                            <Col className="col-box-34">{getTeamFlagName(ranking)}</Col>
                            <Col className="col-box-24">
                                <NumericFormat displayType="text" value={ranking.points} decimalScale={2} fixedDecimalScale />
                            </Col>
                            <Col className="col-box-24">{getConfederationLogo(ranking)}</Col>
                        </Row>
                    </div>
                </div>
            </Col>
        </Row>
    )
}

const filterTeam = (confederation_id, state, func) => {
    const { config } = state
    const { all_rankings } = config
    let result = all_rankings
    if (confederation_id !== 'FIFA') {
        result = all_rankings.filter((t) => t.confederation.id === confederation_id)
    }
    func(result)
}

const RankingsHeader = (props) => {
    const { state, func } = props
    const { config } = state
    const { confederations } = config
    return (
        <Row className="no-gutters ranking-tbl-header team-row padding-tb-md text-start">
            <Col>
                <Row className="no-gutters">
                    <Col className="col-box-4"></Col>
                    <Col className="col-box-14 padding-top-sm">Rank</Col>
                    <Col className="col-box-34 padding-top-sm">Team</Col>
                    <Col className="col-box-24 padding-top-sm">Points</Col>
                    <Col className="col-box-24">
                        <UncontrolledDropdown group>
                            <Button color="primary" className="font-custom2">
                                Confederation
                            </Button>
                            <DropdownToggle caret color="primary" />
                            <DropdownMenu>
                                {confederations &&
                                    confederations.map((c) => {
                                        return (
                                            <DropdownItem key={c.id} onClick={() => filterTeam(c.id, state, func)}>
                                                <img
                                                    className="conf-logo-sm margin-bottom-xs-4"
                                                    src={`/images/confederation_logos/${c.logo_filename}`}
                                                    alt={c.id}
                                                />
                                            </DropdownItem>
                                        )
                                    })}
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

const RankingsTable = (props) => {
    const { state, func } = props
    const { rankings } = state
    return (
        <React.Fragment>
            <RankingsHeader state={state} func={func} />
            {rankings.map((r) => (
                <RankingsRow key={r.id} ranking={r} />
            ))}
        </React.Fragment>
    )
}

class RankingsApp extends React.Component {
    constructor(props) {
        super(props)
        document.title = 'Rankings - Turtle Soccer'

        this.state = { rankings: [], config: { confederations: [], all_rankings: [] } }
    }

    getData = () => {
        const teamTypeId = 'MNT'
        const teamArray = getActiveTeams(teamTypeId)
        const allRankings = getRandomRankings(teamArray)
        this.setState({ rankings: allRankings, config: { confederations: getConfederations(), all_rankings: allRankings, team_type_id: teamTypeId } })
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
