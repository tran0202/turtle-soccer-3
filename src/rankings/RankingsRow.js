import React from 'react'
import { Row, Col } from 'reactstrap'
import { NumericFormat } from 'react-number-format'
import { getConfederationLogo, getTeamFlagName } from '../core/TeamHelper'

class RankingRow extends React.Component {
    render() {
        const { ranking, config } = this.props
        return (
            <Row className="no-gutters ranking-tbl team-row padding-tb-xs text-start">
                <Col>
                    <div className="col-12">
                        <div className="box-sm">
                            <Row className="no-gutters">
                                <Col className="col-box-4"></Col>
                                <Col className="col-box-14">{ranking.rank}</Col>
                                <Col className="col-box-34">{getTeamFlagName(ranking, config)}</Col>
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
}

export default RankingRow
