import React, { useState } from 'react'
import GroupStandings from './GroupStandings'
import GroupMdStandings from './GroupMdStandings'
import { getTournamentConfig, getDefaultStageTab, getAllRoundRobinStages } from './Helper'
import {
  calculateGroupRankings,
  calculateProgressRankings,
  collectGroupRankings,
  hasWildCardAdvancement,
  collectWildCardRankings,
  isGroupPlayoffTiebreaker,
  isLotGroupPlayoffTiebreaker,
} from './RankingsHelper'
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap'
import classnames from 'classnames'

const getFormat = (rrStage) => {
  const { groups, advancement, odd_format } = rrStage
  const groupCount = groups ? groups.length : 0
  const teamCount = groups && groups[0] && groups[0].teams ? groups[0].teams.length : 0
  return { groupCount, teamCount, totalCount: groupCount * teamCount, advancement, odd_format }
}

const TournamentFormat = (props) => {
  const { config, tournamentType } = props
  // console.log('config', config)
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
                    {config.id === 'WC1930' && (
                      <React.Fragment>13 teams were drawn into 4 groups, with Group 1 containing 4 teams and the others containing 3.&nbsp;</React.Fragment>
                    )}
                    {config.id !== 'WC1930' && (
                      <React.Fragment>
                        {config.totalCount} teams were drawn into {config.groupCount} groups of {config.teamCount} teams.&nbsp;
                      </React.Fragment>
                    )}
                    {config.id === 'WC1950' && <React.Fragment>(13 teams eventually participated after several withdrawals).&nbsp;</React.Fragment>}
                    {!config.odd_format && <React.Fragment>Each group played a round-robin schedule.</React.Fragment>}
                    {config.odd_format}
                  </React.Fragment>
                )}
                {config.groupCount === 1 && <React.Fragment>{config.totalCount} teams played a league of home-and-away round-robin matches.</React.Fragment>}
                &nbsp;
                {config.advancement && config.advancement.teams && config.advancement.teams.text
                  ? config.advancement.teams.text
                  : 'The top 2 teams would advance to the knockout stage.'}
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
                    if (tb === 'points') {
                      return (
                        <React.Fragment key={index}>
                          <li>Points</li>
                        </React.Fragment>
                      )
                    } else if (tb === 'team') {
                      return (
                        <React.Fragment key={index}>
                          <li>Points</li>
                          <li>Overall goal difference</li>
                          <li>Overall goals scored</li>
                        </React.Fragment>
                      )
                    } else if (tb === 'pointandgoaldifferent') {
                      return (
                        <React.Fragment key={index}>
                          <li>Points</li>
                          <li>Overall goal difference</li>
                        </React.Fragment>
                      )
                    } else if (tb === 'goalratio') {
                      return (
                        <React.Fragment key={index}>
                          <li>Points</li>
                          <li>Overall goal ratio</li>
                        </React.Fragment>
                      )
                    } else if (tb === 'goalratiogroupplayoff') {
                      return (
                        <React.Fragment key={index}>
                          <li>Points</li>
                          <li>Overall goal ratio if the top 2 teams on equal points</li>
                          <li>Playoff match if the 2nd and 3rd placed teams on equal points</li>
                          <li>Goal ratio from group matches if the playoff match ends with a draw</li>
                        </React.Fragment>
                      )
                    } else if (tb === 'lotgroupplayoff') {
                      return (
                        <React.Fragment key={index}>
                          <li>Points</li>
                          <li>Drawing lots if the top 2 teams on equal points</li>
                          <li>Playoff match if the 2nd and 3rd placed teams on equal points</li>
                        </React.Fragment>
                      )
                    } else if (tb === '1stplaceplayoff') {
                      return (
                        <React.Fragment key={index}>
                          <li>Points</li>
                          <li>Playoff match if the top 2 teams on equal points</li>
                        </React.Fragment>
                      )
                    } else if (tb === 'firstroundposition') {
                      return (
                        <React.Fragment key={index}>
                          <li>Higher finishing position in the first round table</li>
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
      group.teams && group.matches && calculateGroupRankings(group.teams, group.teams, group.matches, config)
      let matchDay = group.matches ? Math.ceil(group.matches.length / (group.teams.length / 2)) : 0
      matchDay = isGroupPlayoffTiebreaker(tournament) ? 3 : matchDay
      matchDay = isLotGroupPlayoffTiebreaker(tournament) ? 2 : matchDay
      collectGroupRankings(tournament, group, matchDay)
      group.teams && group.matches && calculateProgressRankings(tournament, group.teams, group.matches, config)
    })
  stage.wild_card = groups && hasWildCardAdvancement(stage) ? collectWildCardRankings(stage) : {}
}

const DisplayStage = (props) => {
  const { tournament, tournamentType, stage } = props
  if (!stage) return
  const format = getFormat(stage)
  const config = stage.tiebreakers
    ? { ...getTournamentConfig(tournament), ...format, tiebreakers: stage.tiebreakers }
    : { ...getTournamentConfig(tournament), ...format }
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
