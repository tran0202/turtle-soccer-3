import { getTeamName } from './Helper'

export const findTeam = (teamArray, id) => {
  return teamArray ? teamArray.find((t) => t.id === id) : {}
}

export const isGoalRatioTiebreaker = (config) => {
  const { tiebreakers } = config
  if (!tiebreakers) return false
  return tiebreakers.find((tb) => tb.indexOf('goalratio') !== -1) != null
}

export const isGroupPlayoffTiebreaker = (config) => {
  const { tiebreakers } = config
  if (!tiebreakers) return false
  return tiebreakers.find((tb) => tb.indexOf('groupplayoff') !== -1) != null
}

export const isLotGroupPlayoffTiebreaker = (config) => {
  const { tiebreakers } = config
  if (!tiebreakers) return false
  return tiebreakers.find((tb) => tb.indexOf('lotgroupplayoff') !== -1) != null
}

export const isHead2HeadBeforeGoalDifference = (config) => {
  const { tiebreakers } = config
  if (!tiebreakers) return false
  return tiebreakers.findIndex((tb) => tb === 'head2head') < tiebreakers.findIndex((tb) => tb === 'goaldifferenceandgoalscored')
}

export const hasGroupPlayoff = (group) => {
  if (!group.matches) return false
  return group.matches.find((m) => m.group_playoff) !== undefined
}

export const hasReplay = (round) => {
  if (!round.matches) return false
  return round.matches.find((m) => m.replay) !== undefined
}

const accumulateRanking = (team, match, config) => {
  if (!team) return
  if (match.walkover) return
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
  team.gr = isGoalRatioTiebreaker(config) && team.ga !== 0 ? team.gf / team.ga : null
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

export const getBlankRanking = (teamId) => {
  return { id: teamId, md: 0, mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, gr: null, pts: 0, fp: null, h2hm: [] }
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
  return team.rankings[team.rankings.length - 1]
}

const calculateTeamRanking = (container, team, match, config) => {
  if (!team) return
  if (!container) return
  const lr = findLastTeamRanking(container, team.id)
  const newRanking = { ...lr, year: config.year }
  accumulateRanking(newRanking, match, config)
  const teamProgressRanking = container.find((t) => t.id === team.id)
  teamProgressRanking.rankings.push(newRanking)
}

export const calculateRoundRankings = (container, teams, matches, config) => {
  matches &&
    matches.forEach((m) => {
      if (!m.walkover) {
        calculateTeamRanking(container, findTeam(teams, m.home_team), m, config)
        calculateTeamRanking(container, findTeam(teams, m.away_team), m, config)
      }
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

const findHeadtoHeadMatch = (a, b, group_playoff) => {
  const cond = (m) => {
    return (m.home_team === a.id && m.away_team === b.id) || (m.home_team === b.id && m.away_team === a.id)
  }
  const cond2 = (m) => {
    return group_playoff ? m.group_playoff : !m.group_playoff
  }
  return a.h2hm.filter((m) => cond(m) && cond2(m))
}

const drawingLots = (a, b) => {
  // Italia 1990
  if (a.id === 'NED' && b.id === 'IRL') {
    a.draw_lot_notes = 'Netherlands took 3rd place after finished identical records (points, goal difference and goad forward) with Republic of Ireland.'
    b.draw_lot_notes = 'Republic of Ireland took 2nd place after finished identical records (points, goal difference and goad forward) with Netherlands.'
    return 1
  }
  // Mexico 1970
  if (a.id === 'URS' && b.id === 'MEX') {
    a.draw_lot_notes = 'Soviet Union took 1st place after finished level (points and goal difference) with Mexico.'
    b.draw_lot_notes = 'Mexico took 2nd place after finished level (points and goal difference) with Soviet Union.'
    return -1
  }
  // Switzerland 1954
  if (a.id === 'YUG-1945-1992' && b.id === 'BRA') {
    a.draw_lot_notes = 'Yugoslavia took 2nd place after finished level points with Brazil.'
    b.draw_lot_notes = 'Brazil took 1st place after finished level points with Yugoslavia.'
    return 1
  }
  if (a.id === 'AUT' && b.id === 'URU') {
    a.draw_lot_notes = 'Austria took 2nd place after finished level points with Uruguay.'
    b.draw_lot_notes = 'Uruguay took 1st place after finished level points with Austria.'
    return 1
  }

  return 0
}

const compareFairPoints = (a, b) => {
  if (a.fp > b.fp) {
    a.fp_notes = `${getTeamName(a.id)} ${a.fp}`
    b.fp_notes = `${getTeamName(b.id)} ${b.fp}`
    return -1
  } else if (a.fp < b.fp) {
    a.fp_notes = `${getTeamName(a.id)} ${a.fp}`
    b.fp_notes = `${getTeamName(b.id)} ${b.fp}`
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
      if (m.home_extra_score > m.away_extra_score) {
        return -1
      } else if (m.home_extra_score < m.away_extra_score) {
        return 1
      } else {
        return 0
      }
    }
  } else if (m.away_team === id) {
    if (m.home_score > m.away_score) {
      return 1
    } else if (m.home_score < m.away_score) {
      return -1
    } else {
      if (m.home_extra_score > m.away_extra_score) {
        return 1
      } else if (m.home_extra_score < m.away_extra_score) {
        return -1
      } else {
        return 0
      }
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

const saveDrawBothTeams = (group, a, b) => {
  if (group.ranking_type === 'round' || group.ranking_type === 'alltimeround') {
    saveDrawTeams(a, b)
    saveDrawTeams(b, a)
  }
}

const createH2hNotes = (h2hMatch, a, b, drawFunction) => {
  const show_home_score = h2hMatch.home_extra_score != null ? parseInt(h2hMatch.home_score) + parseInt(h2hMatch.home_extra_score) : h2hMatch.home_score
  const show_away_score = h2hMatch.away_extra_score != null ? parseInt(h2hMatch.away_score) + parseInt(h2hMatch.away_extra_score) : h2hMatch.away_score
  const h2hResult = matchResult(a.id, h2hMatch)
  if (h2hResult === 1) {
    if (a.id === h2hMatch.home_team) {
      a.h2h_notes = `${getTeamName(a.id)} lost ${show_home_score}-${show_away_score} against ${getTeamName(b.id)}`
      b.h2h_notes = `${getTeamName(b.id)} won ${show_away_score}-${show_home_score} against ${getTeamName(a.id)}`
    } else {
      a.h2h_notes = `${getTeamName(a.id)} lost ${show_away_score}-${show_home_score} against ${getTeamName(b.id)}`
      b.h2h_notes = `${getTeamName(b.id)} won ${show_home_score}-${show_away_score} against ${getTeamName(a.id)}`
    }
    a.group_playoff = h2hMatch.group_playoff
    b.group_playoff = h2hMatch.group_playoff
    return 1
  } else if (h2hResult === -1) {
    if (a.id === h2hMatch.home_team) {
      a.h2h_notes = `${getTeamName(a.id)} won ${show_home_score}-${show_away_score} against ${getTeamName(b.id)}`
      b.h2h_notes = `${getTeamName(b.id)} lost ${show_away_score}-${show_home_score} against ${getTeamName(a.id)}`
    } else {
      a.h2h_notes = `${getTeamName(a.id)} won ${show_away_score}-${show_home_score} against ${getTeamName(b.id)}`
      b.h2h_notes = `${getTeamName(b.id)} lost ${show_home_score}-${show_away_score} against ${getTeamName(a.id)}`
    }
    a.group_playoff = h2hMatch.group_playoff
    b.group_playoff = h2hMatch.group_playoff
    return -1
  } else {
    // console.log('a', a)
    a.h2h_notes = `${getTeamName(a.id)} drew ${show_home_score}-${show_away_score} against ${getTeamName(b.id)}`
    b.h2h_notes = `${getTeamName(b.id)} drew ${show_away_score}-${show_home_score} against ${getTeamName(a.id)}`
    return drawFunction()
  }
}

const compareH2h = (a, b, group_playoff, drawFunction) => {
  const found = findHeadtoHeadMatch(a, b, group_playoff)
  if (found.length === 1) {
    const h2hMatch = found[0]
    return createH2hNotes(h2hMatch, a, b, drawFunction)
  }
  return drawFunction()
}

const compareGoalForward = (a, b, drawFunction) => {
  if (a.gf > b.gf) {
    return -1
  } else if (a.gf < b.gf) {
    return 1
  } else {
    return drawFunction()
  }
}

const compareGoalDifference = (a, b, savingNotes, drawFunction) => {
  if (a.gd > b.gd) {
    if (savingNotes) {
      a.h2h_notes = `${a.h2h_notes}. Goal Difference: ${getTeamName(a.id)} ${a.gd >= 0 ? '+' : ''}${a.gd}`
      b.h2h_notes = `${b.h2h_notes}. Goal Difference: ${getTeamName(b.id)} ${b.gd >= 0 ? '+' : ''}${b.gd}`
    }
    return -1
  } else if (a.gd < b.gd) {
    if (savingNotes) {
      a.h2h_notes = `${a.h2h_notes}. Goal Difference: ${getTeamName(a.id)} ${a.gd >= 0 ? '+' : ''}${a.gd}`
      b.h2h_notes = `${b.h2h_notes}. Goal Difference: ${getTeamName(b.id)} ${b.gd >= 0 ? '+' : ''}${b.gd}`
    }
    return 1
  } else {
    return drawFunction()
  }
}

export const sortGroupRankings = (group, startingIndex, config) => {
  if (group && group.final_rankings) {
    const isGoalRatioTiebreaker = config ? config.isGoalRatioTiebreaker : false
    const isLotGroupPlayoffTiebreaker = config ? config.isLotGroupPlayoffTiebreaker : false
    const isHead2HeadBeforeGoalDifference = config ? config.isHead2HeadBeforeGoalDifference : false
    group.final_rankings.sort((a, b) => {
      if (a.pts > b.pts) {
        return -1
      } else if (a.pts < b.pts) {
        return 1
      } else {
        if (isHead2HeadBeforeGoalDifference) {
          // console.log('a', a)
          return compareH2h(a, b, false, () => {
            return compareGoalDifference(a, b, true, () => {
              return 0
            })
          })
        } else if (isLotGroupPlayoffTiebreaker) {
          const dl = drawingLots(a, b)
          if (dl !== 0) return dl
          return compareH2h(a, b, true, () => {
            return 0
          })
        } else if (isGoalRatioTiebreaker) {
          const found = findHeadtoHeadMatch(a, b, true) // Group Playoff
          if (found.length === 1) {
            const h2hMatch = found[0]
            return createH2hNotes(h2hMatch, a, b, () => {
              return 0
            })
          } else if (a.gr != null && b.gr != null) {
            if (a.gr > b.gr) {
              return -1
            } else if (a.gr < b.gr) {
              return 1
            } else {
              return 0
            }
          } else if (a.gr === null) {
            return 1
          } else if (b.gr === null) {
            return -1
          } else {
            return 0
          }
        } else if (a.gd > b.gd) {
          return -1
        } else if (a.gd < b.gd) {
          return 1
        } else {
          return compareGoalDifference(a, b, false, () => {
            if (group.tiebreak_pts_gd) {
              return drawingLots(a, b)
            } else {
              return compareGoalForward(a, b, () => {
                saveDrawBothTeams(group, a, b)
                return compareH2h(a, b, false, () => {
                  return compareFairPoints(a, b)
                })
              })
            }
          })
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

export const collectGroupRankings = (tournament, group, matchDay) => {
  if (!group.teams) return
  const config = {
    isGoalRatioTiebreaker: isGoalRatioTiebreaker(tournament),
    isLotGroupPlayoffTiebreaker: isLotGroupPlayoffTiebreaker(tournament),
    isHead2HeadBeforeGoalDifference: isHead2HeadBeforeGoalDifference(tournament),
  }
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
  sortGroupRankings(group, 1, config)
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
  sortGroupRankings(group, 1, null)
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
  sortGroupRankings(wildCard, 1, null)
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

export const isAdvancedThirdPlace = (row, config) => {
  if (!row) return false
  if (config && config.advancement && config.advancement.teams && config.advancement.teams.third_place) {
    return row.r === config.advancement.teams.third_place
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
  if (isAdvancedThirdPlace(row, config)) return ' advanced-third-place-striped'
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
          rankingBundle.sort((a, b) => {
            if (a.id > b.id) {
              return 1
            }
            return -1
          })
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
    gr: ranking.gr,
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
