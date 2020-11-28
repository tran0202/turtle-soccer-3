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
  const { stage } = props
  // console.log('matches', matches)
  return <DisplaySchedule round={getMatchArrayByDate(stage, true)} />
}

export default RoundRobin
