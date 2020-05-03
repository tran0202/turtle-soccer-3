import React, { useState } from 'react'
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap'
import classnames from 'classnames'

export const NestedTabs = () => {
  const [activeTab, setActiveTab] = useState({ level1: '1', level2: '1' })

  const toggle = (tab) => {
    if (activeTab.level1 !== tab.level1 || activeTab.level2 !== tab.level2) setActiveTab(tab)
  }
  return (
    <div>
      <Nav tabs>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab.level1 === '1' })}
            onClick={() => {
              toggle({ level1: '1', level2: '1' })
            }}
          >
            Tab1
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab.level1 === '2' })}
            onClick={() => {
              toggle({ level1: '2' })
            }}
          >
            Moar Tabs
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab.level1}>
        <TabPane tabId="1">
          <Row>
            <Col sm="12">
              <h4>Tab 1 Contents</h4>
              <Nav>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab.level2 === '1' })}
                    onClick={() => {
                      toggle({ level1: '1', level2: '1' })
                    }}
                  >
                    Tab1-1
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab.level2 === '2' })}
                    onClick={() => {
                      toggle({ level1: '1', level2: '2' })
                    }}
                  >
                    Tab1-2
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={activeTab.level2}>
                <TabPane tabId="1">
                  <Row>
                    <Col sm="12">
                      <h4>Tab 1-1 Contents</h4>
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="2">
                  <Row>
                    <Col sm="12">
                      <h4>Tab 1-2 Contents</h4>
                    </Col>
                  </Row>
                </TabPane>
              </TabContent>
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId="2">
          <Row>
            <Col sm="12">
              <h4>Tab 2 Contents</h4>
            </Col>
          </Row>
        </TabPane>
      </TabContent>
    </div>
  )
}

// const newTournamentArray = []
// TournamentArray.forEach((t) => {
//   newTournamentArray.push({
//     id: t.id,
//     name: t.name,
//     tournament_type_id: t.tournament_type_id,
//     active: t.active,
//     third_place_ranking: t.third_place_ranking,
//     head_to_head_tiebreaker: t.head_to_head_tiebreaker,
//     golden_goal_rule: t.golden_goal_rule,
//     points_for_win: t.points_for_win,
//     parent_tournament_id: t.parent_tournament_id,
//     details: { logo_filename: t.logo_filename, start_date: t.start_date, end_date: t.end_date },
//   })
// })
// console.log(JSON.stringify(newTournamentArray))

// const table = TeamPhp.find((x) => x.type === 'table').data
// console.log('TeamPhp', table)
// let array = []
// table.forEach((t) => {
//   if (t.team_type_id === '1') {
//     array.push({
//       id: t.id,
//       name: t.name,
//       team_type_id: 'MNT',
//       nation_id: t.nation_id,
//       parent_team_id: t.parent_team_id ? t.parent_team_id : '',
//       club_code: '',
//       official_name: '',
//     })
//   } else if (t.team_type_id === '2') {
//     array.push({
//       id: t.id,
//       name: t.name,
//       team_type_id: 'CLUB',
//       nation_id: t.nation_id,
//       parent_team_id: t.parent_team_id ? t.parent_team_id : '',
//       club_code: t.code,
//       official_name: t.official_name,
//     })
//   } else if (t.team_type_id === '3') {
//     array.push({
//       id: t.id,
//       name: t.name,
//       team_type_id: 'WNT',
//       nation_id: t.nation_id,
//       parent_team_id: t.parent_team_id ? t.parent_team_id : '',
//       club_code: '',
//       official_name: '',
//     })
//   } else if (t.team_type_id === '4') {
//     array.push({
//       id: t.id,
//       name: t.name,
//       team_type_id: 'U23MNT',
//       nation_id: t.nation_id,
//       parent_team_id: t.parent_team_id ? t.parent_team_id : '',
//       club_code: '',
//       official_name: '',
//     })
//   } else if (t.team_type_id === '5') {
//     array.push({
//       id: t.id,
//       name: t.name,
//       team_type_id: 'U23WNT',
//       nation_id: t.nation_id,
//       parent_team_id: t.parent_team_id ? t.parent_team_id : '',
//       club_code: '',
//       official_name: '',
//     })
//   } else if (t.team_type_id === '6') {
//     array.push({
//       id: t.id,
//       name: t.name,
//       team_type_id: 'FBLT',
//       nation_id: '',
//       parent_team_id: t.parent_team_id ? t.parent_team_id : '',
//       club_code: '',
//       official_name: '',
//     })
//   } else if (t.team_type_id === '7') {
//     array.push({
//       id: t.id,
//       name: t.name,
//       team_type_id: 'TENMS',
//       nation_id: t.nation_id,
//       parent_team_id: t.parent_team_id ? t.parent_team_id : '',
//       club_code: '',
//       official_name: '',
//     })
//   } else if (t.team_type_id === '8') {
//     array.push({
//       id: t.id,
//       name: t.name,
//       team_type_id: 'TENWS',
//       nation_id: t.nation_id,
//       parent_team_id: t.parent_team_id ? t.parent_team_id : '',
//       club_code: '',
//       official_name: '',
//     })
//   }
// })
// console.log(JSON.stringify(array))
