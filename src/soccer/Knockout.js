import React from 'react'
import { DisplaySchedule, getMatchArrayByDate } from './Helper'
import { hasReplay } from './RankingsHelper'
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
  let { stage, config } = props
  stage = reorderMatches(stage)
  return (
    <React.Fragment>
      <Bracket stage={stage} config={{ goldenGoal: config.golden_goal_rule }} />
      {stage.rounds &&
        stage.rounds.map((r) => {
          const matchArray = getMatchArrayByDate(r, true)
          // console.log('r', r)
          if (!hasReplay(r)) {
            return (
              <DisplaySchedule round={{ name: r.name, ...matchArray }} config={{ knockoutMatch: true, goldenGoal: config.golden_goal_rule }} key={r.name} />
            )
          } else {
            return (
              <React.Fragment key={r.name}>
                <DisplaySchedule round={{ name: r.name, ...matchArray[0] }} config={{ knockoutMatch: true, goldenGoal: config.golden_goal_rule }} />
                <DisplaySchedule round={{ ...matchArray[1] }} config={{ knockoutMatch: true, goldenGoal: config.golden_goal_rule }} />
              </React.Fragment>
            )
          }
        })}
    </React.Fragment>
  )
}

export default Knockout
