import React from 'react'
import GroupPlay from './GroupPlay'
import Rankings from './Rankings'
import { calculateGroupRankings, collectMatchdayRankings, sortGroupRankings, cloneRanking } from './RankingsHelper'
import { Row, Col } from 'reactstrap'
import ordinalize from 'ordinalize'

const hasWildCardAdvancement = (groups, advancement) => {
  return groups && advancement && advancement.teams && advancement.teams.wild_card && advancement.teams.wild_card.pos
}

const collectWildCardRankings = (groups, pos) => {
  let wildCard = [{ final_rankings: [], ranking_type: 'wildcard' }]
  groups.forEach((g) => {
    if (!g.final_rankings || g.final_rankings.length === 0 || g.final_rankings.length < pos) return
    const wcr = cloneRanking(g.final_rankings.find((fr) => fr.r === pos))
    wildCard[0].final_rankings.push(wcr)
  })
  sortGroupRankings(wildCard[0], 1)
  return wildCard
}

const GroupStage = (props) => {
  const { config, stage } = props
  const { groups, advancement, show_match_year } = stage
  const wildCardPos = hasWildCardAdvancement(groups, advancement) ? advancement.teams.wild_card.pos : 3
  groups.forEach((group) => {
    calculateGroupRankings(group, config)
    const matchDay = group.matches ? Math.ceil(group.matches.length / 2) : 0
    collectMatchdayRankings(group, matchDay)
  })
  const wildCardRankings = collectWildCardRankings(groups, wildCardPos)
  // console.log('groups', groups)
  stage.wild_card = wildCardRankings[0]
  return (
    <React.Fragment>
      {groups && groups.map((g) => <GroupPlay group={g} config={{ ...config, show_match_year }} key={g.name} />)}
      {hasWildCardAdvancement(groups, advancement) && (
        <React.Fragment>
          <Row>
            <Col>
              <div className="h2-ff1 margin-top-md">Rankings of {ordinalize(wildCardPos)}-placed teams</div>
            </Col>
          </Row>
          <Rankings rounds={wildCardRankings} config={config} />
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default GroupStage
