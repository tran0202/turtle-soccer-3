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
  const newRounds = stage.rounds.filter(
    (r) =>
      r.name !== 'Consolation First Round' &&
      r.name !== 'Consolation Semi-finals' &&
      r.name !== 'Fifth-place' &&
      r.name !== 'Playoff First Round' &&
      r.name !== 'Playoff Second Round',
  )
  return { ...stage, rounds: newRounds }
}

const getConsolationPathStage = (stage) => {
  if (!stage.rounds) return
  const newRounds = stage.rounds.filter(
    (r) =>
      r.name === 'Consolation First Round' ||
      r.name === 'Consolation Semi-finals' ||
      r.name === 'Fifth-place' ||
      r.name === 'Playoff First Round' ||
      r.name === 'Playoff Second Round',
  )
  return { ...stage, rounds: newRounds }
}

const getBracketStage = (stage) => {
  if (!stage) return {}
  const rounds = []
  stage.rounds &&
    stage.rounds.forEach((r) => {
      const roundMatches = []
      r.matches &&
        r.matches.forEach((m) => {
          roundMatches.push(m)
        })
      rounds.push({ ...r, matches: reorderMatches(roundMatches) })
    })
  return { ...stage, rounds }
}

const Knockout = (props) => {
  const { stage, config } = props
  const final_path_bracket_stage = getBracketStage(getFinalPathStage(stage))
  const consolation_path_bracket_stage = getBracketStage(getConsolationPathStage(stage))
  const consolationBracketName = stage.rounds && stage.rounds.find((r) => r.name === 'Playoff First Round') !== undefined ? 'Playoff' : 'Consolation'
  const bracketConfig = {
    tournamentTypeId: config.tournament_type_id,
    goldenGoal: config.golden_goal_rule,
    silverGoal: config.silver_goal_rule,
  }
  const bracketConsolationConfig = {
    consolation_bracket: true,
    consolation_bracket_name: consolationBracketName,
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
            return (
              <DisplaySchedule round={{ name: r.name, ...matchArray, consolation_notes: r.consolation_notes }} config={displayScheduleConfig} key={r.name} />
            )
          } else {
            return (
              <React.Fragment key={r.name}>
                <DisplaySchedule round={{ name: r.name, ...matchArray[0], consolation_notes: r.consolation_notes }} config={displayScheduleConfig} />
                <DisplaySchedule round={{ ...matchArray[1], consolation_notes: r.consolation_notes }} config={displayScheduleConfig} />
              </React.Fragment>
            )
          }
        })}
    </React.Fragment>
  )
}

export default Knockout
