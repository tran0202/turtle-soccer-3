import React from 'react'
import { Row, Col } from 'reactstrap'
import moment from 'moment'
import { getTeamName, getTeamFlagId, isHomeWinMatch } from '../core/TeamHelper'
import { AetTooltip, GoldenGoalTooltip, ReplayTooltip, WalkoverTooltip } from '../core/TooltipHelper'

const MatchRow = (props) => {
    const { m, round, config, last } = props
    const isByeMatch = (m.home_team === 'BYE') | (m.away_team === 'BYE')
    const pairHomeHighlight = isHomeWinMatch(m) || m.replay_required ? 'team-name-win' : 'team-name-lose'
    const pairAwayHighlight = !isHomeWinMatch(m) || m.replay_required ? 'team-name-win' : 'team-name-lose'
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
            {' >>> '} <b>{teamWon}</b> won World Cup {config.year}!
        </React.Fragment>
    )
    const thirdPlaceLine = (
        <React.Fragment>
            {' >>> '} <b>{teamWon}</b> won the third place
        </React.Fragment>
    )
    return (
        !isByeMatch && (
            <React.Fragment key={m.id}>
                <Row className="no-gutters ranking-tbl team-row padding-tb-sm">
                    <Col className="col-box-14 font-14">
                        {m.time ? ' @' : ''} {m.time}
                        <br />
                        {m.stadium && m.city ? m.stadium + ', ' + m.city : ''}
                    </Col>
                    <Col className={`col-box-25 text-end ${pairHomeHighlight}`}>{homeTeamName}</Col>
                    <Col className="col-box-6">{getTeamFlagId(m.home_team, config)}</Col>
                    <Col className="text-center score-no-padding-right col-box-14">
                        {!m.home_walkover && !m.away_walkover && (
                            <React.Fragment>
                                {matchHomeScore} - {matchAwayScore}
                            </React.Fragment>
                        )}{' '}
                        {m.home_extra_score !== undefined && <AetTooltip target="aetTooltip" anchor="(a.e.t.)" />}
                        {(m.home_golden_goal || m.away_golden_goal) && <GoldenGoalTooltip target="goldenGoalTooltip" anchor="(gg)" />}
                        {(m.home_walkover || m.away_walkover) && <WalkoverTooltip target="walkoverTooltip" content="Walkover" anchor="(w/o)" />}
                        {m.replay_required && <ReplayTooltip target={`${homeTeamName}${awayTeamName}replayTooltip`} notes="Replay Required" anchor="(r)" />}
                    </Col>
                    <Col className="col-box-6">{getTeamFlagId(m.away_team, config)}</Col>
                    <Col className={`col-box-25 ${pairAwayHighlight}`}>{awayTeamName}</Col>
                </Row>
                {m.home_extra_score !== undefined && (
                    <Row className="no-gutters aggregate-line team-row padding-tb-sm">
                        <Col xs={{ size: 7, offset: 5 }}>
                            {!m.replay_required && (
                                <React.Fragment>
                                    {teamWonLine}
                                    {extraTimeLine}
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
                {round.championship && m.final && (
                    <Row className="no-gutters aggregate-line team-row padding-tb-sm">
                        <Col xs={{ size: 7, offset: 5 }}>{championshipLine}</Col>
                    </Row>
                )}
                {round.championship && m.third_place && (
                    <Row className="no-gutters aggregate-line team-row padding-tb-sm">
                        <Col xs={{ size: 7, offset: 5 }}>{thirdPlaceLine}</Col>
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
    const final = round.matchdays && round.matchdays.find((md) => md.final)
    const thirdPlace = round.matchdays && round.matchdays.find((md) => md.third_place)
    return (
        <Row>
            <Col className="mt-3 round-box">
                {thirdPlace && (
                    <React.Fragment>
                        <Row>
                            <Col>
                                <div className="h2-ff1 margin-top-md">Third place</div>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm="12" className="h5-ff6 border-bottom-gray4 margin-top-md">
                                {moment(thirdPlace.date).format('dddd, MMMM D, YYYY')}
                            </Col>
                        </Row>
                        {thirdPlace.matches &&
                            thirdPlace.matches.map((m, index) => {
                                const lastMatch = index === thirdPlace.matches.length - 1
                                return <MatchRow key={index} m={m} round={round} config={config} last={lastMatch} />
                            })}
                    </React.Fragment>
                )}
                {final && (
                    <React.Fragment>
                        <Row>
                            <Col>
                                <div className="h2-ff1 margin-top-md">{round.name}</div>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm="12" className="h5-ff6 border-bottom-gray4 margin-top-md">
                                {moment(final.date).format('dddd, MMMM D, YYYY')}
                            </Col>
                        </Row>
                        {final.matches &&
                            final.matches.map((m, index) => {
                                const lastMatch = index === final.matches.length - 1
                                return <MatchRow key={index} m={m} round={round} config={config} last={lastMatch} />
                            })}
                    </React.Fragment>
                )}
            </Col>
        </Row>
    )
}

const MatchesKnockoutPath = (props) => {
    const { paths, config } = props
    return (
        <React.Fragment>
            {paths &&
                paths.map((p) => {
                    return (
                        <React.Fragment key={p.name}>
                            <Row>
                                <Col sm="12" className="h2-ff6 border-bottom-double-gray3 margin-top-md">
                                    {p.name}
                                </Col>
                            </Row>
                            <MatchesKnockoutRound key={p.name} rounds={p.rounds} config={config} />
                        </React.Fragment>
                    )
                })}
        </React.Fragment>
    )
}

const MatchesKnockoutRound = (props) => {
    const { rounds, config } = props
    return (
        <React.Fragment>
            {rounds &&
                rounds.map((r) => {
                    return !r.final ? (
                        <MatchesKnockoutRow key={r.name} round={r} config={config} />
                    ) : (
                        <MatchesKnockoutRowFinal key={r.name} round={r} config={config} />
                    )
                })}
        </React.Fragment>
    )
}

class MatchesKnockout extends React.Component {
    render() {
        const { stage, config } = this.props
        const { rounds, paths } = stage
        const is_stage_qualify = stage.advancement && stage.advancement[0].will === 'qualify'
        const is_stage_next_round = !stage.advancement
            ? false
            : stage.advancement.length === 1
            ? stage.advancement[0].will === 'next_round'
            : stage.advancement[1].will === 'next_round'
        const new_config = { ...config, year: config.year, is_stage_qualify, is_stage_next_round, next_stage: stage.next_stage }
        return (
            <React.Fragment>
                <Row className="mt-3">
                    <Col xs={{ size: 12 }}>
                        {stage.rounds && <MatchesKnockoutRound rounds={rounds} config={new_config} />}
                        {stage.paths && <MatchesKnockoutPath paths={paths} config={new_config} />}
                    </Col>
                </Row>
            </React.Fragment>
        )
    }
}

export default MatchesKnockout
