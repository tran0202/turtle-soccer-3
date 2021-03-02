import React from 'react'
import { DisplayKnockout2LeggedMatch, isKnockout2LeggedStageValid, splitPathMatches } from './Helper'
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

const Knockout2LeggedSummary = (props) => {
  const { stage, config } = props
  const pathMatches = isKnockout2LeggedStageValid(stage) ? splitPathMatches(stage, stage.rounds[0]) : []
  // console.log('pathMatches', pathMatches)
  return (
    <React.Fragment>
      {isKnockout2LeggedStageValid(stage) && (
        <React.Fragment>
          {pathMatches.length === 0 && <Knockout2LeggedBox matches={stage.rounds[0].matches} config={config} />}
          {pathMatches.length === 2 &&
            pathMatches.map((p) => <Knockout2LeggedBox matches={p.matches} config={{ ...config, box_name: `${p.path} Path` }} key={p.path} />)}
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default Knockout2LeggedSummary
