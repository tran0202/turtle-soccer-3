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
        m1['home_2nd_leg_score'] = m2.away_score
        m1['away_2nd_leg_score'] = m2.home_score
        m1['home_2nd_leg_extra_score'] = m2.away_extra_score
        m1['away_2nd_leg_extra_score'] = m2.home_extra_score
        m1['home_2nd_leg_penalty_score'] = m2.away_penalty_score
        m1['away_2nd_leg_penalty_score'] = m2.home_penalty_score
        if (m1.home_score != null && m1.away_score != null && m2.home_score != null && m2.away_score != null) {
          m1.home_1st_leg_aggregate_score = parseInt(m1.home_score) + parseInt(m2.away_score)
          m1.away_1st_leg_aggregate_score = parseInt(m1.away_score) + parseInt(m2.home_score)
          if (m2.home_extra_score != null && m2.away_extra_score != null) {
            m1.home_1st_leg_aggregate_score = m1.home_1st_leg_aggregate_score + parseInt(m2.away_extra_score)
            m1.away_1st_leg_aggregate_score = m1.away_1st_leg_aggregate_score + parseInt(m2.home_extra_score)
          }
          m2.home_2nd_leg_aggregate_score = parseInt(m2.home_score) + parseInt(m1.away_score)
          m2.away_2nd_leg_aggregate_score = parseInt(m2.away_score) + parseInt(m1.home_score)
          if (m2.home_extra_score != null && m2.away_extra_score != null) {
            m2.home_2nd_leg_aggregate_score = m2.home_2nd_leg_aggregate_score + parseInt(m2.home_extra_score)
            m2.away_2nd_leg_aggregate_score = m2.away_2nd_leg_aggregate_score + parseInt(m2.away_extra_score)
          }
        }
        if (m1.home_1st_leg_aggregate_score === m1.away_1st_leg_aggregate_score) {
          if (m1.away_score > m2.away_score) {
            m1.aggregate_1st_leg_team = m2.home_team
          } else if (m1.away_score < m2.away_score) {
            m1.aggregate_1st_leg_team = m1.home_team
          } else if (m2.away_extra_score > 0) {
            m1.aggregate_1st_leg_team = m2.away_team
          }
        }
        if (m2.home_2nd_leg_aggregate_score === m2.away_2nd_leg_aggregate_score) {
          if (m1.away_score > m2.away_score) {
            m2.aggregate_2nd_leg_team = m2.home_team
          } else if (m1.away_score < m2.away_score) {
            m2.aggregate_2nd_leg_team = m1.home_team
          } else if (m2.away_extra_score > 0) {
            m2.aggregate_2nd_leg_team = m2.away_team
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
  return (
    <React.Fragment>
      <Knockout2LeggedSummary stage={stage} />
      {stage.rounds &&
        stage.rounds.map((r) => {
          return <DisplaySchedule round={{ name: r.name, ...getMatchArrayByDate(r, false) }} showMatchYear={stage.show_match_year} key={r.name} />
        })}
    </React.Fragment>
  )
}

export default Knockout2Legged
