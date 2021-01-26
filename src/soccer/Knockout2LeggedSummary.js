import React from 'react'
import { DisplayKnockout2LeggedMatch, isKnockout2LeggedStageValid } from './Helper'
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

const Knockout2LeggedSummary = (props) => {
  const { stage } = props
  return (
    <React.Fragment>
      <Row>
        <Col>
          <div className="h2-ff1 margin-top-md"></div>
        </Col>
      </Row>
      <Row className="box-xl mb-5">
        <Col>
          <Row className="mt-4"></Row>
          <SummaryHead />
          {isKnockout2LeggedStageValid(stage) && stage.rounds[0].matches.map((m, index) => <DisplayKnockout2LeggedMatch m={m} key={index} />)}
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default Knockout2LeggedSummary
