import React from 'react'
import Rankings from './Rankings'
import { hasWildCardAdvancement, collectWildCardRankings } from './RankingsHelper'
import { getRoundRobinStages, getKnockoutStages, getTournamentConfig, isWinner } from './Helper'
import {
  calculateGroupRankings,
  calculateProgressRankings,
  collectGroupRankings,
  sortGroupRankings,
  calculateKnockoutRankings,
  isEliminated,
  isAdvancedNextRound,
  findTeam,
} from './RankingsHelper'
import { Row } from 'reactstrap'

const eliminateGroupTeams = (tournament, groupStage, group) => {
  if (!tournament.progress_rankings || !tournament.progress_rankings.teams) return
  if (!group.final_rankings) return
  if (!tournament.final_rankings) {
    tournament.final_rankings = {}
  }
  if (!tournament.final_rankings.rounds) {
    tournament.final_rankings.rounds = []
  }
  let tmp = tournament.final_rankings.rounds.find((r) => r.name === groupStage.name)
  if (!tmp) {
    tournament.final_rankings.rounds.unshift({ name: groupStage.name, ranking_type: 'round', final_rankings: [] })
    tmp = tournament.final_rankings.rounds.find((r) => r.name === groupStage.name)
  }
  const eliminatedTeams = group.final_rankings.filter((t) => t && isEliminated(t, groupStage))
  eliminatedTeams &&
    eliminatedTeams.forEach((et) => {
      const eliminatedTeamProgess = tournament.progress_rankings.teams.find((t) => t.id === et.id)
      const eliminatedTeamRanking = eliminatedTeamProgess.rankings ? eliminatedTeamProgess.rankings[eliminatedTeamProgess.rankings.length - 1] : {}
      tmp.final_rankings.push(eliminatedTeamRanking)
      // console.log('tmp', tmp)
    })
}

const advanceGroupTeams = (tournament, groupStage, group) => {
  if (!tournament.progress_rankings || !tournament.progress_rankings.teams) return
  if (!group.final_rankings) return
  if (!tournament.advanced_teams) {
    tournament.advanced_teams = {}
  }
  if (!tournament.advanced_teams.rounds) {
    tournament.advanced_teams.rounds = []
  }
  let tmp = tournament.advanced_teams.rounds.find((r) => r.name === groupStage.next_round)
  if (!tmp) {
    tournament.advanced_teams.rounds.unshift({ name: groupStage.next_round, ranking_type: 'round', final_rankings: [] })
    tmp = tournament.advanced_teams.rounds.find((r) => r.name === groupStage.next_round)
  }
  const advancedTeams = group.final_rankings.filter((t) => t && isAdvancedNextRound(t, groupStage))
  advancedTeams &&
    advancedTeams.forEach((at) => {
      const advancedTeamProgess = tournament.progress_rankings.teams.find((t) => t.id === at.id)
      const advancedTeamRanking = advancedTeamProgess.rankings ? advancedTeamProgess.rankings[advancedTeamProgess.rankings.length - 1] : {}
      tmp.final_rankings.push(advancedTeamRanking)
    })
}

const advanceWildCardTeams = (tournament, groupStage) => {
  const wildCardRankings = hasWildCardAdvancement(groupStage) ? collectWildCardRankings(groupStage) : null
  if (!wildCardRankings) return
  groupStage.wild_card = wildCardRankings
  if (!tournament.final_rankings) return
  if (!tournament.advanced_teams) return
  const tmpFinalRankings = tournament.final_rankings.rounds.find((r) => r.name === groupStage.name)
  const tmpAdvancedTeams = tournament.advanced_teams.rounds.find((r) => r.name === groupStage.next_round)
  if (tmpFinalRankings && tmpAdvancedTeams) {
    wildCardRankings.final_rankings &&
      wildCardRankings.final_rankings.forEach((fr, index) => {
        if (index < groupStage.advancement.teams.wild_card.count) {
          tmpAdvancedTeams.final_rankings.push(fr)
        } else {
          tmpFinalRankings.final_rankings.push(fr)
        }
      })
  }
}

const eliminateKnockoutTeams = (tournament, round) => {
  const advanced_teams = findRoundAdvancedTeams(tournament, round.name)
  round.matches &&
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
  round.matches &&
    round.matches.forEach((m) => {
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
  const advanced_teams = findRoundAdvancedTeams(tournament, 'Semi-finals')
  round.matches &&
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
  if (round.matches && advanced_teams) {
    const m = round.matches[0]
    if (m) {
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
  }
}

export const findRoundFinalRanking = (tournament, name) => {
  return tournament.final_rankings && tournament.final_rankings.rounds.find((r) => r.name === name)
}

export const findRoundAdvancedTeams = (tournament, name) => {
  return tournament.advanced_teams.rounds.find((r) => r.name === name)
}

const FinalStandings = (props) => {
  const { tournament } = props
  const config = getTournamentConfig(tournament)
  const { stages } = tournament

  const rrStages = getRoundRobinStages(stages)
  rrStages &&
    rrStages.forEach((groupStage) => {
      if (groupStage.groups) {
        groupStage.groups.forEach((g) => {
          g.teams && g.matches && calculateGroupRankings(g.teams, g.teams, g.matches, config)
          collectGroupRankings(g, 3)
          g.teams && g.matches && calculateProgressRankings(tournament, g.teams, g.matches, config)
          eliminateGroupTeams(tournament, groupStage, g)
        })
        groupStage.groups.forEach((g) => {
          advanceGroupTeams(tournament, groupStage, g)
        })
        advanceWildCardTeams(tournament, groupStage)
        sortGroupRankings(findRoundFinalRanking(tournament, groupStage.name), parseInt(groupStage.eliminateCount) + 1)
      }
    })
  // console.log('tournament.final_rankings', tournament.final_rankings)

  const koStages = getKnockoutStages(stages)
  const koStage = koStages ? koStages[0] : null
  if (koStage && koStage.rounds) {
    const earlyRounds = koStage.rounds.filter((r) => r.name !== 'Semi-finals' && r.name !== 'Third place' && r.name !== 'Final')
    earlyRounds.forEach((round) => {
      calculateKnockoutRankings(findRoundAdvancedTeams(tournament, round.name), round, config)
      eliminateKnockoutTeams(tournament, round)
      sortGroupRankings(findRoundFinalRanking(tournament, round.name), parseInt(round.eliminateCount) + 1)
      advanceKnockoutTeams(tournament, round)
    })

    const semifinals = koStage.rounds.find((r) => r.name === 'Semi-finals')
    if (semifinals) {
      calculateKnockoutRankings(findRoundAdvancedTeams(tournament, semifinals.name), semifinals, config)
      eliminateKnockoutTeams(tournament, semifinals)
      advanceThirdPlaceTeams(tournament, semifinals)
    }

    const thirdPlace = koStage.rounds.find((r) => r.name === 'Third place')
    if (thirdPlace) {
      calculateKnockoutRankings(findRoundAdvancedTeams(tournament, thirdPlace.name), thirdPlace, config)
      createFinalRankings(tournament, thirdPlace)
      advanceKnockoutTeams(tournament, semifinals)
    }

    const final = koStage.rounds.find((r) => r.name === 'Final')
    if (final) {
      calculateKnockoutRankings(findRoundAdvancedTeams(tournament, final.name), final, config)
      createFinalRankings(tournament, final)
    }
  }

  const filteredRounds = tournament.final_rankings ? tournament.final_rankings.rounds.filter((r) => r.name !== 'Semi-finals') : []
  return (
    <React.Fragment>
      <Row className="mt-3"></Row>
      {filteredRounds.length > 0 && <Rankings config={config} rounds={filteredRounds} />}
    </React.Fragment>
  )
}

export default FinalStandings
