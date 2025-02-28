import React from 'react'
import { Row, Col } from 'reactstrap'
import MatchesPair from '../components/MatchesPair'
import { getTeamName, getTeamFlagId } from '../core/TeamHelper'
import { AwayGoalsTooltip, AetTooltip, PenaltyTooltip } from '../core/TooltipHelper'

const PairHeader = () => {
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

const PairRow = (props) => {
    const { pair, config, last } = props
    if (!pair.matches) return
    const team1 = pair.matches[0].home_team
    const team2 = pair.matches[0].away_team
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
        <React.Fragment>
            <Row className={`no-gutters ranking-tbl padding-tb-sm ${!last ? 'team-row' : ''}`}>
                <Col className={`col-box-25 text-end ${pairHomeHighlight}`}>{getTeamName(team1, config)}</Col>
                <Col className="col-box-6">{getTeamFlagId(team1, config)}</Col>
                <Col className="text-center score-no-padding-right col-box-10">
                    {match1HomeScore} - {match1AwayScore}
                </Col>
                <Col className="text-center score-no-padding-right col-box-10">
                    {match2AwayScore} - {match2HomeScore}{' '}
                    {pair.matches[1].home_extra_score !== undefined && <AetTooltip target="aetTooltip" anchor="(a.e.t.)" />}
                </Col>
                <Col className="text-center score-no-padding-right col-box-14">
                    {pair.agg_home_score} - {pair.agg_away_score} {pair.away_goal_winner && <AwayGoalsTooltip target="awayGoalsTooltip" anchor="(a)" />}
                    {pair.matches[1].home_penalty_score !== undefined && (
                        <Row>
                            <Col className="text-center">
                                {match2AwayPenaltyScore} - {match2HomePenaltyScore} <PenaltyTooltip target="penaltyTooltip" anchor="(pen)" />
                            </Col>
                        </Row>
                    )}
                </Col>
                <Col className="col-box-6">{getTeamFlagId(team2, config)}</Col>
                <Col className={`col-box-25 ${pairAwayHighlight}`}>{getTeamName(team2, config)}</Col>
            </Row>
            {!last && <Row className="border-bottom-gray5 margin-left-sm margin-top-sm" />}
        </React.Fragment>
    )
}

const PairRound = (props) => {
    const { round, config } = props
    return (
        <React.Fragment>
            <Row>
                <Col className="mt-3 round-box">
                    <Row>
                        <Col>
                            <div className="h2-ff1">{round.name}</div>
                        </Col>
                    </Row>
                    <PairHeader />
                    {round.pairs &&
                        round.pairs.map((p, index) => {
                            return <PairRow key={p.name} pair={p} config={config} last={index === round.pairs.length - 1} />
                        })}
                </Col>
            </Row>
        </React.Fragment>
    )
}

class Pair extends React.Component {
    render() {
        const { stage, config } = this.props
        return (
            <React.Fragment>
                {stage.rounds &&
                    stage.rounds.map((r) => {
                        return (
                            <React.Fragment>
                                <PairRound key={r.name} round={r} config={config} />
                                <MatchesPair stage={r} config={config} />
                            </React.Fragment>
                        )
                    })}
            </React.Fragment>
        )
    }
}

export default Pair
