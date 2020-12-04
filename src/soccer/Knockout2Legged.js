import React from 'react'
import Knockout2LeggedSummary from './Knockout2LeggedSummary'
import { DisplaySchedule, getMatchArrayByDate } from './Helper'

export const isKnockout2LeggedStageValid = (stage) => {
  if (stage.type !== 'knockout2legged') {
    console.log('Not a knockout2legged stage')
    return false
  }
  if (!stage.rounds || stage.rounds.length !== 2) {
    console.log('Invalid knockout2legged stage')
    return false
  }
  const firstLeg = stage.rounds[0]
  let secondLeg = stage.rounds[1]
  if (!firstLeg.matches || firstLeg.matches.length === 0) {
    console.log('No matches in first leg')
    return false
  }
  if (!secondLeg.matches || secondLeg.matches.length === 0) {
    console.log('No matches in second leg')
    return false
  }
  return true
}

export const calculateAggregateScore = (stage) => {
  if (!isKnockout2LeggedStageValid(stage)) return

  const firstLeg = stage.rounds[0]
  let secondLeg = stage.rounds[1]
  secondLeg.matches.forEach((m2) => {
    firstLeg.matches.some((m1) => {
      if (m2.home_team === m1.away_team && m2.away_team === m1.home_team) {
        m1.home_score_2nd_leg = m2.away_score
        m1.away_score_2nd_leg = m2.home_score
        m1.home_extra_score_2nd_leg = m2.away_extra_score
        m1.away_extra_score_2nd_leg = m2.home_extra_score
        m1.home_penalty_score_2nd_leg = m2.away_penalty_score
        m1.away_penalty_score_2nd_leg = m2.home_penalty_score
        m1.notes_1st_leg = m1.notes
        m1.notes_2nd_leg = m2.notes
        if (m1.home_score != null && m1.away_score != null && m2.home_score != null && m2.away_score != null) {
          m1.home_aggregate_score_1st_leg = parseInt(m1.home_score) + parseInt(m2.away_score)
          m1.away_aggregate_score_1st_leg = parseInt(m1.away_score) + parseInt(m2.home_score)
          if (m2.home_extra_score != null && m2.away_extra_score != null) {
            m1.home_aggregate_score_1st_leg = m1.home_aggregate_score_1st_leg + parseInt(m2.away_extra_score)
            m1.away_aggregate_score_1st_leg = m1.away_aggregate_score_1st_leg + parseInt(m2.home_extra_score)
          }
          m2.home_aggregate_score_2nd_leg = parseInt(m2.home_score) + parseInt(m1.away_score)
          m2.away_aggregate_score_2nd_leg = parseInt(m2.away_score) + parseInt(m1.home_score)
          if (m2.home_extra_score != null && m2.away_extra_score != null) {
            m2.home_aggregate_score_2nd_leg = m2.home_aggregate_score_2nd_leg + parseInt(m2.home_extra_score)
            m2.away_aggregate_score_2nd_leg = m2.away_aggregate_score_2nd_leg + parseInt(m2.away_extra_score)
          }
        }
        if (m1.home_aggregate_score_1st_leg === m1.away_aggregate_score_1st_leg) {
          if (m1.away_score > m2.away_score) {
            m1.aggregate_team_1st_leg = m2.home_team
          } else if (m1.away_score < m2.away_score) {
            m1.aggregate_team_1st_leg = m1.home_team
          } else if (m2.away_extra_score > 0) {
            m1.aggregate_team_1st_leg = m2.away_team
          }
        }
        if (m2.home_aggregate_score_2nd_leg === m2.away_aggregate_score_2nd_leg) {
          if (m1.away_score > m2.away_score) {
            m2.aggregate_team_2nd_leg = m2.home_team
          } else if (m1.away_score < m2.away_score) {
            m2.aggregate_team_2nd_leg = m1.home_team
          } else if (m2.away_extra_score > 0) {
            m2.aggregate_team_2nd_leg = m2.away_team
          }
        }
      }
      return m2.home_team === m1.away_team && m2.away_team === m1.home_team
    })
  })
}

const Knockout2Legged = (props) => {
  const { stage } = props
  calculateAggregateScore(stage)
  // console.log('stage', stage)
  return (
    <React.Fragment>
      <Knockout2LeggedSummary stage={stage} />
      {stage.rounds &&
        stage.rounds.map((r) => {
          const isSecondLeg = r.round_type === 'secondleg'
          return (
            <DisplaySchedule
              round={{ name: r.name, ...getMatchArrayByDate(r, false) }}
              config={{ showMatchYear: stage.show_match_year, knockoutMatch: isSecondLeg, secondLegMatch: isSecondLeg }}
              key={r.name}
            />
          )
        })}
    </React.Fragment>
  )
}

export default Knockout2Legged
