import React from 'react'
import { Row, Col } from 'reactstrap'

const KnockoutSingle = (props) => {
  const { round } = props
  // console.log('stage', stage)
  return (
    <React.Fragment>
      <Row>
        <Col>
          <div className="h2-ff1 margin-top-md">{round.name}</div>
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default KnockoutSingle
