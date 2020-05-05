import React from 'react'
import { DisplaySchedule, getDateMatchArrayPair } from './Helper'
import Bracket from './Bracket'

const getMatchArrayByDate = (round) => {
  let tmp = []
  round.matches &&
    round.matches.forEach((m) => {
      tmp.push(m)
    })
  return getDateMatchArrayPair(tmp)
}

const reorderMatches = (stage) => {
  stage.rounds &&
    stage.rounds.map((r) => {
      r.matches &&
        r.matches.sort((a, b) => {
          if (a.bracket_order < b.bracket_order) {
            return -1
          } else if (a.bracket_order > b.bracket_order) {
            return 1
          } else {
            return 0
          }
        })
      return null
    })
  return stage
}

const Knockout = (props) => {
  const { stage } = props
  const newStage = reorderMatches(stage)
  return (
    <React.Fragment>
      <Bracket stage={newStage} />
      {newStage.rounds &&
        newStage.rounds.map((r) => {
          return <DisplaySchedule round={{ name: r.name, ...getMatchArrayByDate(r) }} key={r.name} />
        })}
    </React.Fragment>
  )
}

export default Knockout
