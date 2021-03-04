import React from 'react'
import { DisplaySchedule, getMatchArrayByDate, collectMdMatchesPair } from './Helper'

const RoundRobinMatchDay = (props) => {
  const { stage, config } = props
  // console.log('config', config)
  const { matchdays, mdMatches } = collectMdMatchesPair(stage)
  return (
    <React.Fragment>
      {matchdays.map((md) => {
        return (
          <DisplaySchedule
            round={{ name: md, ...getMatchArrayByDate(mdMatches[md], true) }}
            config={{ showMatchYear: config.show_match_year, logo_path: config.logo_path, team_type_id: config.team_type_id }}
            key={md}
          />
        )
      })}
    </React.Fragment>
  )
}

export default RoundRobinMatchDay
