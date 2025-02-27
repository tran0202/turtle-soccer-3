import React from 'react'
import { Row, Col } from 'reactstrap'
import moment from 'moment'
import { getTeamName, getTeamFlagId } from '../core/TeamHelper'
import { AetTooltip, DrawLotTooltip } from '../core/TooltipHelper'

const MatchesPairRow = (props) => {
    const { pair, config, last } = props
    const { matches } = pair

    return (
        <React.Fragment>
            {matches &&
                matches.map((m, index) => {
                    const bottomLine = index === 0 || (index === 1 && matches.length === 3) ? 'border-bottom-gray5' : ''
                    const pairHomeHighlight =
                        index === 0 || (index === 1 && matches.length === 3)
                            ? ''
                            : pair.agg_winner === 'home' || m.away_playoff_win || (index === 2 && m.away_score > m.home_score)
                            ? 'team-name-win'
                            : 'team-name-lose'
                    const pairAwayHighlight =
                        index === 0 || (index === 1 && matches.length === 3)
                            ? ''
                            : pair.agg_winner === 'away' || m.home_playoff_win || (index === 2 && m.home_score > m.away_score)
                            ? 'team-name-win'
                            : 'team-name-lose'
                    const homeTeamName = getTeamName(m.home_team, config)
                    const awayTeamName = getTeamName(m.away_team, config)
                    const matchHomeExtraScore = m.home_extra_score ? m.home_extra_score : 0
                    const matchAwayExtraScore = m.away_extra_score ? m.away_extra_score : 0
                    const matchHomeScore = m.home_score + matchHomeExtraScore
                    const matchAwayScore = m.away_score + matchAwayExtraScore
                    const teamWon = pair.agg_winner === 'home' || (index === 2 && m.away_score > m.home_score) ? awayTeamName : homeTeamName
                    const aggregateLine = config.pair_agg_points ? (
                        m.home_playoff_win || m.away_playoff_win ? (
                            <React.Fragment>
                                {m.playoff_notes} {' >>> '} <b>{teamWon}</b> won {config.name}!
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                {pair.name !== 'Final' ? (
                                    <React.Fragment>
                                        Aggregate points: {pair.agg_away_points} - {pair.agg_home_points} {' >>> '}
                                        <b>{teamWon}</b> advanced to the {config.next_stage}
                                        {config.next_round}
                                        {pair.agg_home_points === pair.agg_away_points && !m.home_draw_lot && !m.away_draw_lot && (
                                            <React.Fragment>
                                                <span className="blue">
                                                    {' '}
                                                    on aggregate goals {pair.agg_away_score}-{pair.agg_home_score}
                                                </span>{' '}
                                            </React.Fragment>
                                        )}
                                    </React.Fragment>
                                ) : pair.agg_home_points !== pair.agg_away_points ? (
                                    <React.Fragment>
                                        Aggregate points: {pair.agg_away_points} - {pair.agg_home_points} {' >>> '}
                                        <b>{teamWon}</b> won {config.name}!
                                    </React.Fragment>
                                ) : m.matchday === 'secondleg' ? (
                                    <React.Fragment>
                                        Aggregate points: {pair.agg_away_points} - {pair.agg_home_points} {' >>> '} Playoff required
                                    </React.Fragment>
                                ) : (
                                    <React.Fragment>
                                        {' >>> '}
                                        <b>{teamWon}</b> won {config.name}!
                                    </React.Fragment>
                                )}
                            </React.Fragment>
                        )
                    ) : (
                        <React.Fragment>
                            Aggregate: {pair.agg_away_score} - {pair.agg_home_score} {' >>> '} <b>{teamWon}</b> advanced to the {config.next_stage}
                            {config.next_round}
                        </React.Fragment>
                    )
                    const awayGoalLine = !config.pair_agg_points && pair.away_goal_winner !== undefined ? <span className="blue"> on away goals</span> : ''
                    const extraTimeLine =
                        !config.pair_agg_points && m.home_extra_score !== undefined && m.home_penalty_score === undefined ? (
                            <span className="blue"> after extra time</span>
                        ) : (
                            ''
                        )
                    const penaltyLine =
                        !config.pair_agg_points && m.home_penalty_score !== undefined ? (
                            <React.Fragment>
                                <span className="blue"> on penalties </span>{' '}
                                <b>
                                    {m.home_penalty_score} - {m.away_penalty_score}
                                </b>
                            </React.Fragment>
                        ) : (
                            ''
                        )
                    const drawLotLine = m.home_draw_lot || m.away_draw_lot ? <span className="blue"> on drawing lots</span> : ''
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
                                {(index % 2 === 1 || index === 2) && (
                                    <Row className={`no-gutters aggregate-line team-row padding-tb-sm ${!last ? 'border-bottom-gray4' : ''}`}>
                                        <Col xs={{ size: 7, offset: 5 }}>
                                            {aggregateLine}
                                            {awayGoalLine}
                                            {extraTimeLine}
                                            {penaltyLine}
                                            {drawLotLine}
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
        const { pairs, next_stage, next_round } = stage
        const new_config = { ...config, next_stage, next_round }
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
