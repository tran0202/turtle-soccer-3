import React from 'react'
import { Row, Col } from 'reactstrap'
import { getTeamFlag } from '../core/TeamHelper'

const RankingsHeader = () => {
    return (
        <Row className="no-gutters ranking-tbl-header team-row padding-tb-md text-center">
            <Col className="col-box-5"></Col>
            <Col className="col-box-95">
                <Row className="no-gutters">
                    <Col className="col-box-10"></Col>
                    <Col className="col-box-34"></Col>
                    <Col className="col-box-7">MP</Col>
                    <Col className="col-box-7">W</Col>
                    <Col className="col-box-7">D</Col>
                    <Col className="col-box-7">L</Col>
                    <Col className="col-box-7">GF</Col>
                    <Col className="col-box-7">GA</Col>
                    <Col className="col-box-7">+/-</Col>
                    <Col className="col-box-7">Pts</Col>
                </Row>
            </Col>
        </Row>
    )
}

const RakingsRow = (props) => {
    const { ranking, config } = props
    return (
        <Row className="no-gutters ranking-tbl team-row padding-tb-sm">
            <Col className="col-box-5"></Col>
            <Col className="col-box-95">
                <Row className="no-gutters">
                    <Col className="col-box-10">{getTeamFlag(ranking.team, config)}</Col>
                    <Col className="col-box-34">{ranking.team.name}</Col>
                    <Col className="col-box-7">{ranking.mp}</Col>
                    <Col className="col-box-7">{ranking.w}</Col>
                    <Col className="col-box-7">{ranking.d}</Col>
                    <Col className="col-box-7">{ranking.l}</Col>
                    <Col className="col-box-7">{ranking.gf}</Col>
                    <Col className="col-box-7">{ranking.ga}</Col>
                    <Col className="col-box-7">{ranking.gd}</Col>
                    <Col className="col-box-7">{ranking.pts}</Col>
                </Row>
            </Col>
        </Row>
    )
}

class GroupRankingsTable extends React.Component {
    render() {
        const { group, config } = this.props
        // const { groups } = stage
        return (
            <React.Fragment>
                <RankingsHeader />

                {group.rankings &&
                    group.rankings.map((r, index) => {
                        return <RakingsRow key={r.id} ranking={r} config={config} />
                    })}
            </React.Fragment>
        )
    }
}

export default GroupRankingsTable
