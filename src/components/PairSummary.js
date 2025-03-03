import React from 'react'
import { Row, Col } from 'reactstrap'
import { getTeamName, getTeamFlagId } from '../core/TeamHelper'
import { AwayGoalsTooltip, AetTooltip, PenaltyTooltip, WalkoverTooltip } from '../core/TooltipHelper'

const PairHeader = (props) => {
    const { config } = props
    return (
        <Row className="ranking-tbl-header team-row padding-tb-md text-center">
            <Col className="col-box-25"></Col>
            <Col className="col-box-10"></Col>
            <Col className="text-center score-no-padding-right col-box-10">1st Leg</Col>
            {config.round_type !== 'pair1legged' && <Col className="text-center score-no-padding-right col-box-10">2nd Leg</Col>}
            {config.round_type !== 'pair1legged' && <Col className="text-center score-no-padding-right col-box-10">Aggregate</Col>}
            <Col className="col-box-10"></Col>
            <Col className="col-box-25"></Col>
        </Row>
    )
}

const PairRow = (props) => {
    const { pair, config, last } = props
    if (!pair.matches) return
    const hasFirstLegOnly = pair.matches.find((m) => m.matchday === 'firstlegonly') !== undefined
    const team1 = pair.matches[0].home_team
    const team2 = pair.matches[0].away_team
    const match1HomeScore = pair.matches[0].home_score
    const match1AwayScore = pair.matches[0].away_score
    const match2HomeExtraScore = pair.matches[1] && pair.matches[1].home_extra_score ? pair.matches[1].home_extra_score : 0
    const match2AwayExtraScore = pair.matches[1] && pair.matches[1].away_extra_score ? pair.matches[1].away_extra_score : 0
    const match2HomeScore = (pair.matches[1] ? pair.matches[1].home_score : 0) + match2HomeExtraScore
    const match2AwayScore = (pair.matches[1] ? pair.matches[1].away_score : 0) + match2AwayExtraScore
    const match2HomePenaltyScore = pair.matches[1] ? pair.matches[1].home_penalty_score : 0
    const match2AwayPenaltyScore = pair.matches[1] ? pair.matches[1].away_penalty_score : 0
    const pairHomeHighlight = pair.agg_winner === 'home' ? 'team-name-win' : 'team-name-lose'
    const pairAwayHighlight = pair.agg_winner === 'home' ? 'team-name-lose' : 'team-name-win'
    return (
        <React.Fragment>
            <Row className={`no-gutters ranking-tbl padding-tb-sm ${!last ? 'team-row' : ''}`}>
                <Col className={`col-box-25 text-end ${pairHomeHighlight}`}>{getTeamName(team1, config)}</Col>
                <Col className="col-box-10 text-end">{getTeamFlagId(team1, config)}</Col>
                <Col className="text-center score-no-padding-right col-box-10">
                    {!pair.matches[0].match_cancelled ? (
                        <React.Fragment>
                            {match1HomeScore} - {match1AwayScore}
                        </React.Fragment>
                    ) : (
                        <React.Fragment>Cancelled</React.Fragment>
                    )}
                </Col>
                {config.round_type !== 'pair1legged' && (
                    <Col className="text-center score-no-padding-right col-box-10">
                        {!hasFirstLegOnly && !pair.matches[1].match_cancelled ? (
                            <React.Fragment>
                                {match2AwayScore} - {match2HomeScore}{' '}
                            </React.Fragment>
                        ) : pair.matches[1] && pair.matches[1].match_cancelled ? (
                            <React.Fragment>Cancelled</React.Fragment>
                        ) : (
                            ''
                        )}
                        {pair.matches[1] && pair.matches[1].home_extra_score !== undefined && <AetTooltip target="aetTooltip" anchor="(a.e.t.)" />}
                    </Col>
                )}
                {config.round_type !== 'pair1legged' && (
                    <Col className="text-center score-no-padding-right col-box-10">
                        {!hasFirstLegOnly && !pair.matches[0].match_cancelled && (
                            <React.Fragment>
                                {pair.agg_home_score} - {pair.agg_away_score}
                            </React.Fragment>
                        )}{' '}
                        {pair.away_goal_winner && <AwayGoalsTooltip target="awayGoalsTooltip" anchor="(a)" />}
                        {pair.matches[1] && pair.matches[1].home_penalty_score !== undefined && (
                            <Row>
                                <Col className="text-center">
                                    {match2AwayPenaltyScore} - {match2HomePenaltyScore} <PenaltyTooltip target="penaltyTooltip" anchor="(pen)" />
                                </Col>
                            </Row>
                        )}
                        {pair.matches[0].home_walkover && (
                            <WalkoverTooltip target={`${pair.matches[0].home_team}walkoverTooltip`} content={pair.matches[0].walkover_notes} anchor="(w/o)" />
                        )}
                    </Col>
                )}
                <Col className="col-box-10 text-start">{getTeamFlagId(team2, config)}</Col>
                <Col className={`col-box-25 text-start ${pairAwayHighlight}`}>{getTeamName(team2, config)}</Col>
            </Row>
            {!last && <Row className="border-bottom-gray5 margin-left-sm margin-top-sm" />}
        </React.Fragment>
    )
}

class PairSummary extends React.Component {
    render() {
        const { round, config } = this.props
        const new_config = { ...config, round_type: round.round_type }
        return (
            <React.Fragment>
                <PairHeader config={new_config} />
                {round.pairs &&
                    round.pairs.map((p, index) => {
                        return <PairRow key={p.name} pair={p} config={new_config} last={index === round.pairs.length - 1} />
                    })}
            </React.Fragment>
        )
    }
}

export default PairSummary
