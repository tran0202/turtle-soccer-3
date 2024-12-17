import React from 'react'
import { Row, Col, Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import { NumericFormat } from 'react-number-format'
import { getConfederationLogo, getTeamFlagName } from '../core/TeamHelper'

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

const filterTeam = (conf, state, func) => {
    const { allRankings } = state
    let result = allRankings
    if (conf !== 'FIFA') {
        result = allRankings.filter((t) => t.confederation.id === conf)
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

class RankingsTable extends React.Component {
    render() {
        const { state, func } = this.props
        const { rankings, config } = state
        return (
            <React.Fragment>
                <RankingsHeader state={state} func={func} />
                {rankings.map((r) => (
                    <RankingsRow key={r.id} ranking={r} config={config} />
                ))}
            </React.Fragment>
        )
    }
}

export default RankingsTable
