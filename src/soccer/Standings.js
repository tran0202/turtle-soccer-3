import React from 'react'
import Rankings from './Rankings'
import { getRoundRobinStage, getKnockoutStage, getTournamentConfig, getRoundFinalRanking, isWinner } from './Helper'
import { calculateGroupRankings, collectGroupRankings, sortGroupRankings, calculateKnockoutRankings, findRoundAdvancedTeams, findTeam } from './RankingsHelper'
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
    const tmp = tournament.final_rankings.rounds.find((r) => r.name === groupStage.name)
    if (tmp) {
      tmp.final_rankings.push(eliminated[0], eliminated[1])
    } else {
      tournament.final_rankings.rounds.push({ name: groupStage.name, ranking_type: 'round', final_rankings: eliminated })
    }
  }
}

const advanceGroupTeams = (tournament, groupStage, group) => {
  if (!tournament.advanced_teams) {
    tournament.advanced_teams = []
  }
  if (!tournament.advanced_teams.rounds) {
    tournament.advanced_teams.rounds = []
  }
  if (groupStage.eliminateRule === 'bottom2') {
    const advanced = group.final_rankings.filter((t) => t.r === 1 || t.r === 2)
    const advanced0 = { ...advanced[0] }
    const advanced1 = { ...advanced[1] }
    const tmp = tournament.advanced_teams.rounds.find((r) => r.name === groupStage.next_round)
    if (tmp) {
      tmp.final_rankings.push(advanced0, advanced1)
    } else {
      tournament.advanced_teams.rounds.push({ name: groupStage.next_round, ranking_type: 'round', final_rankings: [advanced0, advanced1] })
    }
  }
}

const eliminateKnockoutTeams = (tournament, round) => {
  const advanced_teams = findRoundAdvancedTeams(tournament.advanced_teams, round.name)
  // console.log('round', round.name)
  round.matches.forEach((m) => {
    const finalStandingRound = tournament.final_rankings.rounds.find((r) => r.name === round.name)
    const home_ranking = findTeam(advanced_teams.final_rankings, m.home_team)
    const away_ranking = findTeam(advanced_teams.final_rankings, m.away_team)
    if (!isWinner('H', m)) {
      if (!finalStandingRound) {
        tournament.final_rankings.rounds.unshift({ name: round.name, final_rankings: [home_ranking] })
      } else {
        finalStandingRound.final_rankings.push(home_ranking)
      }
    } else if (!isWinner('A', m)) {
      if (!finalStandingRound) {
        tournament.final_rankings.rounds.unshift({ name: round.name, final_rankings: [away_ranking] })
      } else {
        finalStandingRound.final_rankings.push(away_ranking)
      }
    }
  })
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
    sortGroupRankings(getRoundFinalRanking(tournament.final_rankings.rounds, groupStage.name), parseInt(groupStage.eliminateCount) + 1)
  }
  const koStages = getKnockoutStage(stages)
  const koStage = koStages.length === 1 ? koStages[0] : null
  if (koStage) {
    groupStage.groups.forEach((g) => {
      advanceGroupTeams(tournament, groupStage, g)
    })
    // Loop through knockout rounds
    const roundof16 = koStage.rounds[0]
    calculateKnockoutRankings(findRoundAdvancedTeams(tournament.advanced_teams, roundof16.name), roundof16, config)
    eliminateKnockoutTeams(tournament, roundof16)
    sortGroupRankings(getRoundFinalRanking(tournament.final_rankings.rounds, roundof16.name), parseInt(koStage.eliminateCount) + 1)
  }
  return (
    <React.Fragment>
      <Row className="mt-5"></Row>
      <Rankings config={config} rounds={tournament.final_rankings.rounds} />
    </React.Fragment>
  )
}

export default Standings
