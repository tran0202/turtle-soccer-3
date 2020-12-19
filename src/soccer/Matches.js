import React, { useState } from 'react'
import RoundRobin from './RoundRobin'
import RoundRobinMatchDay from './RoundRobinMatchDay'
import Knockout from './Knockout'
import Knockout2Legged from './Knockout2Legged'
import { getTournamentConfig, getDefaultStageTab } from './Helper'
import { TabContent, TabPane, Nav, NavItem, NavLink, Row } from 'reactstrap'
import classnames from 'classnames'

const Matches = (props) => {
  const { tournament } = props
  const { stages } = tournament
  const config = getTournamentConfig(tournament)
  const [activeTab, setActiveTab] = useState(getDefaultStageTab(stages))
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
                {stage.name && (
                  <NavLink
                    className={classnames({ active: activeTab === `${stage.name.replace(' ', '-')}` })}
                    onClick={() => {
                      toggle(`${stage.name.replace(' ', '-')}`)
                    }}
                  >
                    {stage.name}
                  </NavLink>
                )}
              </NavItem>
            ))}
          </Nav>
          <TabContent activeTab={activeTab}>
            {stages.map((stage) => (
              <React.Fragment key={stage.name}>
                {stage.name && (
                  <TabPane tabId={stage.name.replace(' ', '-')}>
                    {stage.type === 'roundrobin' && <RoundRobin stage={stage} />}
                    {stage.type === 'roundrobinmatchday' && <RoundRobinMatchDay stage={stage} />}
                    {stage.type === 'knockout' && <Knockout stage={stage} config={config} />}
                    {stage.type === 'knockout2legged' && <Knockout2Legged stage={stage} />}
                  </TabPane>
                )}
              </React.Fragment>
            ))}
          </TabContent>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default Matches
