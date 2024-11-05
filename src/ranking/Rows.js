import React from 'react'
import { Row, Col } from 'reactstrap'
import { NumericFormat } from 'react-number-format'
import { getConfederationLogo, getTeamFlagName2 } from '../core/TeamHelper'

class Rows extends React.Component {
    render() {
        const { state } = this.props
        const { rankings, config } = state
        return (
            <React.Fragment>
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
            </React.Fragment>
        )
    }
}

export default Rows
