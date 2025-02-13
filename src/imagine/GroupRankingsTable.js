import React from 'react'
import { Row, Col } from 'reactstrap'
import { NumericFormat } from 'react-number-format'
import { getTeamFlagId } from '../core/TeamHelper'
import { isGoalRatioTiebreaker } from '../core/RankingsHelper'
import {
    TiebreakTooltip,
    TiebreakTooltip2,
    FairPlayTooltip,
    PlayoffWinTooltip,
    WithdrewTooltip,
    BannedTooltip,
    PointDeductionTooltip,
    TieLastMatchTooltip,
    TieH2HTooltip,
} from '../core/TooltipHelper'

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
            {!isGoalRatioTiebreaker(config) && <Col className="col-box-7">+/-</Col>}
            {isGoalRatioTiebreaker(config) && <Col className="col-box-7">GR</Col>}
            <Col className="col-box-14">Pts</Col>
        </Row>
    )
}

const RankingsRow = (props) => {
    const { ranking, config } = props
    const qualified_striped = ranking.qualified ? 'qualified-striped' : ''
    const advanced_striped = ranking.advanced ? 'advanced-striped' : ''
    const wild_card_striped = ranking.wild_card ? 'wild-card-striped' : ''
    const transferred_striped = ranking.transferred ? 'transferred-striped' : ''
    const relegated_striped = ranking.relegated ? 'relegated-striped' : ''
    const withdrew_striped = ranking.team.withdrew ? 'gray-striped' : ''
    const banned_striped = ranking.team.banned ? 'gray-striped' : ''
    const withdrew = ranking.team.withdrew || ranking.team.banned
    const rank = !withdrew ? ranking.rank : ''
    const w = !withdrew ? ranking.w : <span>&mdash;</span>
    const d = !withdrew ? ranking.d : <span>&mdash;</span>
    const l = !withdrew ? ranking.l : <span>&mdash;</span>
    const gf = !withdrew ? ranking.gf : <span>&mdash;</span>
    const ga = !withdrew ? ranking.ga : <span>&mdash;</span>
    const gd = !withdrew ? ranking.gd : <span>&mdash;</span>
    const pts = !withdrew ? ranking.pts : <span>&mdash;</span>
    const drawLotAnchor = ranking.team.draw_lot_label ? '(ct)' : '(dl)'
    const drawLotRule = ranking.team.draw_lot_label ? ranking.team.draw_lot_label : 'drawing lots'
    return (
        <Row
            className={`no-gutters ranking-tbl team-row padding-tb-sm ${qualified_striped}${advanced_striped}${wild_card_striped}${transferred_striped}${relegated_striped}${withdrew_striped}${banned_striped}`}
        >
            <Col className="col-box-4">{rank}</Col>
            {config.added_group && <Col className="col-box-4">{ranking.group_name.replace('Group ', '')}</Col>}
            <Col className="col-box-7 col-box-no-padding-lr text-end">{getTeamFlagId(ranking.id, config)}</Col>
            {config.added_group && <Col className="col-box-23">{ranking.team.name}</Col>}
            {!config.added_group && (
                <Col className="col-box-27">
                    {ranking.team.name} {ranking.team.withdrew ? <WithdrewTooltip target={`${ranking.id}withrewTooltip`} anchor="(withdrew)" /> : ''}
                    {ranking.team.banned ? <BannedTooltip target={`${ranking.id}bannedTooltip`} anchor="(banned)" notes={ranking.team.banned_notes} /> : ''}
                </Col>
            )}
            <Col className="col-box-7 text-center">{ranking.mp}</Col>
            <Col className="col-box-7 text-center">{w}</Col>
            <Col className="col-box-7 text-center">{d}</Col>
            <Col className="col-box-7 text-center">{l}</Col>
            <Col className="col-box-7 text-center">{gf}</Col>
            <Col className="col-box-7 text-center">{ga}</Col>
            {!isGoalRatioTiebreaker(config) && (
                <Col className="col-box-7 text-center">
                    {gd > 0 ? '+' : ''}
                    {gd}
                </Col>
            )}
            {isGoalRatioTiebreaker(config) && (
                <Col className="col-box-7 text-center">
                    {ranking.gr !== null && <NumericFormat displayType="text" value={ranking.gr} decimalScale={3} fixedDecimalScale />}
                    {ranking.gr === null && <span>&mdash;</span>}
                </Col>
            )}
            <Col className="col-box-13 text-center">
                {pts}{' '}
                {!config.no_h2h_tooltip && ranking.tb_anchor && (
                    <TiebreakTooltip2 target={`${ranking.id}tbTooltip`} anchor={ranking.tb_anchor} note={ranking.tb_note} />
                )}
                {!config.no_h2h_tooltip && ranking.h2h_point && (
                    <TiebreakTooltip target={`${ranking.id}pointTooltip`} anchor="(p)" rule={`head-to-head points: ${ranking.h2h_point_note}`} />
                )}
                {ranking.h2h_gd_win && (
                    <TiebreakTooltip target={`${ranking.id}gdTooltip`} anchor="(gd)" rule={`goal differential: ${ranking.h2h_gd_win_note}`} />
                )}
                {ranking.away_goal_win && (
                    <TiebreakTooltip target={`${ranking.id}awayGoalTooltip`} anchor="(a)" rule={`away goals: ${ranking.away_goal_win_note}`} />
                )}
                {!config.no_h2h_tooltip && ranking.fair_play && (
                    <FairPlayTooltip target={`${ranking.id}fairPlayTooltip`} anchor="(fp)" notes={ranking.fair_play_note} />
                )}
                {ranking.partial_disciplinary_point && (
                    <TiebreakTooltip
                        target={`${ranking.id}disciplinaryPointTooltip`}
                        anchor="(dp)"
                        rule={`disciplinary points: ${ranking.partial_disciplinary_point_note}`}
                    />
                )}
                {!config.no_h2h_tooltip && ranking.draw_lot && (
                    <TiebreakTooltip target={`${ranking.id}drawLotTooltip`} anchor={drawLotAnchor} rule={`${drawLotRule}. ${ranking.draw_lot_note}`} />
                )}
                {ranking.playoff && <PlayoffWinTooltip target={`${ranking.id}playoffTooltip`} notes={ranking.playoff_note} />}
                {ranking.team.point_deduction && (
                    <PointDeductionTooltip target={`${ranking.id}pointDeductionTooltip`} notes={ranking.team.point_deduction_note} />
                )}
                {ranking.tie_last_match && <TieLastMatchTooltip target={`${ranking.id}tieLastMatchTooltip`} notes={ranking.tie_last_match_note} />}
                {!config.no_h2h_tooltip && ranking.tie_h2h && <TieH2HTooltip target={`${ranking.id}tieH2HTooltip`} notes={ranking.tie_h2h_note} />}
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
                    group.rankings.map((r) => {
                        return <RankingsRow key={r.id} ranking={r} config={config} />
                    })}
            </React.Fragment>
        )
    }
}

export default GroupRankingsTable
