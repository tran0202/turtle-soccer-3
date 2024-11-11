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
                                    {/* <DropdownItem onClick={() => this.filterTeam('AFC')}>
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
                                    </DropdownItem> */}
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
