import React from 'react'
import GroupPlay from './GroupPlay'
import Rankings from './Rankings'
import { hasWildCardAdvancement } from './RankingsHelper'
import { Row, Col } from 'reactstrap'
import ordinalize from 'ordinalize'

const GroupLeagueMdStandings = (props) => {
  const { config, stage } = props
  // console.log('config', config)
  const { groups, advancement, championship_round } = stage
  const wildCardPos = groups && hasWildCardAdvancement(stage) ? advancement.teams.wild_card.pos : 3
  return (
    <React.Fragment>
      {groups && groups.map((g) => <GroupPlay group={g} config={{ ...config, championship_round }} key={g.name} />)}
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

export default GroupLeagueMdStandings
