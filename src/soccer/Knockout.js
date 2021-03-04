import React from 'react'
import { DisplaySchedule, getMatchArrayByDate, getBracketStage, getFinalPathStage, getConsolationPathStage } from './Helper'
import { hasReplay } from './RankingsHelper'
import Bracket from './Bracket'

const Knockout = (props) => {
  const { stage, config } = props
  // console.log('config', config)
  const final_path_bracket_stage = getBracketStage(getFinalPathStage(stage))
  const consolation_path_bracket_stage = getBracketStage(getConsolationPathStage(stage))
  const consolationBracketName = stage.rounds && stage.rounds.find((r) => r.name === 'Playoff First Round') !== undefined ? 'Playoff' : 'Consolation'
  const bracketConfig = {
    tournamentTypeId: config.tournament_type_id,
    goldenGoal: config.golden_goal_rule,
    silverGoal: config.silver_goal_rule,
    logo_path: config.logo_path,
    team_type_id: config.team_type_id,
  }
  const bracketConsolationConfig = {
    consolation_bracket: true,
    consolation_bracket_name: consolationBracketName,
    ...bracketConfig,
  }
  const displayScheduleConfig = {
    knockoutMatch: true,
    showMatchYear: config.show_match_year,
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
