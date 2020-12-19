import { getTeamName } from './Helper'

export const findTeam = (teamArray, id) => {
  return teamArray ? teamArray.find((t) => t.id === id) : {}
}

const accumulateRanking = (team, match, config) => {
  if (!team) return
  const side = match.home_team === team.id ? 'home' : 'away'
  team.mp++
  team.md++
  if (parseInt(match.home_score) > parseInt(match.away_score)) {
    if (side === 'home') {
      team.w++
      team.gf += parseInt(match.home_score)
      team.ga += parseInt(match.away_score)
      team.pts += config.points_for_win
    } else {
      team.l++
      team.gf += parseInt(match.away_score)
      team.ga += parseInt(match.home_score)
    }
  } else if (parseInt(match.home_score) === parseInt(match.away_score)) {
    if (side === 'home') {
      if (match.home_extra_score != null && match.away_extra_score != null) {
        if (parseInt(match.home_extra_score) > parseInt(match.away_extra_score)) {
          team.w++
          team.gf += parseInt(match.home_score) + parseInt(match.home_extra_score)
          team.ga += parseInt(match.away_score) + parseInt(match.away_extra_score)
          team.pts += config.points_for_win
        } else if (parseInt(match.home_extra_score) === parseInt(match.away_extra_score)) {
          team.d++
          team.gf += parseInt(match.home_score) + parseInt(match.home_extra_score)
          team.ga += parseInt(match.away_score) + parseInt(match.away_extra_score)
          team.pts++
        } else {
          team.l++
          team.gf += parseInt(match.home_score) + parseInt(match.home_extra_score)
          team.ga += parseInt(match.away_score) + parseInt(match.away_extra_score)
        }
      } else {
        team.d++
        team.gf += parseInt(match.home_score)
        team.ga += parseInt(match.away_score)
        team.pts++
      }
    } else {
      if (match.home_extra_score != null && match.away_extra_score != null) {
        if (parseInt(match.home_extra_score) > parseInt(match.away_extra_score)) {
          team.l++
          team.gf += parseInt(match.away_score) + parseInt(match.away_extra_score)
          team.ga += parseInt(match.home_score) + parseInt(match.home_extra_score)
        } else if (parseInt(match.home_extra_score) === parseInt(match.away_extra_score)) {
          team.d++
          team.gf += parseInt(match.away_score) + parseInt(match.away_extra_score)
          team.ga += parseInt(match.home_score) + parseInt(match.home_extra_score)
          team.pts++
        } else {
          team.w++
          team.gf += parseInt(match.away_score) + parseInt(match.away_extra_score)
          team.ga += parseInt(match.home_score) + parseInt(match.home_extra_score)
          team.pts += config.points_for_win
        }
      } else {
        team.d++
        team.gf += parseInt(match.away_score)
        team.ga += parseInt(match.home_score)
        team.pts++
      }
    }
  } else {
    if (side === 'home') {
      team.l++
      team.gf += parseInt(match.home_score)
      team.ga += parseInt(match.away_score)
    } else {
      team.w++
      team.gf += parseInt(match.away_score)
      team.ga += parseInt(match.home_score)
      team.pts += config.points_for_win
    }
  }
  team.gd = team.gf - team.ga
  if (side === 'home') {
    if (match.home_fair_pts) {
      team.fp = (team.fp ? team.fp : 0) + parseInt(match.home_fair_pts)
    }
  } else {
    if (match.away_fair_pts) {
      team.fp = (team.fp ? team.fp : 0) + parseInt(match.away_fair_pts)
    }
  }
  team.h2hm.push(match)
}

const getBlankRanking = (teamId) => {
  return { id: teamId, md: 0, mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, fp: null, h2hm: [] }
}

const findLastTeamRanking = (teams, teamId) => {
  const team = teams.find((t) => t.id === teamId)
  if (!team) {
    teams.push({ id: teamId, rankings: [] })
    return getBlankRanking(teamId)
  }
  if (!team.rankings) {
    team.rankings = []
    return getBlankRanking(teamId)
  }
  // console.log('team', team)
  return team.rankings[team.rankings.length - 1]
}

const calculateTeamRanking = (container, team, match, config) => {
  if (!team) return
  if (!container) return
  const lr = findLastTeamRanking(container, team.id)
  const newRanking = { ...lr }
  accumulateRanking(newRanking, match, config)
  const teamProgressRanking = container.find((t) => t.id === team.id)
  teamProgressRanking.rankings.push(newRanking)
}

export const calculateRoundRankings = (container, teams, matches, config) => {
  matches &&
    matches.forEach((m) => {
      calculateTeamRanking(container, findTeam(teams, m.home_team), m, config)
      calculateTeamRanking(container, findTeam(teams, m.away_team), m, config)
    })
}

export const calculateProgressRankings = (tournament, teams, matches, config) => {
  if (!tournament.progress_rankings) {
    tournament.progress_rankings = {}
  }
  if (!tournament.progress_rankings.teams) {
    tournament.progress_rankings.teams = []
  }
  calculateRoundRankings(tournament.progress_rankings.teams, teams, matches, config)
}

export const calculateGroupRankings = (container, teams, matches, config) => {
  calculateRoundRankings(container, teams, matches, config)
}

const calculateKnockoutTeamRanking = (team, match, config) => {
  accumulateRanking(team, match, config)
}

export const calculateKnockoutRankings = (advanced_teams, round, config) => {
  round.matches &&
    round.matches.forEach((m) => {
      calculateKnockoutTeamRanking(findTeam(advanced_teams.final_rankings, m.home_team), m, config)
      calculateKnockoutTeamRanking(findTeam(advanced_teams.final_rankings, m.away_team), m, config)
    })
}

const findHeadtoHeadMatch = (a, b) => {
  return a.h2hm.filter((m) => (m.home_team === a.id && m.away_team === b.id) || (m.home_team === b.id && m.away_team === a.id))
}

const drawingLots = (a, b) => {
  // Italia 90
  if (a.id === 'NED' && b.id === 'IRL') {
    a.draw_lot_notes = 'Netherlands lost.'
    b.draw_lot_notes = 'Republic of Ireland won.'
    return 1
  }
  return 0
}

const compareFairPoints = (a, b) => {
  if (a.fp > b.fp) {
    return -1
  } else if (a.fp < b.fp) {
    return 1
  } else {
    return drawingLots(a, b)
  }
}

const matchResult = (id, m) => {
  if (m.home_team === id) {
    if (m.home_score > m.away_score) {
      return -1
    } else if (m.home_score < m.away_score) {
      return 1
    } else {
      return 0
    }
  } else if (m.away_team === id) {
    if (m.home_score > m.away_score) {
      return 1
    } else if (m.home_score < m.away_score) {
      return -1
    } else {
      return 0
    }
  }
}

const saveDrawTeams = (a, b) => {
  if (!a.draws) {
    a.draws = []
    a.draws.push(b.id)
  } else {
    a.draws.push(b.id)
  }
}

export const sortGroupRankings = (group, startingIndex) => {
  if (group && group.final_rankings) {
    group.final_rankings.sort((a, b) => {
      if (a.pts > b.pts) {
        return -1
      } else if (a.pts < b.pts) {
        return 1
      } else {
        if (a.gd > b.gd) {
          return -1
        } else if (a.gd < b.gd) {
          return 1
        } else {
          if (a.gf > b.gf) {
            return -1
          } else if (a.gf < b.gf) {
            return 1
          } else {
            if (group.ranking_type === 'round') {
              saveDrawTeams(a, b)
              saveDrawTeams(b, a)
            }
            const found = findHeadtoHeadMatch(a, b)
            if (found.length === 1) {
              const h2hMatch = found[0]
              const h2hResult = matchResult(a.id, h2hMatch)
              if (h2hResult === 1) {
                if (a.id === h2hMatch.home_team) {
                  a.h2h_notes = `Note1` // `${getTeamName(a.id)} lost ${h2hMatch.home_score}-${h2hMatch.away_score} against ${getTeamName(b.id)}`
                  b.h2h_notes = `Note2` // `${getTeamName(b.id)} won ${h2hMatch.away_score}-${h2hMatch.home_score} against ${getTeamName(a.id)}`
                } else {
                  a.h2h_notes = `${getTeamName(a.id)} lost ${h2hMatch.away_score}-${h2hMatch.home_score} against ${getTeamName(b.id)}`
                  b.h2h_notes = `${getTeamName(b.id)} won ${h2hMatch.home_score}-${h2hMatch.away_score} against ${getTeamName(a.id)}`
                }
                return 1
              } else if (h2hResult === -1) {
                if (a.id === h2hMatch.home_team) {
                  a.h2h_notes = `${getTeamName(a.id)} won ${h2hMatch.home_score}-${h2hMatch.away_score} against ${getTeamName(b.id)}`
                  b.h2h_notes = `${getTeamName(b.id)} lost ${h2hMatch.away_score}-${h2hMatch.home_score} against ${getTeamName(a.id)}`
                } else {
                  a.h2h_notes = `${getTeamName(a.id)} won ${h2hMatch.away_score}-${h2hMatch.home_score} against ${getTeamName(b.id)}`
                  b.h2h_notes = `${getTeamName(b.id)} lost ${h2hMatch.home_score}-${h2hMatch.away_score} against ${getTeamName(a.id)}`
                }
                return -1
              } else {
                return compareFairPoints(a, b)
              }
            } else {
              return compareFairPoints(a, b)
            }
          }
        }
      }
    })
    group.final_rankings.forEach((t, index) => {
      if (t) {
        t.r = index + startingIndex
      }
    })
  }
}

export const collectGroupRankings = (group, matchDay) => {
  if (!group.teams) return
  group.teams.forEach((team) => {
    if (team.rankings) {
      const md = team.rankings.length <= matchDay ? team.rankings.length : matchDay
      const rankings = team.rankings.find((r) => r.md === md)
      if (!group.final_rankings) {
        const newRankings = []
        newRankings.push(rankings)
        group.final_rankings = newRankings
        group.ranking_type = 'group'
      } else {
        group.final_rankings.push(rankings)
      }
    }
  })
  sortGroupRankings(group, 1)
}

export const collectProgressRankings = (tournament, group, matchDay) => {
  if (!group.teams) return
  if (!tournament || !tournament.progress_rankings || !tournament.progress_rankings.teams) return
  group.teams.forEach((t) => {
    const team = tournament.progress_rankings.teams.find((t2) => t2.id === t.id)
    if (team && team.rankings) {
      const md = team.rankings.length <= matchDay ? team.rankings.length : matchDay
      const rankings = team.rankings.find((r) => r.md === md)
      if (!group.final_rankings) {
        const newRankings = []
        newRankings.push(rankings)
        group.final_rankings = newRankings
        group.ranking_type = 'group'
      } else {
        group.final_rankings.push(rankings)
      }
    }
  })
  sortGroupRankings(group, 1)
}

export const collectWildCardRankings = (stage) => {
  const pos = stage.groups && hasWildCardAdvancement(stage) ? stage.advancement.teams.wild_card.pos : 3
  let wildCard = { final_rankings: [], ranking_type: 'wildcard' }
  stage.groups &&
    stage.groups.forEach((g) => {
      if (!g.final_rankings || g.final_rankings.length === 0 || g.final_rankings.length < pos) return
      const wcr = cloneRanking(g.final_rankings.find((fr) => fr.r === pos))
      wildCard.final_rankings.push(wcr)
    })
  sortGroupRankings(wildCard, 1)
  return wildCard
}

export const hasWildCardAdvancement = (stage) => {
  return (
    stage &&
    stage.advancement &&
    stage.advancement.teams &&
    stage.advancement.teams.wild_card &&
    stage.advancement.teams.wild_card.pos &&
    stage.advancement.teams.wild_card.count
  )
}

export const isWildCardExtraRow = (row, config) => {
  if (hasWildCardAdvancement(config)) {
    return config.advancement.teams.wild_card.count_extra
      ? row.r === config.advancement.teams.wild_card.count + config.advancement.teams.wild_card.count_extra
      : false
  }
  return false
}

export const isAdvancedNextRound = (row, config) => {
  if (!row) return false
  if (config && config.advancement && config.advancement.teams && config.advancement.teams.auto) {
    let flag = false
    config.advancement.teams.auto.forEach((a) => (flag = flag || row.r === a))
    return flag
  }
  return false
}

export const isAdvancedWildCard = (row, config) => {
  if (!row) return false
  if (config && config.advancement && config.advancement.teams && config.advancement.teams.wild_card && config.advancement.teams.wild_card.pos) {
    return row.r === config.advancement.teams.wild_card.pos
  }
  return false
}

export const isAdvancedPlayoff = (row, config) => {
  if (!row) return false
  if (config && config.advancement && config.advancement.teams && config.advancement.teams.playoff) {
    return row.r === config.advancement.teams.playoff
  }
  return false
}

export const isEliminated = (row, config) => {
  if (!row) return false
  if (config && config.advancement && config.advancement.teams && config.advancement.teams.eliminated) {
    let flag = false
    config.advancement.teams.eliminated.forEach((e) => (flag = flag || row.r === e))
    return flag
  }
  return false
}

export const getRowStriped = (row, config) => {
  if (isAdvancedNextRound(row, config)) return ' advanced-next-round-striped'
  if (isAdvancedWildCard(row, config)) return ' advanced-wild-card-striped'
  if (isAdvancedPlayoff(row, config)) return ' advanced-playoff-striped'
  return ''
}

// Wild card rankings
export const getWildCardRowStriped = (row, config) => {
  if (!row) return ''
  if (hasWildCardAdvancement(config)) {
    if (row.r <= config.advancement.teams.wild_card.count) {
      return ' advanced-wild-card-striped'
    } else if (isWildCardExtraRow(row, config)) {
      return ' advanced-wild-card-extra-striped'
    } else {
      return ''
    }
  }
  return ''
}

const mergeArray = (a, b) => {
  b.forEach((be) => {
    let merging = true
    a.forEach((ae) => {
      if (ae === be) {
        merging = false
      }
    })
    if (merging) {
      a.push(be)
    }
  })
}

export const createDrawPool = (round) => {
  let pools = []
  if (round.final_rankings) {
    round.final_rankings.forEach((r) => {
      if (r && r.draws) {
        const tmp = [r.id, ...r.draws]
        if (pools.length === 0) {
          pools.push(tmp)
        } else {
          let found = false
          let pool = null
          pools.forEach((p) => {
            p.forEach((e) => {
              tmp.forEach((t) => {
                if (t === e) {
                  found = true
                }
              })
            })
            pool = p
          })
          if (found) {
            mergeArray(pool, tmp)
          } else {
            pools.push(tmp)
          }
        }
      }
    })
    if (pools.length > 0) {
      round.draw_pools = pools
    }
  }
}

export const updateDraws = (round) => {
  round.final_rankings &&
    round.final_rankings.forEach((r) => {
      if (r && r.draws) {
        round.draw_pools.forEach((p) => {
          const found = p.includes(r.id)
          if (found) {
            mergeArray(r.draws, p)
          }
        })
      }
    })
}

export const updateFinalRankings = (round) => {
  let newFinalRankings = []
  let previousDrawCount = 0
  let rankingBundle = []
  if (round.final_rankings) {
    round.final_rankings.forEach((r) => {
      if (r) {
        const drawCount = r.draws ? r.draws.length : 0
        if (drawCount > 0) {
          rankingBundle.push(r)
        } else {
          if (previousDrawCount > 0) {
            newFinalRankings.push(rankingBundle)
            rankingBundle.forEach((r) => (r.r = rankingBundle[0].r))
            rankingBundle = []
          }
          newFinalRankings.push(r)
        }
        previousDrawCount = drawCount
      }
    })
    if (rankingBundle.length > 0) {
      newFinalRankings.push(rankingBundle)
    }
    round.final_rankings = newFinalRankings
  }
}

export const cloneRanking = (ranking) => {
  return {
    d: ranking.d,
    fp: ranking.fp,
    ga: ranking.ga,
    gd: ranking.gd,
    gf: ranking.gf,
    h2hm: ranking.h2hm,
    id: ranking.id,
    l: ranking.l,
    md: ranking.md,
    mp: ranking.mp,
    pts: ranking.pts,
    r: 1,
    w: ranking.w,
  }
}
