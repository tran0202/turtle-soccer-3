import React from 'react'
import { DisplaySchedule, getDateMatchArrayPair } from './Helper'

const getMatchArrayByDate = (stage, sorted) => {
  let tmp = []
  stage.groups &&
    stage.groups.forEach((g) => {
      g.matches &&
        g.matches.forEach((m) => {
          tmp.push({ ...m, group: g.name })
        })
    })
  return getDateMatchArrayPair(tmp, sorted)
}

const RoundRobin = (props) => {
  const { stage, config } = props
  // console.log('stage', stage)
  return <DisplaySchedule round={getMatchArrayByDate(stage, true)} config={{ showMatchYear: config.show_match_year }} />
}

export default RoundRobin
