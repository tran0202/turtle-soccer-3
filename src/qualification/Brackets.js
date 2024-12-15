import React, { useState } from 'react'
import { Collapse, Row, Col, Button } from 'reactstrap'
import moment from 'moment'
import { getShortTeamName, getBracketTeamFlagId, isHomeWinMatch } from '../core/TeamHelper'
import { AetTooltip, PenaltyTooltip } from '../core/TooltipHelper'

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

const BracketFinalCol = (props) => {
    const { round, config } = props
    const { column_count } = config
    const colClassname = column_count === 5 ? 'col-brk-16' : 'col-brk-22'
    const final = round.matches.find((m) => m.final)
    const thirdPlace = round.matches.find((m) => m.third_place)
    const finalRound = !round.third_place ? round : { ...round, matches: [final] }
    const thirdPlaceRound = !round.third_place ? round : { ...round, name: 'Third-place', matches: [thirdPlace] }
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
    const homeHighlight = isHomeWinMatch(match) ? 'team-name-win' : 'team-name-lose'
    const awayHighlight = !isHomeWinMatch(match) ? 'team-name-win' : 'team-name-lose'
    return (
        <React.Fragment>
            <Row className="no-gutters box-sm bracket-box-height">
                <Col sm="12" className="bracket-box-header-height border-bottom-gray5">
                    <Row className="no-gutters">
                        <Col xs={{ size: 11, offset: 1 }}>
                            <span className="box-time d-none d-lg-block">
                                <React.Fragment>{moment(match.date).format('MMMM D, YYYY')}</React.Fragment>
                            </span>
                        </Col>
                    </Row>
                </Col>
                <Col sm="12" className="bracket-half-box-height no-padding-lr border-bottom-gray5">
                    <Row className="no-gutters h3-ff3">
                        <Col xs={{ size: 2 }} className="brk-halfbox-ml">
                            {homeTeamFlag}
                        </Col>
                        <Col xs={{ size: 7 }} className={`no-padding-lr ${homeHighlight}`}>
                            {homeTeamName}
                            {homeExtraScore > awayExtraScore && (
                                <React.Fragment>
                                    {' '}
                                    <AetTooltip target="aetTooltip" anchor="(aet)" />
                                </React.Fragment>
                            )}
                            {homePenaltyScore > awayPenaltyScore && (
                                <React.Fragment>
                                    {' '}
                                    <PenaltyTooltip target="penaltyTooltip" anchor="(pen)" />
                                </React.Fragment>
                            )}
                        </Col>
                        <Col xs={{ size: 2 }} className={`no-padding-lr ${homeHighlight}`}>
                            {homeScore}
                            {(homePenaltyScore !== 0 || awayPenaltyScore !== 0) && (
                                <React.Fragment>
                                    {' ('}
                                    {homePenaltyScore}
                                    {')'}
                                </React.Fragment>
                            )}
                        </Col>
                    </Row>
                </Col>
                <Col sm="12" className="bracket-half-box-height no-padding-lr">
                    <Row className="no-gutters h4-ff3">
                        <Col xs={{ size: 2 }} className="brk-halfbox-ml">
                            {awayTeamFlag}
                        </Col>
                        <Col xs={{ size: 7 }} className={`no-padding-lr ${awayHighlight}`}>
                            {awayTeamName}
                            {awayExtraScore > homeExtraScore && (
                                <React.Fragment>
                                    {' '}
                                    <AetTooltip target="aetTooltip" anchor="(aet)" />
                                </React.Fragment>
                            )}
                            {awayPenaltyScore > homePenaltyScore && (
                                <React.Fragment>
                                    {' '}
                                    <PenaltyTooltip target="penaltyTooltip" anchor="(pen)" />
                                </React.Fragment>
                            )}
                        </Col>
                        <Col xs={{ size: 2 }} className={`no-padding-lr ${awayHighlight}`}>
                            {awayScore}
                            {(homePenaltyScore !== 0 || awayPenaltyScore !== 0) && (
                                <React.Fragment>
                                    {' ('}
                                    {awayPenaltyScore}
                                    {')'}
                                </React.Fragment>
                            )}
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
    return (
        <React.Fragment>
            {colIndex === 0 && <Row className="bracket-gap-height-00"></Row>}
            {colIndex === 1 && <Row className="bracket-gap-height-10"></Row>}
            {colIndex === 2 && <Row className="bracket-gap-height-20"></Row>}
            {colIndex === 3 && <Row className="bracket-gap-height-30"></Row>}
            <Row className="no-margin-lr">
                <Col>
                    <div className="h2-ff1 margin-top-md d-none d-xl-block">{round.name}</div>
                    {round.matches &&
                        round.matches.map((m, index) => {
                            const bye = m.home_team === 'BYE' || m.away_team === 'BYE'
                            const lastBox = round.matches ? index === round.matches.length - 1 : false
                            return !bye ? (
                                <BracketBox match={m} colIndex={colIndex} lastBox={lastBox} config={config} key={index} />
                            ) : (
                                <BracketBoxBye match={m} colIndex={colIndex} lastBox={lastBox} config={config} key={index} />
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
    const { state, stage } = props
    return (
        <Row className="no-gutters">
            {stage.rounds &&
                stage.rounds.map((r, index) => {
                    const roundConfig = { ...state.config, column_count: stage.rounds.length }
                    const hookCount = r.matches.length % 2 === 0 ? r.matches.length / 2 : (r.matches.length - 1) / 2
                    if (r.final) {
                        return <BracketFinalCol round={r} config={roundConfig} key={r.name} />
                    } else if (r.name !== 'Third-place') {
                        return (
                            <React.Fragment key={r.name}>
                                <BracketCol round={r} colIndex={index} config={roundConfig} />
                                <BracketHook1 colIndex={index} hookCount={hookCount} config={roundConfig} />
                                <BracketHook2 colIndex={index} hookCount={hookCount} config={roundConfig} />
                            </React.Fragment>
                        )
                    }
                    return null
                })}
        </Row>
    )
}

const BracketPath = (props) => {
    const { state, stage } = props
    return (
        <React.Fragment>
            {stage.paths.map((p) => {
                return (
                    <React.Fragment key={p.name}>
                        <Row>
                            <Col sm="12" className="h2-ff6 border-bottom-double-gray3 margin-top-md">
                                {p.name}
                            </Col>
                        </Row>
                        <BracketTable state={state} stage={p} />
                    </React.Fragment>
                )
            })}
        </React.Fragment>
    )
}

class Brackets extends React.Component {
    render() {
        const { state, stage } = this.props
        return (
            <React.Fragment>
                <BracketsCollapse title="Brackets" stage={stage} initialStatus="Closed">
                    {stage.rounds && <BracketTable state={state} stage={stage} />}
                    {stage.paths && <BracketPath state={state} stage={stage} />}
                </BracketsCollapse>
            </React.Fragment>
        )
    }
}

export default Brackets
