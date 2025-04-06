import React from 'react'
import { Row, Col } from 'reactstrap'
import { getTeamFlagId } from '../core/TeamHelper'
import { WithdrewTooltip, SharedBronzeTooltip, DisqualifiedTooltip, BannedTooltip, PointDeductionTooltip } from '../core/TooltipHelper'

const StandingsHeader = (props) => {
    const { round } = props
    return (
        <Row className="no-gutters ranking-tbl-header team-row padding-tb-md text-center">
            {round.championship || round.championship_round ? (
                <React.Fragment>
                    <Col className="col-box-5"></Col>
                    <Col className="col-box-95">
                        <Row>
                            <Col className="col-box-7"></Col>
                            <Col className="col-box-27"></Col>
                            <Col className="col-box-7">MP</Col>
                            <Col className="col-box-7">W</Col>
                            <Col className="col-box-7">D</Col>
                            <Col className="col-box-7">L</Col>
                            <Col className="col-box-7">GF</Col>
                            <Col className="col-box-7">GA</Col>
                            <Col className="col-box-7">+/-</Col>
                            <Col className="col-box-13">Pts</Col>
                        </Row>
                    </Col>
                </React.Fragment>
            ) : (
                <Col className="h2-ff1">{round.name}</Col>
            )}
        </Row>
    )
}

const RankColumn = (props) => {
    const { pool } = props
    return (
        <React.Fragment>
            {pool.rankings[0].champion ? (
                <img className="award-icon margin-bottom-xs-4" src={'/images/awards/1st-place.png'} alt={`1st`} title={`1st`} />
            ) : pool.rankings[0].runner_up ? (
                <img className="award-icon margin-bottom-xs-4" src={'/images/awards/2nd-place.png'} alt={`2nd`} title={`2nd`} />
            ) : pool.rankings[0].third_place ? (
                <img className="award-icon margin-bottom-xs-4" src={'/images/awards/3rd-place.png'} alt={`3rd`} title={`3rd`} />
            ) : (
                pool.pool_rank
            )}
        </React.Fragment>
    )
}

const StandingsRow = (props) => {
    const { ranking, config } = props
    const withdrew = ranking.withdrew || ranking.disqualified || ranking.team.withdrew || ranking.team.banned || ranking.team.disqualified
    const w = !withdrew ? ranking.w : <span>&mdash;</span>
    const d = !withdrew ? ranking.d : <span>&mdash;</span>
    const l = !withdrew ? ranking.l : <span>&mdash;</span>
    const gf = !withdrew ? ranking.gf : <span>&mdash;</span>
    const ga = !withdrew ? ranking.ga : <span>&mdash;</span>
    const gd = !withdrew ? ranking.gd : <span>&mdash;</span>
    const pts = !withdrew ? ranking.pts : <span>&mdash;</span>
    return (
        <Row className={`no-gutters ranking-tbl standing-row no-margin-bottom`}>
            <Col className="col-box-7 col-box-no-padding-lr text-end">{getTeamFlagId(ranking.id, config)}</Col>
            <Col className="col-box-27">
                {ranking.team.name}{' '}
                {ranking.withdrew && (
                    <WithdrewTooltip target={`${ranking.id}withrewStandingsTooltip`} anchor="(withdrew)" notes={`${ranking.team.name} withdrew`} />
                )}
                {ranking.shared_bronze && <SharedBronzeTooltip target={`${ranking.home_team}sharedBronzeTooltip`} notes={ranking.shared_bronze_notes} />}
                {ranking.disqualified && (
                    <DisqualifiedTooltip target={`${ranking.id}disqualifiedStandingsTooltip`} anchor="(disqualified)" notes={ranking.disqualified_notes} />
                )}
                {ranking.team.banned && <BannedTooltip target={`${ranking.id}bannedTooltip`} anchor="(banned)" notes={ranking.team.banned_notes} />}
            </Col>
            <Col className="col-box-7 text-center">{ranking.mp}</Col>
            <Col className="col-box-7 text-center">{w}</Col>
            <Col className="col-box-7 text-center">{d}</Col>
            <Col className="col-box-7 text-center">{l}</Col>
            <Col className="col-box-7 text-center">{gf}</Col>
            <Col className="col-box-7 text-center">{ga}</Col>
            <Col className="col-box-7 text-center">
                {gd > 0 ? '+' : ''}
                {gd}
            </Col>
            <Col className="col-box-13 text-center">
                {pts}{' '}
                {ranking.team.point_deduction && (
                    <PointDeductionTooltip target={`${ranking.id}pointDeductionTooltip`} anchor="(pd)" notes={ranking.team.point_deduction_notes} />
                )}
            </Col>
        </Row>
    )
}

const StandingsPools = (props) => {
    const { round, config } = props
    return (
        round.pools &&
        round.pools.map((p) => {
            const rankColPadding =
                p.rankings && p.rankings.length === 1
                    ? 'rank-col-padding-1'
                    : p.rankings.length === 2
                    ? 'rank-col-padding-2'
                    : p.rankings.length === 3
                    ? 'rank-col-padding-3'
                    : p.rankings.length === 4
                    ? 'rank-col-padding-4'
                    : p.rankings.length === 5
                    ? 'rank-col-padding-5'
                    : p.rankings.length === 6
                    ? 'rank-col-padding-6'
                    : p.rankings.length === 7
                    ? 'rank-col-padding-7'
                    : p.rankings.length === 8
                    ? 'rank-col-padding-8'
                    : 'rank-col-padding-9'
            const champion_striped = p.rankings[0].champion ? 'gold' : ''
            const runnerup_striped = p.rankings[0].runner_up ? 'silver' : ''
            const thirdplace_striped = p.rankings[0].third_place ? 'bronze' : ''
            return (
                <React.Fragment key={p.pool_rank}>
                    <Row className={`no-gutters ranking-tbl team-row padding-tb-sm ${champion_striped}${runnerup_striped}${thirdplace_striped}`}>
                        <Col className={`col-box-5 text-center ${rankColPadding}`}>
                            <RankColumn pool={p} />
                        </Col>
                        <Col className="col-box-95">
                            {p.rankings.map((r) => {
                                return <StandingsRow key={r.id} ranking={r} config={config} />
                            })}
                        </Col>
                    </Row>
                </React.Fragment>
            )
        })
    )
}

const StageStandingsTable = (props) => {
    const { round, config } = props
    return (
        <React.Fragment>
            <StandingsHeader round={round} config={config} />
            <StandingsPools round={round} config={config} />
        </React.Fragment>
    )
}

class FinalStandings extends React.Component {
    render() {
        const { tournament, config } = this.props
        return (
            tournament.standing_rounds &&
            tournament.standing_rounds.map((sr) => {
                return (
                    sr.pools &&
                    sr.pools.length > 0 && (
                        <React.Fragment key={sr.name}>
                            <Row className="box-xl">
                                <Col xs={{ size: 10, offset: 1 }}>
                                    <StageStandingsTable round={sr} config={config} />
                                </Col>
                            </Row>
                        </React.Fragment>
                    )
                )
            })
        )
    }
}

export default FinalStandings
