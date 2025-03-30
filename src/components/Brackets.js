import React, { useState } from 'react'
import { Collapse, Row, Col, Button } from 'reactstrap'
import moment from 'moment'
import { getShortTeamName, getBracketTeamFlagId, isHomeWinMatch } from '../core/TeamHelper'
import {
    AetTooltip,
    AetSkippedTooltip,
    PenaltyTooltip,
    GoldenGoalTooltip,
    SilverGoalTooltip,
    ReplayTooltip,
    WalkoverTooltip,
    SharedBronzeTooltip,
    DrawLotTooltip,
    MatchPostponedTooltip,
    ByeTooltip,
    WithdrewTooltip,
    AwardedTooltip,
    ReplacementTooltip,
    DisqualifiedTooltip,
    CoinTossTooltip,
    AwayGoalsTooltip,
} from '../core/TooltipHelper'

const BracketsCollapse = (props) => {
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
                        {title} {status === 'Opening...' && <i className="bx bx-dots-vertical-rounded"></i>}
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

const BracketFinalCol = (props) => {
    const { round, config } = props
    const { column_count } = config
    const colClassname = column_count === 5 ? 'col-brk-16' : 'col-brk-22'
    const final = round.bracketMatches.find((m) => m.final)
    const thirdPlace = round.bracketMatches.find((m) => m.third_place)
    const finalRound = !round.third_place ? round : { ...round, bracketMatches: [final] }
    const thirdPlaceRound = !round.third_place ? round : { ...round, name: 'Third place', bracketMatches: [thirdPlace] }
    return (
        <Col className={colClassname}>
            {column_count === 2 && <Row className="bracket-gap-height-10"></Row>}
            {column_count === 3 && <Row className="bracket-gap-height-20"></Row>}
            {column_count === 4 && <Row className="bracket-gap-height-30"></Row>}
            {column_count === 5 && <Row className="bracket-gap-height-40"></Row>}
            <BracketColInner round={finalRound} config={config} />
            {round.third_place && <BracketColInner round={thirdPlaceRound} config={config} />}
        </Col>
    )
}

const BracketHook1 = (props) => {
    const { colIndex, hookCount, config } = props
    const colClassname = config.column_count === 5 ? 'col-brk-2' : 'col-brk-2'
    return (
        <Col className={colClassname}>
            {Array.from(Array(hookCount), (e, i) => {
                return (
                    <React.Fragment key={i}>
                        {colIndex === 0 && (
                            <React.Fragment>
                                {i === 0 && <Row className="bracket-hook1-gap-height-00 no-margin-lr"></Row>}
                                <Row className="no-gutters no-margin-lr">
                                    <Col className="col-sm-12 bracket-hook10"></Col>
                                </Row>
                                {i < hookCount - 1 && <Row className="bracket-hook1-gap-height-01"></Row>}
                            </React.Fragment>
                        )}
                        {colIndex === 1 && (
                            <React.Fragment>
                                {i === 0 && <Row className="bracket-hook1-gap-height-10 no-margin-lr"></Row>}
                                <Row className="no-gutters no-margin-lr">
                                    <Col className="col-sm-12 bracket-hook11"></Col>
                                </Row>
                                {i < hookCount - 1 && <Row className="bracket-hook1-gap-height-11"></Row>}
                            </React.Fragment>
                        )}
                        {colIndex === 2 && (
                            <React.Fragment>
                                {i === 0 && <Row className="bracket-hook1-gap-height-20 no-margin-lr"></Row>}
                                <Row className="no-gutters no-margin-lr">
                                    <Col className="col-sm-12 bracket-hook12"></Col>
                                </Row>
                                {i < hookCount - 1 && <Row className="bracket-hook1-gap-height-21"></Row>}
                            </React.Fragment>
                        )}
                        {colIndex === 3 && (
                            <React.Fragment>
                                {i === 0 && <Row className="bracket-hook1-gap-height-30 no-margin-lr"></Row>}
                                <Row className="no-gutters no-margin-lr">
                                    <Col className="col-sm-12 bracket-hook13"></Col>
                                </Row>
                            </React.Fragment>
                        )}
                    </React.Fragment>
                )
            })}
        </Col>
    )
}

const BracketHook2 = (props) => {
    const { colIndex, hookCount, config } = props
    const colClassname = config.column_count === 5 ? 'col-brk-2' : 'col-brk-2'
    return (
        <Col className={colClassname}>
            {Array.from(Array(hookCount), (e, i) => {
                return (
                    <React.Fragment key={i}>
                        {colIndex === 0 && (
                            <React.Fragment>
                                {i === 0 && (
                                    <Row className="no-gutters no-margin-lr">
                                        <Col className="col-sm-12 bracket-hook200"></Col>
                                    </Row>
                                )}
                                {i > 0 && (
                                    <Row className="no-gutters no-margin-lr">
                                        <Col className="col-sm-12 bracket-hook201"></Col>
                                    </Row>
                                )}
                            </React.Fragment>
                        )}
                        {colIndex === 1 && (
                            <React.Fragment>
                                {i === 0 && (
                                    <Row className="no-gutters no-margin-lr">
                                        <Col className="col-sm-12 bracket-hook210"></Col>
                                    </Row>
                                )}
                                {i > 0 && (
                                    <Row className="no-gutters no-margin-lr">
                                        <Col className="col-sm-12 bracket-hook211"></Col>
                                    </Row>
                                )}
                            </React.Fragment>
                        )}
                        {colIndex === 2 && (
                            <React.Fragment>
                                {i === 0 && (
                                    <Row className="no-gutters no-margin-lr">
                                        <Col className="col-sm-12 bracket-hook220"></Col>
                                    </Row>
                                )}
                                {i > 0 && (
                                    <Row className="no-gutters no-margin-lr">
                                        <Col className="col-sm-12 bracket-hook221"></Col>
                                    </Row>
                                )}
                            </React.Fragment>
                        )}
                        {colIndex === 3 && (
                            <React.Fragment>
                                {i === 0 && (
                                    <Row className="no-gutters no-margin-lr">
                                        <Col className="col-sm-12 bracket-hook230"></Col>
                                    </Row>
                                )}
                            </React.Fragment>
                        )}
                    </React.Fragment>
                )
            })}
        </Col>
    )
}

const BracketBox = (props) => {
    const { match, colIndex, lastBox, config } = props
    const stadiumStr = match.stadium && match.city ? match.stadium + ', ' + match.city : ''
    const homeTeamName = getShortTeamName(match.home_team, config)
    const awayTeamName = getShortTeamName(match.away_team, config)
    const homeTeamFlag = getBracketTeamFlagId(match.home_team, config)
    const awayTeamFlag = getBracketTeamFlagId(match.away_team, config)
    const homeExtraScore = match.home_extra_score ? match.home_extra_score : 0
    const awayExtraScore = match.away_extra_score ? match.away_extra_score : 0
    const homeScore = match.home_score + homeExtraScore
    const awayScore = match.away_score + awayExtraScore
    const homePenaltyScore = match.home_penalty_score ? match.home_penalty_score : 0
    const awayPenaltyScore = match.away_penalty_score ? match.away_penalty_score : 0
    const homeHighlight =
        (isHomeWinMatch(match) && !match.home_withdrew) || match.shared_bronze || match.match_postponed || match.home_bye ? 'team-name-win' : 'team-name-lose'
    const awayHighlight =
        (!isHomeWinMatch(match) && !match.away_withdrew) || match.shared_bronze || match.match_postponed || match.away_bye ? 'team-name-win' : 'team-name-lose'
    const home_champion_striped = config.championship && match.final && isHomeWinMatch(match) ? 'gold' : ''
    const away_champion_striped = config.championship && match.final && !isHomeWinMatch(match) ? 'gold' : ''
    const home_runnerup_striped = config.championship && match.final && !isHomeWinMatch(match) ? 'silver' : ''
    const away_runnerup_striped = config.championship && match.final && isHomeWinMatch(match) ? 'silver' : ''
    const home_thirdplace_striped = match.third_place && (isHomeWinMatch(match) || match.shared_bronze) ? 'bronze' : ''
    const away_thirdplace_striped = match.third_place && (!isHomeWinMatch(match) || match.shared_bronze) ? 'bronze' : ''
    return (
        <React.Fragment>
            <Row className="no-gutters box-sm bracket-box-height">
                <Col sm="12" className="bracket-box-header-height border-bottom-gray5">
                    <Row className="no-gutters">
                        <Col xs={{ size: 11, offset: 1 }}>
                            <span className="box-time d-none d-lg-block">
                                <React.Fragment>
                                    {moment(match.date).format('MMMM D, YYYY')}
                                    {match.time ? ' @' : ''} {match.time}
                                </React.Fragment>
                            </span>
                        </Col>
                    </Row>
                </Col>
                <Col
                    sm="12"
                    className={`bracket-half-box-height no-padding-lr border-bottom-gray5 ${home_champion_striped}${home_runnerup_striped}${home_thirdplace_striped}`}
                >
                    <Row className="no-gutters h3-ff3">
                        <Col xs={{ size: 2 }} className="brk-halfbox-ml">
                            {homeTeamFlag}
                        </Col>
                        <Col xs={{ size: 7 }} className={`no-padding-lr ${homeHighlight}`}>
                            {homeTeamName} {(homeExtraScore > awayExtraScore || match.home_coin_toss) && <AetTooltip target="aetTooltip" anchor="(aet)" />}
                            {match.extra_time_skipped && <AetSkippedTooltip target="aetSkippedTooltip" anchor="(no.e.t.)" />}
                            {match.home_golden_goal && <GoldenGoalTooltip target={`${match.home_team}goldenGoalTooltip`} anchor="(gg)" />}
                            {match.home_silver_goal && <SilverGoalTooltip target={`${match.home_team}silverGoalTooltip`} anchor="(sg)" />}
                            {homePenaltyScore > awayPenaltyScore && <PenaltyTooltip target="penaltyTooltip" anchor="(pen)" />}
                            {match.replay_required && (
                                <ReplayTooltip target={`${match.home_team}${match.away_team}replayBracketTooltip`} notes="Replay" anchor="(r)" />
                            )}
                            {match.shared_bronze && <SharedBronzeTooltip target={`${match.home_team}sharedBronzeTooltip`} notes={match.shared_bronze_notes} />}
                            {match.home_draw_lot && <DrawLotTooltip target="drawLotTooltip" notes={match.draw_lot_notes} />}
                            {match.match_postponed && (
                                <MatchPostponedTooltip target={`${match.home_team}postponedTooltip`} notes={match.postponed_notes} anchor="(mp)" />
                            )}
                            {match.home_bye && <ByeTooltip target={`${match.home_team}byeTooltip`} notes={match.bye_notes} anchor="(bye)" />}
                            {match.home_withdrew && (
                                <WithdrewTooltip target={`${match.home_team}withdrewTooltip`} notes={match.home_withdrew_notes} anchor="(withdrew)" />
                            )}
                            {match.home_disqualified && (
                                <DisqualifiedTooltip
                                    target={`${match.home_team}disqualifiedTooltip`}
                                    notes={match.disqualified_notes}
                                    anchor="(disqualified)"
                                />
                            )}
                            {match.home_awarded && <AwardedTooltip target={`${match.home_team}awardedTooltip`} notes={match.awarded_notes} />}
                            {match.home_replacement && (
                                <ReplacementTooltip target={`${match.home_team}replacementTooltip`} notes={match.replacement_notes} anchor="(r)" />
                            )}
                            {match.home_coin_toss && (
                                <CoinTossTooltip target={`${match.home_team}cointossTooltip`} notes={match.coin_toss_notes} anchor="(cointoss)" />
                            )}
                        </Col>
                        <Col xs={{ size: 2 }} className={`no-padding-lr ${homeHighlight}`}>
                            {!isNaN(homeScore) && !match.match_postponed && !match.home_bye && !match.home_withdrew && (
                                <React.Fragment>{homeScore}</React.Fragment>
                            )}
                            {(homePenaltyScore !== 0 || awayPenaltyScore !== 0) && (
                                <React.Fragment>
                                    {' ('}
                                    {homePenaltyScore}
                                    {')'}
                                </React.Fragment>
                            )}
                            {match.home_replay_score !== undefined && (
                                <React.Fragment>
                                    {' ('}
                                    {match.home_replay_score}
                                    {')'}
                                </React.Fragment>
                            )}
                            {match.home_walkover && <WalkoverTooltip target="walkoverTooltip" content="Walkover" anchor="(w/o)" />}
                        </Col>
                    </Row>
                </Col>
                <Col sm="12" className={`bracket-half-box-height no-padding-lr ${away_champion_striped}${away_runnerup_striped}${away_thirdplace_striped}`}>
                    <Row className="no-gutters h4-ff3">
                        <Col xs={{ size: 2 }} className="brk-halfbox-ml">
                            {awayTeamFlag}
                        </Col>
                        <Col xs={{ size: 7 }} className={`no-padding-lr ${awayHighlight}`}>
                            {awayTeamName} {(awayExtraScore > homeExtraScore || match.away_coin_toss) && <AetTooltip target="aetTooltip" anchor="(aet)" />}
                            {match.away_golden_goal && <GoldenGoalTooltip target={`${match.away_team}goldenGoalTooltip`} anchor="(gg)" />}
                            {match.away_silver_goal && <SilverGoalTooltip target={`${match.away_team}silverGoalTooltip`} anchor="(sg)" />}
                            {awayPenaltyScore > homePenaltyScore && <PenaltyTooltip target="penaltyTooltip" anchor="(pen)" />}
                            {match.shared_bronze && <SharedBronzeTooltip target={`${match.away_team}sharedBronzeTooltip`} notes={match.shared_bronze_notes} />}
                            {match.away_draw_lot && <DrawLotTooltip target="drawLotTooltip" notes={match.draw_lot_notes} />}
                            {match.match_postponed && (
                                <MatchPostponedTooltip target={`${match.away_team}postponedTooltip`} notes={match.postponed_notes} anchor="(mp)" />
                            )}
                            {match.away_bye && <ByeTooltip target={`${match.away_team}byeTooltip`} notes={match.bye_notes} anchor="(bye)" />}
                            {match.away_withdrew && (
                                <WithdrewTooltip target={`${match.away_team}withdrewTooltip`} notes={match.away_withdrew_notes} anchor="(withdrew)" />
                            )}
                            {match.away_disqualified && (
                                <DisqualifiedTooltip
                                    target={`${match.away_team}disqualifiedTooltip`}
                                    notes={match.disqualified_notes}
                                    anchor="(disqualified)"
                                />
                            )}
                            {match.away_awarded && <AwardedTooltip target={`awardedTooltip`} notes={match.awarded_notes} />}
                            {match.away_replacement && (
                                <ReplacementTooltip target={`${match.away_team}replacementTooltip`} notes={match.replacement_notes} anchor="(r)" />
                            )}
                            {match.away_coin_toss && (
                                <CoinTossTooltip target={`${match.away_team}cointossTooltip`} notes={match.coin_toss_notes} anchor="(cointoss)" />
                            )}
                        </Col>
                        <Col xs={{ size: 2 }} className={`no-padding-lr ${awayHighlight}`}>
                            {!isNaN(awayScore) && !match.match_postponed && !match.away_bye && !match.away_withdrew && (
                                <React.Fragment>{awayScore}</React.Fragment>
                            )}
                            {(homePenaltyScore !== 0 || awayPenaltyScore !== 0) && (
                                <React.Fragment>
                                    {' ('}
                                    {awayPenaltyScore}
                                    {')'}
                                </React.Fragment>
                            )}
                            {match.away_replay_score !== undefined && (
                                <React.Fragment>
                                    {' ('}
                                    {match.away_replay_score}
                                    {')'}
                                </React.Fragment>
                            )}
                            {match.away_walkover && <WalkoverTooltip target="walkoverTooltip" content={match.walkover_notes} anchor="(w/o)" />}
                        </Col>
                    </Row>
                </Col>
                <Col sm="12" className="bracket-box-header-height border-top-gray5">
                    <Row className="no-gutters">
                        <Col xs={{ size: 11, offset: 1 }}>
                            <span className="box-time d-none d-lg-block">
                                <React.Fragment>{stadiumStr}</React.Fragment>
                            </span>
                        </Col>
                    </Row>
                </Col>
            </Row>
            {colIndex === 0 && !lastBox && <Row className="bracket-gap-height-01"></Row>}
            {colIndex === 1 && !lastBox && <Row className="bracket-gap-height-11"></Row>}
            {colIndex === 2 && !lastBox && <Row className="bracket-gap-height-21"></Row>}
            {colIndex === 3 && !lastBox && <Row className="bracket-gap-height-31"></Row>}
        </React.Fragment>
    )
}

const BracketPairBox = (props) => {
    const { match, colIndex, lastBox, config } = props
    const homeTeamName = getShortTeamName(match.home_team, config)
    const awayTeamName = getShortTeamName(match.away_team, config)
    const homeTeamFlag = getBracketTeamFlagId(match.home_team, config)
    const awayTeamFlag = getBracketTeamFlagId(match.away_team, config)
    const homeHighlight =
        (isHomeWinMatch(match) && !match.home_withdrew) || match.shared_bronze || match.match_postponed || match.home_bye ? 'team-name-win' : 'team-name-lose'
    const awayHighlight =
        (!isHomeWinMatch(match) && !match.away_withdrew) || match.shared_bronze || match.match_postponed || match.away_bye ? 'team-name-win' : 'team-name-lose'
    const leg2_home_extra_score = match.leg2_home_extra_score ? match.leg2_home_extra_score : 0
    const leg2_away_extra_score = match.leg2_away_extra_score ? match.leg2_away_extra_score : 0
    const leg2_home_score = match.leg2_home_score + leg2_home_extra_score
    const leg2_away_score = match.leg2_away_score + leg2_away_extra_score
    const home_champion_striped = match.final && isHomeWinMatch(match) ? 'gold' : ''
    const away_champion_striped = match.final && !isHomeWinMatch(match) ? 'gold' : ''
    const home_runnerup_striped = match.final && !isHomeWinMatch(match) ? 'silver' : ''
    const away_runnerup_striped = match.final && isHomeWinMatch(match) ? 'silver' : ''
    const home_thirdplace_striped = match.third_place && (isHomeWinMatch(match) || match.shared_bronze) ? 'bronze' : ''
    const away_thirdplace_striped = match.third_place && (!isHomeWinMatch(match) || match.shared_bronze) ? 'bronze' : ''
    const nameColumnSize = match.leg2_home_penalty_score || match.leg2_away_penalty_score ? 'col-5' : 'col-6'
    const aggColumnSize = match.leg2_home_penalty_score || match.leg2_away_penalty_score ? 'col-2' : 'col-1'
    return (
        <React.Fragment>
            {!match.blank ? (
                <Row className="no-gutters box-sm bracket-box-height">
                    <Col sm="12" className="bracket-box-header-height border-bottom-gray5">
                        <Row className="no-gutters">
                            <Col xs={{ size: 11, offset: 1 }}>
                                <span className="box-time d-none d-lg-block">
                                    <React.Fragment>
                                        {moment(match.leg1_date).format('MMMM D, YYYY')}
                                        {match.leg1_time ? ' @' : ''} {match.leg1_time}
                                        {match.leg1_city ? ' - ' : ''} {match.leg1_city}
                                    </React.Fragment>
                                </span>
                            </Col>
                        </Row>
                    </Col>
                    <Col
                        sm="12"
                        className={`bracket-half-box-height no-padding-lr border-bottom-gray5 ${home_champion_striped}${home_runnerup_striped}${home_thirdplace_striped}`}
                    >
                        <Row className="no-gutters h3-ff3">
                            <Col xs={{ size: 2 }} className="brk-halfbox-ml">
                                {homeTeamFlag}
                            </Col>
                            <Col className={`no-padding-lr ${nameColumnSize} ${homeHighlight}`}>
                                {homeTeamName} {match.home_draw_lot && <DrawLotTooltip target="drawLotTooltip" notes={match.draw_lot_notes} />}
                                {match.home_playoff_win && <AetTooltip target="aetPlayoffTooltip" anchor="(aet)" notes={match.playoff_notes} />}
                                {(match.leg2_home_extra_score > match.leg2_away_extra_score ||
                                    (match.leg2_home_extra_score !== undefined &&
                                        match.leg2_home_extra_score === match.leg2_away_extra_score &&
                                        match.away_goal_winner === 'home')) && <AetTooltip target="aetTooltip" anchor="(aet)" />}
                                {match.away_goal_winner === 'home' && <AwayGoalsTooltip target="awayGoalsTooltip" anchor="(a)" />}
                                {match.leg2_home_penalty_score > match.leg2_away_penalty_score && <PenaltyTooltip target="penaltyTooltip" anchor="(pen)" />}
                                {match.home_walkover && (
                                    <WalkoverTooltip target={`${match.home_team}walkoverTooltip`} anchor="(w/o)" content={match.walkover_notes} />
                                )}
                                {match.home_disqualified && (
                                    <DisqualifiedTooltip target={`${match.home_team}disqualifiedTooltip`} notes={match.disqualified_notes} anchor="(dq)" />
                                )}
                            </Col>
                            <Col xs={{ size: 1 }} className={`no-padding-lr ${homeHighlight}`}>
                                <React.Fragment>{match.leg1_home_score}</React.Fragment>
                            </Col>
                            {!isNaN(leg2_home_score) && (
                                <Col xs={{ size: 1 }} className={`no-padding-lr ${homeHighlight}`}>
                                    <React.Fragment>{leg2_home_score}</React.Fragment>
                                </Col>
                            )}
                            {!isNaN(leg2_home_score) && match.playoff_home_score === undefined && !config.pair_agg_points && (
                                <Col className={`no-padding-lr ${aggColumnSize} ${homeHighlight}`}>
                                    <React.Fragment>{match.agg_home_score}</React.Fragment>
                                    {match.leg2_home_penalty_score !== undefined && <React.Fragment> ({match.leg2_home_penalty_score})</React.Fragment>}
                                </Col>
                            )}
                            {match.playoff_home_score !== undefined && (
                                <Col xs={{ size: 1 }} className={`no-padding-lr ${homeHighlight}`}>
                                    <React.Fragment>{match.playoff_home_score}</React.Fragment>
                                </Col>
                            )}
                        </Row>
                    </Col>
                    <Col sm="12" className={`bracket-half-box-height no-padding-lr ${away_champion_striped}${away_runnerup_striped}${away_thirdplace_striped}`}>
                        <Row className="no-gutters h4-ff3">
                            <Col xs={{ size: 2 }} className="brk-halfbox-ml">
                                {awayTeamFlag}
                            </Col>
                            <Col className={`no-padding-lr ${nameColumnSize} ${awayHighlight}`}>
                                {awayTeamName} {match.away_draw_lot && <DrawLotTooltip target="drawLotTooltip" notes={match.draw_lot_notes} />}
                                {match.away_playoff_win && <AetTooltip target="aetPlayoffTooltip" anchor="(aet)" notes={match.playoff_notes} />}
                                {(match.leg2_away_extra_score > match.leg2_home_extra_score ||
                                    (match.leg2_away_extra_score !== undefined &&
                                        match.leg2_home_extra_score === match.leg2_away_extra_score &&
                                        match.away_goal_winner === 'away')) && <AetTooltip target="aetTooltip" anchor="(aet)" />}
                                {match.away_goal_winner === 'away' && <AwayGoalsTooltip target="awayGoalsTooltip" anchor="(a)" />}
                                {match.leg2_away_penalty_score > match.leg2_home_penalty_score && <PenaltyTooltip target="penaltyTooltip" anchor="(pen)" />}
                                {match.away_walkover && (
                                    <WalkoverTooltip target={`${match.away_team}walkoverTooltip`} anchor="(w/o)" content={match.walkover_notes} />
                                )}
                                {match.away_disqualified && (
                                    <DisqualifiedTooltip target={`${match.away_team}disqualifiedTooltip`} notes={match.disqualified_notes} anchor="(dq)" />
                                )}
                            </Col>
                            <Col xs={{ size: 1 }} className={`no-padding-lr ${awayHighlight}`}>
                                <React.Fragment>{match.leg1_away_score}</React.Fragment>
                            </Col>
                            {!isNaN(leg2_away_score) && (
                                <Col xs={{ size: 1 }} className={`no-padding-lr ${awayHighlight}`}>
                                    <React.Fragment>{leg2_away_score}</React.Fragment>
                                </Col>
                            )}
                            {!isNaN(leg2_away_score) && match.playoff_away_score === undefined && !config.pair_agg_points && (
                                <Col className={`no-padding-lr ${aggColumnSize} ${awayHighlight}`}>
                                    <React.Fragment>{match.agg_away_score}</React.Fragment>
                                    {match.leg2_away_penalty_score !== undefined && <React.Fragment> ({match.leg2_away_penalty_score})</React.Fragment>}
                                </Col>
                            )}
                            {match.playoff_away_score !== undefined && (
                                <Col xs={{ size: 1 }} className={`no-padding-lr ${awayHighlight}`}>
                                    <React.Fragment>{match.playoff_away_score}</React.Fragment>
                                </Col>
                            )}
                        </Row>
                    </Col>
                    <Col sm="12" className="bracket-box-header-height border-top-gray5">
                        <Row className="no-gutters">
                            <Col xs={{ size: 11, offset: 1 }}>
                                <span className="box-time d-none d-lg-block">
                                    <React.Fragment>
                                        {moment(match.leg2_date).format('MMMM D, YYYY')}
                                        {match.leg2_time ? ' @' : ''} {match.leg2_time}
                                        {match.leg2_city ? ' - ' : ''} {match.leg2_city}
                                    </React.Fragment>
                                </span>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            ) : (
                <Row className="no-gutters box-sm bracket-box-height"></Row>
            )}
            {colIndex === 0 && !lastBox && <Row className="bracket-gap-height-01"></Row>}
            {colIndex === 1 && !lastBox && <Row className="bracket-gap-height-11"></Row>}
            {colIndex === 2 && !lastBox && <Row className="bracket-gap-height-21"></Row>}
            {colIndex === 3 && !lastBox && <Row className="bracket-gap-height-31"></Row>}
        </React.Fragment>
    )
}

const BracketBoxBye = (props) => {
    const { match, colIndex, lastBox, config } = props
    const byeTeam = match.away_team === 'BYE' ? match.home_team : match.away_team
    const byeTeamName = getShortTeamName(byeTeam, config)
    const byeTeamFlag = getBracketTeamFlagId(byeTeam, config)
    return (
        <React.Fragment>
            <Row className="no-gutters box-sm bracket-box-height">
                <Col sm="12" className="no-padding-lr">
                    <Row className="no-gutters h3-ff3 padding-top-lg">
                        <Col xs={{ size: 2 }} className="brk-halfbox-ml">
                            {byeTeamFlag}
                        </Col>
                        <Col xs={{ size: 9 }} className={`no-padding-lr team-name-win`}>
                            {byeTeamName} <span className="blue">(bye)</span>
                        </Col>
                    </Row>
                </Col>
            </Row>
            {colIndex === 0 && !lastBox && <Row className="bracket-gap-height-01"></Row>}
            {colIndex === 1 && !lastBox && <Row className="bracket-gap-height-11"></Row>}
            {colIndex === 2 && !lastBox && <Row className="bracket-gap-height-21"></Row>}
            {colIndex === 3 && !lastBox && <Row className="bracket-gap-height-31"></Row>}
        </React.Fragment>
    )
}

const BracketColInner = (props) => {
    const { round, colIndex, config } = props
    const isOlympic = config.competition_id === 'MOFT' || config.competition_id === 'WOFT'
    const roundName = isOlympic ? (round.name === 'Final' ? 'Gold Medal' : round.name === 'Third place' ? 'Bronze Medal' : round.name) : round.name
    return (
        <React.Fragment>
            {colIndex === 0 && <Row className="bracket-gap-height-00"></Row>}
            {colIndex === 1 && <Row className="bracket-gap-height-10"></Row>}
            {colIndex === 2 && <Row className="bracket-gap-height-20"></Row>}
            {colIndex === 3 && <Row className="bracket-gap-height-30"></Row>}
            <Row className="no-margin-lr">
                <Col>
                    <div className="h2-ff1 margin-top-md d-none d-xl-block">{roundName}</div>
                    {round.bracketMatches &&
                        round.bracketMatches.map((m, index) => {
                            const bye = m.home_team === 'BYE' || m.away_team === 'BYE'
                            const lastBox = round.bracketMatches ? index === round.bracketMatches.length - 1 : false
                            return bye ? (
                                <BracketBoxBye match={m} colIndex={colIndex} lastBox={lastBox} config={config} key={index} />
                            ) : round.round_type === 'knockout2legged' ? (
                                <BracketPairBox match={m} colIndex={colIndex} lastBox={lastBox} config={config} key={index} />
                            ) : (
                                <BracketBox match={m} colIndex={colIndex} lastBox={lastBox} config={config} key={index} />
                            )
                        })}
                </Col>
            </Row>
        </React.Fragment>
    )
}

const BracketCol = (props) => {
    const { round, colIndex, config } = props
    const colWidth = config.column_count > 4 ? 'col-brk-16' : 'col-brk-22'
    return (
        <Col className={colWidth}>
            <BracketColInner round={round} colIndex={colIndex} config={config} />
        </Col>
    )
}

const BracketTable = (props) => {
    const { stage, config } = props
    return (
        <Row className="no-gutters">
            {stage.rounds &&
                stage.rounds.map((r, index) => {
                    if (r.bracketMatches) {
                        const roundConfig = { ...config, column_count: stage.rounds.length, championship: r.championship }
                        const hookCount = r.bracketMatches.length % 2 === 0 ? r.bracketMatches.length / 2 : (r.bracketMatches.length - 1) / 2
                        if (r.final) {
                            return <BracketFinalCol round={r} config={roundConfig} key={r.name} />
                        } else {
                            return (
                                <React.Fragment key={r.name}>
                                    <BracketCol round={r} colIndex={index} config={roundConfig} />
                                    <BracketHook1 colIndex={index} hookCount={hookCount} config={roundConfig} />
                                    <BracketHook2 colIndex={index} hookCount={hookCount} config={roundConfig} />
                                </React.Fragment>
                            )
                        }
                    }
                    return null
                })}
        </Row>
    )
}

class Brackets extends React.Component {
    render() {
        const { stage, config, isImagine } = this.props
        const excludePreliminaryRounds = { ...stage, rounds: stage.rounds && stage.rounds.filter((r) => r.name !== 'Preliminary Round') }
        return (
            <React.Fragment>
                {isImagine && (
                    <BracketsCollapse title="Brackets" initialStatus="Opened">
                        <BracketTable stage={stage} config={config} />
                    </BracketsCollapse>
                )}
                {!isImagine && <BracketTable stage={excludePreliminaryRounds} config={config} />}
            </React.Fragment>
        )
    }
}

export default Brackets
