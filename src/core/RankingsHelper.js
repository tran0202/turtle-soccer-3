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
        // collectH2HMatches(g)
        createPointPools(g, config)
        sortGroup(g, config)

        // createPools(g, config)
        // sortPools(g, config)

        flattenRankings(g)
        // processPartialAdvancement(stage, config)
    })
    processPartialAdvancement2(stage, config)
    stage.groups.forEach((g) => {
        setAdvancements(g, stage.advancements)
    })
}

export const getBlankRanking = (team) => {
    return { id: team.id, mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: team.withdrew || team.banned || team.disqualified ? -1 : 0 }
}

export const accumulateRanking = (ranking, matches, config) => {
    if (!ranking || !matches) return
    matches.forEach((m) => {
        if (!m.match_cancelled && !m.match_not_played) {
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
                    if (!ranking.gaw) {
                        ranking.gaw = 0
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
                    if (!ranking.gaw) {
                        ranking.gaw = parseInt(m.away_score)
                    } else {
                        ranking.gaw += parseInt(m.away_score)
                    }
                }
            } else {
                // WC1958
                if (ranking.id === m.home_team) {
                    ranking.playoff = true
                    ranking.playoff_win = isHomeWinMatch(m)
                    ranking.playoff_note = m.group_playoff_note
                }
                if (ranking.id === m.away_team) {
                    ranking.playoff = true
                    ranking.playoff_win = !isHomeWinMatch(m)
                    ranking.playoff_note = m.group_playoff_note
                }
            }
            // CONFEDC1995
            if (m.tie_last_match) {
                if (ranking.id === m.home_team) {
                    ranking.tie_last_match = true
                    ranking.tie_last_match_win = isHomeWinMatch(m)
                    ranking.tie_last_match_note = m.tie_last_match_note
                }
                if (ranking.id === m.away_team) {
                    ranking.tie_last_match = true
                    ranking.tie_last_match_win = !isHomeWinMatch(m)
                    ranking.tie_last_match_note = m.tie_last_match_note
                }
            }
        }
    })
    if (ranking.team.point_deduction) {
        ranking.pts -= ranking.team.point_deduction
    }
}

export const collectH2HMatches = (group) => {
    if (!group || !group.rankings || !group.matchdays) return
    group.rankings.forEach((r) => {
        r.h2h_matches = []
        group.matchdays.forEach((md) => {
            md.matches.forEach((m) => {
                if (m.home_team === r.id || m.away_team === r.id) {
                    r.h2h_matches.push(m)
                }
            })
        })
    })
}

export const createPointPools = (group, config) => {
    if (!group || !group.rankings || !config) return
    group.pools = []
    group.rankings.forEach((r) => {
        const foundPool = group.pools.find((p) => p.pts === r.pts)
        if (foundPool) {
            foundPool.rankings.push(r)
        } else {
            group.pools.push({ pts: r.pts, rankings: [r] })
        }
    })
    group.pools.forEach((p) => {
        if (p.rankings && p.rankings.length === 1) {
            p.sorted = true
        }
    })
}

export const sortGroup = (group, config) => {
    if (!group || !config || !config.tiebreakers) return
    config.tiebreakers.forEach((tb) => {
        switch (tb) {
            case 'points':
                sortOverallPoints(group, config)
                break
            case 'goaldifference':
                sortOverallGoalDifference(group, config)
                break
            case 'goalratio':
                sortGoalRatio(group, config)
                break
            case 'groupplayoff':
                sortGroupPlayoff(group, config)
                break
            case 'goalsfor':
                sortOverallGoalsFor(group, config)
                break
            case 'awaygoals':
                sortOverallAwayGoals(group, config)
                break
            case 'h2hpoints':
                sortH2HPoints(group, config)
                break
            case 'h2hgoaldifference':
                sortH2HGoalDifference(group, config)
                break
            case 'h2hgoalsfor':
                sortH2HGoalsFor(group, config)
                break
            case 'h2hawaygoals':
                sortH2HAwayGoals(group, config)
                break
            case 'fairplaypoints':
            case 'disciplinarypoints':
                sortFairPlayPoints(group, config)
                break
            case 'lots':
                drawLots(group, config)
                break
            case 'tielastmatch':
                sortTieLastMatch(group, config)
                break
            default:
        }
    })
}

export const sortOverallPoints = (group, config) => {
    if (!group || !config) return
    const pools = group.pools
    for (var i = 0; i < pools.length - 1; i++) {
        for (var j = i + 1; j < pools.length; j++) {
            if (pools[i].pts < pools[j].pts) {
                const temp = pools[i]
                pools[i] = pools[j]
                pools[j] = temp
            }
        }
    }
}

export const isDoneSorting = (group, config) => {
    if (!group || !group.pools || !config) return
    return group.pools.every((p) => p.sorted)
}

// WC2022
export const sortOverallGoalDifference = (group, config) => {
    if (!group || !group.pools || !config) return
    if (isDoneSorting(group, config)) return
    const pools = group.pools
    for (var i = 0; i < pools.length; i++) {
        const p = pools[i]
        const rankings = p.rankings
        if (rankings.length === 2) {
            if (rankings[0].gd < rankings[1].gd) {
                const temp = rankings[0]
                rankings[0] = rankings[1]
                rankings[1] = temp
            }
            if (rankings[0].gd !== rankings[1].gd) {
                p.sorted = true

                // UCL202223 || UCL202324
                // UEL201819 || UEL202223 || UEL202324
                // UNL201819 || UNL202021 || UNL202223
                if (isHead2HeadBeforeGoalDifference(config)) {
                    rankings[0].tb_anchor = '(ogd)'
                    rankings[0].tb_notes =
                        'Tied on Head-to-head results (' +
                        p.h2h_rankings[0].pts +
                        'pts, ' +
                        (p.h2h_rankings[0].gd > 0 ? '+' : '') +
                        p.h2h_rankings[0].gd +
                        'gd, ' +
                        p.h2h_rankings[0].gf +
                        'gf). Tiebreak by Overall goal difference: ' +
                        rankings[0].team.name +
                        ' ' +
                        (rankings[0].gd > 0 ? '+' : '') +
                        rankings[0].gd +
                        ' >< ' +
                        rankings[1].team.name +
                        ' ' +
                        (rankings[1].gd > 0 ? '+' : '') +
                        rankings[1].gd
                    rankings[1].tb_anchor = '(ogd)'
                    rankings[1].tb_notes =
                        'Tied on Head-to-head results (' +
                        p.h2h_rankings[0].pts +
                        'pts, ' +
                        (p.h2h_rankings[0].gd > 0 ? '+' : '') +
                        p.h2h_rankings[0].gd +
                        'gd, ' +
                        p.h2h_rankings[0].gf +
                        'gf). Tiebreak by Overall goal difference: ' +
                        rankings[1].team.name +
                        ' ' +
                        (rankings[1].gd > 0 ? '+' : '') +
                        rankings[1].gd +
                        ' >< ' +
                        rankings[0].team.name +
                        ' ' +
                        (rankings[0].gd > 0 ? '+' : '') +
                        rankings[0].gd
                }
            }
            // WC1994
            // UEL202223 4-way
        } else if (rankings.length > 2) {
            processBigGdPool(p, config)
        }
    }
    flattenPools(group, config)
}

// WC1966 || WC1962
export const sortGoalRatio = (group, config) => {
    if (!group || !group.pools || !config) return
    if (isDoneSorting(group, config)) return
    const pools = group.pools
    for (var i = 0; i < pools.length; i++) {
        const p = pools[i]
        const rankings = p.rankings
        if (rankings.length === 2) {
            if (rankings[0].gr < rankings[1].gr) {
                const temp = rankings[0]
                rankings[0] = rankings[1]
                rankings[1] = temp
            }
            if (rankings[0].gr !== rankings[1].gr) {
                p.sorted = true
            }
        }
    }
}

// WC1958
export const sortGroupPlayoff = (group, config) => {
    if (!group || !group.pools || !config) return
    if (isDoneSorting(group, config)) return
    const pools = group.pools
    for (var i = 0; i < pools.length; i++) {
        const p = pools[i]
        const rankings = p.rankings
        if (rankings.length === 2) {
            const playoff = rankings[0].playoff && rankings[1].playoff
            const playoff_win = rankings[1].playoff_win
            if (playoff && playoff_win) {
                const temp = rankings[0]
                rankings[0] = rankings[1]
                rankings[1] = temp

                p.sorted = true
            }
        }
    }
}

export const flattenPools = (group, config) => {
    if (!group || !group.pools || !config) return
    const new_pools = []
    group.pools.forEach((p) => {
        const pools = p.pools
        if (pools) {
            pools.forEach((p2) => {
                new_pools.push(p2)
            })
        } else {
            new_pools.push(p)
        }
    })
    group.pools = new_pools
}

// WC1994
export const processBigGdPool = (pool, config) => {
    if (!pool || !pool.rankings || !config) return
    pool.pools = []
    pool.rankings.forEach((r) => {
        const foundPool = pool.pools.find((p) => p.gd === r.gd)
        if (foundPool) {
            foundPool.rankings.push(r)
        } else {
            pool.pools.push({ pts: pool.pts, gd: r.gd, rankings: [r] })
        }
    })
    pool.pools.forEach((p) => {
        if (p.rankings && p.rankings.length === 1) {
            p.sorted = true
        }
    })
    const pools = pool.pools
    for (var i = 0; i < pools.length - 1; i++) {
        for (var j = i + 1; j < pools.length; j++) {
            if (pools[i].gd < pools[j].gd) {
                const temp = pools[i]
                pools[i] = pools[j]
                pools[j] = temp
            }
        }
    }
    pool.pools.forEach((p) => {
        if (p.rankings.length === 1) {
            const rankings = p.rankings
            // UEL202223 4-way || AFCON2000
            if (isHead2HeadBeforeGoalDifference(config)) {
                rankings[0].tb_anchor = '(ogd)'
                rankings[0].tb_notes =
                    'All tied on Head-to-head results. Tiebreak by Overall goal difference: ' +
                    rankings[0].team.name +
                    ' ' +
                    (rankings[0].gd > 0 ? '+' : '') +
                    rankings[0].gd
                // WC1994
            } else {
                rankings[0].tb_anchor = '(ogd)'
                rankings[0].tb_notes =
                    'Tied on Overall points (' +
                    rankings[0].pts +
                    '). Tiebreak by Overall goal difference: ' +
                    rankings[0].team.name +
                    ' ' +
                    (rankings[0].gd > 0 ? '+' : '') +
                    rankings[0].gd
            }
        } else {
            p.multi_tie = true
        }
    })
}

// WC2022
export const sortOverallGoalsFor = (group, config) => {
    if (!group || !group.pools || !config) return
    if (isDoneSorting(group, config)) return
    const pools = group.pools
    for (var i = 0; i < pools.length; i++) {
        const p = pools[i]
        const rankings = p.rankings
        if (!p.sorted) {
            if (rankings.length === 2) {
                if (rankings[0].gf < rankings[1].gf) {
                    const temp = rankings[0]
                    rankings[0] = rankings[1]
                    rankings[1] = temp
                }
                if (rankings[0].gf !== rankings[1].gf) {
                    p.sorted = true

                    // UCL201819 || UCL202324
                    if (isHead2HeadBeforeGoalDifference(config)) {
                        if (!p.multi_tie) {
                            rankings[0].tb_anchor = '(ogf)'
                            rankings[0].tb_notes =
                                'Tied on head-to-head results (' +
                                p.h2h_rankings[0].pts +
                                'pts, ' +
                                (p.h2h_rankings[0].gd > 0 ? '+' : '') +
                                p.h2h_rankings[0].gd +
                                'gd, ' +
                                p.h2h_rankings[0].gf +
                                'gf). Tied on Overall goal difference (' +
                                (rankings[0].gd > 0 ? '+' : '') +
                                rankings[0].gd +
                                '). Tiebreak by Overall goals scored: ' +
                                rankings[0].team.name +
                                ' ' +
                                rankings[0].gf +
                                ' >< ' +
                                rankings[1].team.name +
                                ' ' +
                                rankings[1].gf
                            rankings[1].tb_anchor = '(ogf)'
                            rankings[1].tb_notes =
                                'Tied on head-to-head results (' +
                                p.h2h_rankings[0].pts +
                                'pts, ' +
                                (p.h2h_rankings[0].gd > 0 ? '+' : '') +
                                p.h2h_rankings[0].gd +
                                'gd, ' +
                                p.h2h_rankings[0].gf +
                                'gf). Tied on Overall goal difference (' +
                                (rankings[1].gd > 0 ? '+' : '') +
                                rankings[1].gd +
                                '). Tiebreak by Overall goals scored: ' +
                                rankings[1].team.name +
                                ' ' +
                                rankings[1].gf +
                                ' >< ' +
                                rankings[0].team.name +
                                ' ' +
                                rankings[0].gf
                            // UEL202223 4-way || AFCON2000
                        } else {
                            rankings[0].tb_anchor = '(ogf)'
                            rankings[0].tb_notes =
                                'All tied on head-to-head results. Tied on Overall goal difference (' +
                                (rankings[0].gd > 0 ? '+' : '') +
                                rankings[0].gd +
                                '). Tiebreak by Overall goals scored: ' +
                                rankings[0].team.name +
                                ' ' +
                                rankings[0].gf +
                                ' >< ' +
                                rankings[1].team.name +
                                ' ' +
                                rankings[1].gf
                            rankings[1].tb_anchor = '(ogf)'
                            rankings[1].tb_notes =
                                'All tied on Head-to-head results. Tied on Overall goal difference (' +
                                (rankings[1].gd > 0 ? '+' : '') +
                                rankings[1].gd +
                                '). Tiebreak by Overall goals scored: ' +
                                rankings[1].team.name +
                                ' ' +
                                rankings[1].gf +
                                ' >< ' +
                                rankings[0].team.name +
                                ' ' +
                                rankings[0].gf
                        }
                    }
                    // WWC2019
                    else {
                        if (p.multi_tie) {
                            rankings[0].tb_anchor = '(ogf)'
                            rankings[0].tb_notes =
                                'Tied on Overall points (' +
                                rankings[0].pts +
                                '), goal difference (' +
                                (rankings[0].gd > 0 ? '+' : '') +
                                rankings[0].gd +
                                '). Tiebreak by Overall goals scored: ' +
                                rankings[0].team.name +
                                ' ' +
                                rankings[0].gf +
                                ' >< ' +
                                rankings[1].team.name +
                                ' ' +
                                rankings[1].gf
                            rankings[1].tb_anchor = '(ogf)'
                            rankings[1].tb_notes =
                                'Tied on Overall points (' +
                                rankings[0].pts +
                                '), goal difference (' +
                                (rankings[0].gd > 0 ? '+' : '') +
                                rankings[0].gd +
                                '). Tiebreak by Overall goals scored: ' +
                                rankings[1].team.name +
                                ' ' +
                                rankings[1].gf +
                                ' >< ' +
                                rankings[0].team.name +
                                ' ' +
                                rankings[0].gf
                        }
                    }
                }
            } else if (rankings.length > 2) {
                processBigGfPool(p, config)
            }
        }
    }
    flattenPools(group, config)
}

// WC1994
export const processBigGfPool = (pool, config) => {
    if (!pool || !pool.rankings || !config) return
    pool.pools = []
    pool.rankings.forEach((r) => {
        const foundPool = pool.pools.find((p) => p.gf === r.gf)
        if (foundPool) {
            foundPool.rankings.push(r)
        } else {
            pool.pools.push({ pts: pool.pts, gd: r.gd, gf: r.gf, rankings: [r] })
        }
    })
    pool.pools.forEach((p) => {
        if (p.rankings && p.rankings.length === 1) {
            p.sorted = true
        }
    })
    const pools = pool.pools
    for (var i = 0; i < pools.length - 1; i++) {
        for (var j = i + 1; j < pools.length; j++) {
            if (pools[i].gf < pools[j].gf) {
                const temp = pools[i]
                pools[i] = pools[j]
                pools[j] = temp
            }
        }
    }
    pool.pools.forEach((p) => {
        if (p.rankings.length === 1) {
            const rankings = p.rankings
            if (isHead2HeadBeforeGoalDifference(config)) {
                rankings[0].tb_anchor = '(ogf)'
                rankings[0].tb_notes =
                    'All tied on Head-to-head results. Tied on Overall goal difference (' +
                    (rankings[0].gd > 0 ? '+' : '') +
                    rankings[0].gd +
                    '). Tiebreak by Overall goals scored: ' +
                    rankings[0].team.name +
                    ' ' +
                    rankings[0].gf
                // WC1994
            } else {
                rankings[0].tb_anchor = '(ogf)'
                rankings[0].tb_notes =
                    'All tied on Overall goal difference (' +
                    (rankings[0].gd > 0 ? '+' : '') +
                    rankings[0].gd +
                    '). Tiebreak by Overall goals scored: ' +
                    rankings[0].team.name +
                    ' ' +
                    rankings[0].gf
            }
        } else {
            p.multi_tie = true
        }
    })
}

// UCL202223
export const sortOverallAwayGoals = (group, config) => {
    if (!group || !group.pools || !config) return
    if (isDoneSorting(group, config)) return
    const pools = group.pools
    for (var i = 0; i < pools.length; i++) {
        const p = pools[i]
        const rankings = p.rankings
        if (!p.sorted) {
            if (rankings.length === 2) {
                if (rankings[0].gaw < rankings[1].gaw) {
                    const temp = rankings[0]
                    rankings[0] = rankings[1]
                    rankings[1] = temp
                }
                if (rankings[0].gaw !== rankings[1].gaw) {
                    p.sorted = true

                    if (isHead2HeadBeforeGoalDifference(config)) {
                        rankings[0].tb_anchor = '(oag)'
                        rankings[0].tb_notes =
                            'Tied on Head-to-head results (' +
                            p.h2h_rankings[0].pts +
                            'pts, ' +
                            (p.h2h_rankings[0].gd > 0 ? '+' : '') +
                            p.h2h_rankings[0].gd +
                            'gd, ' +
                            p.h2h_rankings[0].gf +
                            'gf). Tied on Overall goal difference (' +
                            (rankings[0].gd > 0 ? '+' : '') +
                            rankings[0].gd +
                            '), goals scored (' +
                            rankings[0].gf +
                            '). Tiebreak by Overall away goals: ' +
                            rankings[0].team.name +
                            ' ' +
                            rankings[0].gaw +
                            ' >< ' +
                            rankings[1].team.name +
                            ' ' +
                            rankings[1].gaw
                        rankings[1].tb_anchor = '(oag)'
                        rankings[1].tb_notes =
                            'Tied on Head-to-head results (' +
                            p.h2h_rankings[0].pts +
                            'pts, ' +
                            (p.h2h_rankings[0].gd > 0 ? '+' : '') +
                            p.h2h_rankings[0].gd +
                            'gd, ' +
                            p.h2h_rankings[0].gf +
                            'gf). Tied on Overall goal difference (' +
                            (rankings[1].gd > 0 ? '+' : '') +
                            rankings[1].gd +
                            '), goals scored (' +
                            rankings[1].gf +
                            '). Tiebreak by Overall away goals: ' +
                            rankings[1].team.name +
                            ' ' +
                            rankings[1].gaw +
                            ' >< ' +
                            rankings[0].team.name +
                            ' ' +
                            rankings[0].gaw
                    }
                }
            }
        }
    }
}

export const isDoneH2HSorting = (pool, config) => {
    if (!pool || !pool.h2h_pools || !config) return
    return pool.h2h_pools.every((p) => p.sorted)
}

export const prepareH2HPool = (pool, matchdays, config) => {
    if (!pool || !pool.rankings || !config) return
    // 1. Collect the h2h matches
    collectPoolH2HMatches(pool, matchdays)
    // 2. Accumulate the rankings
    pool.h2h_rankings = []
    pool.rankings.forEach((t) => {
        const ranking = getBlankRanking(t)
        ranking.team = t.team
        accumulateRanking(ranking, pool.h2h_matches, config)
        if (pool.h2h_matches.length === 2) {
            ranking.h2h_homeaway = true
        }
        // 3. Transfer the total fair play points to h2h teams
        ranking.fp = t.fp
        pool.h2h_rankings.push(ranking)
    })
}

// UCL201819 || UCL201920 || UCL202021 || UCL202223 || UCL202324
// UEL201819 || UEL202021 || UEL202122 || UEL202223
// UNL201819 || UNL202021 || UNL202223
export const sortH2HPoints = (group, config) => {
    if (!group || !group.pools || !config) return
    if (isDoneSorting(group, config)) return
    const pools = group.pools
    for (var i = 0; i < pools.length; i++) {
        const p = pools[i]
        const rankings = p.rankings
        if (!p.sorted) {
            if (rankings.length === 2) {
                prepareH2HPool(p, group.matchdays, config)
                // 4. Sort the rankings
                if (p.h2h_rankings[0].pts < p.h2h_rankings[1].pts) {
                    const temp = p.h2h_rankings[0]
                    p.h2h_rankings[0] = p.h2h_rankings[1]
                    p.h2h_rankings[1] = temp
                }
                if (p.h2h_rankings[0].pts !== p.h2h_rankings[1].pts) {
                    p.sorted = true

                    if (isHead2HeadBeforeGoalDifference(config)) {
                        p.h2h_rankings[0].tb_anchor = '(hp)'
                        p.h2h_rankings[0].tb_notes =
                            'Tiebreak by Head-to-head points: ' +
                            p.h2h_rankings[0].team.name +
                            ' ' +
                            p.h2h_rankings[0].pts +
                            ' >< ' +
                            p.h2h_rankings[1].team.name +
                            ' ' +
                            p.h2h_rankings[1].pts +
                            ' (' +
                            getTeamName(p.h2h_matches[0].home_team, config) +
                            ' ' +
                            p.h2h_matches[0].home_score +
                            '-' +
                            p.h2h_matches[0].away_score +
                            ' ' +
                            getTeamName(p.h2h_matches[0].away_team, config) +
                            (p.h2h_matches.length === 2
                                ? ' | ' +
                                  getTeamName(p.h2h_matches[1].home_team, config) +
                                  ' ' +
                                  p.h2h_matches[1].home_score +
                                  '-' +
                                  p.h2h_matches[1].away_score +
                                  ' ' +
                                  getTeamName(p.h2h_matches[1].away_team, config)
                                : '') +
                            ')'
                        p.h2h_rankings[1].tb_anchor = '(hp)'
                        p.h2h_rankings[1].tb_notes =
                            'Tiebreak by Head-to-head points: ' +
                            p.h2h_rankings[1].team.name +
                            ' ' +
                            p.h2h_rankings[1].pts +
                            ' >< ' +
                            p.h2h_rankings[0].team.name +
                            ' ' +
                            p.h2h_rankings[0].pts +
                            ' (' +
                            getTeamName(p.h2h_matches[0].home_team, config) +
                            ' ' +
                            p.h2h_matches[0].home_score +
                            '-' +
                            p.h2h_matches[0].away_score +
                            ' ' +
                            getTeamName(p.h2h_matches[0].away_team, config) +
                            (p.h2h_matches.length === 2
                                ? ' | ' +
                                  getTeamName(p.h2h_matches[1].home_team, config) +
                                  ' ' +
                                  p.h2h_matches[1].home_score +
                                  '-' +
                                  p.h2h_matches[1].away_score +
                                  ' ' +
                                  getTeamName(p.h2h_matches[1].away_team, config)
                                : '') +
                            ')'
                    } else {
                        p.h2h_rankings[0].tb_anchor = '(hp)'
                        p.h2h_rankings[0].tb_notes =
                            'Tied on Overall points, goal difference and goals scored. Tiebreak by Head-to-head points: ' +
                            p.h2h_rankings[0].team.name +
                            ' ' +
                            p.h2h_rankings[0].pts +
                            ' >< ' +
                            p.h2h_rankings[1].team.name +
                            ' ' +
                            p.h2h_rankings[1].pts +
                            ' (' +
                            getTeamName(p.h2h_matches[0].home_team, config) +
                            ' ' +
                            p.h2h_matches[0].home_score +
                            '-' +
                            p.h2h_matches[0].away_score +
                            ' ' +
                            getTeamName(p.h2h_matches[0].away_team, config) +
                            (p.h2h_matches.length === 2
                                ? ' | ' +
                                  getTeamName(p.h2h_matches[1].home_team, config) +
                                  ' ' +
                                  p.h2h_matches[1].home_score +
                                  '-' +
                                  p.h2h_matches[1].away_score +
                                  ' ' +
                                  getTeamName(p.h2h_matches[1].away_team, config)
                                : '') +
                            ')'
                        p.h2h_rankings[1].tb_anchor = '(hp)'
                        p.h2h_rankings[1].tb_notes =
                            'Tied on Overall points, goal difference and goals scored. Tiebreak by Head-to-head points: ' +
                            p.h2h_rankings[1].team.name +
                            ' ' +
                            p.h2h_rankings[1].pts +
                            ' >< ' +
                            p.h2h_rankings[0].team.name +
                            ' ' +
                            p.h2h_rankings[0].pts +
                            ' (' +
                            getTeamName(p.h2h_matches[0].home_team, config) +
                            ' ' +
                            p.h2h_matches[0].home_score +
                            '-' +
                            p.h2h_matches[0].away_score +
                            ' ' +
                            getTeamName(p.h2h_matches[0].away_team, config) +
                            (p.h2h_matches.length === 2
                                ? ' | ' +
                                  getTeamName(p.h2h_matches[1].home_team, config) +
                                  ' ' +
                                  p.h2h_matches[1].home_score +
                                  '-' +
                                  p.h2h_matches[1].away_score +
                                  ' ' +
                                  getTeamName(p.h2h_matches[1].away_team, config)
                                : '') +
                            ')'
                    }
                }
                // 5. Update the pool
                updatePool(p)
                // AFCON2010
            } else if (rankings.length === 3) {
                prepareH2HPool(p, group.matchdays, config)
                processBigH2HPointPools(p, config)
            }
        }
    }
}

export const updatePool = (pool) => {
    if (!pool || !pool.h2h_rankings || !pool.rankings) return
    const pool_rankings = []
    pool.h2h_rankings.forEach((hr) => {
        const foundRanking = pool.rankings.find((r) => r.id === hr.id)
        if (foundRanking) {
            pool_rankings.push({ ...hr, ...foundRanking })
        }
    })
    pool.rankings = pool_rankings
}

export const collectPoolH2HMatches = (pool, matchdays) => {
    if (!pool || !pool.rankings || pool.rankings.length <= 1 || !matchdays) return
    pool.h2h_matches = []
    for (var i = 0; i < pool.rankings.length - 1; i++) {
        for (var j = i + 1; j < pool.rankings.length; j++) {
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

export const processBigH2HPointPools = (pool, config) => {
    if (!pool || !pool.h2h_rankings || !config) return
    pool.h2h_pools = []
    pool.h2h_rankings.forEach((r) => {
        const foundPool = pool.h2h_pools.find((p) => p.h2h_pts === r.pts)
        if (foundPool) {
            foundPool.rankings.push(r)
        } else {
            pool.h2h_pools.push({ pts: pool.pts, h2h_pts: r.pts, rankings: [r] })
        }
    })
    const pools = pool.h2h_pools
    for (var k = 0; k < pools.length - 1; k++) {
        for (var l = k + 1; l < pools.length; l++) {
            if (pools[k].h2h_pts < pools[l].h2h_pts) {
                const temp = pools[k]
                pools[k] = pools[l]
                pools[l] = temp
            }
        }
    }
    pool.h2h_pools.forEach((h2h_p) => {
        if (h2h_p.rankings.length === 1) {
            h2h_p.sorted = true
        }
    })
}

export const flattenH2HPools = (group, config) => {
    if (!group || !group.pools || !config) return
    const new_pools = []
    group.pools.forEach((p) => {
        const h2h_pools = p.h2h_pools
        if (h2h_pools) {
            h2h_pools.forEach((p2) => {
                const update_rankings = []
                p2.rankings.forEach((r) => {
                    const foundRanking = p.rankings.find((r2) => r2.id === r.id)
                    if (foundRanking) {
                        update_rankings.push(foundRanking)
                    }
                })
                p2.rankings = update_rankings
                new_pools.push(p2)
            })
        } else {
            new_pools.push(p)
        }
    })
    group.pools = new_pools
}

export const flattenH2HRankings = (pool) => {
    if (!pool) return
    pool.h2h_rankings = []
    let rank = 0
    pool.h2h_pools.forEach((p) => {
        p.rankings.forEach((t) => {
            rank++
            t.rank = rank
            pool.h2h_rankings.push(t)
        })
    })
}

// UCL201819 || UCL201920 || UCL202021 || UCL202122 || UCL202223 || UCL202324
// UEL201819
// UNL201819 || UNL202021 || UNL202223
export const sortH2HGoalDifference = (group, config) => {
    if (!group || !group.pools || !config) return
    if (isDoneSorting(group, config)) return
    const pools = group.pools
    for (var i = 0; i < pools.length; i++) {
        const p = pools[i]
        const rankings = p.rankings
        if (rankings.length === 2) {
            if (p.h2h_rankings[0].gd < p.h2h_rankings[1].gd) {
                const temp = p.h2h_rankings[0]
                p.h2h_rankings[0] = p.h2h_rankings[1]
                p.h2h_rankings[1] = temp
            }
            if (p.h2h_rankings[0].gd !== p.h2h_rankings[1].gd) {
                p.sorted = true

                p.h2h_rankings[0].tb_anchor = '(hgd)'
                p.h2h_rankings[0].tb_notes =
                    'Tied on Head-to-head points (' +
                    p.h2h_rankings[0].pts +
                    '). Tiebreak by Head-to-head goal difference: ' +
                    p.h2h_rankings[0].team.name +
                    ' ' +
                    (p.h2h_rankings[0].gd > 0 ? '+' : '') +
                    p.h2h_rankings[0].gd +
                    ' >< ' +
                    p.h2h_rankings[1].team.name +
                    ' ' +
                    (p.h2h_rankings[1].gd > 0 ? '+' : '') +
                    p.h2h_rankings[1].gd
                p.h2h_rankings[1].tb_anchor = '(hgd)'
                p.h2h_rankings[1].tb_notes =
                    'Tied on Head-to-head points (' +
                    p.h2h_rankings[0].pts +
                    '). Tiebreak by Head-to-head goal difference: ' +
                    p.h2h_rankings[1].team.name +
                    ' ' +
                    (p.h2h_rankings[1].gd > 0 ? '+' : '') +
                    p.h2h_rankings[1].gd +
                    ' >< ' +
                    p.h2h_rankings[0].team.name +
                    ' ' +
                    (p.h2h_rankings[0].gd > 0 ? '+' : '') +
                    p.h2h_rankings[0].gd
            }
            updatePool(p)
            // AFCON2006 || AFCON2010
        } else if (rankings.length === 3) {
            prepareH2HPool(p, group.matchdays, config)
            processBigH2HGdPools(p, config)
            flattenH2HRankings(p)
            updatePool(p)
        }
    }
    flattenH2HPools(group, config)
}

export const processBigH2HGdPools = (pool, config) => {
    if (!pool || !pool.h2h_rankings || !config) return
    pool.h2h_pools = []
    pool.h2h_rankings.forEach((r) => {
        const foundPool = pool.h2h_pools.find((p) => p.h2h_gd === r.gd)
        if (foundPool) {
            foundPool.rankings.push(r)
        } else {
            pool.h2h_pools.push({ pts: pool.pts, h2h_pts: r.pts, h2h_gd: r.gd, rankings: [r] })
        }
    })
    const pools = pool.h2h_pools
    for (var k = 0; k < pools.length - 1; k++) {
        for (var l = k + 1; l < pools.length; l++) {
            if (pools[k].h2h_gd < pools[l].h2h_gd) {
                const temp = pools[k]
                pools[k] = pools[l]
                pools[l] = temp
            }
        }
    }
    pool.h2h_pools.forEach((h2h_p) => {
        const rankings = h2h_p.rankings
        if (h2h_p.rankings.length === 1) {
            h2h_p.sorted = true

            rankings[0].tb_anchor = '(ogd)'
            rankings[0].tb_notes =
                'All tied on Head-to-head points (' +
                rankings[0].pts +
                '). Tiebreak by Head-to-head goal difference: ' +
                rankings[0].team.name +
                ' ' +
                (rankings[0].gd > 0 ? '+' : '') +
                rankings[0].gd
        }
    })
}

export const sortH2HGoalsFor = (group, config) => {
    if (!group || !group.pools || !config) return
    if (isDoneSorting(group, config)) return
    const pools = group.pools
    for (var i = 0; i < pools.length; i++) {
        const p = pools[i]
        const rankings = p.rankings
        if (rankings.length === 2) {
            prepareH2HPool(p, group.matchdays, config)
            if (p.h2h_rankings[0].gf < p.h2h_rankings[1].gf) {
                const temp = p.h2h_rankings[0]
                p.h2h_rankings[0] = p.h2h_rankings[1]
                p.h2h_rankings[1] = temp
            }

            if (p.h2h_rankings[0].gf !== p.h2h_rankings[1].gf) {
                p.sorted = true
            }
            updatePool(p)
        } else if (rankings.length === 3) {
            prepareH2HPool(p, group.matchdays, config)
            processBigH2HGfPools(p, config)
            flattenH2HRankings(p)
            updatePool(p)
        }
    }
    flattenH2HPools(group, config)
}

export const processBigH2HGfPools = (pool, config) => {
    if (!pool || !pool.h2h_rankings || !config) return
    pool.h2h_pools = []
    pool.h2h_rankings.forEach((r) => {
        const foundPool = pool.h2h_pools.find((p) => p.h2h_gf === r.gf)
        if (foundPool) {
            foundPool.rankings.push(r)
        } else {
            pool.h2h_pools.push({ pts: pool.pts, h2h_pts: r.pts, h2h_gd: r.gd, h2h_gf: r.gf, rankings: [r] })
        }
    })
    const pools = pool.h2h_pools
    for (var k = 0; k < pools.length - 1; k++) {
        for (var l = k + 1; l < pools.length; l++) {
            if (pools[k].h2h_gf < pools[l].h2h_gf) {
                const temp = pools[k]
                pools[k] = pools[l]
                pools[l] = temp
            }
        }
    }
    pool.h2h_pools.forEach((h2h_p) => {
        const rankings = h2h_p.rankings
        if (rankings.length === 1) {
            h2h_p.sorted = true

            rankings[0].tb_anchor = '(ogf)'
            rankings[0].tb_notes =
                'All tied on Head-to-head points (' +
                rankings[0].pts +
                ') and goal difference (' +
                (rankings[0].gd > 0 ? '+' : '') +
                rankings[0].gd +
                '). Tiebreak by Head-to-head goals scored: ' +
                rankings[0].team.name +
                ' ' +
                rankings[0].gf
        }
    })
}

// UCL201819 || UCL202021
// UNL202021
export const sortH2HAwayGoals = (group, config) => {
    if (!group || !group.pools || !config) return
    if (isDoneSorting(group, config)) return
    const pools = group.pools
    for (var i = 0; i < pools.length; i++) {
        const p = pools[i]
        const rankings = p.rankings
        if (rankings.length === 2) {
            if (p.h2h_rankings[0].gaw < p.h2h_rankings[1].gaw) {
                const temp = p.h2h_rankings[0]
                p.h2h_rankings[0] = p.h2h_rankings[1]
                p.h2h_rankings[1] = temp
            }

            if (p.h2h_rankings[0].gaw !== p.h2h_rankings[1].gaw) {
                p.sorted = true

                p.h2h_rankings[0].tb_anchor = '(hag)'
                p.h2h_rankings[0].tb_notes =
                    'Tied on Head-to-head points (' +
                    p.h2h_rankings[0].pts +
                    '), goal difference (' +
                    (p.h2h_rankings[0].gd > 0 ? '+' : '') +
                    p.h2h_rankings[0].gd +
                    '), goals scored (' +
                    p.h2h_rankings[0].gf +
                    '). Tiebreak by Head-to-head away goals: ' +
                    p.h2h_rankings[0].team.name +
                    ' ' +
                    p.h2h_rankings[0].gaw +
                    ' >< ' +
                    p.h2h_rankings[1].team.name +
                    ' ' +
                    p.h2h_rankings[1].gaw
                p.h2h_rankings[1].tb_anchor = '(hag)'
                p.h2h_rankings[1].tb_notes =
                    'Tied on Head-to-head points (' +
                    p.h2h_rankings[1].pts +
                    '), goal difference (' +
                    (p.h2h_rankings[1].gd > 0 ? '+' : '') +
                    p.h2h_rankings[1].gd +
                    '), goals scored (' +
                    p.h2h_rankings[1].gf +
                    '). Tiebreak by Head-to-head away goals: ' +
                    p.h2h_rankings[1].team.name +
                    ' ' +
                    p.h2h_rankings[1].gaw +
                    ' >< ' +
                    p.h2h_rankings[0].team.name +
                    ' ' +
                    p.h2h_rankings[0].gaw
            }
            updatePool(p)
        }
    }
}

// Fair play: WC2018
// Disciplinary points: AAC2019 Partial
export const sortFairPlayPoints = (group, config) => {
    if (!group || !group.pools || !config) return
    if (isDoneSorting(group, config)) return
    const pools = group.pools
    const fairPlay = !isDisciplinaryPointsTiebreaker(config) ? 'Fair play' : 'Disciplinary points'
    for (var i = 0; i < pools.length; i++) {
        const p = pools[i]
        const rankings = p.rankings
        if (!p.sorted) {
            if (rankings.length === 2) {
                if (rankings[0].fp < rankings[1].fp) {
                    const temp = rankings[0]
                    rankings[0] = rankings[1]
                    rankings[1] = temp
                }
                if (rankings[0].fp !== rankings[1].fp) {
                    if (isDisciplinaryPointsTiebreaker(config)) {
                        rankings[0].partial_disciplinary_point = true
                        rankings[1].partial_disciplinary_point = true
                    }
                    p.sorted = true

                    rankings[0].tb_anchor = '(fp)'
                    rankings[0].tb_notes =
                        'Tiebreak by ' + fairPlay + ': ' + rankings[0].team.name + ' ' + rankings[0].fp + ' >< ' + rankings[1].team.name + ' ' + rankings[1].fp
                    rankings[1].tb_anchor = '(fp)'
                    rankings[1].tb_notes =
                        'Tiebreak by ' + fairPlay + ': ' + rankings[1].team.name + ' ' + rankings[1].fp + ' >< ' + rankings[0].team.name + ' ' + rankings[0].fp
                }
            }
        }
    }
}

export const drawLots = (group, config) => {
    if (!group || !group.pools || !config) return
    if (isDoneSorting(group, config)) return
    const pools = group.pools
    for (var i = 0; i < pools.length; i++) {
        const p = pools[i]
        const rankings = p.rankings
        if (!p.sorted) {
            // WC1990 || AFCON1988 || AFCON2015 || GC2000
            if (rankings.length === 2) {
                const winlot1 = rankings[0].team.draw_lot_win
                const winlot2 = rankings[1].team.draw_lot_win
                if (winlot2) {
                    const temp = rankings[0]
                    rankings[0] = rankings[1]
                    rankings[1] = temp
                }
                if (winlot1 || winlot2) {
                    p.sorted = true

                    rankings[0].tb_anchor = '(dl)'
                    rankings[0].tb_notes = 'Tiebreak by Drawing lots: ' + rankings[0].team.draw_lot_note
                    rankings[1].tb_anchor = '(dl)'
                    rankings[1].tb_notes = 'Tiebreak by Drawing lots: ' + rankings[1].team.draw_lot_note
                }
                // GC2002
            } else {
                for (var k = 0; k < rankings.length - 1; k++) {
                    for (var l = k + 1; l < rankings.length; l++) {
                        if (rankings[l].team.draw_lot_win) {
                            const temp = rankings[k]
                            rankings[k] = rankings[l]
                            rankings[l] = temp
                        }
                    }
                }
                p.sorted = true
                rankings.forEach((r) => {
                    r.tb_anchor = '(dl)'
                    r.tb_notes = 'Tiebreak by Drawing lots: ' + r.team.draw_lot_note
                })
            }
        }
    }
}

// CONFEDC1995
export const sortTieLastMatch = (group, config) => {
    if (!group || !group.pools || !config) return
    if (isDoneSorting(group, config)) return
    const pools = group.pools
    for (var i = 0; i < pools.length; i++) {
        const p = pools[i]
        const rankings = p.rankings
        if (!p.sorted) {
            if (rankings.length === 2) {
                if (rankings[1].tie_last_match_win) {
                    const temp = rankings[0]
                    rankings[0] = rankings[1]
                    rankings[1] = temp

                    p.sorted = true
                }
            }
        }
    }
}

export const processPartialAdvancement2 = (stage, config) => {
    if (!stage || !stage.advancements || !stage.advancements.positions) return
    const partial = stage.advancements.positions.some((a) => a.count)
    if (partial) {
        stage.partial_advancement = true
        const pa = stage.advancements.positions.filter((a) => a.count)
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
            stage.partial = {}
            stage.partial.rankings = rankings
            createPointPools(stage.partial, { ...config, tiebreakers: config.partial_tiebreakers })
            sortGroup(stage.partial, { ...config, tiebreakers: config.partial_tiebreakers })
            flattenRankings(stage.partial)
            stage.partial.rankings.forEach((t, index) => {
                t.rank = index + 1
                const count = a.count
                if (count > 0) {
                    if (index < count) {
                        t.wild_card = true
                    } else {
                        delete t.wild_card
                    }
                } else {
                    if (index >= 0 - count) {
                        t.relegated = true
                    } else {
                        delete t.relegated
                    }
                }
            })
            a.rankings = stage.partial.rankings
        })
    }
}

export const flattenRankings = (group) => {
    if (!group) return
    group.rankings = []
    let rank = 0
    group.pools.forEach((p) => {
        p.rankings.forEach((t) => {
            rank++
            t.rank = rank
            group.rankings.push(t)
        })
    })
}

export const setAdvancements = (group, advancements) => {
    if (!group || !group.matchdays || group.matchdays.length === 0 || !advancements || !advancements.positions || advancements.positions.length === 0) return
    group.rankings.forEach((t) => {
        const qualified_date = group.matchdays[group.matchdays.length - 1].date
        const groupPositions = group.advancements && group.advancements.positions ? group.advancements.positions : advancements.positions
        const foundPosition = groupPositions.find((a) => a.pos === t.rank)
        if (foundPosition) {
            let passed = !foundPosition.rankings
            const foundWildCard = foundPosition.next === 'wild_card'
            const foundRelegated = foundPosition.next === 'relegate'
            if (foundPosition.rankings) {
                const foundPartial = foundPosition.rankings.find(
                    (t2) => t2.id === t.id && ((foundWildCard && t2.wild_card) || (foundRelegated && t2.relegated)),
                )
                if (foundPartial) {
                    passed = true
                }
            }
            if (passed) {
                if (foundPosition.next === 'qualify') {
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
                } else if (foundPosition.next === 'advance') {
                    t.advanced = true
                } else if (foundPosition.next === 'wild_card') {
                    t.wild_card = true
                } else if (foundPosition.next === 'transfer') {
                    t.transferred = true
                } else if (foundPosition.next === 'relegate') {
                    t.relegated = true
                } else if (foundPosition.next === 'champion') {
                    t.champion = true
                } else if (foundPosition.next === 'runner-up') {
                    t.runner_up = true
                } else if (foundPosition.next === 'third-place') {
                    t.third_place = true
                }
            }
        }
    })
}

// ------------------ V1 -------------------

export const createPools = (group, config) => {
    if (!group || !group.rankings || !config) return
    group.pools = []
    const isH2h = isH2HTiebreaker(config)
    group.rankings.forEach((r) => {
        const foundPool = group.pools.find((p) => p.pts === r.pts && (isH2h || p.gd === r.gd) && (isH2h || p.gf === r.gf))
        if (foundPool) {
            foundPool.rankings.push(r)
        } else {
            if (isH2h) {
                group.pools.push({ pts: r.pts, rankings: [r] })
            } else {
                group.pools.push({ pts: r.pts, gd: r.gd, gr: r.gr, gf: r.gf, rankings: [r] })
            }
        }
    })
}

export const sortPools = (group, config) => {
    if (!group || !group.pools || group.pools.length === 0 || !group.matchdays || !config) return
    group.pools.forEach((p) => {
        if (p.rankings && p.rankings.length > 1) {
            // 1. Collect the h2h matches
            collectPoolH2HMatches(p, group.matchdays)
            // 2. Accumulate the rankings
            p.h2h_rankings = []
            p.rankings.forEach((t) => {
                const ranking = getBlankRanking(t)
                ranking.team = t.team
                accumulateRanking(ranking, p.h2h_matches, config)
                if (p.rankings.length === 2 && p.h2h_matches.length === 2) ranking.h2h_homeaway = true
                // 3. Transfer the total fair play points to h2h teams
                ranking.fp = t.fp
                p.h2h_rankings.push(ranking)
            })
            // 4. Sort the rankings
            // three_way_tied: AFCON2006, AFCON2010, EURO2020
            // four_way_tied: EURO2024
            const result = sortRankings(p.h2h_rankings, {
                ...config,
                sort: 'h2h',
                three_way_tied: p.rankings.length === 3,
                four_way_tied: p.rankings.length === 4,
            })
            // 5. Update the pool
            const pool_rankings = []
            p.h2h_rankings.forEach((hr) => {
                const foundRanking = p.rankings.find((r) => r.id === hr.id)
                if (foundRanking) {
                    pool_rankings.push({ ...hr, ...foundRanking })
                }
            })
            p.rankings = pool_rankings
            if (result && result.h2htie) {
                sortRankings(p.rankings, { ...config, sort: 'h2htie' })
            }
        }
    })
    sortRankings(group.pools, { ...config, sort: 'pool' })
}

export const sortRankings = (rankings, config) => {
    if (!rankings || !config) return
    if (isPointTiebreaker(config)) {
        return comparePoints(rankings, config)
    }
}

export const comparePoints = (rankings, config) => {
    if (!rankings || rankings.length <= 1 || !config) return
    let h2htie = false
    for (var i = 0; i < rankings.length - 1; i++) {
        for (var j = i + 1; j < rankings.length; j++) {
            if (rankings[i].pts < rankings[j].pts) {
                const temp = rankings[i]
                rankings[i] = { ...rankings[j] }
                rankings[j] = { ...temp }
            } else if (rankings[i].pts === rankings[j].pts) {
                if (isGroupPlayoffTiebreaker(config)) {
                    const result = compareGroupPlayoff(rankings[i], rankings[j], config)
                    rankings[i] = result.ranking1
                    rankings[j] = result.ranking2
                } else if (isGoalDifferenceTiebreaker(config)) {
                    const result = compareGoalDifference(rankings[i], rankings[j], config)
                    rankings[i] = result.ranking1
                    rankings[j] = result.ranking2
                    h2htie = result.h2htie
                } else if (isGoalRatioTiebreaker(config)) {
                    const result = compareGoalRatio(rankings[i], rankings[j], config)
                    rankings[i] = result.ranking1
                    rankings[j] = result.ranking2
                } else if (isLotTiebreaker(config)) {
                    const result = drawingLots(rankings[i], rankings[j], config)
                    rankings[i] = result.ranking1
                    rankings[j] = result.ranking2
                }
            }
            // WC1994
            // h2h_homeaway UCL201819
            if (config.sort === 'h2h' && rankings[i].pts !== rankings[j].pts) {
                rankings[i].h2h_point = true
                rankings[i].h2h_point_note = !rankings[i].h2h_homeaway
                    ? rankings[i].team.name + ' ' + rankings[i].gf + '-' + rankings[i].ga + ' ' + rankings[j].team.name + ' >>> '
                    : '' + rankings[i].team.name + ' ' + rankings[i].pts + ' | ' + rankings[j].team.name + ' ' + rankings[j].pts
                rankings[j].h2h_point = true
                rankings[j].h2h_point_note = !rankings[i].h2h_homeaway
                    ? rankings[j].team.name + ' ' + rankings[j].gf + '-' + rankings[j].ga + ' ' + rankings[i].team.name + ' >>> '
                    : '' + rankings[j].team.name + ' ' + rankings[j].pts + ' | ' + rankings[i].team.name + ' ' + rankings[i].pts
            }
        }
    }
    updatePool3WayTieNotes(rankings, config)
    return { h2htie }
}

export const updatePool3WayTieNotes = (rankings, config) => {
    if (!rankings || rankings.length !== 3 || !config) return
    if (config.three_way_tied) {
        // AFCON2010
        if (rankings[0].tie_h2h_p_gd) {
            const note =
                'All 3 teams ' +
                rankings[0].team.name +
                ' | ' +
                rankings[1].team.name +
                ' | ' +
                rankings[2].team.name +
                ' tied on head-to-head points ' +
                rankings[0].pts +
                ' and goal difference ' +
                rankings[0].gd +
                '. Tiebreak by head-to-head goals scored: ' +
                rankings[0].team.name +
                ' ' +
                rankings[0].gf +
                ' | ' +
                rankings[1].team.name +
                ' ' +
                rankings[1].gf +
                ' | ' +
                rankings[2].team.name +
                ' ' +
                rankings[2].gf
            rankings[0].tie_h2h_note = note
            rankings[1].tie_h2h_note = note
            rankings[2].tie_h2h_note = note
        } else {
            // AFCON2006
            const note =
                'All 3 teams ' +
                rankings[0].team.name +
                ' | ' +
                rankings[1].team.name +
                ' | ' +
                rankings[2].team.name +
                ' tied on head-to-head points ' +
                rankings[0].pts +
                '. Tiebreak by head-to-head goal difference: ' +
                rankings[0].team.name +
                ' ' +
                rankings[0].gd +
                ' | ' +
                rankings[1].team.name +
                ' ' +
                rankings[1].gd +
                ' | ' +
                rankings[2].team.name +
                ' ' +
                rankings[2].gd
            rankings[0].tie_h2h_note = note
            rankings[1].tie_h2h_note = note
            rankings[2].tie_h2h_note = note
        }
    }
}

export const compareGroupPlayoff = (ranking1, ranking2, config) => {
    if (!ranking1 || !ranking2 || !config) return
    const playoff =
        config.sort === 'h2h' || config.sort === 'partial' ? ranking1.playoff && ranking2.playoff : ranking1.rankings[0].playoff && ranking2.rankings[0].playoff
    const playoff_win = config.sort === 'h2h' || config.sort === 'partial' ? ranking2.playoff_win : ranking2.rankings[0].playoff_win
    if (playoff) {
        if (playoff_win) {
            const temp = ranking1
            ranking1 = { ...ranking2 }
            ranking2 = { ...temp }
        }
    } else if (isGoalDifferenceTiebreaker(config)) {
        const result = compareGoalDifference(ranking1, ranking2, config)
        ranking1 = result.ranking1
        ranking2 = result.ranking2
    } else if (isGoalRatioTiebreaker(config)) {
        const result = compareGoalRatio(ranking1, ranking2, config)
        ranking1 = result.ranking1
        ranking2 = result.ranking2
    }
    return { ranking1, ranking2 }
}

export const compareGoalDifference = (ranking1, ranking2, config) => {
    if (!ranking1 || !ranking2 || !config) return
    let h2htie = false
    if (ranking1.gd < ranking2.gd) {
        const temp = ranking1
        ranking1 = { ...ranking2 }
        ranking2 = { ...temp }
    } else if (ranking1.gd === ranking2.gd) {
        if (isGoalForTiebreaker(config)) {
            const result = compareGoalFor(ranking1, ranking2, config)
            ranking1 = result.ranking1
            ranking2 = result.ranking2
            h2htie = result.h2htie
        } else if (isLotTiebreaker(config)) {
            const result = drawingLots(ranking1, ranking2, config)
            ranking1 = result.ranking1
            ranking2 = result.ranking2
        }
    }
    // AFCON2006
    if (config.sort === 'h2h' && !config.four_way_tied && ranking1.gd !== ranking2.gd) {
        ranking1.tie_h2h = true
        ranking1.tie_h2h_note =
            'Tied on head-to-head points (' +
            ranking1.pts +
            '). Tiebreak by head-to-head goal difference: ' +
            ranking1.team.name +
            ' ' +
            (ranking1.gd > 0 ? '+' : '') +
            ranking1.gd +
            ' | ' +
            ranking2.team.name +
            ' ' +
            (ranking2.gd > 0 ? '+' : '') +
            ranking2.gd
        ranking2.tie_h2h = true
        ranking2.tie_h2h_note =
            'Tied on head-to-head points (' +
            ranking1.pts +
            '). Tiebreak by head-to-head goal difference: ' +
            ranking2.team.name +
            ' ' +
            (ranking2.gd > 0 ? '+' : '') +
            ranking2.gd +
            ' | ' +
            ranking1.team.name +
            ' ' +
            (ranking1.gd > 0 ? '+' : '') +
            ranking1.gd
    }
    // AFCON2023
    if (config.sort === 'h2htie' && ranking1.gd !== ranking2.gd) {
        ranking1.tie_h2h = true
        ranking1.tie_h2h_note =
            'Tied on head-to-head points. Tiebreak by overall goal difference: ' +
            ranking1.team.name +
            ' ' +
            (ranking1.gd > 0 ? '+' : '') +
            ranking1.gd +
            ' | ' +
            ranking2.team.name +
            ' ' +
            (ranking2.gd > 0 ? '+' : '') +
            ranking2.gd
        ranking2.tie_h2h = true
        ranking2.tie_h2h_note =
            'Tied on head-to-head points. Tiebreak by overall goal difference: ' +
            ranking2.team.name +
            ' ' +
            (ranking2.gd > 0 ? '+' : '') +
            ranking2.gd +
            ' | ' +
            ranking1.team.name +
            ' ' +
            (ranking1.gd > 0 ? '+' : '') +
            ranking1.gd
    }
    return { ranking1, ranking2, h2htie }
}

export const compareGoalRatio = (ranking1, ranking2, config) => {
    if (!ranking1 || !ranking2 || !config) return
    if (ranking1.gr < ranking2.gr) {
        const temp = ranking1
        ranking1 = { ...ranking2 }
        ranking2 = { ...temp }
    }
    return { ranking1, ranking2 }
}

export const compareGoalFor = (ranking1, ranking2, config) => {
    if (!ranking1 || !ranking2 || !config) return
    let h2htie = false
    if (ranking1.gf < ranking2.gf) {
        const temp = ranking1
        ranking1 = { ...ranking2 }
        ranking2 = { ...temp }
    } else if (ranking1.gf === ranking2.gf) {
        if (isAwayGoalsTiebreaker(config) || isH2HAwayGoalsTiebreaker(config)) {
            const result = compareAwayGoals(ranking1, ranking2, config)
            ranking1 = result.ranking1
            ranking2 = result.ranking2
            h2htie = result.h2htie
        } else if (isH2HTiebreaker(config) && config.sort === 'h2h') {
            h2htie = true
        } else if (isFairPlayTiebreaker(config)) {
            const result = compareFairPlay(ranking1, ranking2, config)
            ranking1 = result.ranking1
            ranking2 = result.ranking2
        } else if (isTieLastMatchTiebreaker(config)) {
            const result = compareTieLastMatch(ranking1, ranking2, config)
            ranking1 = result.ranking1
            ranking2 = result.ranking2
        } else if (isLotTiebreaker(config)) {
            const result = drawingLots(ranking1, ranking2, config)
            ranking1 = result.ranking1
            ranking2 = result.ranking2
        }
    }
    // AFCON2010
    if (config.sort === 'h2h' && !config.four_way_tied && ranking1.gf !== ranking2.gf) {
        ranking1.tie_h2h = true
        ranking1.tie_h2h_p_gd = true
        ranking1.tie_h2h_note =
            'Tied on head-to-head points and goal difference. Tiebreak by head-to-head goals scored: ' +
            ranking1.team.name +
            ' ' +
            ranking1.gf +
            ' | ' +
            ranking2.team.name +
            ' ' +
            ranking2.gf
        ranking2.tie_h2h = true
        ranking2.tie_h2h_note =
            'Tied on head-to-head points and goal difference. Tiebreak by head-to-head goals scored: ' +
            ranking2.team.name +
            ' ' +
            ranking2.gf +
            ' | ' +
            ranking1.team.name +
            ' ' +
            ranking1.gf
    }
    // AFCON2023 | UCL201819
    if (config.sort === 'h2htie' && ranking1.gf !== ranking2.gf) {
        ranking1.tie_h2h = true
        ranking1.tie_h2h_p_gd = true
        ranking1.tie_h2h_note =
            'Tied on head-to-head points and overall goal difference. Tiebreak by overall goals scored: ' +
            ranking1.team.name +
            ' ' +
            ranking1.gf +
            ' | ' +
            ranking2.team.name +
            ' ' +
            ranking2.gf
        ranking2.tie_h2h = true
        ranking2.tie_h2h_note =
            'Tied on head-to-head points and overall goal difference. Tiebreak by overall goals scored: ' +
            ranking2.team.name +
            ' ' +
            ranking2.gf +
            ' | ' +
            ranking1.team.name +
            ' ' +
            ranking1.gf
    }
    return { ranking1, ranking2, h2htie }
}

export const compareAwayGoals = (ranking1, ranking2, config) => {
    if (!ranking1 || !ranking2 || !config) return
    let h2htie = false
    if (ranking1.gaw < ranking2.gaw) {
        const temp = ranking1
        ranking1 = { ...ranking2 }
        ranking2 = { ...temp }
    } else if (ranking1.gaw === ranking2.gaw) {
        if (isH2HTiebreaker(config) && config.sort === 'h2h') {
            h2htie = true
        }
    }
    // UCL201819
    if (config.sort === 'h2h' && ranking1.gaw !== ranking2.gaw) {
        ranking1.tie_h2h = true
        ranking1.tie_h2h_note =
            'Tied on head-to-head points, goal difference and goal scored. Tiebreak by head-to-head away goals: ' +
            ranking1.team.name +
            ' ' +
            ranking1.gaw +
            ' | ' +
            ranking2.team.name +
            ' ' +
            ranking2.gaw
        ranking2.tie_h2h = true
        ranking2.tie_h2h_note =
            'Tied on head-to-head points, goal difference and goal scored. Tiebreak by head-to-head away goals: ' +
            ranking2.team.name +
            ' ' +
            ranking2.gaw +
            ' | ' +
            ranking1.team.name +
            ' ' +
            ranking1.gaw
    }
    // UCL202223
    if (config.sort === 'h2htie' && ranking1.gaw !== ranking2.gaw) {
        ranking1.tie_h2h = true
        ranking1.tie_h2h_note =
            'Tied on head-to-head results, overall goal difference and overall goal scored. Tiebreak by overall away goals: ' +
            ranking1.team.name +
            ' ' +
            ranking1.gaw +
            ' | ' +
            ranking2.team.name +
            ' ' +
            ranking2.gaw
        ranking2.tie_h2h = true
        ranking2.tie_h2h_note =
            'Tied on head-to-head results, overall goal difference and overall goal scored. Tiebreak by overall away goals: ' +
            ranking2.team.name +
            ' ' +
            ranking2.gaw +
            ' | ' +
            ranking1.team.name +
            ' ' +
            ranking1.gaw
    }
    return { ranking1, ranking2, h2htie }
}

export const compareFairPlay = (ranking1, ranking2, config) => {
    if (!ranking1 || !ranking2 || !config) return
    if (ranking1.fp < ranking2.fp) {
        const temp = ranking1
        ranking1 = { ...ranking2 }
        ranking2 = { ...temp }
    }
    // WC2018
    if (config.sort === 'h2h') {
        ranking1.fair_play = true
        ranking1.fair_play_note = 'Fair play points: ' + ranking1.team.name + ' ' + ranking1.fp + ' | ' + ranking2.team.name + ' ' + ranking2.fp
        ranking2.fair_play = true
        ranking2.fair_play_note = 'Fair play points: ' + ranking2.team.name + ' ' + ranking2.fp + ' | ' + ranking1.team.name + ' ' + ranking1.fp
    }
    // EURO2024
    if (config.sort === 'h2htie') {
        ranking1.fair_play = true
        ranking1.fair_play_note =
            'Tied on head-to-head points, overall goal difference and overall goals scored. Tiebreak by disciplinary points: ' +
            ranking1.team.name +
            ' ' +
            ranking1.fp +
            ' | ' +
            ranking2.team.name +
            ' ' +
            ranking2.fp
        ranking2.fair_play = true
        ranking2.fair_play_note =
            'Tied on head-to-head points, overall goal difference and overall goals scored. Tiebreak by disciplinary points: ' +
            ranking2.team.name +
            ' ' +
            ranking2.fp +
            ' | ' +
            ranking1.team.name +
            ' ' +
            ranking1.fp
    }
    // EURO2024
    if (config.sort === 'partial') {
        ranking1.partial_disciplinary_point = true
        ranking1.partial_disciplinary_point_note = ranking1.team.name + ' ' + ranking1.fp + ' | ' + ranking2.team.name + ' ' + ranking2.fp
        ranking2.partial_disciplinary_point = true
        ranking2.partial_disciplinary_point_note = ranking2.team.name + ' ' + ranking2.fp + ' | ' + ranking1.team.name + ' ' + ranking1.fp
    }
    return { ranking1, ranking2 }
}

export const compareTieLastMatch = (ranking1, ranking2, config) => {
    if (!ranking1 || !ranking2 || !config) return
    if (ranking2.tie_last_match_win) {
        const temp = ranking1
        ranking1 = { ...ranking2 }
        ranking2 = { ...temp }
    }
    return { ranking1, ranking2 }
}

export const drawingLots = (ranking1, ranking2, config) => {
    if (!ranking1 || !ranking2 || !config) return
    const winlot1 =
        config.sort === 'h2h' || config.sort === 'h2htie' || config.sort === 'partial' ? ranking1.team.draw_lot_win : ranking1.rankings[0].team.draw_lot_win
    const winlot2 =
        config.sort === 'h2h' || config.sort === 'h2htie' || config.sort === 'partial' ? ranking2.team.draw_lot_win : ranking2.rankings[0].team.draw_lot_win
    if (winlot1 || winlot2) {
        if (winlot2) {
            const temp = ranking1
            ranking1 = { ...ranking2 }
            ranking2 = { ...temp }
        }
        // h2h: WC1990 || AFCON1988
        // h2htie: AFCON2015
        if (config.sort === 'h2h' || config.sort === 'h2htie') {
            ranking1.draw_lot = true
            ranking1.draw_lot_note = ranking1.team.draw_lot_note
            ranking2.draw_lot = true
            ranking2.draw_lot_note = ranking2.team.draw_lot_note
        }
        // WC1970
        if (config.sort === 'pool') {
            ranking1.rankings[0].draw_lot = true
            ranking1.rankings[0].draw_lot_note = ranking1.rankings[0].team.draw_lot_note
            ranking2.rankings[0].draw_lot = true
            ranking2.rankings[0].draw_lot_note = ranking2.rankings[0].team.draw_lot_note
        }
    }
    return { ranking1, ranking2 }
}

export const processPartialAdvancement = (stage, config) => {
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
            stage.partial = {}
            stage.partial.rankings = rankings
            createPools(stage.partial, { ...config, tiebreakers: config.partial_tiebreakers })
            stage.partial.pools.forEach((p) => {
                sortRankings(p.rankings, { ...config, sort: 'partial' })
            })
            sortRankings(stage.partial.pools, { ...config, sort: 'partial' })
            flattenRankings(stage.partial)
            stage.partial.rankings.forEach((t, index) => {
                t.rank = index + 1
                if (index < a.count) {
                    t.next_rounded = true
                } else {
                    delete t.next_rounded
                }
            })
            a.rankings = stage.partial.rankings
        })
    }
}

export const getPartialAdvancementRankings = (stage) => {
    if (!stage || !stage.advancements || !stage.advancements.positions) return
    return stage.advancements.positions.filter((a) => a.count)
}

export const isPointTiebreaker = (config) => {
    const { tiebreakers } = config
    if (!tiebreakers) return false
    return tiebreakers.find((tb) => tb === 'point') != null
}

export const isAwayGoalsTiebreaker = (config) => {
    const { tiebreakers } = config
    if (!tiebreakers) return false
    return tiebreakers.find((tb) => tb === 'awaygoals') != null
}

export const isH2HTiebreaker = (config) => {
    const { tiebreakers } = config
    if (!tiebreakers) return false
    return tiebreakers.find((tb) => tb === 'head2head') != null
}

export const isH2HAwayGoalsTiebreaker = (config) => {
    const { tiebreakers } = config
    if (!tiebreakers) return false
    return tiebreakers.find((tb) => tb === 'head2headawaygoals') != null
}

export const isGoalDifferenceTiebreaker = (config) => {
    const { tiebreakers } = config
    if (!tiebreakers) return false
    return tiebreakers.find((tb) => tb === 'goaldifference') != null
}

export const isGoalRatioTiebreaker = (config) => {
    const { tiebreakers } = config
    if (!tiebreakers) return false
    return tiebreakers.find((tb) => tb === 'goalratio') != null
}

export const isGroupPlayoffTiebreaker = (config) => {
    const { tiebreakers } = config
    if (!tiebreakers) return false
    return tiebreakers.find((tb) => tb === 'groupplayoff') != null
}

export const isGoalForTiebreaker = (config) => {
    const { tiebreakers } = config
    if (!tiebreakers) return false
    return tiebreakers.find((tb) => tb === 'goalfor') != null
}

export const isFairPlayTiebreaker = (config) => {
    const { tiebreakers } = config
    if (!tiebreakers) return false
    return tiebreakers.find((tb) => tb === 'fairplay') != null
}

export const isDisciplinaryPointsTiebreaker = (config) => {
    const { tiebreakers } = config
    if (!tiebreakers) return false
    return tiebreakers.find((tb) => tb === 'disciplinarypoints') != null
}

export const isTieLastMatchTiebreaker = (config) => {
    const { tiebreakers } = config
    if (!tiebreakers) return false
    return tiebreakers.find((tb) => tb === 'tielastmatch') != null
}

export const isLotTiebreaker = (config) => {
    const { tiebreakers } = config
    if (!tiebreakers) return false
    return tiebreakers.find((tb) => tb === 'lot') != null
}

export const isHead2HeadBeforeGoalDifference = (config) => {
    const { tiebreakers } = config
    if (!tiebreakers) return false
    const index1 = tiebreakers.findIndex((tb) => tb === 'h2hpoints')
    const index2 = tiebreakers.findIndex((tb) => tb === 'goaldifference')
    return index1 !== -1 && index2 !== -1 && index1 < index2
}

// export const isOnlyPointGoalDifferenceTiebreaker = (config) => {
//     return isPointTiebreaker(config) && isGoalDifferenceTiebreaker(config) && !isGoalForTiebreaker(config)
// }
