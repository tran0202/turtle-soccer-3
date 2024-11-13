import React from 'react'
import { Row, Col } from 'reactstrap'

class DrawRankingsHeader extends React.Component {
    render() {
        const { name } = this.props
        return (
            <React.Fragment>
                <Row className="no-gutters ranking-tbl-header team-row padding-tb-sm text-start">
                    <Col className="col-box-5"></Col>
                    <Col className="col-box-75">Pot {name}</Col>
                </Row>
                <Row className="no-gutters ranking-tbl-header-light team-row padding-tb-xs text-start">
                    <Col className="col-box-5"></Col>
                    <Col className="col-box-14">Rank</Col>
                    <Col className="col-box-75">Team (Overall Rank)</Col>
                </Row>
            </React.Fragment>
        )
    }
}

export default DrawRankingsHeader
