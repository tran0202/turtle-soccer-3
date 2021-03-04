import React from 'react'
import { DisplayKnockout2LeggedMatch } from './Helper'
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

const Knockout2LeggedBox = (props) => {
  const { matches, config } = props
  // console.log('stage', stage)
  if (!matches) return
  return (
    <React.Fragment>
      <Row>
        <Col>
          <div className="h3-ff6 margin-top-md">{config.box_name}</div>
        </Col>
      </Row>
      <Row className="box-xl mb-5">
        <Col>
          <Row className="mt-4"></Row>
          <SummaryHead />
          {matches.map((m, index) => (
            <DisplayKnockout2LeggedMatch m={m} key={index} config={config} />
          ))}
        </Col>
      </Row>
    </React.Fragment>
  )
}

const collectAggregateMatches = (round) => {
  if (!round || !round.pairs) return []
  const am = []
  round.pairs.forEach((p) => {
    if (p.matches) {
      const m1 = p.matches.find((m) => m.match_type === 'firstleg')
      if (m1 !== undefined) {
        am.push(m1)
      }
    }
  })
  return am
}

const KnockoutSingle2LeggedSummary = (props) => {
  const { round, config } = props
  return <React.Fragment>{round && round.pairs && <Knockout2LeggedBox matches={collectAggregateMatches(round)} config={config} />}</React.Fragment>
}

export default KnockoutSingle2LeggedSummary
