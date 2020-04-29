import React from 'react'
import Rankings from './Rankings'
import { getRoundRobinStage, getTournamentConfig, getRoundFinalRanking } from './Helper'
import { calculateGroupRankings, collectGroupRankings, sortGroupRankings } from './RankingsHelper'
import { Row } from 'reactstrap'

const eliminateGroupTeams = (tournament, groupStage, group) => {
  if (!tournament.final_rankings) {
    tournament.final_rankings = []
  }
  if (!tournament.final_rankings.rounds) {
    tournament.final_rankings.rounds = []
  }
  if (groupStage.eliminateRule === 'bottom2') {
    const eliminated = group.final_rankings.filter((t) => t.r === 3 || t.r === 4)
    // console.log('eliminated', eliminated)
    const tmp = tournament.final_rankings.rounds.filter((r) => r.name === groupStage.name)
    if (tmp.length === 1) {
      tmp[0].final_rankings.push(eliminated[0], eliminated[1])
    } else {
      tournament.final_rankings.rounds.push({ name: groupStage.name, ranking_type: 'round', final_rankings: eliminated })
    }
  }
}

const Standings = (props) => {
  const { tournament } = props
  const config = getTournamentConfig(tournament)
  const { stages } = tournament
  const rrStages = getRoundRobinStage(stages)
  const groupStage = rrStages.length > 0 ? rrStages[0] : null // 2nd round-robin ?
  if (groupStage) {
    groupStage.groups.forEach((g) => {
      calculateGroupRankings(g, config)
      collectGroupRankings(g, config)
      eliminateGroupTeams(tournament, groupStage, g)
    })
    sortGroupRankings(getRoundFinalRanking(tournament.final_rankings.rounds, groupStage.name))
  }
  return (
    <React.Fragment>
      <Row className="mt-5"></Row>
      <Rankings config={config} rounds={tournament.final_rankings.rounds} />
    </React.Fragment>
  )
}

export default Standings
