import React from 'react'
import KnockoutSingle2LeggedSummary from './KnockoutSingle2LeggedSummary'
import { DisplaySchedule, getMatchArrayByDate, calculateAggregateScore2, collectPairMatches } from './Helper'
import { Row, Col } from 'reactstrap'

const KnockoutSingle2Legged = (props) => {
  const { round, config } = props
  calculateAggregateScore2(round)
  collectPairMatches(round)
  // console.log('round', round)
  return (
    <React.Fragment>
      <Row>
        <Col>
          <div className="h2-ff1 margin-top-md">{round.name}</div>
        </Col>
      </Row>
      <KnockoutSingle2LeggedSummary round={round} config={config} />
      {round.matches.map((m) => {
        const isKnockoutMatch = m.match_type === 'secondleg' || m.match_type === 'firstlegonly'
        const isSecondLeg = m.match_type === 'secondleg'
        const ma = getMatchArrayByDate({ matches: [m] }, false)
        return (
          <DisplaySchedule
            round={ma}
            config={{
              showMatchYear: config.show_match_year,
              knockoutMatch: isKnockoutMatch,
              secondLegMatch: isSecondLeg,
              logo_path: config.logo_path,
              team_type_id: config.team_type_id,
              hideDateGroup: true,
            }}
            key={m.home_team}
          />
        )
      })}
    </React.Fragment>
  )
}

export default KnockoutSingle2Legged
