import React, { useState } from 'react'
import { Row, Col, Collapse, Button } from 'reactstrap'
import { DisplaySchedule, getDateMatchArrayPair } from './Helper'

const getMatchArrayByDate = (group) => {
  return getDateMatchArrayPair(group.matches)
}

const GroupPlay = (props) => {
  const { group } = props
  const [collapse, setCollapse] = useState(true)
  const [status, setStatus] = useState('Opened')
  const onEntering = () => setStatus('Opening...')
  const onEntered = () => setStatus('Opened')
  const onExiting = () => setStatus('Closing...')
  const onExited = () => setStatus('Closed')
  const toggle = () => setCollapse(!collapse)
  return (
    <React.Fragment>
      <Row className="mt-3 text-center">
        <Col sm="12">
          <Button outline color="primary" onClick={toggle} className="h2-ff3 btn-collapse">
            {group.name}&nbsp;
            {status === 'Opening...' && <i className="bx bx-dots-vertical-rounded"></i>}
            {status === 'Opened' && <i className="bx bx-chevron-up-square"></i>}
            {status === 'Closing...' && <i className="bx bx-dots-vertical-rounded"></i>}
            {status === 'Closed' && <i className="bx bx-chevron-down-square"></i>}
          </Button>
        </Col>
      </Row>
      <Collapse isOpen={collapse} onEntering={onEntering} onEntered={onEntered} onExiting={onExiting} onExited={onExited}>
        <DisplaySchedule round={getMatchArrayByDate(group)} />
        <Row className="mb-5"></Row>
      </Collapse>
    </React.Fragment>
  )
}

export default GroupPlay
