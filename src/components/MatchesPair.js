import React from 'react'
import { Row, Col } from 'reactstrap'
import moment from 'moment'
import { getTeamName, getTeamFlagId } from '../core/TeamHelper'
import { AetTooltip, DisqualifiedTooltip, DrawLotTooltip, WalkoverTooltip, PenaltyTooltip, AwardedTooltip, ByeTooltip } from '../core/TooltipHelper'

const MatchesPairRow = (props) => {
    const { pair, config, last } = props
    const { matches } = pair
    const hasPlayoff = matches && matches.find((m) => m.matchday === 'playoffleg') !== undefined

    return (
        <React.Fragment>
            {matches &&
                matches.map((m) => {
                    const isFirstLeg = m.matchday === 'firstleg'
                    const isFirstLegOnly = m.matchday === 'firstlegonly'
                    const isSecondLeg = m.matchday === 'secondleg'
                    const isThirdLeg = m.matchday === 'playoffleg'
                    const isByeMatch = m.home_bye || m.away_bye

                    const bottomLine = isFirstLeg || (hasPlayoff && isSecondLeg) ? 'border-bottom-gray5' : ''

                    const pairHomeHighlight =
                        isByeMatch || isFirstLeg || (hasPlayoff && isSecondLeg)
                            ? ''
                            : (isSecondLeg && pair.agg_winner === 'away') || ((isFirstLegOnly || isThirdLeg) && pair.agg_winner === 'home')
                            ? 'team-name-win'
                            : 'team-name-lose'
                    const pairAwayHighlight =
                        isByeMatch || isFirstLeg || (hasPlayoff && isSecondLeg)
                            ? ''
                            : (isSecondLeg && pair.agg_winner === 'home') || ((isFirstLegOnly || isThirdLeg) && pair.agg_winner === 'away')
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

                    const walkoverLine =
                        m.home_walkover || m.away_walkover ? (
                            <React.Fragment>
                                <b>{teamWon}</b> won
                                <span className="blue"> on walkover</span>
                                {'. '}
                            </React.Fragment>
                        ) : (
                            ''
                        )

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
                                                <b>{teamWon}</b> won <span className="blue">on aggregate goals</span>{' '}
                                                <b>
                                                    {pair.agg_away_score}-{pair.agg_home_score}
                                                </b>
                                                {'. '}
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
                    ) : m.home_walkover || m.away_walkover ? (
                        walkoverLine
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

                    const promotionRelegationLine1 = isSecondLeg && pair.agg_winner === 'home' ? config.round_won_notes : config.round_remain_notes
                    const promotionRelegationLine2 = isSecondLeg && pair.agg_winner === 'home' ? config.round_lost_notes : config.round_remain2_notes

                    const nextLine = config.interleague_exchanged ? (
                        <React.Fragment>
                            <b>{teamWon}</b> {promotionRelegationLine1}
                            {'. '}
                            <b>{teamLost}</b> {promotionRelegationLine2}
                            {'.'}
                        </React.Fragment>
                    ) : config.round_won_notes || config.round_lost_notes ? (
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
                                    <Col className="col-box-18 font-14">
                                        {m.date ? moment(m.date).format('MMMM D, YYYY') : ''}
                                        {m.time ? ' @' : ''} {m.time}
                                        <br />
                                        {m.stadium && m.city ? m.stadium + ', ' + m.city : ''}
                                    </Col>

                                    <Col className={`col-box-25 text-end ${pairHomeHighlight}`}>
                                        {homeTeamName} {m.home_draw_lot && <DrawLotTooltip target="drawLotTooltip" notes={m.draw_lot_notes} />}
                                        {m.home_disqualified && (
                                            <DisqualifiedTooltip
                                                target={`${m.home_team}disqualifiedTooltip`}
                                                notes={m.disqualified_notes}
                                                anchor="(disqualified)"
                                            />
                                        )}
                                        {m.home_walkover && (
                                            <WalkoverTooltip target={`${m.away_team}walkoverTooltip`} content={m.walkover_notes} anchor="(w/o)" />
                                        )}
                                        {m.home_awarded && <AwardedTooltip target={`awardedTooltip`} notes={m.awarded_notes} />}
                                        {m.home_bye && <ByeTooltip target={`${m.home_team}byeTooltip`} notes={m.bye_notes} anchor="(bye)" />}
                                    </Col>

                                    <Col className="col-box-10">{getTeamFlagId(m.home_team, config)}</Col>

                                    <Col className="text-center score-no-padding-right col-box-10">
                                        {m.match_cancelled ? (
                                            <React.Fragment>Cancelled</React.Fragment>
                                        ) : m.home_bye || m.away_bye ? (
                                            <React.Fragment></React.Fragment>
                                        ) : (
                                            <React.Fragment>
                                                {matchHomeScore} - {matchAwayScore}
                                            </React.Fragment>
                                        )}{' '}
                                        {m.home_extra_score !== undefined && <AetTooltip target="aetTooltip" anchor="(a.e.t.)" />}
                                        {m.home_penalty_score !== undefined && m.away_penalty_score !== undefined && (
                                            <Row>
                                                <Col className="text-center">
                                                    {m.home_penalty_score} - {m.away_penalty_score} <PenaltyTooltip target="penaltyTooltip" anchor="(pen)" />
                                                </Col>
                                            </Row>
                                        )}
                                    </Col>

                                    <Col className="col-box-10">{getTeamFlagId(m.away_team, config)}</Col>

                                    <Col className={`col-box-25 ${pairAwayHighlight}`}>
                                        {awayTeamName} {m.away_draw_lot && <DrawLotTooltip target="drawLotTooltip" notes={m.draw_lot_notes} />}
                                        {m.away_disqualified && (
                                            <DisqualifiedTooltip
                                                target={`${m.away_team}disqualifiedTooltip`}
                                                notes={m.disqualified_notes}
                                                anchor="(disqualified)"
                                            />
                                        )}
                                        {m.away_walkover && (
                                            <WalkoverTooltip target={`${m.away_team}walkoverTooltip`} content={m.walkover_notes} anchor="(w/o)" />
                                        )}
                                        {m.away_awarded && <AwardedTooltip target={`awardedTooltip`} notes={m.awarded_notes} />}
                                        {m.awawy_bye && <ByeTooltip target={`${m.away_team}byeTooltip`} notes={m.bye_notes} anchor="(bye)" />}
                                    </Col>
                                </Row>
                                {(isSecondLeg || isThirdLeg) && (
                                    <Row className={`no-gutters aggregate-line team-row padding-tb-sm ${!last ? 'border-bottom-gray4' : ''}`}>
                                        <Col xs={{ size: 7, offset: 5 }}>
                                            {aggregateLine}
                                            {extraTimeLine}
                                            {awayGoalLine}
                                            {penaltyLine}
                                            {!(isSecondLeg && hasPlayoff) && nextLine}
                                        </Col>
                                    </Row>
                                )}
                                {isFirstLegOnly && <Row className={`${!last ? 'border-bottom-gray4' : ''} margin-left-sm margin-top-md`} />}
                            </Row>
                        </React.Fragment>
                    )
                })}
        </React.Fragment>
    )
}

const MatchesPairPath = (props) => {
    const { path, config } = props
    const { round_won_notes, round_lost_notes, round_remain_notes, round_remain2_notes } = path
    const new_config = { ...config, round_won_notes, round_lost_notes, round_remain_notes, round_remain2_notes }
    return (
        <React.Fragment>
            <Row>
                <Col sm="12" className="h2-ff6 border-bottom-double-gray3 margin-top-md">
                    {path.name}
                </Col>
            </Row>
            {path.pairs &&
                path.pairs.map((p, index) => {
                    return <MatchesPairRow key={p.name} pair={p} config={new_config} last={index === path.pairs.length - 1} />
                })}
        </React.Fragment>
    )
}

class MatchesPair extends React.Component {
    render() {
        const { stage, config } = this.props
        const { pairs, paths, next_stage, next_round, round_won_notes, round_lost_notes, interleague_exchanged } = stage
        const new_config = { ...config, next_stage, next_round, round_won_notes, round_lost_notes, interleague_exchanged }
        return (
            <React.Fragment>
                <Row className="mt-5 box-white">
                    <Col xs={{ size: 10, offset: 1 }}>
                        {paths &&
                            paths.map((p2) => {
                                return <MatchesPairPath key={p2.name} path={p2} config={new_config} />
                            })}
                        {pairs &&
                            pairs.map((p, index) => {
                                const last = index === pairs.length - 1 || (index === pairs.length - 2 && pairs[pairs.length - 1].blank)
                                return !p.blank && <MatchesPairRow key={p.name} pair={p} config={new_config} last={last} />
                            })}
                    </Col>
                </Row>
            </React.Fragment>
        )
    }
}

export default MatchesPair
