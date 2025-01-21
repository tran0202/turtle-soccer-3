/* eslint-disable no-loop-func */
import { isHomeWinMatch, getTeamName } from './TeamHelper'

export const calculateGroupRankings = (stage, config) => {
    if (!stage || !stage.groups) return
    stage.groups.forEach((g) => {
        g.rankings = []
        const allMatches = []
        g.matchdays &&
            g.matchdays.forEach((md) => {
                md.matches.forEach((m) => {
                    allMatches.push(m)
                })
            })
        g.teams &&
            g.teams.forEach((t) => {
                const ranking = getBlankRanking(t)
                ranking.team = t
                accumulateRanking(ranking, allMatches, config)
                g.rankings.push(ranking)
            })
        sortGroupRankings(g, config)
        flattenDrawPools(g)
        processPartialAdvancement(stage)
    })
    stage.groups.forEach((g) => {
        setAdvancement(g, stage.advancement)
    })
}

export const getBlankRanking = (team) => {
    return { id: team.id, mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: team.withdrew ? -1 : 0 }
}

export const accumulateRanking = (ranking, matches, config) => {
    if (!ranking || !matches) return
    matches.forEach((m) => {
        if (!m.group_playoff) {
            if (ranking.id === m.home_team) {
                ranking.mp++
                if (m.home_score > m.away_score) {
                    ranking.w++
                    ranking.pts += parseInt(config.points_for_win)
                } else if (m.home_score === m.away_score) {
                    ranking.d++
                    ranking.pts++
                } else {
                    ranking.l++
                }
                ranking.gf += parseInt(m.home_score)
                ranking.ga += parseInt(m.away_score)
                if (m.home_extra_score) {
                    ranking.gf += parseInt(m.home_extra_score)
                }
                if (m.away_extra_score) {
                    ranking.ga += parseInt(m.away_extra_score)
                }
                ranking.gd = ranking.gf - ranking.ga
                ranking.gr = isGoalRatioTiebreaker(config) && ranking.ga !== 0 ? ranking.gf / ranking.ga : null
                if (m.home_fair_pts) {
                    if (ranking.fp) {
                        ranking.fp += parseInt(m.home_fair_pts)
                    } else {
                        ranking.fp = parseInt(m.home_fair_pts)
                    }
                }
            }
            if (ranking.id === m.away_team) {
                ranking.mp++
                if (m.home_score > m.away_score) {
                    ranking.l++
                } else if (m.home_score === m.away_score) {
                    ranking.d++
                    ranking.pts++
                } else {
                    ranking.w++
                    ranking.pts += parseInt(config.points_for_win)
                }
                ranking.gf += parseInt(m.away_score)
                ranking.ga += parseInt(m.home_score)
                if (m.away_extra_score) {
                    ranking.gf += parseInt(m.away_extra_score)
                }
                if (m.home_extra_score) {
                    ranking.ga += parseInt(m.home_extra_score)
                }
                ranking.gd = ranking.gf - ranking.ga
                ranking.gr = isGoalRatioTiebreaker(config) && ranking.ga !== 0 ? ranking.gf / ranking.ga : null
                if (m.away_fair_pts) {
                    if (ranking.fp) {
                        ranking.fp += parseInt(m.away_fair_pts)
                    } else {
                        ranking.fp = parseInt(m.away_fair_pts)
                    }
                }
            }
        }
    })
    if (ranking.team.point_deduction) {
        ranking.pts -= ranking.team.point_deduction
    }
}

export const sortGroupRankings = (group, config) => {
    if (!group) return
    createDrawPools(group, config)
    sortRankings(group.draw_pools, null, config)
}

export const createDrawPools = (group, config) => {
    if (!group) return
    group.draw_pools = []
    group.rankings.forEach((r) => {
        const foundPool = group.draw_pools.find((p) => p.pts === r.pts && p.gd === r.gd && p.gf === r.gf)
        if (foundPool) {
            foundPool.rankings.push(r)
        } else {
            group.draw_pools.push({ pts: r.pts, gd: r.gd, gf: r.gf, rankings: [r] })
        }
    })
    group.draw_pools.forEach((p) => {
        if (isGroupPlayoffTiebreaker(config)) {
            const hasPlayoff = group.matchdays && group.matchdays.find((md) => md.name === 'Play-off')
            if (hasPlayoff) {
                const playoff = hasPlayoff.matches[0]
                if (p.rankings[0].id === playoff.home_team) {
                    const playoff_win = isHomeWinMatch(playoff)
                    p.rankings[0].playoff_win = playoff_win
                    if (playoff_win) {
                        p.rankings[0].playoff_win_note =
                            getTeamName(playoff.home_team, config) +
                            ' defeated ' +
                            getTeamName(playoff.away_team, config) +
                            ' ' +
                            (playoff.home_extra_score ? playoff.home_score + playoff.home_extra_score : playoff.home_score) +
                            '-' +
                            (playoff.away_extra_score ? playoff.away_score + playoff.away_extra_score : playoff.away_score) +
                            (playoff.home_extra_score !== undefined ? ' (a.e.t.)' : '')
                    }
                } else if (p.rankings[0].id === playoff.away_team) {
                    const playoff_win = !isHomeWinMatch(playoff)
                    p.rankings[0].playoff_win = playoff_win
                    if (playoff_win) {
                        p.rankings[0].playoff_win_note =
                            getTeamName(playoff.away_team, config) +
                            ' defeated ' +
                            getTeamName(playoff.home_team, config) +
                            ' ' +
                            (playoff.away_extra_score ? playoff.away_score + playoff.away_extra_score : playoff.away_score) +
                            '-' +
                            (playoff.home_extra_score ? playoff.home_score + playoff.home_extra_score : playoff.home_score) +
                            (playoff.home_extra_score !== undefined ? ' (a.e.t.)' : '')
                    }
                }
            }
        }
        // If the pool has more than 1 team:
        else if (p.rankings.length > 1) {
            // 1. Collect the h2h matches
            collectH2HMatches(p, group.matchdays)
            // 2. Accumulate the rankings
            p.h2h_rankings = []
            p.rankings.forEach((t) => {
                const ranking = getBlankRanking(t)
                ranking.team = t.team
                accumulateRanking(ranking, p.h2h_matches, config)
                // 3. Transfer the total fair play points to h2h teams
                ranking.fp = t.fp
                p.h2h_rankings.push(ranking)
            })
            // 4. Sort the rankings
            sortRankings(p.h2h_rankings, p.h2h_matches, {})
            // 5. Update the pool
            for (var i = 0; i < p.rankings.length; i++) {
                p.rankings[i] = {
                    ...p.rankings[i],
                    id: p.h2h_rankings[i].id,
                    team: p.h2h_rankings[i].team,
                    fp: p.h2h_rankings[i].fp,
                    h2h_point_win: p.h2h_rankings[i].h2h_point_win,
                    h2h_point_win_note: p.h2h_rankings[i].h2h_point_win_note,
                    h2h_gd_win: p.h2h_rankings[i].h2h_gd_win,
                    h2h_gd_win_note: p.h2h_rankings[i].h2h_gd_win_note,
                    h2h_gf_win: p.h2h_rankings[i].h2h_gf_win,
                    h2h_gf_win_note: p.h2h_rankings[i].h2h_gf_win_note,
                    away_goal_win: p.h2h_rankings[i].away_goal_win,
                    away_goal_win_note: p.h2h_rankings[i].away_goal_win_note,
                    fair_play_win: p.h2h_rankings[i].fair_play_win,
                    fair_play_win_note: p.h2h_rankings[i].fair_play_win_note,
                    draw_lot_win: p.h2h_rankings[i].draw_lot_win,
                    draw_lot_win_note: p.h2h_rankings[i].draw_lot_win_note,
                    tie_last_match_win: p.h2h_rankings[i].tie_last_match_win,
                    tie_last_match_win_note: p.h2h_rankings[i].tie_last_match_win_note,
                }
            }
        }
    })
}

export const collectH2HMatches = (pool, matchdays) => {
    if (!pool || !matchdays) return
    if (pool.rankings.length > 1) {
        pool.h2h_matches = []
        for (var i = 0; i < pool.rankings.length - 1; i++) {
            for (var j = i + 1; j < pool.rankings.length; j++) {
                // eslint-disable-next-line no-loop-func
                matchdays.forEach((md) => {
                    md.matches.forEach((m) => {
                        if (
                            (m.home_team === pool.rankings[i].id && m.away_team === pool.rankings[j].id) ||
                            (m.home_team === pool.rankings[j].id && m.away_team === pool.rankings[i].id)
                        ) {
                            pool.h2h_matches.push(m)
                        }
                    })
                })
            }
        }
    }
}

export const sortRankings = (rankings, h2h_matches, config) => {
    if (!rankings) return
    for (var i = 0; i < rankings.length - 1; i++) {
        for (var j = i + 1; j < rankings.length; j++) {
            // Point
            if (rankings[i].pts > rankings[j].pts) {
                if (h2h_matches) {
                    rankings[i].h2h_point_win = true
                    rankings[j].h2h_point_win = false
                    rankings[i].h2h_point_win_note =
                        rankings[i].team.name +
                        ' ' +
                        rankings[i].gf +
                        '-' +
                        rankings[i].ga +
                        ' ' +
                        rankings[j].team.name +
                        ' >>> ' +
                        rankings[i].team.name +
                        ' ' +
                        rankings[i].pts +
                        ' | ' +
                        rankings[j].team.name +
                        ' ' +
                        rankings[j].pts
                }
            }
            if (rankings[i].pts < rankings[j].pts) {
                const temp = rankings[i]
                rankings[i] = { ...rankings[j] }
                rankings[j] = { ...temp }
                if (h2h_matches) {
                    rankings[i].h2h_point_win = true
                    rankings[j].h2h_point_win = false
                    rankings[i].h2h_point_win_note =
                        rankings[i].team.name +
                        ' ' +
                        rankings[i].gf +
                        '-' +
                        rankings[i].ga +
                        ' ' +
                        rankings[j].team.name +
                        ' >>> ' +
                        rankings[i].team.name +
                        ' ' +
                        rankings[i].pts +
                        ' | ' +
                        rankings[j].team.name +
                        ' ' +
                        rankings[j].pts
                }
            }

            // Goal differential
            if (rankings[i].pts === rankings[j].pts) {
                if (isGroupPlayoffTiebreaker(config)) {
                    if (rankings[j].rankings[0].playoff_win) {
                        const temp = rankings[i]
                        rankings[i] = { ...rankings[j] }
                        rankings[j] = { ...temp }
                    }
                } else if (rankings[i].gd < rankings[j].gd) {
                    const temp = rankings[i]
                    rankings[i] = { ...rankings[j] }
                    rankings[j] = { ...temp }
                    if (h2h_matches) {
                        rankings[i].h2h_gd_win = true
                        rankings[j].h2h_gd_win = false
                        rankings[i].h2h_gd_win_note = rankings[i].gd + '|' + rankings[j].gd
                    }
                }
            }

            // Goal forward
            if (rankings[i].pts === rankings[j].pts && rankings[i].gd === rankings[j].gd) {
                if (isPointGoalDifferenceTiebreaker(config)) {
                    if (rankings[j].rankings[0].team.win_lot) {
                        const temp = rankings[i]
                        rankings[i] = { ...rankings[j] }
                        rankings[j] = { ...temp }
                        rankings[i].rankings[0].draw_lot_win = true
                        rankings[j].rankings[0].draw_lot_win = false
                        rankings[i].rankings[0].draw_lot_win_note = rankings[i].rankings[0].team.win_lot_note
                    }
                    if (rankings[i].rankings[0].team.win_lot) {
                        rankings[i].rankings[0].draw_lot_win = true
                        rankings[j].rankings[0].draw_lot_win = false
                        rankings[i].rankings[0].draw_lot_win_note = rankings[i].rankings[0].team.win_lot_note
                    }
                } else if (rankings[i].gf < rankings[j].gf) {
                    const temp = rankings[i]
                    rankings[i] = { ...rankings[j] }
                    rankings[j] = { ...temp }
                    if (h2h_matches) {
                        rankings[i].h2h_gf_win = true
                        rankings[j].h2h_gf_win = false
                        rankings[i].h2h_gf_win_note = rankings[i].gf + '|' + rankings[j].gf
                    }
                }
            }

            // Away goal
            if (rankings[i].pts === rankings[j].pts && rankings[i].gd === rankings[j].gd && rankings[i].gf === rankings[j].gf) {
                const match1 = h2h_matches && h2h_matches.find((m) => m.home_team === rankings[i].team.id)
                const match2 = h2h_matches && h2h_matches.find((m) => m.home_team === rankings[j].team.id)
                if (match1 && match2 && match1.away_score > match2.away_score) {
                    const temp = rankings[i]
                    rankings[i] = { ...rankings[j] }
                    rankings[j] = { ...temp }
                    if (h2h_matches) {
                        rankings[i].away_goal_win = true
                        rankings[j].away_goal_win = false
                        rankings[i].away_goal_win_note = match1.away_score + '|' + match2.away_score
                    }
                }
            }
            // Fair play points
            if (
                rankings[i].pts === rankings[j].pts &&
                rankings[i].gd === rankings[j].gd &&
                rankings[i].gf === rankings[j].gf &&
                rankings[i].fp < rankings[j].fp
            ) {
                const temp = rankings[i]
                rankings[i] = { ...rankings[j] }
                rankings[j] = { ...temp }
                if (h2h_matches) {
                    rankings[i].fair_play_win = true
                    rankings[j].fair_play_win = false
                    rankings[i].fair_play_win_note = rankings[i].team.name + ' ' + rankings[i].fp + ' | ' + rankings[j].team.name + ' ' + rankings[j].fp
                }
            }

            // Drawing lots or Tie last match
            if (
                rankings[i].pts === rankings[j].pts &&
                rankings[i].gd === rankings[j].gd &&
                rankings[i].gf === rankings[j].gf &&
                (!rankings[i].fp || (rankings[i].fp && rankings[i].fp === rankings[j].fp))
            ) {
                if (h2h_matches && h2h_matches[0].tie_last_match) {
                    const temp = rankings[i]
                    rankings[i] = { ...rankings[j] }
                    rankings[j] = { ...temp }
                    rankings[i].tie_last_match_win = true
                    rankings[j].tie_last_match_win = false
                    rankings[i].tie_last_match_win_note = h2h_matches[0].tie_last_match_note
                } else {
                    if (rankings[j].team.win_lot) {
                        const temp = rankings[i]
                        rankings[i] = { ...rankings[j] }
                        rankings[j] = { ...temp }
                    }
                    if (h2h_matches && rankings[i].team.win_lot) {
                        rankings[i].draw_lot_win = true
                        rankings[j].draw_lot_win = false
                        rankings[i].draw_lot_win_note = rankings[i].team.win_lot_note
                    }
                }
            }
        }
    }
}

export const flattenDrawPools = (group) => {
    if (!group) return
    group.rankings = []
    let rank = 0
    group.draw_pools.forEach((p) => {
        p.rankings.forEach((t) => {
            rank++
            t.rank = rank
            group.rankings.push(t)
        })
    })
}

export const processPartialAdvancement = (stage) => {
    if (!stage || !stage.advancement) return
    const partial = stage.advancement.some((a) => a.count)
    if (partial) {
        stage.partial_advancement = true
        const pa = stage.advancement.filter((a) => a.count)
        pa.forEach((a) => {
            const rankings = []
            stage.groups.forEach((g) => {
                let customGroup = true
                if (a.groups) {
                    customGroup = a.groups.find((g2) => g2 === g.name)
                }
                const foundTeam = g.rankings && g.rankings.find((t) => customGroup && t.rank === a.pos)
                if (foundTeam) {
                    rankings.push({ ...foundTeam, group_name: g.name })
                }
            })
            sortRankings(rankings, null, {})
            rankings.forEach((t, index) => {
                t.rank = index + 1
                if (index < a.count) {
                    t.next_rounded = true
                } else {
                    delete t.next_rounded
                }
            })
            a.rankings = rankings
        })
    }
}

export const setAdvancement = (group, advancement) => {
    if (!group || !group.matchdays || group.matchdays.length === 0 || !advancement || advancement.length === 0) return
    group.rankings.forEach((t) => {
        const qualified_date = group.matchdays[group.matchdays.length - 1].date
        const groupAdvancement = group.advancement ? group.advancement : advancement
        const foundAdvancement = groupAdvancement.find((a) => a.pos === t.rank)
        if (foundAdvancement) {
            let passed = !foundAdvancement.rankings
            if (foundAdvancement.rankings) {
                const foundPartial = foundAdvancement.rankings.find((t2) => t2.id === t.id && t2.next_rounded)
                if (foundPartial) {
                    passed = true
                }
            }
            if (passed) {
                if (foundAdvancement.will === 'qualify') {
                    t.qualified = true
                    if (t.rank === 1) {
                        t.qualified_position = 'winners'
                    } else if (t.rank === 2) {
                        t.qualified_position = 'runners-up'
                    } else if (t.rank === 3) {
                        t.qualified_position = '3rd place'
                    } else if (t.rank === 4) {
                        t.qualified_position = '4th place'
                    } else if (t.rank === 5) {
                        t.qualified_position = '5th place'
                    } else if (t.rank === 6) {
                        t.qualified_position = '6th place'
                    }
                    t.qualified_date = qualified_date
                } else if (foundAdvancement.will === 'advance') {
                    t.advanced = true
                } else if (foundAdvancement.will === 'next_round') {
                    t.next_rounded = true
                }
            } else {
                delete t.next_rounded
            }
        }
    })
}

export const getPartialAdvancementRankings = (stage) => {
    if (!stage) return
    return stage.advancement.filter((a) => a.count)
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

export const isPointGoalDifferenceTiebreaker = (config) => {
    const { tiebreakers } = config
    if (!tiebreakers) return false
    return tiebreakers.find((tb) => tb.indexOf('pointandgoaldifference') !== -1) != null
}
