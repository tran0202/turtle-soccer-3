import React from 'react'
import { getFinalPathStage } from './Helper'
import Bracket from './Bracket'
import KnockoutSingle from './KnockoutSingle'
import KnockoutSingle2Legged from './KnockoutSingle2Legged'

export const reorderPairs = (pairs) => {
  pairs &&
    pairs.sort((a, b) => {
      if (a.bracket_order < b.bracket_order) {
        return -1
      } else if (a.bracket_order > b.bracket_order) {
        return 1
      } else {
        return 0
      }
    })
  return pairs
}

export const getBracketStage2 = (stage) => {
  if (!stage) return {}
  const rounds = []
  // console.log('stage', stage)
  stage.rounds &&
    stage.rounds.forEach((r) => {
      const bracketPairs = []
      r.pairs &&
        r.pairs.forEach((p) => {
          bracketPairs.push(p)
        })
      rounds.push({ ...r, pairs: reorderPairs(bracketPairs) })
    })
  return { ...stage, rounds }
}

const KnockoutMultiple2Legged = (props) => {
  const { stage, config } = props
  const bracket_stage = getBracketStage2(getFinalPathStage(stage))
  // console.log('config', config)
  const bracketConfig = {
    tournamentTypeId: config.tournament_type_id,
    goldenGoal: config.golden_goal_rule,
    silverGoal: config.silver_goal_rule,
    logo_path: config.logo_path,
    team_type_id: config.team_type_id,
    two_legged: true,
  }
  const displayScheduleConfig = {
    knockoutMatch: true,
    show_match_year: config.show_match_year,
    ...bracketConfig,
  }
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
