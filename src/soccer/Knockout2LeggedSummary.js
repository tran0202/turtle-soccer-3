import React from 'react'
import { isKnockout2LeggedStageValid } from './Knockout2Legged'
import { getFlagSrc, getTeamName, AwardedTooltip } from './Helper'
import { Row, Col } from 'reactstrap'

const SummaryHead = () => {
  return (
    <Row className="no-gutters ranking-tbl team-row padding-tb-md text-center">
      <Col className="col-2"></Col>
      <Col className="col-1"></Col>
      <Col className="col-2">1st Leg</Col>
      <Col className="col-2">2nd Leg</Col>
      <Col className="col-2">Aggregate</Col>
      <Col className="col-1"></Col>
      <Col className="col-2"></Col>
    </Row>
  )
}

const SummaryRow = (props) => {
  const { row } = props
  return (
    <Row className="padding-tb-md border-bottom-gray5">
      <Col
        sm="2"
        xs="2"
        className={`team-name text-uppercase text-right team-name-no-padding-right${row.home_aggregate_score < row.away_aggregate_score ? ' gray3' : ''}`}
      >
        {getTeamName(row.home_team)}
      </Col>
      <Col sm="1" xs="1" className="padding-top-sm text-center">
        {row.home_team && <img className="flag-sm flag-md" src={getFlagSrc(row.home_team)} alt={row.home_team} />}
      </Col>
      <Col sm="2" xs="2" className="score text-center score-no-padding-right">
        {row.home_1st_leg_score != null && row.away_1st_leg_score != null && (
          <React.Fragment>
            {row.home_1st_leg_score}-{row.away_1st_leg_score}
            {row['1st_leg_notes'] && row['1st_leg_notes'].awarded && (
              <AwardedTooltip target={`awarded_${row.home_team}_${row.away_team}`} content={row['1st_leg_notes'].text} />
            )}
          </React.Fragment>
        )}
      </Col>
      <Col sm="2" xs="2" className="score text-center score-no-padding-right">
        {row.home_2nd_leg_score != null && row.away_2nd_leg_score != null && (
          <React.Fragment>
            {row.home_2nd_leg_score}-{row.away_2nd_leg_score}
            {row['2nd_leg_notes'] && row['2nd_leg_notes'].awarded && (
              <AwardedTooltip target={`awarded_${row.away_team}_${row.home_team}`} content={row['2nd_leg_notes'].text} />
            )}
          </React.Fragment>
        )}
      </Col>
      <Col sm="2" xs="2" className="score text-center score-no-padding-right">
        {row.home_aggregate_score != null && row.away_aggregate_score != null && (
          <React.Fragment>
            {row.home_aggregate_score}-{row.away_aggregate_score}
          </React.Fragment>
        )}
      </Col>
      <Col sm="1" xs="1" className="padding-top-sm text-center flag-no-padding-left">
        {row.away_team && <img className="flag-sm flag-md" src={getFlagSrc(row.away_team)} alt={row.away_team} />}
      </Col>
      <Col sm="2" xs="2" className={`team-name text-uppercase${row.home_aggregate_score > row.away_aggregate_score ? ' gray3' : ''}`}>
        {getTeamName(row.away_team)}
      </Col>
    </Row>
  )
}

const collectKnockout2LeggedMatches = (stage) => {
  let matchPairs = []
  if (isKnockout2LeggedStageValid(stage)) {
    const firstLeg = stage.rounds[0]
    let secondLeg = stage.rounds[1]
    firstLeg.matches.forEach((m1) => {
      secondLeg.matches.some((m2) => {
        if (m2.home_team === m1.away_team && m2.away_team === m1.home_team) {
          let pair = {
            ...m1,
            home_1st_leg_score: m1.home_score,
            away_1st_leg_score: m1.away_score,
            home_2nd_leg_score: m2.away_score,
            away_2nd_leg_score: m2.home_score,
            home_aggregate_score: parseInt(m1.home_score) + parseInt(m2.away_score),
            away_aggregate_score: parseInt(m1.away_score) + parseInt(m2.home_score),
          }
          if (m1.notes) {
            pair['1st_leg_notes'] = m1.notes
          }
          if (m2.notes) {
            pair['2nd_leg_notes'] = m2.notes
          }
          matchPairs.push(pair)
        }
        return m2.home_team === m1.away_team && m2.away_team === m1.home_team
      })
    })
  }
  // console.log('matchPairs', matchPairs)
  return matchPairs
}

const Knockout2LeggedSummary = (props) => {
  const { stage } = props
  const matchPairs = collectKnockout2LeggedMatches(stage)
  return (
    <React.Fragment>
      <Row>
        <Col>
          <div className="h2-ff1 margin-top-md">Summary</div>
        </Col>
      </Row>
      <Row className="box-xl mb-5">
        <Col xs={{ size: 10, offset: 1 }}>
          <Row className="mt-4"></Row>
          <SummaryHead />
          {matchPairs && matchPairs.map((r, index) => <SummaryRow row={r} key={index} />)}
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default Knockout2LeggedSummary
