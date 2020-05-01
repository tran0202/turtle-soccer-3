import React, { useState } from 'react'
import { DisplaySchedule, getDateMatchArrayPair } from './Helper'
import { calculateGroupRankings, collectGroupRankings } from './RankingsHelper'
import Rankings from './Rankings'
import { Collapse, Row, Col, Button } from 'reactstrap'

const GroupCollapse = (props) => {
  const { group } = props
  const [collapse, setCollapse] = useState(false)
  const [status, setStatus] = useState('Closed')
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

const getMatchArrayByDate = (group) => {
  return getDateMatchArrayPair(group.matches)
}

const GroupPlay = (props) => {
  const { group, config } = props
  calculateGroupRankings(group, config)
  collectGroupRankings(group)
  // console.log('Test1')
  return (
    <React.Fragment>
      <GroupCollapse group={group} />
      <Rankings rounds={[group]} />
    </React.Fragment>
  )
}

export default GroupPlay
