import React from 'react'
import Knockout2LeggedSummary from './Knockout2LeggedSummary'
import { DisplaySchedule, getMatchArrayByDate, calculateAggregateScore } from './Helper'

const Knockout2Legged = (props) => {
  const { stage, config } = props
  calculateAggregateScore(stage)
  // console.log('stage', stage)
  return (
    <React.Fragment>
      <Knockout2LeggedSummary stage={stage} config={config} />
      {stage.rounds &&
        stage.rounds.map((r) => {
          const isSecondLeg = r.round_type === 'secondleg'
          const isPlayoffLeg = r.round_type === 'playoffleg'
          return (
            <DisplaySchedule
              round={{ name: r.name, ...getMatchArrayByDate(r, false) }}
              config={{
                showMatchYear: config.show_match_year,
                knockoutMatch: isSecondLeg || isPlayoffLeg,
                secondLegMatch: isSecondLeg,
                logo_path: config.logo_path,
                team_type_id: config.team_type_id,
                multiple_paths: stage.multiple_paths,
              }}
              key={r.name}
            />
          )
        })}
    </React.Fragment>
  )
}

export default Knockout2Legged
