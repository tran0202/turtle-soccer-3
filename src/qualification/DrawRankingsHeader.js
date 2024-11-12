import React from 'react'
import { Row, Col } from 'reactstrap'

class DrawRankingsHeader extends React.Component {
    render() {
        return (
            <Row className="no-gutters ranking-tbl-header team-row padding-tb-md text-start">
                <Col>
                    <Row className="no-gutters">
                        <Col className="col-box-4"></Col>
                        <Col className="col-box-14 padding-top-sm">Rank</Col>
                        <Col className="col-box-34 padding-top-sm">Team (Overall Rank)</Col>
                        <Col className="col-box-24 padding-top-sm">Round</Col>
                        <Col className="col-box-24 padding-top-sm">Pot</Col>
                    </Row>
                </Col>
            </Row>
        )
    }
}

export default DrawRankingsHeader
