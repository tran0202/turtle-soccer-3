import React from 'react'
import { getBracketStage, getFinalPathStage } from './Helper'
import Bracket from './Bracket'
import KnockoutSingle from './KnockoutSingle'
import KnockoutSingle2Legged from './KnockoutSingle2Legged'

const KnockoutMultiple2Legged = (props) => {
  const { stage, config } = props
  const bracket_stage = getBracketStage(getFinalPathStage(stage))
  const bracketConfig = {
    tournamentTypeId: config.tournament_type_id,
    goldenGoal: config.golden_goal_rule,
    silverGoal: config.silver_goal_rule,
    logo_path: config.logo_path,
    team_type_id: config.team_type_id,
  }
  const displayScheduleConfig = {
    knockoutMatch: true,
    show_match_year: config.show_match_year,
    ...bracketConfig,
  }
  // console.log('displayScheduleConfig', displayScheduleConfig)
  return (
    <React.Fragment>
      <Bracket stage={bracket_stage} config={bracketConfig} />
      {stage.rounds &&
        stage.rounds.map((r) =>
          r.name !== 'Final' ? (
            <KnockoutSingle2Legged round={r} config={displayScheduleConfig} key={r.name} />
          ) : (
            <KnockoutSingle round={r} config={displayScheduleConfig} key={r.name} />
          ),
        )}
    </React.Fragment>
  )
}

export default KnockoutMultiple2Legged
