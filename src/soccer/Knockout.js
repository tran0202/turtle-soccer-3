import React from 'react'
import { DisplaySchedule, getMatchArrayByDate } from './Helper'
import Bracket from './Bracket'

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
  let { stage } = props
  stage = reorderMatches(stage)
  return (
    <React.Fragment>
      <Bracket stage={stage} />
      {stage.rounds &&
        stage.rounds.map((r) => {
          return <DisplaySchedule round={{ name: r.name, ...getMatchArrayByDate(r, true) }} config={{ knockoutMatch: true }} key={r.name} />
        })}
    </React.Fragment>
  )
}

export default Knockout
