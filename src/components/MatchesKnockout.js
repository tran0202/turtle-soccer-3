import React, { useState } from 'react'
import { Row, Col, Collapse, Button } from 'reactstrap'
import moment from 'moment'
import { getTeamName, getTeamFlagId, isHomeWinMatch } from '../core/TeamHelper'
import {
    AetTooltip,
    AetSkippedTooltip,
    GoldenGoalTooltip,
    SilverGoalTooltip,
    ReplayTooltip,
    WalkoverTooltip,
    DrawLotTooltip,
    MatchPostponedTooltip,
    SharedBronzeTooltip,
    ByeTooltip,
    WithdrewTooltip,
    AwardedTooltip,
    ReplacementTooltip,
    DisqualifiedTooltip,
    CoinTossTooltip,
} from '../core/TooltipHelper'
import MatchesPair from './MatchesPair'
import PairSummary from './PairSummary'

const MatchesKnockoutCollapse = (props) => {
    const { title, initialStatus, children } = props
    const [collapse, setCollapse] = useState(initialStatus === 'Opened' ? true : false)
    const [status, setStatus] = useState(initialStatus === 'Opened' ? initialStatus : 'Closed')
    const onEntering = () => setStatus('Opening...')
    const onEntered = () => setStatus('Opened')
    const onExiting = () => setStatus('Closing...')
    const onExited = () => setStatus('Closed')
    const toggle = () => setCollapse(!collapse)

    return (
        <React.Fragment>
            <Row className="text-start padding-top-md padding-left-sm">
                <Col sm="3" md="3">
                    <Button outline color="primary" onClick={toggle} className="h3-ff3 orange btn-collapse-orange">
                        {title}&nbsp;
                        {status === 'Opening...' && <i className="bx bx-dots-vertical-rounded"></i>}
                        {status === 'Opened' && <i className="bx bx-chevron-up-square"></i>}
                        {status === 'Closing...' && <i className="bx bx-dots-vertical-rounded"></i>}
                        {status === 'Closed' && <i className="bx bx-chevron-down-square"></i>}
                    </Button>
                </Col>
            </Row>
            <Collapse isOpen={collapse} onEntering={onEntering} onEntered={onEntered} onExiting={onExiting} onExited={onExited}>
                <Row className="mb-3 text-start padding-left-sm">
                    <Col sm="12" md="12">
                        {children}
                    </Col>
                </Row>
            </Collapse>
        </React.Fragment>
    )
}

const MatchRow = (props) => {
    const { m, round, config, last } = props
    const isOlympic = config.competition_id === 'MOFT' || config.competition_id === 'WOFT'
    const isByeMatch = (m.home_team === 'BYE') | (m.away_team === 'BYE')
    const pairHomeHighlight =
        (isHomeWinMatch(m) && !m.home_withdrew) || m.replay_required || m.shared_bronze || m.match_postponed || m.home_bye ? 'team-name-win' : 'team-name-lose'
    const pairAwayHighlight =
        (!isHomeWinMatch(m) && !m.away_withdrew) || m.replay_required || m.shared_bronze || m.match_postponed || m.away_bye ? 'team-name-win' : 'team-name-lose'
    const homeTeamName = getTeamName(m.home_team, config)
    const awayTeamName = getTeamName(m.away_team, config)
    const matchHomeExtraScore = m.home_extra_score ? m.home_extra_score : 0
    const matchAwayExtraScore = m.away_extra_score ? m.away_extra_score : 0
    const matchHomeScore = m.home_score + matchHomeExtraScore
    const matchAwayScore = m.away_score + matchAwayExtraScore
    const teamWon = isHomeWinMatch(m) ? homeTeamName : awayTeamName
    const teamLose = isHomeWinMatch(m) ? awayTeamName : homeTeamName
    const teamNextRoundLine = config.is_stage_qualify ? teamLose : teamWon
    const teamWonLine = (
        <React.Fragment>
            {' >>> '} <b>{teamWon}</b> won
        </React.Fragment>
    )
    const goldenGoalLine = m.home_golden_goal || m.away_golden_goal ? <span className="blue"> golden goal</span> : ''
    const silverGoalLine = m.home_silver_goal || m.away_silver_goal ? <span className="blue"> silver goal</span> : ''
    const extraTimeLine = m.home_extra_score !== undefined && m.home_penalty_score === undefined ? <span className="blue"> after extra time</span> : ''
    const penaltyLine =
        m.home_penalty_score !== undefined ? (
            <React.Fragment>
                <span className="blue"> on penalties </span>{' '}
                <b>
                    {m.home_penalty_score} - {m.away_penalty_score}
                </b>
            </React.Fragment>
        ) : (
            ''
        )
    const coinTossLine =
        m.home_coin_toss || m.away_coin_toss ? (
            <React.Fragment>
                <span className="blue"> on coin toss</span>
            </React.Fragment>
        ) : (
            ''
        )
    const qualifyLine = (
        <React.Fragment>
            {' >>> '} <b>{teamWon}</b> qualify for World Cup {config.year}
        </React.Fragment>
    )
    const nextRoundLine = (
        <React.Fragment>
            {' >>> '} <b>{teamNextRoundLine}</b> advance to the {config.next_stage}
        </React.Fragment>
    )
    const championshipLine = (
        <React.Fragment>
            {' >>> '} <b>{teamWon}</b> won {isOlympic ? ' the gold medal of ' : ''}
            {config.name}!
        </React.Fragment>
    )
    const thirdPlaceLine = (
        <React.Fragment>
            {' >>> '} <b>{teamWon}</b> won the {isOlympic ? 'bronze medal' : 'third place'}
        </React.Fragment>
    )
    return (
        !isByeMatch && (
            <React.Fragment key={m.id}>
                <Row className="no-gutters ranking-tbl team-row padding-tb-sm">
                    <Col className="col-box-20 font-14">
                        {m.match_type ? moment(m.date).format('MMMM D, YYYY') : ''}
                        {m.time ? ' @' : ''} {m.time}
                        <br />
                        {m.stadium && m.city ? m.stadium + ', ' + m.city : ''}
                    </Col>
                    <Col className={`col-box-25 text-end ${pairHomeHighlight}`}>
                        {homeTeamName} {m.home_draw_lot && <DrawLotTooltip target="drawLotTooltip" notes={m.draw_lot_notes} />}
                        {m.home_bye && <ByeTooltip target={`${m.home_team}byeTooltip`} notes={m.bye_notes} anchor="(bye)" />}
                        {m.home_withdrew && <WithdrewTooltip target={`${m.home_team}withdrewTooltip`} notes={m.home_withdrew_notes} anchor="(withdrew)" />}
                        {m.home_disqualified && (
                            <DisqualifiedTooltip target={`${m.home_team}disqualifiedTooltip`} notes={m.disqualified_notes} anchor="(disqualified)" />
                        )}
                        {m.home_replacement && <ReplacementTooltip target={`${m.home_team}replacementTooltip`} notes={m.replacement_notes} anchor="(r)" />}
                        {m.shared_bronze && <SharedBronzeTooltip target={`${m.home_team}sharedBronzeTooltip`} notes={m.shared_bronze_notes} />}
                        {m.home_coin_toss && <CoinTossTooltip target={`${m.home_team}cointossTooltip`} notes={m.coin_toss_notes} anchor="(cointoss)" />}
                    </Col>
                    <Col className="col-box-8">{getTeamFlagId(m.home_team, config)}</Col>
                    <Col className="text-center score-no-padding-right col-box-10">
                        {!m.match_postponed && !m.home_withdrew && !m.away_withdrew && !m.home_disqualified && !m.away_disqualified && (
                            <React.Fragment>
                                {matchHomeScore} - {matchAwayScore}
                            </React.Fragment>
                        )}{' '}
                        {m.home_extra_score !== undefined && <AetTooltip target="aetTooltip" anchor="(a.e.t.)" />}
                        {m.extra_time_skipped && <AetSkippedTooltip target="aetSkippedTooltip" anchor="(no.e.t.)" />}
                        {(m.home_golden_goal || m.away_golden_goal) && <GoldenGoalTooltip target="goldenGoalTooltip" anchor="(gg)" />}
                        {(m.home_silver_goal || m.away_silver_goal) && <SilverGoalTooltip target="silverGoalTooltip" anchor="(sg)" />}
                        {(m.home_walkover || m.away_walkover) && <WalkoverTooltip target="walkoverTooltip" content={m.walkover_notes} anchor="(w/o)" />}
                        {m.replay_required && <ReplayTooltip target={`${m.home_team}${m.away_team}replayTooltip`} notes="Replay Required" anchor="(r)" />}
                        {m.match_postponed && <MatchPostponedTooltip target={`postponedTooltip`} notes={m.postponed_notes} anchor="(mp)" />}
                        {(m.home_awarded || m.away_awarded) && <AwardedTooltip target={`awardedTooltip`} notes={m.awarded_notes} />}
                    </Col>
                    <Col className="col-box-8">{getTeamFlagId(m.away_team, config)}</Col>
                    <Col className={`col-box-25 ${pairAwayHighlight}`}>
                        {awayTeamName} {m.away_draw_lot && <DrawLotTooltip target="drawLotTooltip" notes={m.draw_lot_notes} />}
                        {m.away_bye && <ByeTooltip target={`${m.away_team}byeTooltip`} notes={m.bye_notes} anchor="(bye)" />}
                        {m.away_withdrew && <WithdrewTooltip target={`${m.away_team}withdrewTooltip`} notes={m.away_withdrew_notes} anchor="(withdrew)" />}
                        {m.away_disqualified && (
                            <DisqualifiedTooltip target={`${m.away_team}disqualifiedTooltip`} notes={m.disqualified_notes} anchor="(disqualified)" />
                        )}
                        {m.away_replacement && <ReplacementTooltip target={`${m.away_team}replacementTooltip`} notes={m.replacement_notes} anchor="(r)" />}
                        {m.shared_bronze && <SharedBronzeTooltip target={`${m.away_team}sharedBronzeTooltip`} notes={m.shared_bronze_notes} />}
                        {m.away_coin_toss && <CoinTossTooltip target={`${m.away_team}cointossTooltip`} notes={m.coin_toss_notes} anchor="(cointoss)" />}
                    </Col>
                </Row>
                {(((m.home_extra_score !== undefined || m.home_penalty_score !== undefined) &&
                    !m.home_draw_lot &&
                    !m.away_draw_lot &&
                    !m.home_walkover &&
                    !m.away_walkover) ||
                    m.extra_time_skipped) && (
                    <Row className="no-gutters aggregate-line team-row padding-tb-sm">
                        <Col xs={{ size: 7, offset: 5 }}>
                            {!m.replay_required && (
                                <React.Fragment>
                                    {teamWonLine}
                                    {goldenGoalLine}
                                    {silverGoalLine}
                                    {extraTimeLine}
                                    {coinTossLine}
                                </React.Fragment>
                            )}
                            {penaltyLine}
                        </Col>
                    </Row>
                )}
                {round.final && config.is_stage_qualify && (
                    <Row className="no-gutters aggregate-line team-row padding-tb-sm">
                        <Col xs={{ size: 7, offset: 5 }}>{qualifyLine}</Col>
                    </Row>
                )}
                {round.final && config.is_stage_next_round && (
                    <Row className="no-gutters aggregate-line team-row padding-tb-sm">
                        <Col xs={{ size: 7, offset: 5 }}>{nextRoundLine}</Col>
                    </Row>
                )}
                {round.championship && m.final && !m.replay_required && !isOlympic && (
                    <Row className="no-gutters aggregate-line team-row padding-tb-sm">
                        <Col xs={{ size: 7, offset: 5 }}>{championshipLine}</Col>
                    </Row>
                )}
                {round.championship && m.final && !m.replay_required && isOlympic && (
                    <Row className="no-gutters aggregate-line team-row padding-tb-sm">
                        <Col xs={{ size: 8, offset: 4 }}>{championshipLine}</Col>
                    </Row>
                )}
                {round.championship && m.third_place && !m.replay_required && !m.shared_bronze && (
                    <Row className="no-gutters aggregate-line team-row padding-tb-sm">
                        <Col xs={{ size: 7, offset: 5 }}>{thirdPlaceLine}</Col>
                    </Row>
                )}
                {m.shared_bronze && (
                    <Row className="no-gutters aggregate-line team-row padding-tb-sm">
                        <Col xs={{ size: 7, offset: 5 }}>
                            {' >>> '} {m.shared_bronze_notes}
                        </Col>
                    </Row>
                )}

                {!last && <Row className="border-bottom-gray5 margin-left-sm margin-top-sm" />}
            </React.Fragment>
        )
    )
}

const MatchesKnockoutRow = (props) => {
    const { round, config } = props
    return (
        <Row>
            <Col className="mt-3 round-box">
                <Row>
                    <Col>
                        <div className="h2-ff1">{round.name}</div>
                    </Col>
                </Row>
                {round.matchdays &&
                    round.matchdays.map((md) => {
                        return (
                            <React.Fragment key={md.date}>
                                <Row>
                                    <Col sm="12" className="h5-ff6 border-bottom-gray4 margin-top-md">
                                        {moment(md.date).format('dddd, MMMM D, YYYY')}
                                        {md.replay && <React.Fragment> ::: Replay</React.Fragment>}
                                    </Col>
                                </Row>
                                {md.matches &&
                                    md.matches.map((m, index) => {
                                        const lastMatch = index === md.matches.length - 1
                                        return <MatchRow key={index} m={m} round={round} config={config} last={lastMatch} />
                                    })}
                            </React.Fragment>
                        )
                    })}
            </Col>
        </Row>
    )
}

const MatchesKnockoutRowFinal = (props) => {
    const { round, config } = props
    const final_matchdays = round.matchdays && round.matchdays.filter((md) => md.final)
    const third_place_matchdays = round.matchdays && round.matchdays.filter((md) => md.third_place)
    const isOlympic = config.competition_id === 'MOFT' || config.competition_id === 'WOFT'
    const thirdPlaceRoundName = isOlympic ? 'Bronze Medal' : 'Third place'
    const finalRoundName = isOlympic ? 'Gold Medal' : 'Final'
    return (
        <Row>
            <Col className="mt-3 round-box">
                {third_place_matchdays && third_place_matchdays.length > 0 && (
                    <React.Fragment>
                        <Row>
                            <Col>
                                <div className="h2-ff1 margin-top-md">{thirdPlaceRoundName}</div>
                            </Col>
                        </Row>
                        {third_place_matchdays.map((md) => {
                            return (
                                <React.Fragment key={md.date}>
                                    <Row>
                                        <Col sm="12" className="h5-ff6 border-bottom-gray4 margin-top-md">
                                            {moment(md.date).format('dddd, MMMM D, YYYY')}
                                            {md.replay && <React.Fragment> ::: Replay</React.Fragment>}
                                        </Col>
                                    </Row>
                                    {md.matches &&
                                        md.matches.map((m, index) => {
                                            const lastMatch = index === md.matches.length - 1
                                            return <MatchRow key={index} m={m} round={round} config={config} last={lastMatch} />
                                        })}
                                </React.Fragment>
                            )
                        })}
                    </React.Fragment>
                )}
                {final_matchdays && final_matchdays.length > 0 && (
                    <React.Fragment>
                        <Row>
                            <Col>
                                <div className="h2-ff1 margin-top-md">{finalRoundName}</div>
                            </Col>
                        </Row>
                        {final_matchdays.map((md) => {
                            return (
                                <React.Fragment key={md.date}>
                                    <Row>
                                        <Col sm="12" className="h5-ff6 border-bottom-gray4 margin-top-md">
                                            {moment(md.date).format('dddd, MMMM D, YYYY')}
                                            {md.replay && <React.Fragment> ::: Replay</React.Fragment>}
                                        </Col>
                                    </Row>
                                    {md.matches &&
                                        md.matches.map((m, index) => {
                                            const lastMatch = index === md.matches.length - 1
                                            return <MatchRow key={index} m={m} round={round} config={config} last={lastMatch} />
                                        })}
                                </React.Fragment>
                            )
                        })}
                    </React.Fragment>
                )}
            </Col>
        </Row>
    )
}

const MatchesKnockoutPair = (props) => {
    const { round, config } = props
    return (
        <Row>
            <Col className="mt-3 round-box">{round.pairs && <MatchesPair stage={round} config={config} />}</Col>
        </Row>
    )
}

const MatchesKnockoutRound = (props) => {
    const { rounds, config } = props
    return (
        <React.Fragment>
            {rounds &&
                rounds.map((r) => {
                    if (r.matches) {
                        if (!r.final) {
                            return <MatchesKnockoutRow key={r.name} round={r} config={config} />
                        } else {
                            return <MatchesKnockoutRowFinal key={r.name} round={r} config={config} />
                        }
                    }
                    if (r.pairs) {
                        return (
                            <React.Fragment key={r.name}>
                                <PairSummary round={r} config={config} />
                                <MatchesKnockoutPair round={r} config={config} />
                            </React.Fragment>
                        )
                    }
                    return null
                })}
        </React.Fragment>
    )
}

class MatchesKnockout extends React.Component {
    render() {
        const { stage, config, isImagine } = this.props
        const { rounds } = stage
        const is_stage_qualify = stage.advancements && stage.advancements.positions && stage.advancements.positions[0].next === 'qualify'
        const is_stage_next_round =
            !stage.advancements || !stage.advancements.positions
                ? false
                : stage.advancements.positions.length === 1
                ? stage.advancements.positions[0].next === 'next_round'
                : stage.advancements.positions[1].next === 'next_round'
        const new_config = { ...config, year: config.year, is_stage_qualify, is_stage_next_round, next_stage: stage.next_stage }
        return (
            <React.Fragment>
                <Row className="mt-3">
                    <Col xs={{ size: 12 }}>
                        {isImagine && (
                            <MatchesKnockoutCollapse title="Matches" stage={stage} initialStatus="Opened">
                                <MatchesKnockoutRound rounds={rounds} config={new_config} />
                            </MatchesKnockoutCollapse>
                        )}
                        {!isImagine && <MatchesKnockoutRound rounds={rounds} config={new_config} />}
                    </Col>
                </Row>
            </React.Fragment>
        )
    }
}

export default MatchesKnockout
