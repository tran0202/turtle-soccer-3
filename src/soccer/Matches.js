import React, { useState } from 'react'
import RoundRobin from './RoundRobin'
import Knockout from './Knockout'
import Knockout2Legged from './Knockout2Legged'
import { TabContent, TabPane, Nav, NavItem, NavLink, Row } from 'reactstrap'
import classnames from 'classnames'

const Matches = (props) => {
  const { tournament } = props
  const { stages } = tournament
  const defaultStage = stages && stages.length > 0 ? stages[0].name.replace(' ', '-') : 'Group-Stage'
  const [activeTab, setActiveTab] = useState(defaultStage)
  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab)
  }

  return (
    <React.Fragment>
      <Row className="mt-3"></Row>
      {stages && stages.length > 0 && (
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
                {stage.type === 'knockout2legged' && <Knockout2Legged stage={stage} />}
              </TabPane>
            ))}
          </TabContent>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default Matches
