import React, { useState } from 'react'
import RoundRobin from './RoundRobin'
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap'
import classnames from 'classnames'

const Knockout = () => {
  return (
    <Row>
      <Col sm="12">
        <h4>Knockout Contents</h4>
      </Col>
    </Row>
  )
}

const Matches = (props) => {
  const { tournament } = props
  const { stages } = tournament
  const defaultStage = stages.length > 0 ? stages[0].name.replace(' ', '-') : 'Group-Stage'
  const [activeTab, setActiveTab] = useState(defaultStage)
  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab)
  }

  return (
    <React.Fragment>
      {stages.length > 0 && (
        <React.Fragment>
          <Nav tabs className="mt-3">
            {stages.map((stage) => (
              <NavItem key={stage.name}>
                <NavLink
                  className={classnames({ active: activeTab === `${stage.name.replace(' ', '-')}` })}
                  onClick={() => {
                    toggle(`${stage.name.replace(' ', '-')}`)
                  }}
                >
                  {stage.name}
                </NavLink>
              </NavItem>
            ))}
          </Nav>
          <TabContent activeTab={activeTab}>
            {stages.map((stage) => (
              <TabPane tabId={stage.name.replace(' ', '-')} key={stage.name}>
                {stage.type === 'roundrobin' && <RoundRobin stage={stage} />}
                {stage.type === 'knockout' && <Knockout stage={stage} />}
              </TabPane>
            ))}
          </TabContent>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default Matches
