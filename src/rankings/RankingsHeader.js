import React from 'react'
import { Row, Col, Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'

class RankingsHeader extends React.Component {
    filterTeam(conf) {
        const { state, func } = this.props
        const { allRankings } = state
        let result = allRankings
        if (conf !== 'FIFA') {
            result = allRankings.filter((t) => t.confederation.id === conf)
        }
        func(result)
    }

    render() {
        const { state } = this.props
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
                                                <DropdownItem key={c.id} onClick={() => this.filterTeam(c.id)}>
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
}

export default RankingsHeader
