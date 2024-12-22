import React from 'react'
import { Row, Col } from 'reactstrap'
import moment from 'moment'
import { getTeamFlagName, getConfederationLogo } from '../core/TeamHelper'

const QualifiedHeader = () => {
    return (
        <Row className="no-gutters ranking-tbl-header team-row padding-tb-sm">
            <Col className="col-box-4">No.</Col>
            <Col className="col-box-34">Team</Col>
            <Col className="col-box-8">Conf.</Col>
            <Col className="col-box-34">Method of Qualification</Col>
            <Col className="col-box-20">Date of Qualification</Col>
        </Row>
    )
}

const QualifiedRow = (props) => {
    const { row } = props
    return (
        <Row className="no-gutters ranking-tbl team-row padding-tb-sm">
            <Col className="col-box-4">{row.rank}</Col>
            <Col className="col-box-34">{getTeamFlagName(row)}</Col>
            <Col className="col-box-8">{getConfederationLogo(row)}</Col>
            <Col className="col-box-34">{row.qualification_method}</Col>
            <Col className="col-box-20">{moment(row.qualification_date).format('MMMM D, YYYY')}</Col>
        </Row>
    )
}

class QualifiedTable extends React.Component {
    render() {
        const { state } = this.props
        const { qualifiedTeams, config } = state
        return (
            <React.Fragment>
                <Row className="mt-5 box-xl">
                    <Col xs={{ size: 10, offset: 1 }}>
                        <QualifiedHeader />
                        {qualifiedTeams &&
                            qualifiedTeams.map((r, index) => {
                                r.rank = index + 1
                                return <QualifiedRow key={r.id} rank={index} row={r} config={config} />
                            })}
                    </Col>
                </Row>
            </React.Fragment>
        )
    }
}

export default QualifiedTable
