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

const getFinalPathStage = (stage) => {
  if (!stage.rounds) return
  const newStage = { rounds: [] }
  stage.rounds.forEach((r) => {
    if (r.name !== 'Consolation' && r.name !== 'Fifth-place') {
      newStage.rounds.push(r)
    }
  })
  // console.log('finalPathRounds', finalPathRounds)
  return newStage
}

const getConsolationPathStage = (stage) => {
  if (!stage.rounds) return
  const newStage = { rounds: [] }
  stage.rounds.forEach((r) => {
    if (r.name === 'Consolation' || r.name === 'Fifth-place') {
      newStage.rounds.push(r)
    }
  })
  return newStage
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
  const final_path_bracket_stage = getBracketStage(getFinalPathStage(stage))
  const consolation_path_bracket_stage = getBracketStage(getConsolationPathStage(stage))
  const bracketConfig = {
    tournamentTypeId: config.tournament_type_id,
    goldenGoal: config.golden_goal_rule,
    silverGoal: config.silver_goal_rule,
  }
  const bracketConsolationConfig = {
    consolation_bracket: true,
    ...bracketConfig,
  }
  const displayScheduleConfig = {
    knockoutMatch: true,
    ...bracketConfig,
  }
  return (
    <React.Fragment>
      <Bracket stage={final_path_bracket_stage} config={bracketConfig} />
      {stage.consolation_round && <Bracket stage={consolation_path_bracket_stage} config={bracketConsolationConfig} />}
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
