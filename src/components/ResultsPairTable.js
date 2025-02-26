import React from 'react'
import { Row, Col } from 'reactstrap'
import { getTeamFlag } from '../core/TeamHelper'
import { AwayGoalsTooltip, AetTooltip, PenaltyTooltip } from '../core/TooltipHelper'

const ResultsPairHeader = () => {
    return (
        <Row className="ranking-tbl-header team-row padding-tb-md text-center">
            <Col className="col-box-25"></Col>
            <Col className="col-box-6"></Col>
            <Col className="text-center score-no-padding-right col-box-10">1st Leg</Col>
            <Col className="text-center score-no-padding-right col-box-10">2nd Leg</Col>
            <Col className="text-center score-no-padding-right col-box-14">Aggregate</Col>
            <Col className="col-box-6"></Col>
            <Col className="col-box-25"></Col>
        </Row>
    )
}

const ResultsPairRow = (props) => {
    const { pair, last } = props
    const team1 = pair.teams.find((t) => t.pos === 1)
    const team2 = pair.teams.find((t) => t.pos === 2)
    if (!team1 || !team2 || !pair.matches) return
    const match1HomeScore = pair.matches[0].home_score
    const match1AwayScore = pair.matches[0].away_score
    const match2HomeExtraScore = pair.matches[1].home_extra_score ? pair.matches[1].home_extra_score : 0
    const match2AwayExtraScore = pair.matches[1].away_extra_score ? pair.matches[1].away_extra_score : 0
    const match2HomeScore = pair.matches[1].home_score + match2HomeExtraScore
    const match2AwayScore = pair.matches[1].away_score + match2AwayExtraScore
    const match2HomePenaltyScore = pair.matches[1].home_penalty_score
    const match2AwayPenaltyScore = pair.matches[1].away_penalty_score
    const pairHomeHighlight = pair.agg_winner === 'home' ? 'team-name-win' : 'team-name-lose'
    const pairAwayHighlight = pair.agg_winner === 'home' ? 'team-name-lose' : 'team-name-win'
    return (
        <Row className={`no-gutters ranking-tbl padding-tb-sm ${!last ? 'team-row' : ''}`}>
            <Col className={`col-box-25 text-end ${pairHomeHighlight}`}>{team1.name}</Col>
            <Col className="col-box-6">{getTeamFlag(team1)}</Col>
            <Col className="text-center score-no-padding-right col-box-10">
                {match1HomeScore} - {match1AwayScore}
            </Col>
            <Col className="text-center score-no-padding-right col-box-10">
                {match2AwayScore} - {match2HomeScore} {pair.matches[1].home_extra_score !== undefined && <AetTooltip target="aetTooltip" anchor="(a.e.t.)" />}
            </Col>
            <Col className="text-center score-no-padding-right col-box-14">
                {pair.agg_home_score} - {pair.agg_away_score} {pair.away_goal_winner && <AwayGoalsTooltip target="awayGoalsTooltip" anchor="(a)" />}
                {pair.matches[1].home_penalty_score !== undefined && (
                    <Row>
                        <Col className="text-center">
                            {'>>> '}
                            {match2AwayPenaltyScore} - {match2HomePenaltyScore} <PenaltyTooltip target="penaltyTooltip" anchor="(pen)" />
                        </Col>
                    </Row>
                )}
            </Col>
            <Col className="col-box-6">{getTeamFlag(team2)}</Col>
            <Col className={`col-box-25 ${pairAwayHighlight}`}>{team2.name}</Col>
        </Row>
    )
}

class ResultsPairTable extends React.Component {
    render() {
        const { stage, config } = this.props
        const { pairs } = stage
        return (
            <React.Fragment>
                <Row className="mt-5 box-xl">
                    <Col xs={{ size: 10, offset: 1 }}>
                        <ResultsPairHeader />
                        {pairs &&
                            pairs.map((p, index) => {
                                return <ResultsPairRow key={p.name} pair={p} config={config} last={index === pairs.length - 1} />
                            })}
                    </Col>
                </Row>
            </React.Fragment>
        )
    }
}

export default ResultsPairTable
