import React from 'react'
import Rankings from './Rankings'
import { getRoundRobinStage, getKnockoutStage, getTournamentConfig, isWinner } from './Helper'
import { calculateGroupRankings, collectGroupRankings, sortGroupRankings, calculateKnockoutRankings, findTeam } from './RankingsHelper'
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
  const advanced_teams = findRoundAdvancedTeams(tournament, round.name)
  round.matches.forEach((m) => {
    const finalStandingRound = tournament.final_rankings.rounds.find((r) => r.name === round.name)
    const home_ranking = findTeam(advanced_teams.final_rankings, m.home_team)
    const away_ranking = findTeam(advanced_teams.final_rankings, m.away_team)
    if (!isWinner('H', m)) {
      if (!finalStandingRound) {
        tournament.final_rankings.rounds.unshift({ name: round.name, ranking_type: 'round', final_rankings: [home_ranking] })
      } else {
        finalStandingRound.final_rankings.push(home_ranking)
      }
    } else if (!isWinner('A', m)) {
      if (!finalStandingRound) {
        tournament.final_rankings.rounds.unshift({ name: round.name, ranking_type: 'round', final_rankings: [away_ranking] })
      } else {
        finalStandingRound.final_rankings.push(away_ranking)
      }
    }
  })
}

const advanceKnockoutTeams = (tournament, round) => {
  const advanced_teams = findRoundAdvancedTeams(tournament, round.name)
  round.matches.forEach((m) => {
    // console.log('m', m)
    const next_round = findRoundAdvancedTeams(tournament, round.next_round)
    const home_ranking = findTeam(advanced_teams.final_rankings, m.home_team)
    const away_ranking = findTeam(advanced_teams.final_rankings, m.away_team)
    if (isWinner('H', m)) {
      if (!next_round) {
        tournament.advanced_teams.rounds.push({ name: round.next_round, ranking_type: 'round', final_rankings: [home_ranking] })
      } else {
        next_round.final_rankings.push(home_ranking)
      }
    } else if (isWinner('A', m)) {
      if (!next_round) {
        tournament.advanced_teams.rounds.push({ name: round.next_round, ranking_type: 'round', final_rankings: [away_ranking] })
      } else {
        next_round.final_rankings.push(away_ranking)
      }
    }
  })
}

const advanceThirdPlaceTeams = (tournament, round) => {
  const advanced_teams = findRoundAdvancedTeams(tournament, 'Semifinals')
  round.matches.forEach((m) => {
    const next_round = findRoundAdvancedTeams(tournament, 'Third place')
    const home_ranking = findTeam(advanced_teams.final_rankings, m.home_team)
    const away_ranking = findTeam(advanced_teams.final_rankings, m.away_team)
    if (!isWinner('H', m)) {
      if (!next_round) {
        tournament.advanced_teams.rounds.push({ name: 'Third place', ranking_type: 'round', final_rankings: [home_ranking] })
      } else {
        next_round.final_rankings.push(home_ranking)
      }
    } else if (!isWinner('A', m)) {
      if (!next_round) {
        tournament.advanced_teams.rounds.push({ name: 'Third place', ranking_type: 'round', final_rankings: [away_ranking] })
      } else {
        next_round.final_rankings.push(away_ranking)
      }
    }
  })
}

const createFinalRankings = (tournament, round) => {
  const advanced_teams = findRoundAdvancedTeams(tournament, round.name)
  const m = round.matches[0]
  let home_ranking = findTeam(advanced_teams.final_rankings, m.home_team)
  let away_ranking = findTeam(advanced_teams.final_rankings, m.away_team)
  const rankWinner = round.name === 'Final' ? 1 : 3
  const rankLoser = round.name === 'Final' ? 2 : 4
  if (isWinner('H', m)) {
    home_ranking.r = rankWinner
    away_ranking.r = rankLoser
    tournament.final_rankings.rounds.unshift({
      name: round.name,
      ranking_type: 'round',
      final_rankings: [home_ranking, away_ranking],
    })
  } else if (isWinner('A', m)) {
    home_ranking.r = rankLoser
    away_ranking.r = rankWinner
    tournament.final_rankings.rounds.unshift({
      name: round.name,
      ranking_type: 'round',
      final_rankings: [away_ranking, home_ranking],
    })
  }
}

export const findRoundFinalRanking = (tournament, name) => {
  return tournament.final_rankings.rounds.find((r) => r.name === name)
}

export const findRoundAdvancedTeams = (tournament, name) => {
  return tournament.advanced_teams.rounds.find((r) => r.name === name)
}

const Standings = (props) => {
  const { tournament } = props
  const config = getTournamentConfig(tournament)
  const { stages } = tournament

  const rrStages = getRoundRobinStage(stages)
  rrStages.forEach((groupStage) => {
    groupStage.groups.forEach((g) => {
      calculateGroupRankings(g, config)
      collectGroupRankings(g, config)
      eliminateGroupTeams(tournament, groupStage, g)
    })
    sortGroupRankings(findRoundFinalRanking(tournament, groupStage.name), parseInt(groupStage.eliminateCount) + 1)
    groupStage.groups.forEach((g) => {
      advanceGroupTeams(tournament, groupStage, g)
    })
  })

  const koStage = getKnockoutStage(stages)[0]
  if (koStage) {
    const earlyRounds = koStage.rounds.filter((r) => r.name !== 'Semifinals' && r.name !== 'Third place' && r.name !== 'Final')
    earlyRounds.forEach((round, index) => {
      calculateKnockoutRankings(findRoundAdvancedTeams(tournament, round.name), round, config)
      eliminateKnockoutTeams(tournament, round)
      sortGroupRankings(findRoundFinalRanking(tournament, round.name), parseInt(round.eliminateCount) + 1)
      advanceKnockoutTeams(tournament, round)
    })

    const semifinals = koStage.rounds.find((r) => r.name === 'Semifinals')
    calculateKnockoutRankings(findRoundAdvancedTeams(tournament, semifinals.name), semifinals, config)
    eliminateKnockoutTeams(tournament, semifinals)
    advanceThirdPlaceTeams(tournament, semifinals)

    const thirdPlace = koStage.rounds.find((r) => r.name === 'Third place')
    calculateKnockoutRankings(findRoundAdvancedTeams(tournament, thirdPlace.name), thirdPlace, config)
    createFinalRankings(tournament, thirdPlace)
    advanceKnockoutTeams(tournament, semifinals)

    const final = koStage.rounds.find((r) => r.name === 'Final')
    calculateKnockoutRankings(findRoundAdvancedTeams(tournament, final.name), final, config)
    createFinalRankings(tournament, final)
  }

  const filteredRounds = tournament.final_rankings ? tournament.final_rankings.rounds.filter((r) => r.name !== 'Semifinals') : []
  return (
    <React.Fragment>
      <Row className="mt-5"></Row>
      {filteredRounds.length > 0 && <Rankings config={config} rounds={filteredRounds} />}
    </React.Fragment>
  )
}

export default Standings
