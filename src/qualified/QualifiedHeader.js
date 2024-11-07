import React from 'react'
import { Row, Col } from 'reactstrap'

class QualifiedHeader extends React.Component {
    render() {
        return (
            <Row className="no-gutters ranking-tbl-header team-row padding-tb-sm">
                <Col className="col-box-4"></Col>
                <Col className="col-box-14">No.</Col>
                <Col className="col-box-34">Team</Col>
                <Col className="col-box-24">Method of Qualification</Col>
                <Col className="col-box-24">Date of Qualification</Col>
            </Row>
        )
    }
}

export default QualifiedHeader
