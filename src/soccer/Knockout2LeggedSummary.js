import React from 'react'
import { isKnockout2LeggedStageValid } from './Knockout2Legged'
import { getFlagSrc, getTeamName, isHomeLoseAggregateLeg1, isAwayLoseAggregateLeg1, AetTooltip, AwardedTooltip } from './Helper'
import { Row, Col } from 'reactstrap'

const SummaryHead = () => {
  return (
    <Row className="ranking-tbl team-row padding-tb-md text-center">
      <Col className="col-box-25"></Col>
      <Col className="col-box-10"></Col>
      <Col className="text-center score-no-padding-right col-box-10">Leg1</Col>
      <Col className="text-center score-no-padding-right col-box-10">Leg2</Col>
      <Col className="text-center score-no-padding-right col-box-10">Agg</Col>
      <Col className="col-box-10"></Col>
      <Col className="col-box-25"></Col>
    </Row>
  )
}

const SummaryRow = (props) => {
  const { row } = props
  return (
    <React.Fragment>
      <Row className="padding-top-md">
        <Col className={`team-name text-uppercase text-right team-name-no-padding-right col-box-25${isHomeLoseAggregateLeg1(row) ? ' gray3' : ''}`}>
          {getTeamName(row.home_team)}
        </Col>
        <Col className="padding-top-sm text-center col-box-10">
          {row.home_team && <img className="flag-sm flag-md" src={getFlagSrc(row.home_team)} alt={row.home_team} />}
        </Col>
        <Col className="score text-center score-no-padding-right col-box-10">
          {row.home_score != null && row.away_score != null && (
            <React.Fragment>
              {row.home_score}-{row.away_score}
              {row['1st_leg_notes'] && row['1st_leg_notes'].awarded && (
                <AwardedTooltip target={`awarded_${row.home_team}_${row.away_team}`} content={row['1st_leg_notes'].text} />
              )}
            </React.Fragment>
          )}
        </Col>
        <Col className="score text-center score-no-padding-right col-box-10">
          {row.home_2nd_leg_score != null && row.away_2nd_leg_score != null && (
            <React.Fragment>
              {row.home_2nd_leg_extra_score == null && row.away_2nd_leg_extra_score == null && (
                <React.Fragment>
                  {row.home_2nd_leg_score}-{row.away_2nd_leg_score}
                </React.Fragment>
              )}
              {row.home_2nd_leg_extra_score != null && row.away_2nd_leg_extra_score != null && (
                <React.Fragment>
                  {parseInt(row.home_2nd_leg_score) + parseInt(row.home_2nd_leg_extra_score)}-
                  {parseInt(row.away_2nd_leg_score) + parseInt(row.away_2nd_leg_extra_score)}
                  <AetTooltip target="aetTooltip3" anchor="(a.e.t.)" />
                </React.Fragment>
              )}
              {row['2nd_leg_notes'] && row['2nd_leg_notes'].awarded && (
                <AwardedTooltip target={`awarded_${row.away_team}_${row.home_team}`} content={row['2nd_leg_notes'].text} />
              )}
            </React.Fragment>
          )}
        </Col>
        <Col className="score text-center score-no-padding-right col-box-10">
          {row.home_1st_leg_aggregate_score != null && row.away_1st_leg_aggregate_score != null && (
            <React.Fragment>
              {row.home_1st_leg_aggregate_score}-{row.away_1st_leg_aggregate_score}
            </React.Fragment>
          )}
        </Col>
        <Col className="padding-top-sm text-center flag-no-padding-left col-box-10">
          {row.away_team && <img className="flag-sm flag-md" src={getFlagSrc(row.away_team)} alt={row.away_team} />}
        </Col>
        <Col className={`team-name text-uppercase col-box-25${isAwayLoseAggregateLeg1(row) ? ' gray3' : ''}`}>{getTeamName(row.away_team)}</Col>
      </Row>
      <Row>
        <Col sm={{ size: 6, offset: 6 }} xs={{ size: 6, offset: 6 }} className="aggregate_text margin-top-sm">
          {row.home_1st_leg_aggregate_score != null && row.away_1st_leg_aggregate_score != null && (
            <React.Fragment>
              {row.aggregate_1st_leg_team && (
                <React.Fragment>
                  &gt;&gt;&gt; <b>{getTeamName(row.aggregate_1st_leg_team)}</b> won on away goals
                  {row.home_2nd_leg_extra_score != null && row.away_2nd_leg_extra_score != null && <React.Fragment>&nbsp;after extra time</React.Fragment>}
                </React.Fragment>
              )}
            </React.Fragment>
          )}
          {row.home_2nd_leg_extra_score != null && row.away_2nd_leg_extra_score != null && (
            <React.Fragment>
              {row.home_2nd_leg_penalty_score == null && row.away_2nd_leg_penalty_score == null && (
                <React.Fragment>
                  {row.home_2nd_leg_extra_score !== row.away_2nd_leg_extra_score && <React.Fragment>&nbsp;&gt;&gt;&gt;&nbsp;</React.Fragment>}
                  {row.home_2nd_leg_extra_score > row.away_2nd_leg_extra_score && (
                    <React.Fragment>
                      <b>{getTeamName(row.home_team)}</b>
                    </React.Fragment>
                  )}
                  {row.home_2nd_leg_extra_score < row.away_2nd_leg_extra_score && (
                    <React.Fragment>
                      <b>{getTeamName(row.away_team)}</b>
                    </React.Fragment>
                  )}
                  {row.home_2nd_leg_extra_score !== row.away_2nd_leg_extra_score && <React.Fragment>&nbsp;won after extra time</React.Fragment>}
                </React.Fragment>
              )}
              {row.home_2nd_leg_penalty_score != null && row.away_2nd_leg_penalty_score != null && (
                <React.Fragment>
                  &nbsp;&gt;&gt;&gt;&nbsp;
                  {row.home_2nd_leg_penalty_score > row.away_2nd_leg_penalty_score && (
                    <React.Fragment>
                      <b>{getTeamName(row.home_team)}</b>
                    </React.Fragment>
                  )}
                  {row.home_2nd_leg_penalty_score < row.away_2nd_leg_penalty_score && (
                    <React.Fragment>
                      <b>{getTeamName(row.away_team)}</b>
                    </React.Fragment>
                  )}
                  &nbsp;won on penalties&nbsp;
                  <b>
                    {row.home_2nd_leg_penalty_score}-{row.away_2nd_leg_penalty_score}
                  </b>
                </React.Fragment>
              )}
            </React.Fragment>
          )}
        </Col>
      </Row>
      <Row className="padding-tb-md border-bottom-gray5"></Row>
    </React.Fragment>
  )
}

const Knockout2LeggedSummary = (props) => {
  const { stage } = props
  return (
    <React.Fragment>
      <Row>
        <Col>
          <div className="h2-ff1 margin-top-md">Summary</div>
        </Col>
      </Row>
      <Row className="box-xl mb-5">
        <Col>
          <Row className="mt-4"></Row>
          <SummaryHead />
          {isKnockout2LeggedStageValid(stage) && stage.rounds[0].matches.map((r, index) => <SummaryRow row={r} key={index} />)}
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default Knockout2LeggedSummary
