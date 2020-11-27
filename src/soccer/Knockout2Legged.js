import React from 'react'
import { DisplaySchedule, getMatchArrayByDate } from './Helper'

const calculateAggregateScore = (stage) => {
  if (stage.type !== 'knockout2legged') {
    console.log('Not a knockout2legged stage')
    return
  }
  if (!stage.rounds || stage.rounds.length !== 2) {
    console.log('Invalid knockout2legged stage')
    return
  }
  const firstLeg = stage.rounds[0]
  let secondLeg = stage.rounds[1]
  if (!firstLeg.matches || firstLeg.matches.length === 0) {
    console.log('No matches in first leg')
    return
  }
  if (!secondLeg.matches || secondLeg.matches.length === 0) {
    console.log('No matches in second leg')
    return
  }
  secondLeg.matches.map((m2) => {
    firstLeg.matches.map((m1) => {
      if (m2.home_team === m1.away_team && m2.away_team === m1.home_team) {
        m2.home_aggregate_score = parseInt(m2.home_score) + parseInt(m1.away_score)
        m2.away_aggregate_score = parseInt(m2.away_score) + parseInt(m1.home_score)
        return
      }
    })
  })
}

const Knockout2Legged = (props) => {
  const { stage } = props
  calculateAggregateScore(stage)
  console.log('stage', stage)
  return (
    <React.Fragment>
      {stage.rounds &&
        stage.rounds.map((r) => {
          return <DisplaySchedule round={{ name: r.name, ...getMatchArrayByDate(r) }} showMatchYear={stage.show_match_year} key={r.name} />
        })}
    </React.Fragment>
  )
}

export default Knockout2Legged
