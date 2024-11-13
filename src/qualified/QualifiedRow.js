import React from 'react'
import { Row, Col } from 'reactstrap'
import moment from 'moment'
import { getTeamFlagName } from '../core/TeamHelper'

class QualifiedRow extends React.Component {
    render() {
        const { row, config } = this.props
        return (
            <Row className="no-gutters ranking-tbl team-row padding-tb-sm">
                <Col className="col-box-4"></Col>
                <Col className="col-box-14">{row.rank}</Col>
                <Col className="col-box-34">{getTeamFlagName(row, config)}</Col>
                <Col className="col-box-24">{row.qualificationMethod}</Col>
                <Col className="col-box-24">{moment(row.qualificationDate).format('MMMM D, YYYY')}</Col>
            </Row>
        )
    }
}

export default QualifiedRow
