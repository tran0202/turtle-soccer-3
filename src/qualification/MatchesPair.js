import React from 'react'
import { Row, Col } from 'reactstrap'
import moment from 'moment'
import { getTeamName, getTeamFlagId } from '../core/TeamHelper'
import { AetTooltip } from '../core/TooltipHelper'

const MatchesPairRow = (props) => {
    const { group, config } = props
    const { matches } = group

    return (
        <React.Fragment>
            {matches &&
                matches.map((m, index) => {
                    const bottomLine = index % 2 === 0 ? 'border-bottom-gray5' : ''
                    const pairHomeHighlight = index % 2 === 0 ? '' : group.agg_winner === 'home' ? 'team-name-win' : 'team-name-lose'
                    const pairAwayHighlight = index % 2 === 0 ? '' : group.agg_winner === 'home' ? 'team-name-lose' : 'team-name-win'
                    const homeTeamName = getTeamName(m.home_team, config)
                    const awayTeamName = getTeamName(m.away_team, config)
                    const matchHomeExtraScore = m.home_extra_score ? m.home_extra_score : 0
                    const matchAwayExtraScore = m.away_extra_score ? m.away_extra_score : 0
                    const matchHomeScore = m.home_score + matchHomeExtraScore
                    const matchAwayScore = m.away_score + matchAwayExtraScore
                    const teamWon = group.agg_winner === 'home' ? awayTeamName : homeTeamName
                    const aggregateLine = (
                        <React.Fragment>
                            Aggregate: {group.agg_away_score} - {group.agg_home_score} {' >>> '} <b>{teamWon}</b> advanced
                        </React.Fragment>
                    )
                    const awayGoalLine = group.away_goal_winner !== undefined ? <span className="blue"> on away goals</span> : ''
                    const extraTimeLine =
                        m.home_extra_score !== undefined && m.home_penalty_score === undefined ? <span className="blue"> after extra time</span> : ''
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
                    return (
                        <React.Fragment key={group.name + m.matchday}>
                            <Row className={`no-gutters ranking-tbl team-row padding-tb-sm ${bottomLine}`}>
                                <Col className="col-box-20 date-line">{moment(m.date).format('MMMM D, YYYY')}</Col>
                                <Col className={`col-box-25 text-end ${pairAwayHighlight}`}>{homeTeamName}</Col>
                                <Col className="col-box-6">{getTeamFlagId(m.home_team, config)}</Col>
                                <Col className="text-center score-no-padding-right col-box-14">
                                    {matchHomeScore} - {matchAwayScore}
                                    {m.home_extra_score !== undefined && <AetTooltip target="aetTooltip" anchor="(a.e.t.)" />}
                                </Col>
                                <Col className="col-box-6">{getTeamFlagId(m.away_team, config)}</Col>
                                <Col className={`col-box-25 ${pairHomeHighlight}`}>{awayTeamName}</Col>
                            </Row>
                            {index % 2 === 1 && (
                                <Row className="no-gutters aggregate-line team-row padding-tb-sm border-bottom-gray4">
                                    <Col xs={{ size: 7, offset: 5 }}>
                                        {aggregateLine}
                                        {awayGoalLine}
                                        {extraTimeLine}
                                        {penaltyLine}
                                    </Col>
                                </Row>
                            )}
                        </React.Fragment>
                    )
                })}
        </React.Fragment>
    )
}

class MatchesPair extends React.Component {
    render() {
        const { state, stage } = this.props
        const { groups } = stage
        return (
            <React.Fragment>
                <Row className="mt-5 box-white">
                    <Col xs={{ size: 10, offset: 1 }}>
                        {groups &&
                            groups.map((g, index) => {
                                return <MatchesPairRow key={g.name} group={g} config={state.config} />
                            })}
                    </Col>
                </Row>
            </React.Fragment>
        )
    }
}

export default MatchesPair
