import React from 'react'
import { Row, Col } from 'reactstrap'
import { getTeamFlagName } from '../core/TeamHelper'

class DrawRankingRow extends React.Component {
    render() {
        const { ranking, config } = this.props
        return (
            <Row className="no-gutters ranking-tbl team-row padding-tb-xs text-start">
                <Col>
                    <div className="col-12">
                        <div className={`box-sm ${ranking.qualStriped ? 'ltblue-striped' : ''}`}>
                            <Row className="no-gutters">
                                <Col className="col-box-5"></Col>
                                <Col className="col-box-14">{ranking.confRank}</Col>
                                <Col className="col-box-75">
                                    {getTeamFlagName(ranking, config)} ({ranking.rank})
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Col>
            </Row>
        )
    }
}

export default DrawRankingRow
