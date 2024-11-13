import React from 'react'
import { Row, Col } from 'reactstrap'
import { getTeamName, getTeamFlag } from '../core/TeamHelper'

const ResultsPairHeader = () => {
    return (
        <Row className="ranking-tbl-header team-row padding-tb-md text-center">
            <Col className="col-box-25"></Col>
            <Col className="col-box-8"></Col>
            <Col className="text-center score-no-padding-right col-box-10">1st Leg</Col>
            <Col className="text-center score-no-padding-right col-box-10">2nd Leg</Col>
            <Col className="text-center score-no-padding-right col-box-10">Aggregate</Col>
            <Col className="col-box-8"></Col>
            <Col className="col-box-25"></Col>
        </Row>
    )
}

const ResultsPairRow = (props) => {
    const { group, config } = props
    const team1 = group.teams.find((t) => t.pos === 1)
    const team2 = group.teams.find((t) => t.pos === 2)
    const match1homeScore = group.matches[0].home_score
    const match1awayScore = group.matches[0].away_score
    const match2homeScore = group.matches[1].home_score
    const match2awayScore = group.matches[1].away_score
    const pairHomeHighlight = group.agg_winner === 'home' ? 'weight-medium' : 'gray3'
    const pairAwayHighlight = group.agg_winner === 'home' ? 'gray3' : 'weight-medium'
    return (
        <Row className="no-gutters ranking-tbl team-row padding-tb-sm">
            <Col className={`col-box-25 text-end ${pairHomeHighlight}`}>{getTeamName(team1.id, config)}</Col>
            <Col className="col-box-8">{getTeamFlag(team1, config)}</Col>
            <Col className="text-center score-no-padding-right col-box-10">
                {match1homeScore} - {match1awayScore}
            </Col>
            <Col className="text-center score-no-padding-right col-box-10">
                {match2awayScore} - {match2homeScore}
            </Col>
            <Col className="text-center score-no-padding-right col-box-10">
                {group.agg_home_score} - {group.agg_away_score}
            </Col>
            <Col className="col-box-8">{getTeamFlag(team2, config)}</Col>
            <Col className={`col-box-25 ${pairAwayHighlight}`}>{getTeamName(team2.id, config)}</Col>
        </Row>
    )
}

class ResultsPairTable extends React.Component {
    render() {
        const { state, stage } = this.props
        const { groups } = stage
        return (
            <React.Fragment>
                <Row className="mt-5 box-xl">
                    <Col xs={{ size: 10, offset: 1 }}>
                        <ResultsPairHeader />
                        {groups &&
                            groups.map((g, index) => {
                                return <ResultsPairRow key={g.name} group={g} config={state.config} />
                            })}
                    </Col>
                </Row>
            </React.Fragment>
        )
    }
}

export default ResultsPairTable
