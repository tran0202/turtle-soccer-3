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
  if (match.walkover || match.home_bye || match.home_awarded_score_not_counted || match.postponed || match.match_void || (match.notes && match.notes.awarded))
    return
  // console.log('match',match)
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
        if (match.home_awarded_adjust) {
          team.w++
          team.pts += config.points_for_win
        } else {
          team.d++
          team.pts++
        }
        team.gf += parseInt(match.home_score)
        team.ga += parseInt(match.away_score)
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
        if (match.home_awarded_adjust) {
          team.l++
        } else {
          team.d++
          team.pts++
        }
        team.gf += parseInt(match.away_score)
        team.ga += parseInt(match.home_score)
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
      if (!m.walkover && !m.away_withdrew && !m.postponed) {
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
  // Gold Cup 2000
  if (a.id === 'KOR' && b.id === 'CAN') {
    a.draw_lot_notes = 'Korea Republic took 3rd place after finished identical records (points, goal difference and goad forward) with Canada.'
    b.draw_lot_notes = 'Canada took 2nd place after finished identical records (points, goal difference and goad forward) with Korea Republic.'
    return 1
  }
  // AFCON 2015
  if (a.id === 'MLI' && b.id === 'GUI') {
    a.draw_lot_notes = 'Mali took 3rd place after tying with Guinea on head-to-head match, overall goal difference and overall goad forward.'
    b.draw_lot_notes = 'Guinea took 2nd place after tying with Mali on head-to-head match, overall goal difference and overall goad forward.'
    return 1
  }
  // console.log('a', a)
  // console.log('b', b)
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
    const tmp = a.draws.find((x) => x === b.id)
    if (tmp === undefined) {
      a.draws.push(b.id)
    }
  }
}

const saveDrawBothTeams = (group, a, b) => {
  saveDrawTeams(a, b)
  saveDrawTeams(b, a)
}

const createH2hNotes = (h2hMatch, a, b, drawFunction) => {
  const show_home_score = h2hMatch.home_extra_score != null ? parseInt(h2hMatch.home_score) + parseInt(h2hMatch.home_extra_score) : h2hMatch.home_score
  const show_away_score = h2hMatch.away_extra_score != null ? parseInt(h2hMatch.away_score) + parseInt(h2hMatch.away_extra_score) : h2hMatch.away_score
  const h2hResult = matchResult(a.id, h2hMatch)
  if (h2hResult === 1) {
    if (a.id === h2hMatch.home_team) {
      a.h2h_notes = `${getTeamName(a.id)} ${show_home_score}-${show_away_score} ${getTeamName(b.id)}`
      b.h2h_notes = `${getTeamName(b.id)} ${show_away_score}-${show_home_score} ${getTeamName(a.id)}`
    } else {
      a.h2h_notes = `${getTeamName(a.id)} ${show_away_score}-${show_home_score} ${getTeamName(b.id)}`
      b.h2h_notes = `${getTeamName(b.id)} ${show_home_score}-${show_away_score} ${getTeamName(a.id)}`
    }
    a.group_playoff = h2hMatch.group_playoff
    b.group_playoff = h2hMatch.group_playoff
    return 1
  } else if (h2hResult === -1) {
    if (a.id === h2hMatch.home_team) {
      a.h2h_notes = `${getTeamName(a.id)} ${show_home_score}-${show_away_score} ${getTeamName(b.id)}`
      b.h2h_notes = `${getTeamName(b.id)} ${show_away_score}-${show_home_score} ${getTeamName(a.id)}`
    } else {
      a.h2h_notes = `${getTeamName(a.id)} ${show_away_score}-${show_home_score} ${getTeamName(b.id)}`
      b.h2h_notes = `${getTeamName(b.id)} ${show_home_score}-${show_away_score} ${getTeamName(a.id)}`
    }
    a.group_playoff = h2hMatch.group_playoff
    b.group_playoff = h2hMatch.group_playoff
    return -1
  } else {
    a.h2h_notes = `${getTeamName(a.id)} ${show_home_score}-${show_away_score} ${getTeamName(b.id)}`
    b.h2h_notes = `${getTeamName(b.id)} ${show_away_score}-${show_home_score} ${getTeamName(a.id)}`
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

const compareGoalForward = (a, b, savingNotes, drawFunction) => {
  const tmpA = `Overall goals >>> ${getTeamName(a.id)} ${a.gf}`
  const tmpB = `Overall goals >>> ${getTeamName(b.id)} ${b.gf}`
  const saveNotes = () => {
    if (savingNotes) {
      a.h2h_notes = a.h2h_notes ? `${a.h2h_notes} ${tmpA}` : null
      b.h2h_notes = b.h2h_notes ? `${b.h2h_notes} ${tmpB}` : null
    }
  }
  if (a.gf > b.gf) {
    saveNotes()
    return -1
  } else if (a.gf < b.gf) {
    saveNotes()
    return 1
  } else {
    return drawFunction()
  }
}

const compareGoalDifference = (a, b, savingNotes, drawFunction) => {
  const tmpA = `Overall goal difference >>> ${getTeamName(a.id)} ${a.gd > 0 ? '+' : ''}${a.gd}`
  const tmpB = `Overall goal difference >>> ${getTeamName(b.id)} ${b.gd > 0 ? '+' : ''}${b.gd}`
  const saveNotes = () => {
    if (savingNotes) {
      a.h2h_notes = a.h2h_notes ? `${a.h2h_notes}. ${tmpA}` : null
      b.h2h_notes = b.h2h_notes ? `${b.h2h_notes}. ${tmpB}` : null
    }
  }
  if (a.gd > b.gd) {
    saveNotes()
    return -1
  } else if (a.gd < b.gd) {
    saveNotes()
    return 1
  } else {
    if (savingNotes) {
      a.h2h_notes = a.h2h_notes ? `${a.h2h_notes} and tied on overall goal difference (${a.gd > 0 ? '+' : ''}${a.gd}).` : null
      b.h2h_notes = b.h2h_notes ? `${b.h2h_notes} and tied on overall goal difference (${b.gd > 0 ? '+' : ''}${b.gd}).` : null
    }
    return drawFunction()
  }
}

export const updateDrawPool = (group, a, b) => {
  if (!group) return
  if (!group.draw_pools) {
    group.draw_pools = []
  }
  const pool = group.draw_pools.find((p) => p.pts === a.pts)
  if (pool === undefined) {
    group.draw_pools.push({ pts: a.pts, teams: [{ id: a.id }, { id: b.id }], matches: findHeadtoHeadMatch(a, b, false) })
  } else {
    const newTeamA = pool.teams.find((t) => t.id === a.id)
    if (newTeamA === undefined) {
      pool.teams.push({ id: a.id })
    }
    const newTeamB = pool.teams.find((t) => t.id === b.id)
    if (newTeamB === undefined) {
      pool.teams.push({ id: b.id })
    }
    const newMatch = pool.matches.find((m) => (m.home_team === a.id && m.away_team === b.id) || (m.home_team === b.id && m.away_team === a.id))
    if (newMatch === undefined) {
      const found = findHeadtoHeadMatch(a, b, false)
      if (found.length > 0) {
        pool.matches.push(found[0])
      }
    }
  }
}

export const sortDrawPoolRankings = (pool) => {
  if (!pool || !pool.final_rankings) return
  pool.final_rankings.sort((a, b) => {
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
        }
        return 0
      }
    }
  })
}

export const sortGroupRankings = (group, startingIndex, config) => {
  if (group && group.final_rankings) {
    const isGoalRatioTiebreaker = config ? config.isGoalRatioTiebreaker : false
    const isLotGroupPlayoffTiebreaker = config ? config.isLotGroupPlayoffTiebreaker : false
    const isHead2HeadBeforeGoalDifference = config ? config.isHead2HeadBeforeGoalDifference : false
    group.final_rankings.sort((a, b) => {
      if (group.name === 'Semi-finals' || group.name === 'Semi-finals Second Leg') {
        return getTeamName(a.id) > getTeamName(b.id) ? 1 : -1
      } else if (a.pts > b.pts) {
        return -1
      } else if (a.pts < b.pts) {
        return 1
      } else {
        if (isHead2HeadBeforeGoalDifference) {
          updateDrawPool(group, a, b)
          return compareH2h(a, b, false, () => {
            return compareGoalDifference(a, b, true, () => {
              return compareGoalForward(a, b, true, () => {
                return drawingLots(a, b)
              })
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
              return compareGoalForward(a, b, false, () => {
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
        t.r = group.name === 'Semi-finals' || group.name === 'Semi-finals Second Leg' ? startingIndex : index + startingIndex
      }
    })
    if (group.draw_pools) {
      // console.log('group.draw_pools', group.draw_pools)
      group.draw_pools.forEach((p) => {
        if (p.teams && p.teams.length === 3) {
          let allTeamNames = ``
          p.teams.forEach((t, index) => {
            allTeamNames = `${allTeamNames}${getTeamName(t.id)}${index < p.teams.length - 2 ? ',' : ''}${index === p.teams.length - 2 ? ' & ' : ''} `
          })
          calculateGroupRankings(p.teams, p.teams, p.matches, config)
          collectGroupRankings(p, 3)
          sortDrawPoolRankings(p)
          p.final_rankings.forEach((fr, index) => {
            fr.r = index + 1
            fr.h2h_notes = `Teams ${allTeamNames} all tied on points (${fr.pts}) and goal difference (${fr.gd}). Goals >>> ${getTeamName(fr.id)} ${fr.gf}`
          })
        }
      })
      group.final_rankings.forEach((fr) => {
        const pool = group.draw_pools.find((p) => p.pts === fr.pts)
        if (pool !== undefined && pool.final_rankings) {
          const team = pool.final_rankings.find((pfr) => pfr.id === fr.id)
          if (team !== undefined) {
            fr.r = team.r
            fr.h2h_notes = team.h2h_notes
          }
        }
      })
    }
  }
}

export const createGroupFinalRankings = (tournament, group, matchDay) => {
  if (!group.teams) return
  collectGroupRankings(group, matchDay)
  const config = {
    isGoalRatioTiebreaker: isGoalRatioTiebreaker(tournament),
    isLotGroupPlayoffTiebreaker: isLotGroupPlayoffTiebreaker(tournament),
    isHead2HeadBeforeGoalDifference: isHead2HeadBeforeGoalDifference(tournament),
    points_for_win: tournament.points_for_win,
  }
  sortGroupRankings(group, 1, config)
  if (tournament.id === 'GC2002' && group.name === 'Group D') {
    group.final_rankings[0].r = 3
    group.final_rankings[0].h2h_notes = null
    group.final_rankings[0].draw_lot_notes =
      'Ecuador took 3rd place after finished identical records (points, goal difference and goad forward) with Canada and Haiti.'
    group.final_rankings[1].r = 1
    group.final_rankings[1].h2h_notes = null
    group.final_rankings[1].draw_lot_notes =
      'Canada took 1st place after finished identical records (points, goal difference and goad forward) with Haiti and Ecuador.'
    group.final_rankings[2].r = 2
    group.final_rankings[2].h2h_notes = null
    group.final_rankings[2].draw_lot_notes =
      'Haiti took 2nd place after finished identical records (points, goal difference and goad forward) with Canada and Ecuador.'
    group.final_rankings.sort((a, b) => {
      // console.log('a', a)
      if (a.r < b.r) return -1
      else if (a.r > b.r) return 1
      else return 0
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

// const mergeArray = (a, b) => {
//   b.forEach((be) => {
//     let merging = true
//     a.forEach((ae) => {
//       if (ae === be) {
//         merging = false
//       }
//     })
//     if (merging) {
//       a.push(be)
//     }
//   })
// }

const adjustRankingCount = (rankingBundle) => {
  if (!rankingBundle || rankingBundle.length === 0) return
  let min = rankingBundle[0].r
  rankingBundle.forEach((r) => {
    if (min > r.r) {
      min = r.r
    }
  })
  rankingBundle.forEach((r) => (r.r = min))
}

export const updateFinalRankings = (round) => {
  if (round.ranking_type !== 'round' && round.ranking_type !== 'alltimeround') return
  let newFinalRankings = []
  let previousDrawCount = 0
  let rankingBundle = []
  if (round.final_rankings) {
    round.final_rankings.forEach((r) => {
      if (r) {
        if (r.draws) {
          const retainIds = []
          r.draws.forEach((d) => {
            round.final_rankings.forEach((r2) => {
              if (r2.id && r2.id === d) {
                retainIds.push(d)
              }
            })
          })
          r.draws = retainIds
        }
        const drawCount = r.draws ? r.draws.length : 0
        if (drawCount > 0) {
          rankingBundle.push(r)
          rankingBundle.sort((a, b) => {
            if (getTeamName(a.id) > getTeamName(b.id)) {
              return 1
            }
            return -1
          })
          adjustRankingCount(rankingBundle)
        } else {
          if (previousDrawCount > 0) {
            newFinalRankings.push(rankingBundle)
            adjustRankingCount(rankingBundle)
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

export const createSemifinalistsPool = (round) => {
  if (!round.final_rankings) return
  let pool = []
  round.final_rankings.forEach((fr) => {
    pool.push(fr)
  })
  round.final_rankings = []
  round.final_rankings.push(pool)
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
