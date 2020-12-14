import React from 'react'
import GroupPlay from './GroupPlay'
import Rankings from './Rankings'
import { calculateGroupRankings, collectMatchdayRankings, hasWildCardAdvancement, collectWildCardRankings } from './RankingsHelper'
import { Row, Col } from 'reactstrap'
import ordinalize from 'ordinalize'

const GroupStandings = (props) => {
  const { config, stage } = props
  const { groups, advancement, show_match_year } = stage
  const wildCardPos = groups && hasWildCardAdvancement(stage) ? advancement.teams.wild_card.pos : 3
  groups &&
    groups.forEach((group) => {
      calculateGroupRankings(group, config)
      const matchDay = group.matches ? Math.ceil(group.matches.length / (group.teams.length / 2)) : 0
      collectMatchdayRankings(group, matchDay)
    })
  const wildCardRankings = collectWildCardRankings(stage)
  // console.log('groups', groups)
  stage.wild_card = wildCardRankings
  return (
    <React.Fragment>
      {groups && groups.map((g) => <GroupPlay group={g} config={{ ...config, show_match_year }} key={g.name} />)}
      {groups && hasWildCardAdvancement(stage) && (
        <React.Fragment>
          <Row>
            <Col>
              <div className="h2-ff1 margin-top-md">Rankings of {ordinalize(wildCardPos)}-placed teams</div>
            </Col>
          </Row>
          <Rankings rounds={[wildCardRankings]} config={config} />
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default GroupStandings
