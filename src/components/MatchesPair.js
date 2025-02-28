import React from 'react'
import { Row, Col } from 'reactstrap'
import moment from 'moment'
import { getTeamName, getTeamFlagId } from '../core/TeamHelper'
import { AetTooltip, DrawLotTooltip } from '../core/TooltipHelper'

const MatchesPairRow = (props) => {
    const { pair, config, last } = props
    const { matches } = pair
    const hasPlayoff = matches.find((m) => m.matchday === 'playoffleg') !== undefined

    return (
        <React.Fragment>
            {matches &&
                matches.map((m, index) => {
                    const isFirstLeg = m.matchday === 'firstleg'
                    const isSecondLeg = m.matchday === 'secondleg'
                    const isThirdLeg = m.matchday === 'playoffleg'
                    const bottomLine = isFirstLeg || (hasPlayoff && isSecondLeg) ? 'border-bottom-gray5' : ''
                    const pairHomeHighlight =
                        isFirstLeg || (hasPlayoff && isSecondLeg)
                            ? ''
                            : (isSecondLeg && pair.agg_winner === 'home') || (isThirdLeg && pair.agg_winner === 'away')
                            ? 'team-name-win'
                            : 'team-name-lose'
                    const pairAwayHighlight =
                        isFirstLeg || (hasPlayoff && isSecondLeg)
                            ? ''
                            : (isSecondLeg && pair.agg_winner === 'away') || (isThirdLeg && pair.agg_winner === 'home')
                            ? 'team-name-win'
                            : 'team-name-lose'
                    const homeTeamName = getTeamName(m.home_team, config)
                    const awayTeamName = getTeamName(m.away_team, config)
                    const matchHomeExtraScore = m.home_extra_score ? m.home_extra_score : 0
                    const matchAwayExtraScore = m.away_extra_score ? m.away_extra_score : 0
                    const matchHomeScore = m.home_score + matchHomeExtraScore
                    const matchAwayScore = m.away_score + matchAwayExtraScore
                    const teamWon = (isSecondLeg && pair.agg_winner === 'home') || (isThirdLeg && pair.agg_winner === 'away') ? awayTeamName : homeTeamName
                    const teamLost = (isSecondLeg && pair.agg_winner === 'home') || (isThirdLeg && pair.agg_winner === 'away') ? homeTeamName : awayTeamName
                    const aggregateLine = config.pair_agg_points ? (
                        isSecondLeg ? (
                            <React.Fragment>
                                Aggregate points: {pair.agg_away_pts} - {pair.agg_home_pts} {' >>> '}
                                {pair.agg_home_pts !== pair.agg_away_pts ? (
                                    <React.Fragment></React.Fragment>
                                ) : (
                                    <React.Fragment>
                                        {hasPlayoff ? (
                                            <React.Fragment>Playoff required. </React.Fragment>
                                        ) : pair.agg_home_score !== pair.agg_away_score ? (
                                            <React.Fragment>
                                                <b>{teamWon}</b> won{' '}
                                                <span className="blue">
                                                    on aggregate goals {pair.agg_away_score}-{pair.agg_home_score}
                                                    {'. '}
                                                </span>
                                            </React.Fragment>
                                        ) : (
                                            <React.Fragment>
                                                <b>{teamWon}</b> won <span className="blue">on drawing lots</span>
                                                {'. '}
                                            </React.Fragment>
                                        )}
                                    </React.Fragment>
                                )}
                            </React.Fragment>
                        ) : m.home_playoff_win || m.away_playoff_win ? (
                            <React.Fragment>
                                {m.playoff_notes} {' >>> '}
                            </React.Fragment>
                        ) : (
                            <React.Fragment></React.Fragment>
                        )
                    ) : (
                        <React.Fragment>
                            Aggregate: {pair.agg_away_score} - {pair.agg_home_score} {' >>> '}{' '}
                        </React.Fragment>
                    )
                    const awayGoalLine =
                        !config.pair_agg_points && pair.away_goal_winner !== undefined ? (
                            <React.Fragment>
                                <b>{teamWon}</b> won <span className="blue">on away goals</span>
                                {'. '}
                            </React.Fragment>
                        ) : (
                            ''
                        )
                    const extraTimeLine =
                        !config.pair_agg_points && m.home_extra_score !== undefined && m.home_penalty_score === undefined ? (
                            <React.Fragment>
                                <b>{teamWon}</b> won <span className="blue"> after extra time</span>
                                {'. '}
                            </React.Fragment>
                        ) : (
                            ''
                        )
                    const penaltyLine =
                        !config.pair_agg_points && m.home_penalty_score !== undefined ? (
                            <React.Fragment>
                                <b>{teamWon}</b> won <span className="blue"> on penalties </span>
                                <b>
                                    {m.home_penalty_score} - {m.away_penalty_score}
                                </b>
                                {'. '}
                            </React.Fragment>
                        ) : (
                            ''
                        )
                    const nextLine =
                        config.round_won_notes || config.round_lost_notes ? (
                            <React.Fragment>
                                <b>{teamWon}</b> {config.round_won_notes}
                                {'. '}
                                {config.round_lost_notes && (
                                    <React.Fragment>
                                        <b>{teamLost}</b> {config.round_lost_notes}
                                        {'.'}
                                    </React.Fragment>
                                )}
                            </React.Fragment>
                        ) : pair.final ? (
                            <React.Fragment>
                                <b>{teamWon}</b> won {config.name}!
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                <b>{teamWon}</b> advanced to the {config.next_stage}
                                {config.next_round}.
                            </React.Fragment>
                        )
                    return (
                        <React.Fragment key={pair.name + m.matchday}>
                            <Row className={bottomLine}>
                                <Row className={`no-gutters ranking-tbl team-row padding-tb-sm`}>
                                    <Col className="col-box-20 font-14">
                                        {moment(m.date).format('MMMM D, YYYY')}
                                        {m.time ? ' @' : ''} {m.time}
                                        <br />
                                        {m.stadium && m.city ? m.stadium + ', ' + m.city : ''}
                                    </Col>
                                    <Col className={`col-box-25 text-end ${pairAwayHighlight}`}>
                                        {homeTeamName}
                                        {m.home_draw_lot && <DrawLotTooltip target="drawLotTooltip" notes={m.draw_lot_notes} />}
                                    </Col>
                                    <Col className="col-box-6">{getTeamFlagId(m.home_team, config)}</Col>
                                    <Col className="text-center score-no-padding-right col-box-14">
                                        {matchHomeScore} - {matchAwayScore}{' '}
                                        {m.home_extra_score !== undefined && <AetTooltip target="aetTooltip" anchor="(a.e.t.)" />}
                                    </Col>
                                    <Col className="col-box-6">{getTeamFlagId(m.away_team, config)}</Col>
                                    <Col className={`col-box-25 ${pairHomeHighlight}`}>
                                        {awayTeamName}
                                        {m.away_draw_lot && <DrawLotTooltip target="drawLotTooltip" notes={m.draw_lot_notes} />}
                                    </Col>
                                </Row>
                                {(isSecondLeg || isThirdLeg) && (
                                    <Row className={`no-gutters aggregate-line team-row padding-tb-sm ${!last ? 'border-bottom-gray4' : ''}`}>
                                        <Col xs={{ size: 7, offset: 5 }}>
                                            {aggregateLine}
                                            {awayGoalLine}
                                            {extraTimeLine}
                                            {penaltyLine}
                                            {!(isSecondLeg && hasPlayoff) && nextLine}
                                        </Col>
                                    </Row>
                                )}
                            </Row>
                        </React.Fragment>
                    )
                })}
        </React.Fragment>
    )
}

class MatchesPair extends React.Component {
    render() {
        const { stage, config } = this.props
        const { pairs, next_stage, next_round, round_won_notes, round_lost_notes } = stage
        const new_config = { ...config, next_stage, next_round, round_won_notes, round_lost_notes }
        return (
            <React.Fragment>
                <Row className="mt-5 box-white">
                    <Col xs={{ size: 10, offset: 1 }}>
                        {pairs &&
                            pairs.map((p, index) => {
                                return <MatchesPairRow key={p.name} pair={p} config={new_config} last={index === pairs.length - 1} />
                            })}
                    </Col>
                </Row>
            </React.Fragment>
        )
    }
}

export default MatchesPair
