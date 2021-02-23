import React, { useState } from 'react'
import { DisplaySchedule, getMatchArrayByDate } from './Helper'
import Rankings from './Rankings'
import { hasGroupPlayoff } from './RankingsHelper'
import { Collapse, Row, Col, Button } from 'reactstrap'

const GroupCollapse = (props) => {
  const { group, config } = props
  const matchArray = getMatchArrayByDate(group, true)
  // console.log('group', group)
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
        {!hasGroupPlayoff(group) && <DisplaySchedule round={matchArray} config={{ showMatchYear: config.show_match_year }} />}
        {hasGroupPlayoff(group) && (
          <React.Fragment>
            <DisplaySchedule round={matchArray[0]} config={{ showMatchYear: config.show_match_year }} />
            <DisplaySchedule round={matchArray[1]} config={{ showMatchYear: config.show_match_year }} />
          </React.Fragment>
        )}
        <Row className="mb-5"></Row>
      </Collapse>
    </React.Fragment>
  )
}

const GroupPlay = (props) => {
  const { group, config } = props
  return (
    <React.Fragment>
      <GroupCollapse group={group} config={config} />
      <Rankings rounds={[group]} config={config} />
    </React.Fragment>
  )
}

export default GroupPlay
