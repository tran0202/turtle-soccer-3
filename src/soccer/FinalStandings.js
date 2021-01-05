import React from 'react'
import Rankings from './Rankings'
import { hasWildCardAdvancement, collectWildCardRankings, getBlankRanking } from './RankingsHelper'
import { getRoundRobinStages, getKnockoutStages, getTournamentConfig, isWinner } from './Helper'
import {
  calculateGroupRankings,
  calculateProgressRankings,
  createGroupFinalRankings,
  sortGroupRankings,
  calculateKnockoutRankings,
  isEliminated,
  isAdvancedNextRound,
  isAdvancedThirdPlace,
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
  const advancedThirdPlaceTeam = group.final_rankings.find((t) => t && isAdvancedThirdPlace(t, groupStage))
  if (advancedThirdPlaceTeam) {
    tmp = tournament.advanced_teams.rounds.find((r) => r.name === 'Third place')
    if (!tmp) {
      tournament.advanced_teams.rounds.unshift({ name: 'Third place', ranking_type: 'round', final_rankings: [] })
      tmp = tournament.advanced_teams.rounds.find((r) => r.name === 'Third place')
    }
    const advancedThirdPlaceTeamProgess = tournament.progress_rankings.teams.find((t) => t.id === advancedThirdPlaceTeam.id)
    const advancedThirdPlaceTeamRanking = advancedThirdPlaceTeamProgess.rankings
      ? advancedThirdPlaceTeamProgess.rankings[advancedThirdPlaceTeamProgess.rankings.length - 1]
      : {}
    tmp.final_rankings.push(advancedThirdPlaceTeamRanking)
  }
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
      let finalStandingRound = tournament.final_rankings.rounds.find((r) => r.name === round.name)
      const home_ranking = findTeam(advanced_teams.final_rankings, m.home_team)
      const away_ranking = findTeam(advanced_teams.final_rankings, m.away_team)
      if (!isWinner('H', m) && !m.walkover) {
        if (!finalStandingRound) {
          tournament.final_rankings.rounds.unshift({ name: round.name, ranking_type: 'round', final_rankings: [home_ranking] })
          finalStandingRound = tournament.final_rankings.rounds.find((r) => r.name === round.name)
        } else {
          finalStandingRound.final_rankings.push(home_ranking)
        }
        finalStandingRound.final_rankings = finalStandingRound.final_rankings.filter((fr) => fr.id !== m.away_team)
      } else if (!isWinner('A', m) && !m.walkover) {
        // console.log('m', m)
        if (!finalStandingRound) {
          tournament.final_rankings.rounds.unshift({ name: round.name, ranking_type: 'round', final_rankings: [away_ranking] })
          finalStandingRound = tournament.final_rankings.rounds.find((r) => r.name === round.name)
        } else {
          finalStandingRound.final_rankings.push(away_ranking)
        }
        finalStandingRound.final_rankings = finalStandingRound.final_rankings.filter((fr) => fr.id !== m.home_team)
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

const createFinalRoundRankings = (tournament, groupStage, group) => {
  if (!tournament.progress_rankings || !tournament.progress_rankings.teams) return
  if (!group.final_rankings) return
  if (!tournament.final_rankings) {
    tournament.final_rankings = {}
  }
  if (!tournament.final_rankings.rounds) {
    tournament.final_rankings.rounds = []
  }
  // console.log('group.final_rankings', group.final_rankings)
  tournament.final_rankings.rounds.unshift({ name: groupStage.name, ranking_type: 'round', final_rankings: [] })
  const finalRound = tournament.final_rankings.rounds.find((r) => r.name === groupStage.name)
  group.final_rankings.forEach((fr, index) => {
    const teamProgess = tournament.progress_rankings.teams.find((t) => t.id === fr.id)
    const teamRanking = teamProgess.rankings ? teamProgess.rankings[teamProgess.rankings.length - 1] : {}
    finalRound.final_rankings.push({ ...teamRanking, r: index + 1 })
  })
}

export const findRoundFinalRanking = (tournament, name) => {
  return tournament.final_rankings && tournament.final_rankings.rounds.find((r) => r.name === name)
}

export const findRoundAdvancedTeams = (tournament, name) => {
  if (!tournament.advanced_teams) return
  return tournament.advanced_teams.rounds.find((r) => r.name === name)
}

const initKnockoutRankings = (tournament, stage) => {
  if (tournament.advanced_teams && tournament.final_rankings) return
  if (!tournament.advanced_teams) {
    tournament.advanced_teams = {}
    tournament.advanced_teams.rounds = []
    let finalRankings = []
    stage.teams &&
      stage.teams.forEach((t) => {
        finalRankings.push(getBlankRanking(t.id))
      })
    const roundName = stage.rounds && stage.rounds.length > 0 ? stage.rounds[0].name : ''
    tournament.advanced_teams.rounds.push({ name: roundName, ranking_type: 'round', final_rankings: finalRankings })
  }
  if (!tournament.final_rankings) {
    tournament.final_rankings = {}
    tournament.final_rankings.rounds = []
  }
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
          createGroupFinalRankings(tournament, g, 3)
          g.teams && g.matches && calculateProgressRankings(tournament, g.teams, g.matches, config)
          !groupStage.championship_round && eliminateGroupTeams(tournament, groupStage, g)
          groupStage.championship_round && createFinalRoundRankings(tournament, groupStage, g)
        })
        !groupStage.championship_round &&
          groupStage.groups.forEach((g) => {
            advanceGroupTeams(tournament, groupStage, g)
          })
        advanceWildCardTeams(tournament, groupStage)
        !groupStage.championship_round && sortGroupRankings(findRoundFinalRanking(tournament, groupStage.name), parseInt(groupStage.eliminateCount) + 1, null)
      }
    })

  const koStages = getKnockoutStages(stages)
  const koStage = koStages ? koStages[0] : null
  if (koStage && koStage.rounds) {
    initKnockoutRankings(tournament, koStage)
    // console.log('tournament', tournament)
    const earlyRounds = koStage.rounds.filter((r) => r.name !== 'Semi-finals' && r.name !== 'Third place' && r.name !== 'Final')
    earlyRounds.forEach((round) => {
      calculateKnockoutRankings(findRoundAdvancedTeams(tournament, round.name), round, config)
      eliminateKnockoutTeams(tournament, round)
      sortGroupRankings(findRoundFinalRanking(tournament, round.name), parseInt(round.eliminateCount) + 1, null)
      advanceKnockoutTeams(tournament, round)
    })

    const semifinals = koStage.rounds.find((r) => r.name === 'Semi-finals')
    if (semifinals) {
      calculateKnockoutRankings(findRoundAdvancedTeams(tournament, semifinals.name), semifinals, config)
      eliminateKnockoutTeams(tournament, semifinals)
      sortGroupRankings(findRoundFinalRanking(tournament, semifinals.name), parseInt(semifinals.eliminateCount) + 1, null)
      advanceThirdPlaceTeams(tournament, semifinals)
    }

    const thirdPlace = koStage.rounds.find((r) => r.name === 'Third place')
    if (thirdPlace) {
      calculateKnockoutRankings(findRoundAdvancedTeams(tournament, thirdPlace.name), thirdPlace, config)
      createFinalRankings(tournament, thirdPlace)
    }

    if (semifinals) {
      advanceKnockoutTeams(tournament, semifinals)
    }

    const final = koStage.rounds.find((r) => r.name === 'Final')
    if (final) {
      calculateKnockoutRankings(findRoundAdvancedTeams(tournament, final.name), final, config)
      createFinalRankings(tournament, final)
    }
  }

  const hasThirdPlaceRound = tournament.final_rankings ? tournament.final_rankings.rounds.find((r) => r.name === 'Third place') !== undefined : false
  const filteredRounds =
    tournament.final_rankings && hasThirdPlaceRound
      ? tournament.final_rankings.rounds.filter((r) => r.name !== 'Semi-finals')
      : tournament.final_rankings
      ? tournament.final_rankings.rounds
      : []
  return (
    <React.Fragment>
      <Row className="mt-3"></Row>
      {filteredRounds.length > 0 && <Rankings config={config} rounds={filteredRounds} />}
    </React.Fragment>
  )
}

export default FinalStandings
