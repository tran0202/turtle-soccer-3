import React from 'react'
import GroupPlay from './GroupPlay'
import Rankings from './Rankings'
import { hasWildCardAdvancement } from './RankingsHelper'
import { Row, Col } from 'reactstrap'
import ordinalize from 'ordinalize'

const GroupStandings = (props) => {
  const { config, stage } = props
  const { groups, advancement, show_match_year } = stage
  const wildCardPos = groups && hasWildCardAdvancement(stage) ? advancement.teams.wild_card.pos : 3
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
          <Rankings rounds={[stage.wild_card]} config={config} />
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default GroupStandings
