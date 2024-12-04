import React from 'react'
import { Row, Col } from 'reactstrap'
import { getTeamFlag } from '../core/TeamHelper'
import { TiebreakTooltip } from '../core/TooltipHelper'

const RankingsHeader = (props) => {
    const { config } = props
    return (
        <Row className="no-gutters ranking-tbl-header team-row padding-tb-md text-center">
            <Col className="col-box-4"></Col>
            {config.added_group && <Col className="col-box-4">Gr</Col>}
            <Col className="col-box-6"></Col>
            {config.added_group && <Col className="col-box-23"></Col>}
            {!config.added_group && <Col className="col-box-27"></Col>}
            <Col className="col-box-7">MP</Col>
            <Col className="col-box-7">W</Col>
            <Col className="col-box-7">D</Col>
            <Col className="col-box-7">L</Col>
            <Col className="col-box-7">GF</Col>
            <Col className="col-box-7">GA</Col>
            <Col className="col-box-7">+/-</Col>
            <Col className="col-box-14">Pts</Col>
        </Row>
    )
}

const RankingsRow = (props) => {
    const { ranking, config } = props
    const qualified_striped = ranking.qualified ? 'advanced-next-round-striped' : ''
    const advanced_striped = ranking.advanced ? 'advanced-next-round-striped' : ''
    const next_round_striped = ranking.next_rounded ? 'advanced-wild-card-striped' : ''
    return (
        <Row className={`no-gutters ranking-tbl team-row padding-tb-sm ${qualified_striped}${advanced_striped}${next_round_striped}`}>
            <Col className="col-box-4">{ranking.rank}</Col>
            {config.added_group && <Col className="col-box-4">{ranking.group_name}</Col>}
            <Col className="col-box-6">{getTeamFlag(ranking.team, config)}</Col>
            {config.added_group && <Col className="col-box-23">{ranking.team.name}</Col>}
            {!config.added_group && <Col className="col-box-27">{ranking.team.name}</Col>}
            <Col className="col-box-7 text-center">{ranking.mp}</Col>
            <Col className="col-box-7 text-center">{ranking.w}</Col>
            <Col className="col-box-7 text-center">{ranking.d}</Col>
            <Col className="col-box-7 text-center">{ranking.l}</Col>
            <Col className="col-box-7 text-center">{ranking.gf}</Col>
            <Col className="col-box-7 text-center">{ranking.ga}</Col>
            <Col className="col-box-7 text-center">{ranking.gd}</Col>
            <Col className="col-box-14 text-center">
                {ranking.pts} {ranking.h2h_point_win && <TiebreakTooltip target="pointTooltip" anchor="(p)" rule={`points (${ranking.h2h_point_win_note})`} />}
                {ranking.h2h_gd_win && <TiebreakTooltip target="gdTooltip" anchor="(gd)" rule={`goal differential (${ranking.h2h_gd_win_note})`} />}
                {ranking.away_goal_win && <TiebreakTooltip target="awayGoalTooltip" anchor="(a)" rule={`away goal (${ranking.away_goal_win_note})`} />}
                {ranking.fair_play_win && <TiebreakTooltip target="fairPlayTooltip" anchor="(fp)" rule={`fair play point (${ranking.fair_play_win_note})`} />}
                {ranking.draw_lot_win && <TiebreakTooltip target="drawLotTooltip" anchor="(dl)" rule="drawing lot" />}
            </Col>
        </Row>
    )
}

class GroupRankingsTable extends React.Component {
    render() {
        const { group, config } = this.props
        return (
            <React.Fragment>
                <RankingsHeader config={config} />

                {group.rankings &&
                    group.rankings.map((r, index) => {
                        return <RankingsRow key={r.id} ranking={r} config={config} />
                    })}
            </React.Fragment>
        )
    }
}

export default GroupRankingsTable
