import React, { useState } from 'react'
import { DisplaySchedule, getMatchArrayByDate } from './Helper'
import { calculateGroupRankings, collectMatchdayRankings } from './RankingsHelper'
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
        <DisplaySchedule round={getMatchArrayByDate(group, true)} />
        <Row className="mb-5"></Row>
      </Collapse>
    </React.Fragment>
  )
}

const GroupPlay = (props) => {
  const { group, config } = props
  calculateGroupRankings(group, config)
  const matchDay = group.matches ? Math.ceil(group.matches.length / 2) : 0
  collectMatchdayRankings(group, matchDay)
  // console.log('Test1')
  return (
    <React.Fragment>
      <GroupCollapse group={group} />
      <Rankings rounds={[group]} config={config} />
    </React.Fragment>
  )
}

export default GroupPlay
