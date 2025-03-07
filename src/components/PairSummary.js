import React from 'react'
import { Row, Col } from 'reactstrap'
import { getTeamName, getTeamFlagId } from '../core/TeamHelper'
import { AwayGoalsTooltip, AetTooltip, PenaltyTooltip, WalkoverTooltip, ByeTooltip } from '../core/TooltipHelper'

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
    if (!pair.matches || pair.matches.length === 0 || pair.matches.length > 3) return

    const hasFirstLegOnly = pair.matches.find((m) => m.matchday === 'firstlegonly') !== undefined
    const homeTeam = pair.matches[0].home_team
    const awayTeam = pair.matches[0].away_team
    // UEL201920
    const homeBye = pair.matches[0].home_bye
    const awayBye = pair.matches[0].away_bye
    const byeNotes = pair.matches[0].bye_notes
    const byeMatch = homeBye || awayBye
    const match1HomeScore = pair.matches[0].home_score
    const match1AwayScore = pair.matches[0].away_score
    // UEL202122
    const match1Cancelled = pair.matches[0].match_cancelled
    const homeWalkover = pair.matches[0].home_walkover
    const walkoverNotes = pair.matches[0].walkover_notes

    const match2HomeExtraScore = pair.matches[1] && pair.matches[1].home_extra_score ? pair.matches[1].home_extra_score : 0
    const match2AwayExtraScore = pair.matches[1] && pair.matches[1].away_extra_score ? pair.matches[1].away_extra_score : 0
    const match2HomeScore = (pair.matches[1] ? pair.matches[1].home_score : 0) + match2HomeExtraScore
    const match2AwayScore = (pair.matches[1] ? pair.matches[1].away_score : 0) + match2AwayExtraScore
    const match2HomePenaltyExist = pair.matches[1] && pair.matches[1].home_penalty_score !== undefined
    const match2AwayPenaltyExist = pair.matches[1] && pair.matches[1].away_penalty_score !== undefined
    const match2HomePenaltyScore = pair.matches[1] ? pair.matches[1].home_penalty_score : 0
    const match2AwayPenaltyScore = pair.matches[1] ? pair.matches[1].away_penalty_score : 0
    const match2Cancelled = pair.matches[1] && pair.matches[1].match_cancelled

    const pairHomeHighlight = byeMatch ? '' : pair.agg_winner === 'home' ? 'team-name-win' : 'team-name-lose'
    const pairAwayHighlight = byeMatch ? '' : pair.agg_winner === 'home' ? 'team-name-lose' : 'team-name-win'

    const showLeg2Score = config.round_type !== 'pair1legged'
    const showAggScore = config.round_type !== 'pair1legged'
    const showAetTooltip = pair.matches[1] && pair.matches[1].home_extra_score !== undefined

    return (
        <React.Fragment>
            <Row className={`no-gutters ranking-tbl padding-tb-sm`}>
                <Col className={`col-box-25 text-end ${pairHomeHighlight}`}>
                    {getTeamName(homeTeam, config)}{' '}
                    {hasFirstLegOnly && homeBye && <ByeTooltip target={`${homeTeam}byeTooltip`} notes={byeNotes} anchor="(bye)" />}
                </Col>

                <Col className="col-box-10 text-end">{getTeamFlagId(homeTeam, config)}</Col>

                <Col className="text-center score-no-padding-right col-box-10">
                    {match1Cancelled ? (
                        <React.Fragment>Cancelled</React.Fragment>
                    ) : !byeMatch ? (
                        <React.Fragment>
                            {match1HomeScore} - {match1AwayScore}
                        </React.Fragment>
                    ) : (
                        ''
                    )}
                </Col>

                {showLeg2Score && (
                    <Col className="text-center score-no-padding-right col-box-10">
                        {match2Cancelled ? (
                            <React.Fragment>Cancelled</React.Fragment>
                        ) : !hasFirstLegOnly ? (
                            <React.Fragment>
                                {match2AwayScore} - {match2HomeScore}{' '}
                            </React.Fragment>
                        ) : (
                            ''
                        )}
                        {showAetTooltip && <AetTooltip target="aetTooltip" anchor="(a.e.t.)" />}
                    </Col>
                )}

                {showAggScore && (
                    <Col className="text-center score-no-padding-right col-box-10">
                        {!hasFirstLegOnly && !match1Cancelled && (
                            <React.Fragment>
                                {pair.agg_home_score} - {pair.agg_away_score}
                            </React.Fragment>
                        )}{' '}
                        {pair.away_goal_winner && <AwayGoalsTooltip target="awayGoalsTooltip" anchor="(a)" />}
                        {match2HomePenaltyExist && match2AwayPenaltyExist && (
                            <Row>
                                <Col className="text-center">
                                    {match2AwayPenaltyScore} - {match2HomePenaltyScore} <PenaltyTooltip target="penaltyTooltip" anchor="(pen)" />
                                </Col>
                            </Row>
                        )}
                        {homeWalkover && <WalkoverTooltip target={`${homeTeam}walkoverTooltip`} content={walkoverNotes} anchor="(w/o)" />}
                    </Col>
                )}

                <Col className="col-box-10 text-start">
                    {getTeamFlagId(awayTeam, config)}{' '}
                    {hasFirstLegOnly && awayBye && <ByeTooltip target={`${awayTeam}byeTooltip`} notes={byeNotes} anchor="(bye)" />}
                </Col>

                <Col className={`col-box-25 text-start ${pairAwayHighlight}`}>{getTeamName(awayTeam, config)}</Col>
            </Row>
            {!last && <Row className="border-bottom-gray5 margin-left-sm margin-top-sm" />}
        </React.Fragment>
    )
}

const PairPath = (props) => {
    const { path, config } = props
    return (
        <React.Fragment>
            <Row>
                <Col sm="12" className="h2-ff6 border-bottom-double-gray3 margin-top-md">
                    {path.name}
                </Col>
            </Row>
            {path.pairs &&
                path.pairs.map((p, index) => {
                    return <PairRow key={p.name} pair={p} config={config} last={index === path.pairs.length - 1} />
                })}
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
                {round.paths &&
                    round.paths.map((p) => {
                        return <PairPath key={p.name} path={p} config={new_config} />
                    })}
                {round.pairs &&
                    round.pairs.map((p, index) => {
                        const last = index === round.pairs.length - 1 || (index === round.pairs.length - 2 && round.pairs[round.pairs.length - 1].blank)
                        return <PairRow key={p.name} pair={p} config={new_config} last={last} />
                    })}
            </React.Fragment>
        )
    }
}

export default PairSummary
