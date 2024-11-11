import React from 'react'
import { Row, Col } from 'reactstrap'
import { getTeamFlagName2 } from '../core/TeamHelper'

class QualificationRankingRow extends React.Component {
    render() {
        const { ranking, config } = this.props
        return (
            <Row className="no-gutters ranking-tbl team-row padding-tb-xs text-start">
                <Col>
                    <div className="col-12">
                        <div className={`box-sm ${ranking.qualStriped ? 'ltblue-striped' : ''}`}>
                            <Row className="no-gutters">
                                <Col className="col-box-4"></Col>
                                <Col className="col-box-14">{ranking.confRank}</Col>
                                <Col className="col-box-34">
                                    {getTeamFlagName2(ranking, config)} ({ranking.rank})
                                </Col>
                                <Col className="col-box-24">{ranking.qualRound}</Col>
                                <Col className="col-box-24">{ranking.qualPot}</Col>
                            </Row>
                        </div>
                    </div>
                </Col>
            </Row>
        )
    }
}

export default QualificationRankingRow
