import React from 'react'
import { DisplaySchedule, getMatchArrayByDate, collectMdMatchesPair } from './Helper'

const RoundRobinMatchDay = (props) => {
  const { stage, config } = props
  const { matchdays, mdMatches } = collectMdMatchesPair(stage)
  return (
    <React.Fragment>
      {matchdays.map((md) => {
        return <DisplaySchedule round={{ name: md, ...getMatchArrayByDate(mdMatches[md], true) }} config={{ showMatchYear: config.show_match_year }} key={md} />
      })}
    </React.Fragment>
  )
}

export default RoundRobinMatchDay
