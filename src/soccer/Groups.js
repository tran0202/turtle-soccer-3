import React, { useState } from 'react'
import GroupStandings from './GroupStandings'
import GroupMdStandings from './GroupMdStandings'
import { getTournamentConfig, getDefaultStageTab, getAllRoundRobinStages } from './Helper'
import { calculateGroupRankings, calculateProgressRankings, collectGroupRankings, hasWildCardAdvancement, collectWildCardRankings } from './RankingsHelper'
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap'
import classnames from 'classnames'

const getFormat = (rrStage) => {
  const { groups, advancement } = rrStage
  const groupCount = groups ? groups.length : 0
  const teamCount = groups && groups[0] && groups[0].teams ? groups[0].teams.length : 0
  return { groupCount, teamCount, totalCount: groupCount * teamCount, advancement }
}

const TournamentFormat = (props) => {
  const { config, tournamentType } = props
  return (
    config.teamCount !== 0 && (
      <Row className="mt-3 mb-3 text-left tournament-format">
        <Col xs="9">
          <Row>
            <Col xs="12">
              <p>
                <strong>Format:&nbsp;</strong>
                {config.groupCount > 1 && (
                  <React.Fragment>
                    {config.totalCount} teams are divided into {config.groupCount} groups of {config.teamCount} teams. Each group plays a round-robin schedule.
                  </React.Fragment>
                )}
                {config.groupCount === 1 && <React.Fragment>{config.totalCount} teams plays a league of home-and-away round-robin matches.</React.Fragment>}
                &nbsp;
                {config.advancement && config.advancement.teams && config.advancement.teams.text
                  ? config.advancement.teams.text
                  : 'The top 2 teams advance to the knockout stage.'}
                &nbsp;{config.advancement ? config.advancement.extra : ''}
              </p>
            </Col>
            <Col xs="12">
              <p>
                <strong>Points:</strong> {config.points_for_win} points/W - 1 points/D - 0 points/L
              </p>
            </Col>
            <Col xs="12">
              <p className="no-margin-bottom">
                <strong>Tiebreakers:</strong>
              </p>
              <ul className="no-margin-bottom">
                {config.tiebreakers &&
                  config.tiebreakers.map((tb, index) => {
                    if (tb === 'team') {
                      return (
                        <React.Fragment key={index}>
                          <li>Points</li>
                          <li>Overall goal difference</li>
                          <li>Overall goals scored</li>
                        </React.Fragment>
                      )
                    } else if (tb === 'head2head') {
                      return (
                        <React.Fragment key={index}>
                          <li>Points in matches between tied teams</li>
                          <li>Goal difference in matches between tied teams</li>
                          <li>Goals scored in matches between tied teams</li>
                        </React.Fragment>
                      )
                    } else if (tb === 'awaygoals') {
                      return (
                        <li key={index}>
                          Away goals scored in matches between tied teams (if the tie is only between two teams in home-and-away league format)
                        </li>
                      )
                    } else if (tb === 'fairplay') {
                      return <li key={index}>Fair play points: Yellow -1. Indirect Red -3. Direct Red -4. Yellow and Direct Red -5.</li>
                    } else if (tb === 'lot') {
                      return <li key={index}>Drawing lots</li>
                    } else {
                      return null
                    }
                  })}
              </ul>
            </Col>
          </Row>
        </Col>
        <Col xs="3">
          {config.details && config.details.mascot_filename && (
            <img
              src={`/assets/images/${tournamentType.logo_path}/${config.details.mascot_filename}`}
              alt={`Mascot ${config.name}`}
              className="tournament-mascot"
            />
          )}
        </Col>
      </Row>
    )
  )
}

const collectMdMatches = (group) => {
  let matches = []
  group.matchdays &&
    group.matchdays.forEach((md) => {
      md.matches &&
        md.matches.forEach((m) => {
          matches.push(m)
        })
    })
  group.matches = matches
}

const calculateStageRankings = (tournament, config, stage) => {
  const { groups } = stage
  groups &&
    groups.forEach((group) => {
      if (stage.type === 'roundrobinmatchday') {
        collectMdMatches(group)
      }
      // console.log('group', group)
      group.teams && group.matches && calculateGroupRankings(group.teams, group.teams, group.matches, config)
      const matchDay = group.matches ? Math.ceil(group.matches.length / (group.teams.length / 2)) : 0
      collectGroupRankings(group, matchDay)
      group.teams && group.matches && calculateProgressRankings(tournament, group.teams, group.matches, config)
    })
  stage.wild_card = groups && hasWildCardAdvancement(stage) ? collectWildCardRankings(stage) : {}
}

const DisplayStage = (props) => {
  const { tournament, tournamentType, stage } = props
  if (!stage) return
  const format = getFormat(stage)
  const config = { ...getTournamentConfig(tournament), ...format }
  return (
    <React.Fragment>
      {format && <TournamentFormat config={config} tournamentType={tournamentType} />}
      {stage.type === 'roundrobin' && <GroupStandings config={config} stage={stage} />}
      {stage.type === 'roundrobinmatchday' && <GroupMdStandings config={config} stage={stage} />}
    </React.Fragment>
  )
}

const Groups = (props) => {
  const { tournament, tournamentType } = props
  const { stages } = tournament
  const rrStages = getAllRoundRobinStages(stages)
  !tournament.calculated &&
    rrStages.forEach((stage) => {
      calculateStageRankings(tournament, getTournamentConfig(tournament), stage)
      tournament.calculated = true
    })
  const [activeTab, setActiveTab] = useState(getDefaultStageTab(rrStages))
  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab)
  }

  return (
    <React.Fragment>
      <Row className="mt-3"></Row>
      {rrStages && rrStages.length === 1 && <DisplayStage tournament={tournament} tournamentType={tournamentType} stage={rrStages[0]} />}
      {rrStages && rrStages.length > 1 && (
        <React.Fragment>
          <Nav tabs className="mt-3">
            {rrStages.map((stage) => (
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
            {rrStages.map((stage) => (
              <React.Fragment key={stage.name}>
                {stage.name && (
                  <TabPane tabId={stage.name.replace(' ', '-')}>
                    <DisplayStage tournament={tournament} tournamentType={tournamentType} stage={stage} />
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

export default Groups
