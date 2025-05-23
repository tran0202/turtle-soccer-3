import React from 'react'
import { Row, Col } from 'reactstrap'
import { NumericFormat } from 'react-number-format'
import { getTeamFlagId } from '../core/TeamHelper'
import { isGoalRatioTiebreaker } from '../core/RankingsHelper'
import {
    TiebreakTooltip,
    DisciplinaryPointsTooltip,
    PlayoffWinTooltip,
    WithdrewTooltip,
    BannedTooltip,
    DisqualifiedTooltip,
    PointDeductionTooltip,
    TieLastMatchTooltip,
} from '../core/TooltipHelper'

const RankingsHeader = (props) => {
    const { config } = props
    return (
        <Row className="no-gutters ranking-tbl-header team-row padding-tb-md text-center">
            <Col className="col-box-4"></Col>
            {config.added_group && <Col className="col-box-4">Gr</Col>}
            <Col className="col-box-7"></Col>
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
            <Col className="col-box-13">Pts</Col>
        </Row>
    )
}

const RankColumn = (props) => {
    const { ranking } = props
    const withdrew = ranking.team.withdrew || ranking.team.banned || ranking.team.disqualified

    return (
        !withdrew && (
            <React.Fragment>
                {ranking.champion ? (
                    <img className="award-icon margin-bottom-xs-4" src={'/images/awards/1st-place.png'} alt={`1st`} title={`1st`} />
                ) : ranking.runner_up ? (
                    <img className="award-icon margin-bottom-xs-4" src={'/images/awards/2nd-place.png'} alt={`2nd`} title={`2nd`} />
                ) : ranking.third_place ? (
                    <img className="award-icon margin-bottom-xs-4" src={'/images/awards/3rd-place.png'} alt={`3rd`} title={`3rd`} />
                ) : (
                    ranking.rank
                )}
            </React.Fragment>
        )
    )
}

// Banned: UNL202223
// Withdrew: MOFT1964 || MOFT1976
// Disqualified: MOFT1964 || AFCON2010
const RankingsRow = (props) => {
    const { ranking, config } = props
    const qualified_striped = ranking.qualified ? 'qualified-striped' : ''
    const advanced_striped = ranking.advanced ? 'advanced-striped' : ''
    const advanced_playoff_striped = ranking.advanced_playoff ? 'advanced-playoff-striped' : ''
    const wild_card_striped = ranking.wild_card ? 'wild-card-striped' : ''
    const wild_card2_striped = ranking.wild_card2 ? 'wild-card2-striped' : ''
    const transferred_striped = ranking.transferred ? 'transferred-striped' : ''
    const relegated_playoff_striped = ranking.relegated_playoff ? 'relegated-playoff-striped' : ''
    const relegated_striped = ranking.relegated ? 'relegated-striped' : ''
    const withdrew_striped = ranking.team.withdrew ? 'gray-striped' : ''
    const banned_striped = ranking.team.banned ? 'gray-striped' : ''
    const disqualified_striped = ranking.team.disqualified ? 'gray-striped' : ''
    const champion_striped = ranking.champion ? 'gold' : ''
    const runnerup_striped = ranking.runner_up ? 'silver' : ''
    const thirdplace_striped = ranking.third_place ? 'bronze' : ''
    const withdrew = ranking.team.withdrew || ranking.team.banned || ranking.team.disqualified
    const w = !withdrew ? ranking.w : <span>&mdash;</span>
    const d = !withdrew ? ranking.d : <span>&mdash;</span>
    const l = !withdrew ? ranking.l : <span>&mdash;</span>
    const gf = !withdrew ? ranking.gf : <span>&mdash;</span>
    const ga = !withdrew ? ranking.ga : <span>&mdash;</span>
    const gd = !withdrew ? ranking.gd : <span>&mdash;</span>
    const pts = !withdrew ? ranking.pts : <span>&mdash;</span>
    return (
        <Row
            className={`no-gutters ranking-tbl team-row padding-tb-sm ${qualified_striped}${advanced_striped}${advanced_playoff_striped}${wild_card_striped}${wild_card2_striped}${transferred_striped}${relegated_playoff_striped}${relegated_striped}${withdrew_striped}${banned_striped}${disqualified_striped}${champion_striped}${runnerup_striped}${thirdplace_striped}`}
        >
            <Col className="col-box-4 col-box-no-padding-lr text-center">
                <RankColumn ranking={ranking} />
            </Col>
            {config.added_group && <Col className="col-box-4">{ranking.group_name.replace('Group ', '')}</Col>}
            <Col className="col-box-7 col-box-no-padding-lr text-end">{getTeamFlagId(ranking.id, config)}</Col>
            {config.added_group && <Col className="col-box-23">{ranking.team.name}</Col>}
            {!config.added_group && (
                <Col className="col-box-27">
                    {ranking.team.name}{' '}
                    {ranking.team.withdrew && (
                        <WithdrewTooltip target={`${ranking.id}withrewTooltip`} anchor="(withdrew)" notes={ranking.team.withdrew_notes} />
                    )}
                    {ranking.team.banned && <BannedTooltip target={`${ranking.id}bannedTooltip`} anchor="(banned)" notes={ranking.team.banned_notes} />}
                    {ranking.team.disqualified && (
                        <DisqualifiedTooltip target={`${ranking.id}disqualifiedTooltip`} anchor="(disqualified)" notes={ranking.team.disqualified_notes} />
                    )}
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
                    <TiebreakTooltip target={`${ranking.id}tbTooltip`} anchor={ranking.tb_anchor} note={ranking.tb_notes} />
                )}
                {((!config.no_h2h_tooltip && ranking.disciplinary_point) ||
                    (config.no_h2h_tooltip && ranking.disciplinary_point && ranking.sort === 'partial')) && (
                    <DisciplinaryPointsTooltip target={`${ranking.id}disciplinaryPointsTooltip`} anchor="(dp)" notes={ranking.tb_notes} />
                )}
                {ranking.group_playoff && <PlayoffWinTooltip target={`${ranking.id}playoffTooltip`} anchor="(po)" notes={ranking.group_playoff_notes} />}
                {ranking.team.point_deduction && (
                    <PointDeductionTooltip target={`${ranking.id}pointDeductionTooltip`} anchor="(pd)" notes={ranking.team.point_deduction_notes} />
                )}
                {ranking.tie_last_match && (
                    <TieLastMatchTooltip target={`${ranking.id}tieLastMatchTooltip`} anchor="(tlm)" notes={ranking.tie_last_match_note} />
                )}
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
