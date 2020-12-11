import React from 'react'
import Rankings from './Rankings'
import { calculateGroupRankings, collectMatchdayRankings, sortGroupRankings } from './RankingsHelper'
import { getTournamentConfig, getParentTeam } from './Helper'
import { Row } from 'reactstrap'

const collectRankings = (tournaments) => {
  let rankingArray = []
  tournaments &&
    tournaments.forEach((t) => {
      const config = getTournamentConfig(t)
      let _teams = []
      let _matches = []
      let rankings = { teams: _teams, matches: _matches }
      t.stages &&
        t.stages.forEach((s) => {
          s.type === 'roundrobin' &&
            s.groups &&
            s.groups.forEach((g) => {
              g.teams &&
                g.teams.forEach((t) => {
                  if (!_teams.find((t2) => t.id === t2.id)) {
                    _teams.push(t)
                  }
                })
              g.matches &&
                g.matches.forEach((m) => {
                  _matches.push(m)
                })
            })
          s.type === 'knockout' &&
            s.rounds &&
            s.rounds.forEach((r) => {
              r.matches &&
                r.matches.forEach((m) => {
                  _matches.push(m)
                })
            })
        })
      calculateGroupRankings(rankings, config)
      const matchDay = 7
      collectMatchdayRankings(rankings, matchDay)
      rankingArray.push(rankings)
    })

  let final_rankings = []
  let allRankings = { final_rankings }
  rankingArray.forEach((tou) => {
    tou.final_rankings &&
      tou.final_rankings.forEach((fr) => {
        if (fr) {
          const parentTeam = getParentTeam(fr.id)
          const teamId = parentTeam ? parentTeam.id : fr.id
          const tmp = final_rankings.find((fr2) => teamId === fr2.id)
          if (!tmp) {
            if (parentTeam) {
              final_rankings.push({ ...fr, id: parentTeam.id })
            } else {
              final_rankings.push(fr)
            }
          } else {
            tmp.mp += fr.mp
            tmp.w += fr.w
            tmp.d += fr.d
            tmp.l += fr.l
            tmp.gf += fr.gf
            tmp.ga += fr.ga
            tmp.gd += fr.gd
            tmp.pts += fr.pts
          }
        }
      })
  })
  // console.log('allRankings', allRankings)
  sortGroupRankings(allRankings, 1)

  return [allRankings]
}

const AlltimeStandings = (props) => {
  const { tournaments } = props
  const ats = tournaments ? collectRankings(tournaments) : []
  return (
    <React.Fragment>
      <Row className="mt-3"></Row>
      {tournaments && <Rankings rounds={ats} config={{}} />}
    </React.Fragment>
  )
}

export default AlltimeStandings
