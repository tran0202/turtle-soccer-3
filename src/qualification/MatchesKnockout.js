import React from 'react'
import { Row, Col } from 'reactstrap'
import moment from 'moment'
import { getTeamName, getTeamFlagId, isHomeWinMatch } from '../core/TeamHelper'
import { AetTooltip } from '../core/TooltipHelper'

const MatchesKnockoutRow = (props) => {
    const { round, config } = props
    return (
        <React.Fragment>
            <Row>
                <Col>
                    <div className="h2-ff1 margin-top-md">{round.name}</div>
                </Col>
            </Row>
            {round.matchdays &&
                round.matchdays.map((md) => {
                    return (
                        <React.Fragment key={md.date}>
                            <Row>
                                <Col sm="12" className="h5-ff6 border-bottom-gray2 margin-top-md">
                                    {moment(md.date).format('dddd, MMMM D, YYYY')}
                                </Col>
                            </Row>
                            {md.matches &&
                                md.matches.map((m) => {
                                    const pairHomeHighlight = isHomeWinMatch(m) ? 'team-name-win' : 'team-name-lose'
                                    const pairAwayHighlight = !isHomeWinMatch(m) ? 'team-name-win' : 'team-name-lose'
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
                                    const extraTimeLine =
                                        m.home_extra_score !== undefined && m.home_penalty_score === undefined ? (
                                            <span className="blue"> after extra time</span>
                                        ) : (
                                            ''
                                        )
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
                                    return (
                                        <React.Fragment key={m.id}>
                                            <Row className="no-gutters ranking-tbl team-row padding-tb-sm">
                                                <Col className="col-box-14"></Col>
                                                <Col className={`col-box-25 text-end ${pairHomeHighlight}`}>{homeTeamName}</Col>
                                                <Col className="col-box-6">{getTeamFlagId(m.home_team, config)}</Col>
                                                <Col className="text-center score-no-padding-right col-box-14">
                                                    {matchHomeScore} - {matchAwayScore}{' '}
                                                    {m.home_extra_score !== undefined && <AetTooltip target="aetTooltip" anchor="(a.e.t.)" />}
                                                </Col>
                                                <Col className="col-box-6">{getTeamFlagId(m.away_team, config)}</Col>
                                                <Col className={`col-box-25 ${pairAwayHighlight}`}>{awayTeamName}</Col>
                                            </Row>
                                            {m.home_extra_score !== undefined && (
                                                <Row className="no-gutters aggregate-line team-row padding-tb-sm">
                                                    <Col xs={{ size: 7, offset: 5 }}>
                                                        {teamWonLine}
                                                        {extraTimeLine}
                                                        {penaltyLine}
                                                    </Col>
                                                </Row>
                                            )}
                                            {round.final && config.is_stage_qualify && (
                                                <Row className="no-gutters aggregate-line team-row padding-tb-sm">
                                                    <Col xs={{ size: 7, offset: 5 }}>{qualifyLine}</Col>
                                                </Row>
                                            )}
                                            {round.final && (
                                                <Row className="no-gutters aggregate-line team-row padding-tb-sm">
                                                    <Col xs={{ size: 7, offset: 5 }}>{nextRoundLine}</Col>
                                                </Row>
                                            )}

                                            <Row className="border-bottom-gray5 margin-left-sm margin-top-sm" />
                                        </React.Fragment>
                                    )
                                })}
                        </React.Fragment>
                    )
                })}
        </React.Fragment>
    )
}

class MatchesKnockout extends React.Component {
    render() {
        const { state, stage } = this.props
        const { rounds } = stage
        const is_stage_qualify = !stage.advancement ? false : stage.advancement[0].will === 'qualify'
        const config = { ...state.config, year: state.tournament.year, is_stage_qualify, next_stage: stage.next_stage }
        return (
            <React.Fragment>
                <Row className="mt-3 box-white">
                    <Col xs={{ size: 12 }}>
                        {rounds &&
                            rounds.map((r) => {
                                return <MatchesKnockoutRow key={r.name} round={r} config={config} />
                            })}
                    </Col>
                </Row>
            </React.Fragment>
        )
    }
}

export default MatchesKnockout
