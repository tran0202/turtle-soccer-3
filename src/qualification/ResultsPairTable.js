import React from 'react'
import { Row, Col } from 'reactstrap'
import { getTeamName, getTeamFlag } from '../core/TeamHelper'
import { AwayGoalsTooltip, AetTooltip, PenaltyTooltip } from '../core/TooltipHelper'

const ResultsPairHeader = () => {
    return (
        <Row className="ranking-tbl-header team-row padding-tb-md text-center">
            <Col className="col-box-25"></Col>
            <Col className="col-box-8"></Col>
            <Col className="text-center score-no-padding-right col-box-10">1st Leg</Col>
            <Col className="text-center score-no-padding-right col-box-10">2nd Leg</Col>
            <Col className="text-center score-no-padding-right col-box-14">Aggregate</Col>
            <Col className="col-box-8"></Col>
            <Col className="col-box-25"></Col>
        </Row>
    )
}

const ResultsPairRow = (props) => {
    const { group, config } = props
    const team1 = group.teams.find((t) => t.pos === 1)
    const team2 = group.teams.find((t) => t.pos === 2)
    const match1HomeScore = group.matches[0].home_score
    const match1AwayScore = group.matches[0].away_score
    const match2HomeExtraScore = group.matches[1].home_extra_score ? group.matches[1].home_extra_score : 0
    const match2AwayExtraScore = group.matches[1].away_extra_score ? group.matches[1].away_extra_score : 0
    const match2HomeScore = group.matches[1].home_score + match2HomeExtraScore
    const match2AwayScore = group.matches[1].away_score + match2AwayExtraScore
    const match2HomePenaltyScore = group.matches[1].home_penalty_score
    const match2AwayPenaltyScore = group.matches[1].away_penalty_score
    const pairHomeHighlight = group.agg_winner === 'home' ? 'weight-medium' : 'gray3'
    const pairAwayHighlight = group.agg_winner === 'home' ? 'gray3' : 'weight-medium'
    return (
        <Row className="no-gutters ranking-tbl team-row padding-tb-sm">
            <Col className={`col-box-25 text-end ${pairHomeHighlight}`}>{getTeamName(team1.id, config)}</Col>
            <Col className="col-box-8">{getTeamFlag(team1, config)}</Col>
            <Col className="text-center score-no-padding-right col-box-10">
                {match1HomeScore} - {match1AwayScore}
            </Col>
            <Col className="text-center score-no-padding-right col-box-10">
                {match2AwayScore} - {match2HomeScore} {group.matches[1].home_extra_score !== undefined && <AetTooltip target="aetTooltip" anchor="(a.e.t.)" />}
            </Col>
            <Col className="text-center score-no-padding-right col-box-14">
                {group.agg_home_score} - {group.agg_away_score} {group.away_goal_winner && <AwayGoalsTooltip target="awayGoalsTooltip" anchor="(a)" />}
                {group.matches[1].home_penalty_score !== undefined && (
                    <Row>
                        <Col className="text-center">
                            {'>>> '}
                            {match2AwayPenaltyScore} - {match2HomePenaltyScore} <PenaltyTooltip target="aetTooltip" anchor="(pen)" />
                        </Col>
                    </Row>
                )}
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
                    <Col xs={{ size: 12 }}>
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
