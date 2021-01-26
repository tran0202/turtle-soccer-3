import React from 'react'
import Knockout2LeggedSummary from './Knockout2LeggedSummary'
import { DisplaySchedule, getMatchArrayByDate, calculateAggregateScore } from './Helper'

const Knockout2Legged = (props) => {
  const { stage } = props
  calculateAggregateScore(stage)
  // console.log('stage', stage)
  return (
    <React.Fragment>
      <Knockout2LeggedSummary stage={stage} />
      {stage.rounds &&
        stage.rounds.map((r) => {
          const isSecondLeg = r.round_type === 'secondleg'
          return (
            <DisplaySchedule
              round={{ name: r.name, ...getMatchArrayByDate(r, false) }}
              config={{ showMatchYear: stage.show_match_year, knockoutMatch: isSecondLeg, secondLegMatch: isSecondLeg }}
              key={r.name}
            />
          )
        })}
    </React.Fragment>
  )
}

export default Knockout2Legged
