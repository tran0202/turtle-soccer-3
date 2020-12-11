export const findTeam = (teamArray, id) => {
  return teamArray ? teamArray.find((t) => t.id === id) : {}
}

const findLastRanking = (team) => {
  if (!team.rankings) {
    return { id: team.id, md: 0, mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, fp: null, h2hm: [] }
  } else {
    return team.rankings[team.rankings.length - 1]
  }
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

const calculateGroupTeamRanking = (team, match, config) => {
  if (!team) return
  const lr = findLastRanking(team)
  const newRanking = { ...lr }
  accumulateRanking(newRanking, match, config)
  if (!team.rankings) {
    let newRankings = []
    newRankings.push(newRanking)
    team.rankings = newRankings
  } else {
    team.rankings.push(newRanking)
  }
}

export const calculateGroupRankings = (group, config) => {
  group.matches &&
    group.matches.forEach((m) => {
      calculateGroupTeamRanking(findTeam(group.teams, m.home_team), m, config)
      calculateGroupTeamRanking(findTeam(group.teams, m.away_team), m, config)
    })
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

const compareFairPoints = (a, b) => {
  if (a.fp > b.fp) {
    return -1
  } else if (a.fp < b.fp) {
    return 1
  } else {
    return 0
  }
}

const matchResult = (id, m) => {
  if (m.home_team === id) {
    if (m.home_score > m.away_score) {
      return 1
    } else if (m.home_score < m.away_score) {
      return -1
    } else {
      return 0
    }
  } else if (m.away_team === id) {
    if (m.home_score > m.away_score) {
      return -1
    } else if (m.home_score < m.away_score) {
      return 1
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
                return 1
              } else if (h2hResult === -1) {
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

export const collectMatchdayRankings = (group, matchDay) => {
  if (group.teams) {
    group.teams.forEach((t) => {
      if (t.rankings) {
        let rankings = t.rankings.find((r) => r.md === matchDay)
        if (!rankings && matchDay > 1) {
          rankings = t.rankings.find((r) => r.md === matchDay - 1)
          if (!rankings && matchDay > 2) {
            rankings = t.rankings.find((r) => r.md === matchDay - 2)
            if (!rankings && matchDay > 3) {
              rankings = t.rankings.find((r) => r.md === matchDay - 3)
              if (!rankings && matchDay > 4) {
                rankings = t.rankings.find((r) => r.md === matchDay - 4)
                if (!rankings && matchDay > 5) {
                  rankings = t.rankings.find((r) => r.md === matchDay - 5)
                  if (!rankings && matchDay > 6) {
                    rankings = t.rankings.find((r) => r.md === matchDay - 6)
                  }
                }
              }
            }
          }
        }
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
}

export const collectGroupRankings = (group) => {
  return collectMatchdayRankings(group, 3)
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
