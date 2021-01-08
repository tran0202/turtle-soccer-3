import React from 'react'
import { DisplaySchedule, getMatchArrayByDate } from './Helper'
import { hasReplay } from './RankingsHelper'
import Bracket from './Bracket'

const reorderMatches = (matches) => {
  matches &&
    matches.sort((a, b) => {
      if (a.bracket_order < b.bracket_order) {
        return -1
      } else if (a.bracket_order > b.bracket_order) {
        return 1
      } else {
        return 0
      }
    })
  return matches
}

const getBracketStage = (stage) => {
  const rounds = []
  const bracket_stage = { name: stage.name, type: stage.type, teams: stage.teams, rounds }
  stage.rounds &&
    stage.rounds.forEach((r) => {
      const roundMatches = []
      r.matches &&
        r.matches.forEach((m) => {
          roundMatches.push(m)
        })
      rounds.push({ matches: reorderMatches(roundMatches), eliminateCount: r.eliminateCount, name: r.name, short_name: r.short_name, next_round: r.next_round })
    })
  return bracket_stage
}

const Knockout = (props) => {
  const { stage, config } = props
  const bracket_stage = getBracketStage(stage)
  const bracketConfig = {
    tournamentTypeId: config.tournament_type_id,
    goldenGoal: config.golden_goal_rule,
    silverGoal: config.silver_goal_rule,
  }
  const displayScheduleConfig = {
    knockoutMatch: true,
    ...bracketConfig,
  }
  // console.log('stage', stage)
  return (
    <React.Fragment>
      <Bracket stage={bracket_stage} config={bracketConfig} />
      {stage.rounds &&
        stage.rounds.map((r) => {
          const matchArray = getMatchArrayByDate(r, true)
          if (!hasReplay(r)) {
            return <DisplaySchedule round={{ name: r.name, ...matchArray }} config={displayScheduleConfig} key={r.name} />
          } else {
            return (
              <React.Fragment key={r.name}>
                <DisplaySchedule round={{ name: r.name, ...matchArray[0] }} config={displayScheduleConfig} />
                <DisplaySchedule round={{ ...matchArray[1] }} config={displayScheduleConfig} />
              </React.Fragment>
            )
          }
        })}
    </React.Fragment>
  )
}

export default Knockout
