/* eslint-disable no-loop-func */
import { isHomeWinMatch, getTeamName } from './TeamHelper'

export const calculateKnockoutRankings = (stage, config) => {
    if (!stage || !config) return
    if (stage.paths) {
    }
    if (stage.rounds) {
        stage.rounds.forEach((r) => {
            const teams = []
            r.matches.forEach((m) => {
                if (!teams.find((t) => t.id === m.home_team)) {
                    const homeTeam = config.competition.teams.find((t) => t.id === m.home_team)
                    teams.push(homeTeam)
                }
                if (!teams.find((t) => t.id === m.away_team)) {
                    const awayTeam = config.competition.teams.find((t) => t.id === m.away_team)
                    teams.push(awayTeam)
                }
            })
            r.teams = teams

            r.rankings = []
            r.teams.forEach((t) => {
                const ranking = getBlankRanking(t)
                ranking.team = t
                accumulateRanking(ranking, r.matches, config)
                r.rankings.push(ranking)
            })
        })
    }
}

export const calculateGroupRankings = (stage, config) => {
    if (!stage || !stage.groups || !config) return
    stage.groups.forEach((g) => {
        // Collect all matches from matchdays
        const matches = []
        g.matchdays &&
            g.matchdays.forEach((md) => {
                md.matches.forEach((m) => {
                    matches.push(m)
                })
            })

        // Collect all rankings
        g.rankings = []
        g.teams &&
            g.teams.forEach((t) => {
                const ranking = getBlankRanking(t)
                ranking.team = t
                accumulateRanking(ranking, matches, config)
                g.rankings.push(ranking)
            })

        sortGroup(g, config)
        flattenRankings(g)
    })

    processPartialAdvancement(stage, config)

    stage.groups.forEach((g) => {
        setAdvancements(g, stage.advancements)
    })
}

export const getBlankRanking = (team) => {
    const pts = team.withdrew || team.banned || team.disqualified ? -1 : 0
    return { id: team.id, mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: pts }
}

export const accumulateRanking = (ranking, matches, config) => {
    if (!ranking || !matches || !config) return
    matches.forEach((m) => {
        if (!m.match_cancelled && !m.match_not_played && !m.home_awarded_adjust) {
            if (!m.group_playoff || config.group_playoff_override) {
                if (ranking.id === m.home_team) {
                    ranking.mp++
                    if (m.home_score > m.away_score) {
                        ranking.w++
                        ranking.pts += parseInt(config.points_for_win)
                    } else if (m.home_score === m.away_score) {
                        if (m.home_extra_score !== undefined && m.away_extra_score !== undefined) {
                            if (m.home_extra_score > m.away_extra_score) {
                                ranking.w++
                                ranking.pts += parseInt(config.points_for_win)
                            } else if (m.home_extra_score === m.away_extra_score) {
                                ranking.d++
                                ranking.pts++
                                ranking.pen = m.home_penalty_score
                            } else {
                                ranking.l++
                            }
                        } else {
                            ranking.d++
                            ranking.pts++
                        }
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
                    if (!ranking.wa) {
                        ranking.wa = 0
                    }
                }
                if (ranking.id === m.away_team) {
                    ranking.mp++
                    if (m.home_score > m.away_score) {
                        ranking.l++
                    } else if (m.home_score === m.away_score) {
                        if (m.home_extra_score !== undefined && m.away_extra_score !== undefined) {
                            if (m.home_extra_score > m.away_extra_score) {
                                ranking.l++
                            } else if (m.home_extra_score === m.away_extra_score) {
                                ranking.d++
                                ranking.pts++
                                ranking.pen = m.away_penalty_score
                            } else {
                                ranking.w++
                                ranking.pts += parseInt(config.points_for_win)
                            }
                        } else {
                            ranking.d++
                            ranking.pts++
                        }
                    } else {
                        ranking.w++
                        ranking.pts += parseInt(config.points_for_win)
                        if (!ranking.wa) {
                            ranking.wa = 1
                        } else {
                            ranking.wa++
                        }
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
                // WC1954 || WC1958
                if (ranking.id === m.home_team) {
                    ranking.group_playoff = true
                    ranking.group_playoff_win = isHomeWinMatch(m)
                    ranking.group_playoff_notes = m.group_playoff_notes
                }
                if (ranking.id === m.away_team) {
                    ranking.group_playoff = true
                    ranking.group_playoff_win = !isHomeWinMatch(m)
                    ranking.group_playoff_notes = m.group_playoff_notes
                }
            }
            // Win awarded, keep score: COPA1942 || COPA1953
        } else if (m.home_awarded_adjust) {
            if (ranking.id === m.home_team) {
                ranking.mp++
                ranking.w++
                ranking.pts += parseInt(config.points_for_win)
                ranking.gf += parseInt(m.home_score)
                ranking.ga += parseInt(m.away_score)
                ranking.gd = ranking.gf - ranking.ga
            }
            if (ranking.id === m.away_team) {
                ranking.mp++
                ranking.l++
                ranking.gf += parseInt(m.away_score)
                ranking.ga += parseInt(m.home_score)
                ranking.gd = ranking.gf - ranking.ga
            }
            // WC1938
        } else if (m.match_cancelled) {
            if (ranking.id === m.home_team) {
                if (m.home_withdrew) {
                    ranking.withdrew = true
                }
            }
            if (ranking.id === m.away_team) {
                if (m.away_withdrew) {
                    ranking.withdrew = true
                }
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
    })
    // WOFT2024
    if (ranking.team.point_deduction) {
        ranking.pts -= ranking.team.point_deduction
    }
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
            case 'penalties':
                sortPenalties(group, config)
                break
            case 'awaygoals':
                sortOverallAwayGoals(group, config)
                break
            case 'wins':
                sortOverallWins(group, config)
                break
            case 'awaywins':
                sortOverallAwayWins(group, config)
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

    createPointPools(group, config)
    addSortPath(group, 'points')

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
    group.pools.forEach((p) => {
        if (p.rankings && p.rankings.length === 1) {
            p.sorted = true
        }
    })
}

export const createPointPools = (group, config) => {
    if (!group || !group.rankings || !config) return
    group.pools = []
    group.rankings.forEach((r) => {
        if (r.withdrew) {
            group.pools.push({ withdrew: true, pts: r.pts, rankings: [r] })
        } else {
            const foundPool = group.pools.find((p) => p.pts === r.pts)
            if (foundPool) {
                foundPool.rankings.push(r)
            } else {
                group.pools.push({ pts: r.pts, rankings: [r] })
            }
        }
    })
}

export const addSortPath = (group, path) => {
    if (!group || !path) return
    if (!group.sort_path) {
        group.sort_path = [path]
    } else {
        group.sort_path.push(path)
    }
}

export const isDoneSorting = (group, config) => {
    if (!group || !group.pools || !config) return
    return group.pools.every((p) => p.sorted)
}

export const sortOverallGoalDifference = (group, config) => {
    if (!group || !group.pools || !config) return
    if (isDoneSorting(group, config)) return
    addSortPath(group, 'goaldifference')

    const pools = group.pools
    for (var i = 0; i < pools.length; i++) {
        const p = pools[i]
        const rankings = p.rankings

        if (rankings.length >= 2) {
            createGoalDifferenceSubpools(p, config)

            const subpools = p.subpools
            for (var k = 0; k < subpools.length - 1; k++) {
                for (var l = k + 1; l < subpools.length; l++) {
                    if (subpools[k].gd < subpools[l].gd) {
                        const temp = subpools[k]
                        subpools[k] = subpools[l]
                        subpools[l] = temp
                    }
                }
            }
            p.subpools.forEach((sp) => {
                if (sp.rankings && sp.rankings.length === 1) {
                    sp.sorted = true
                }
            })
        }

        // AAC2011 || AAC2019 || AAC2023
        // AFCON2002 || AFCON2006 || AFCON2008 || AFCON2010 || AFCON2012 || AFCON2013 || AFCON2017 || AFCON2019 || AFCON2021 || AFCON2023
        // GC2000 || GC2003 || GC2005
        // EURO2008 || EURO2016 || EURO2020
        // UNL201819 || UNL202021 || UNL202223
        // UCL202223 || UCL202324
        // UEL201819 || UEL202223 || UEL202324
        if (rankings.length === 2) {
            if (isHead2HeadBeforeGoalDifference(config)) {
                rankings[0].tb_anchor = '(ogd)'
                rankings[0].tb_notes =
                    'Tied on Head-to-head results. Tiebreak by Overall goal difference: ' +
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
                    'Tied on Head-to-head results. Tiebreak by Overall goal difference: ' +
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
        } else if (rankings.length >= 3) {
            // 4: AFCON2000
            // 4: EURO2024
            // 4: UEL202223
            if (isHead2HeadBeforeGoalDifference(config)) {
                rankings.forEach((r) => {
                    r.tb_anchor = '(ogd)'
                    r.tb_notes = 'All tied on Head-to-head results. Tiebreak by Overall goal difference: ' + r.team.name + ' ' + (r.gd > 0 ? '+' : '') + r.gd
                })
            }
        }
    }
    flattenSubpools(group, config)
}

export const createGoalDifferenceSubpools = (pool, config) => {
    if (!pool || !pool.rankings || !config) return
    pool.subpools = []
    pool.rankings.forEach((r) => {
        const foundPool = pool.subpools.find((p) => p.gd === r.gd)
        if (foundPool) {
            foundPool.rankings.push(r)
        } else {
            pool.subpools.push({ pts: r.pts, gd: r.gd, rankings: [r] })
        }
    })
}

export const flattenSubpools = (group, config) => {
    if (!group || !group.pools || !config) return
    const start_pools = []
    const new_pools = []
    group.pools.forEach((p) => {
        start_pools.push(p)
        const subpools = p.subpools
        if (subpools) {
            subpools.forEach((p2) => {
                new_pools.push(p2)
            })
        } else {
            new_pools.push(p)
        }
    })
    group.start_pools = start_pools
    group.pools = new_pools
}

// WC1962 || WC1966
export const sortGoalRatio = (group, config) => {
    if (!group || !group.pools || !config) return
    if (isDoneSorting(group, config)) return
    addSortPath(group, 'goalratio')

    const pools = group.pools
    for (var i = 0; i < pools.length; i++) {
        const p = pools[i]
        const rankings = p.rankings

        if (rankings.length === 2) {
            createGoalRatioSubpools(p, config)

            const subpools = p.subpools
            for (var k = 0; k < subpools.length - 1; k++) {
                for (var l = k + 1; l < subpools.length; l++) {
                    if (subpools[k].gr < subpools[l].gr) {
                        const temp = subpools[k]
                        subpools[k] = subpools[l]
                        subpools[l] = temp
                    }
                }
            }
            p.subpools.forEach((sp) => {
                if (sp.rankings && sp.rankings.length === 1) {
                    sp.sorted = true
                }
            })
        }
    }
    flattenSubpools(group, config)
}

export const createGoalRatioSubpools = (pool, config) => {
    if (!pool || !pool.rankings || !config) return
    pool.subpools = []
    pool.rankings.forEach((r) => {
        const foundPool = pool.subpools.find((p) => p.gr === r.gr)
        if (foundPool) {
            foundPool.rankings.push(r)
        } else {
            pool.subpools.push({ pts: r.pts, gr: r.gr, rankings: [r] })
        }
    })
}

// WC1954 || WC1958
export const sortGroupPlayoff = (group, config) => {
    if (!group || !group.pools || !config) return
    if (isDoneSorting(group, config)) return
    addSortPath(group, 'groupplayoff')

    const pools = group.pools
    for (var i = 0; i < pools.length; i++) {
        const p = pools[i]
        const rankings = p.rankings
        if (rankings.length === 2) {
            const group_playoff = rankings[0].group_playoff && rankings[1].group_playoff
            const group_playoff_win = rankings[1].group_playoff_win
            if (group_playoff && group_playoff_win) {
                const temp = rankings[0]
                rankings[0] = rankings[1]
                rankings[1] = temp

                p.sorted = true
            }
        }
    }
}

export const sortOverallGoalsFor = (group, config) => {
    if (!group || !group.pools || !config) return
    if (isDoneSorting(group, config)) return
    addSortPath(group, 'goalsfor')

    const pools = group.pools
    for (var i = 0; i < pools.length; i++) {
        const p = pools[i]
        const rankings = p.rankings

        if (rankings.length >= 2) {
            createGoalsForSubpools(p, config)

            const subpools = p.subpools
            for (var k = 0; k < subpools.length - 1; k++) {
                for (var l = k + 1; l < subpools.length; l++) {
                    if (subpools[k].gf < subpools[l].gf) {
                        const temp = subpools[k]
                        subpools[k] = subpools[l]
                        subpools[l] = temp
                    }
                }
            }
            p.subpools.forEach((sp) => {
                if (sp.rankings && sp.rankings.length === 1) {
                    sp.sorted = true
                }
            })
        }
        // AFCON2000 || AFCON2008 || AFCON2015 || AFCON2019 || AFCON2021 || AFCON2023
        // GC2002 || GC2003
        // EURO1996 || EURO2004 || EURO2020 || EURO2024
        // UCL201819 || UCL202324
        // UEL202223
        if (rankings.length === 2) {
            if (isHead2HeadBeforeGoalDifference(config)) {
                rankings[0].tb_anchor = '(ogf)'
                rankings[0].tb_notes =
                    'Tied on head-to-head results. Tied on Overall goal difference (' +
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
                    'Tied on head-to-head results. Tied on Overall goal difference (' +
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
        // 3: WC1994
        // 3: WOFT2004
        // 3: COPA1922
        // 4: WC1994
        else if (rankings.length >= 3) {
            if (!isHead2HeadBeforeGoalDifference(config)) {
                rankings.forEach((r) => {
                    r.tb_anchor = '(ogf)'
                    r.tb_notes = 'All tied on Overall points and goal difference. Tiebreak by Overall goals scored: ' + r.team.name + ' ' + r.gf
                })
            }
        }
    }
    flattenSubpools(group, config)
}

export const createGoalsForSubpools = (pool, config) => {
    if (!pool || !pool.rankings || !config) return
    pool.subpools = []
    pool.rankings.forEach((r) => {
        const foundPool = pool.subpools.find((p) => p.gf === r.gf)
        if (foundPool) {
            foundPool.rankings.push(r)
        } else {
            pool.subpools.push({ pts: r.pts, gd: r.gd, gf: r.gf, rankings: [r] })
        }
    })
}

export const sortPenalties = (group, config) => {
    if (!group || !group.pools || !config) return
    if (isDoneSorting(group, config)) return
    addSortPath(group, 'penalties')

    const pools = group.pools
    for (var i = 0; i < pools.length; i++) {
        const p = pools[i]
        const rankings = p.rankings

        if (rankings.length >= 2) {
            createPenaltiesSubpools(p, config)

            const subpools = p.subpools
            for (var k = 0; k < subpools.length - 1; k++) {
                for (var l = k + 1; l < subpools.length; l++) {
                    if (subpools[k].pen < subpools[l].pen) {
                        const temp = subpools[k]
                        subpools[k] = subpools[l]
                        subpools[l] = temp
                    }
                }
            }
            p.subpools.forEach((sp) => {
                if (sp.rankings && sp.rankings.length === 1) {
                    sp.sorted = true
                }
            })
        }
    }
    flattenSubpools(group, config)
}

export const createPenaltiesSubpools = (pool, config) => {
    if (!pool || !pool.rankings || !config) return
    pool.subpools = []
    pool.rankings.forEach((r) => {
        const foundPool = pool.subpools.find((p) => p.pen === r.pen)
        if (foundPool) {
            foundPool.rankings.push(r)
        } else {
            pool.subpools.push({ pts: r.pts, gd: r.gd, gf: r.gf, pen: r.pen, rankings: [r] })
        }
    })
}

export const sortOverallAwayGoals = (group, config) => {
    if (!group || !group.pools || !config) return
    if (isDoneSorting(group, config)) return
    addSortPath(group, 'awaygoals')

    const pools = group.pools
    for (var i = 0; i < pools.length; i++) {
        const p = pools[i]
        const rankings = p.rankings

        if (rankings.length >= 2) {
            createAwayGoalsSubpools(p, config)

            const subpools = p.subpools
            for (var k = 0; k < subpools.length - 1; k++) {
                for (var l = k + 1; l < subpools.length; l++) {
                    if (subpools[k].gaw < subpools[l].gaw) {
                        const temp = subpools[k]
                        subpools[k] = subpools[l]
                        subpools[l] = temp
                    }
                }
            }
            p.subpools.forEach((sp) => {
                if (sp.rankings && sp.rankings.length === 1) {
                    sp.sorted = true
                }
            })
        }

        // UCL202223
        if (rankings.length === 2) {
            if (isHead2HeadBeforeGoalDifference(config)) {
                rankings[0].tb_anchor = '(oag)'
                rankings[0].tb_notes =
                    'Tied on Head-to-head results. Tied on Overall goal difference (' +
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
                    'Tied on Head-to-head results. Tied on Overall goal difference (' +
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
            } else {
                rankings[0].tb_anchor = '(oag)'
                rankings[0].tb_notes =
                    'Tied on Overall points (' +
                    rankings[0].pts +
                    '), goal difference (' +
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
                    'Tied on Overall points (' +
                    rankings[1].pts +
                    '), goal difference (' +
                    (rankings[1].gd > 0 ? '+' : '') +
                    rankings[1].gd +
                    '), goals scored (' +
                    rankings[1].gf +
                    '). Tiebreak by Overall away wins: ' +
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
    flattenSubpools(group, config)
}

export const createAwayGoalsSubpools = (pool, config) => {
    if (!pool || !pool.rankings || !config) return
    pool.subpools = []
    pool.rankings.forEach((r) => {
        const foundPool = pool.subpools.find((p) => p.gaw === r.gaw)
        if (foundPool) {
            foundPool.rankings.push(r)
        } else {
            pool.subpools.push({ pts: r.pts, gd: r.gd, gf: r.gf, gaw: r.gaw, rankings: [r] })
        }
    })
}

export const sortOverallWins = (group, config) => {
    if (!group || !group.pools || !config) return
    if (isDoneSorting(group, config)) return
    addSortPath(group, 'wins')

    const pools = group.pools
    for (var i = 0; i < pools.length; i++) {
        const p = pools[i]
        const rankings = p.rankings

        if (rankings.length >= 2) {
            createWinsSubpools(p, config)

            const subpools = p.subpools
            for (var k = 0; k < subpools.length - 1; k++) {
                for (var l = k + 1; l < subpools.length; l++) {
                    if (subpools[k].w < subpools[l].w) {
                        const temp = subpools[k]
                        subpools[k] = subpools[l]
                        subpools[l] = temp
                    }
                }
            }
            p.subpools.forEach((sp) => {
                if (sp.rankings && sp.rankings.length === 1) {
                    sp.sorted = true
                }
            })
        }
    }
    flattenSubpools(group, config)
}

export const createWinsSubpools = (pool, config) => {
    if (!pool || !pool.rankings || !config) return
    pool.subpools = []
    pool.rankings.forEach((r) => {
        const foundPool = pool.subpools.find((p) => p.w === r.w)
        if (foundPool) {
            foundPool.rankings.push(r)
        } else {
            pool.subpools.push({ pts: r.pts, gd: r.gd, gf: r.gf, gaw: r.gaw, w: r.w, rankings: [r] })
        }
    })
}

export const sortOverallAwayWins = (group, config) => {
    if (!group || !group.pools || !config) return
    if (isDoneSorting(group, config)) return
    addSortPath(group, 'awaywins')

    const pools = group.pools
    for (var i = 0; i < pools.length; i++) {
        const p = pools[i]
        const rankings = p.rankings

        if (rankings.length >= 2) {
            createAwayWinsSubpools(p, config)

            const subpools = p.subpools
            for (var k = 0; k < subpools.length - 1; k++) {
                for (var l = k + 1; l < subpools.length; l++) {
                    if (subpools[k].wa < subpools[l].wa) {
                        const temp = subpools[k]
                        subpools[k] = subpools[l]
                        subpools[l] = temp
                    }
                }
            }
            p.subpools.forEach((sp) => {
                if (sp.rankings && sp.rankings.length === 1) {
                    sp.sorted = true
                }
            })
        }

        // UCL202425
        if (rankings.length === 2) {
            rankings[0].tb_anchor = '(oaw)'
            rankings[0].tb_notes =
                'Tied on Overall points (' +
                rankings[0].pts +
                '), goal difference (' +
                (rankings[0].gd > 0 ? '+' : '') +
                rankings[0].gd +
                '), goals scored (' +
                rankings[0].gf +
                '), away goals (' +
                rankings[0].gaw +
                ') and wins (' +
                rankings[0].w +
                '). Tiebreak by Overall away wins: ' +
                rankings[0].team.name +
                ' ' +
                rankings[0].wa +
                ' >< ' +
                rankings[1].team.name +
                ' ' +
                rankings[1].wa
            rankings[1].tb_anchor = '(oaw)'
            rankings[1].tb_notes =
                'Tied on Overall points (' +
                rankings[1].pts +
                '), goal difference (' +
                (rankings[1].gd > 0 ? '+' : '') +
                rankings[1].gd +
                '), goals scored (' +
                rankings[1].gf +
                '), away goals (' +
                rankings[1].gaw +
                ') and wins (' +
                rankings[1].w +
                '). Tiebreak by Overall away wins: ' +
                rankings[1].team.name +
                ' ' +
                rankings[1].wa +
                ' >< ' +
                rankings[0].team.name +
                ' ' +
                rankings[0].wa
        }
    }
    flattenSubpools(group, config)
}

export const createAwayWinsSubpools = (pool, config) => {
    if (!pool || !pool.rankings || !config) return
    pool.subpools = []
    pool.rankings.forEach((r) => {
        const foundPool = pool.subpools.find((p) => p.wa === r.wa)
        if (foundPool) {
            foundPool.rankings.push(r)
        } else {
            pool.subpools.push({ pts: r.pts, gd: r.gd, gf: r.gf, gaw: r.gaw, w: r.w, wa: r.wa, rankings: [r] })
        }
    })
}

export const sortH2HPoints = (group, config) => {
    if (!group || !group.pools || !config) return
    if (isDoneSorting(group, config)) return
    addSortPath(group, 'h2hpoints')

    const pools = group.pools
    for (var i = 0; i < pools.length; i++) {
        const p = pools[i]
        const rankings = p.rankings

        if (rankings.length === 2 || rankings.length === 3) {
            prepareH2HPool(p, group.matchdays, config)
            createH2HPointsSubpools(p, config)

            const subpools = p.subpools
            for (var k = 0; k < subpools.length - 1; k++) {
                for (var l = k + 1; l < subpools.length; l++) {
                    if (subpools[k].h2h_pts < subpools[l].h2h_pts) {
                        const temp = subpools[k]
                        subpools[k] = subpools[l]
                        subpools[l] = temp
                    }
                }
            }
            p.subpools.forEach((sp) => {
                if (sp.rankings && sp.rankings.length === 1) {
                    sp.sorted = true
                }
            })
        }

        if (rankings.length === 2) {
            // AAC2019
            // AFCON2004 || AFCON2010 || AFCON2015 || AFCON2021 || AFCON2023
            // GC2007
            // EURO1996 || EURO2000 || EURO2008 || EURO2012 || EURO2016 || EURO2020 || EURO2024
            // UNL201819 || UNL202021 || UNL202223
            // UCL201819 || UCL201920 || UCL202021 || UCL202223 || UCL202324
            // UEL201819 || UEL202021 || UEL202122 || UEL202223
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
            }
            // WC1994
            // MOFT2024
            // WOFT2004
            // AAC1996
            else {
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
            updateSubpools(p)
        } else if (rankings.length === 3) {
            p.h2h_rankings.forEach((r) => {
                if (isHead2HeadBeforeGoalDifference(config)) {
                    r.tb_anchor = '(hp)'
                    r.tb_notes = 'Tiebreak by Head-to-head points: ' + r.team.name + ' ' + r.pts
                } else {
                    r.tb_anchor = '(hp)'
                    r.tb_notes = 'All tied on Overall points, goal difference and goals scored. Tiebreak by Head-to-head points: ' + r.team.name + ' ' + r.pts
                }
            })
            updateSubpools(p)
        }
    }
    flattenSubpools(group, config)
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

export const createH2HPointsSubpools = (pool, config) => {
    if (!pool || !pool.h2h_rankings || !config) return
    pool.subpools = []
    pool.h2h_rankings.forEach((r) => {
        const foundPool = pool.subpools.find((p) => p.h2h_pts === r.pts)
        if (foundPool) {
            foundPool.rankings.push(r)
        } else {
            pool.subpools.push({ pts: pool.pts, h2h_pts: r.pts, rankings: [r] })
        }
    })
}

export const updateSubpools = (pool) => {
    if (!pool || !pool.subpools || !pool.rankings || !pool.h2h_rankings) return
    pool.subpools.forEach((sp) => {
        const subpool_rankings = []
        sp.rankings.forEach((spr) => {
            const foundRanking = pool.rankings.find((r2) => r2.id === spr.id)
            if (foundRanking) {
                subpool_rankings.push({ ...spr, ...foundRanking })
            }
        })
        sp.rankings = subpool_rankings
    })
    pool.subpools.forEach((sp) => {
        sp.rankings.forEach((spr) => {
            const foundRanking = pool.h2h_rankings.find((r2) => r2.id === spr.id)
            if (foundRanking) {
                spr.tb_anchor = foundRanking.tb_anchor
                spr.tb_notes = foundRanking.tb_notes
            }
        })
    })
}

export const sortH2HGoalDifference = (group, config) => {
    if (!group || !group.pools || !config) return
    if (isDoneSorting(group, config)) return
    addSortPath(group, 'h2hgoaldifference')

    const pools = group.pools
    for (var i = 0; i < pools.length; i++) {
        const p = pools[i]
        const rankings = p.rankings

        if (rankings.length === 2 || rankings.length === 3) {
            prepareH2HPool(p, group.matchdays, config)
            createH2HGoalDifferenceSubpools(p, config)

            const subpools = p.subpools
            for (var k = 0; k < subpools.length - 1; k++) {
                for (var l = k + 1; l < subpools.length; l++) {
                    if (subpools[k].h2h_gd < subpools[l].h2h_gd) {
                        const temp = subpools[k]
                        subpools[k] = subpools[l]
                        subpools[l] = temp
                    }
                }
            }
            p.subpools.forEach((sp) => {
                if (sp.rankings && sp.rankings.length === 1) {
                    sp.sorted = true
                }
            })
        }

        // UNL201819 || UNL202021 || UNL202223
        // UCL201819 || UCL201920 || UCL202021 || UCL202122 || UCL202223 || UCL202324
        // UEL201819
        if (rankings.length === 2) {
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

            updateSubpools(p)
        } else if (rankings.length === 3) {
            p.h2h_rankings.forEach((r) => {
                // AFCON2006
                // EURO2020
                if (isHead2HeadBeforeGoalDifference(config)) {
                    r.tb_anchor = '(hgd)'
                    r.tb_notes =
                        'All tied on Head-to-head points (' +
                        r.pts +
                        '). Tiebreak by Head-to-head goal difference: ' +
                        r.team.name +
                        ' ' +
                        (r.gd > 0 ? '+' : '') +
                        r.gd
                } else {
                    r.tb_anchor = '(hgd)'
                    r.tb_notes =
                        'All tied on Overall points, goal difference and goals scored. Tied on Head-to-head points (' +
                        r.pts +
                        '). Tiebreak by Head-to-head goal difference: ' +
                        r.team.name +
                        ' ' +
                        (r.gd > 0 ? '+' : '') +
                        r.gd
                }
            })
            updateSubpools(p)
        }
    }
    flattenSubpools(group, config)
}

export const createH2HGoalDifferenceSubpools = (pool, config) => {
    if (!pool || !pool.h2h_rankings || !config) return
    pool.subpools = []
    pool.h2h_rankings.forEach((r) => {
        const foundPool = pool.subpools.find((p) => p.h2h_gd === r.gd)
        if (foundPool) {
            foundPool.rankings.push(r)
        } else {
            pool.subpools.push({ pts: pool.pts, h2h_pts: r.pts, h2h_gd: r.gd, rankings: [r] })
        }
    })
}

export const sortH2HGoalsFor = (group, config) => {
    if (!group || !group.pools || !config) return
    if (isDoneSorting(group, config)) return
    addSortPath(group, 'h2hgoalsfor')

    const pools = group.pools
    for (var i = 0; i < pools.length; i++) {
        const p = pools[i]
        const rankings = p.rankings

        if (rankings.length === 2 || rankings.length === 3) {
            prepareH2HPool(p, group.matchdays, config)
            createH2HGoalsForSubpools(p, config)

            const subpools = p.subpools
            for (var k = 0; k < subpools.length - 1; k++) {
                for (var l = k + 1; l < subpools.length; l++) {
                    if (subpools[k].h2h_gf < subpools[l].h2h_gf) {
                        const temp = subpools[k]
                        subpools[k] = subpools[l]
                        subpools[l] = temp
                    }
                }
            }
            p.subpools.forEach((sp) => {
                if (sp.rankings && sp.rankings.length === 1) {
                    sp.sorted = true
                }
            })
        }

        if (rankings.length === 2) {
            updateSubpools(p)
        } else if (rankings.length === 3) {
            p.h2h_rankings.forEach((r) => {
                // AFCON2010
                // EURO2004
                if (isHead2HeadBeforeGoalDifference(config)) {
                    r.tb_anchor = '(hgf)'
                    r.tb_notes =
                        'All tied on Head-to-head points (' +
                        r.pts +
                        ') and goal difference (' +
                        (r.gd > 0 ? '+' : '') +
                        r.gd +
                        '). Tiebreak by Head-to-head goal scored: ' +
                        r.team.name +
                        ' ' +
                        r.gf
                } else {
                    r.tb_anchor = '(hgf)'
                    r.tb_notes =
                        'All tied on Overall points, goal difference and goals scored. Tied on Head-to-head points (' +
                        r.pts +
                        ') and goal difference (' +
                        (r.gd > 0 ? '+' : '') +
                        r.gd +
                        '). Tiebreak by Head-to-head goal scored: ' +
                        r.team.name +
                        ' ' +
                        r.gf
                }
            })
            updateSubpools(p)
        }
    }
    flattenSubpools(group, config)
}

export const createH2HGoalsForSubpools = (pool, config) => {
    if (!pool || !pool.h2h_rankings || !config) return
    pool.subpools = []
    pool.h2h_rankings.forEach((r) => {
        const foundPool = pool.subpools.find((p) => p.h2h_gf === r.gf)
        if (foundPool) {
            foundPool.rankings.push(r)
        } else {
            pool.subpools.push({ pts: pool.pts, h2h_pts: r.pts, h2h_gd: r.gd, h2h_gf: r.gf, rankings: [r] })
        }
    })
}

export const sortH2HAwayGoals = (group, config) => {
    if (!group || !group.pools || !config) return
    if (isDoneSorting(group, config)) return
    addSortPath(group, 'h2hawaygoals')

    const pools = group.pools
    for (var i = 0; i < pools.length; i++) {
        const p = pools[i]
        const rankings = p.rankings

        if (rankings.length >= 2) {
            prepareH2HPool(p, group.matchdays, config)
            createH2HAwayGoalsSubpools(p, config)

            const subpools = p.subpools
            for (var k = 0; k < subpools.length - 1; k++) {
                for (var l = k + 1; l < subpools.length; l++) {
                    if (subpools[k].h2h_gaw < subpools[l].h2h_gaw) {
                        const temp = subpools[k]
                        subpools[k] = subpools[l]
                        subpools[l] = temp
                    }
                }
            }
            p.subpools.forEach((sp) => {
                if (sp.rankings && sp.rankings.length === 1) {
                    sp.sorted = true
                }
            })
        }

        // UNL202021
        // UCL201819 || UCL202021
        if (rankings.length === 2) {
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
            updateSubpools(p)
        }
    }
    flattenSubpools(group, config)
}

export const createH2HAwayGoalsSubpools = (pool, config) => {
    if (!pool || !pool.h2h_rankings || !config) return
    pool.subpools = []
    pool.h2h_rankings.forEach((r) => {
        const foundPool = pool.subpools.find((p) => p.h2h_gaw === r.gaw)
        if (foundPool) {
            foundPool.rankings.push(r)
        } else {
            pool.subpools.push({ pts: pool.pts, h2h_pts: r.pts, h2h_gd: r.gd, h2h_gf: r.gf, h2h_gaw: r.gaw, rankings: [r] })
        }
    })
}

export const sortFairPlayPoints = (group, config) => {
    if (!group || !group.pools || !config) return
    if (isDoneSorting(group, config)) return
    if (isDisciplinaryPointsTiebreaker(config)) {
        addSortPath(group, 'disciplinarypoints')
    } else {
        addSortPath(group, 'fairplaypoints')
    }

    const pools = group.pools
    for (var i = 0; i < pools.length; i++) {
        const p = pools[i]
        const rankings = p.rankings

        if (rankings.length >= 2) {
            createFairplaySubpools(p, config)

            const subpools = p.subpools
            for (var k = 0; k < subpools.length - 1; k++) {
                for (var l = k + 1; l < subpools.length; l++) {
                    if (subpools[k].fp < subpools[l].fp) {
                        const temp = subpools[k]
                        subpools[k] = subpools[l]
                        subpools[l] = temp
                    }
                }
            }
            p.subpools.forEach((sp) => {
                if (sp.rankings && sp.rankings.length === 1) {
                    sp.sorted = true
                }
            })
        }

        if (rankings.length === 2) {
            // EURO2024
            const h2h = isHead2HeadBeforeGoalDifference(config)
                ? 'Tied on head-to-head results. Tied on Overall goal difference (' +
                  (rankings[0].gd > 0 ? '+' : '') +
                  rankings[0].gd +
                  ') and Overall goals scored (' +
                  rankings[0].gf +
                  '). '
                : ''
            // Disciplinary points: AAC2019 Partial
            if (isDisciplinaryPointsTiebreaker(config)) {
                if (config.sort === 'partial') {
                    rankings[0].sort = 'partial'
                    rankings[1].sort = 'partial'
                }
                delete rankings[0].tb_anchor
                rankings[0].disciplinary_point = true
                rankings[0].tb_notes =
                    h2h +
                    'Tiebreak by Disciplinary points: ' +
                    rankings[0].team.name +
                    ' ' +
                    rankings[0].fp +
                    ' >< ' +
                    rankings[1].team.name +
                    ' ' +
                    rankings[1].fp
                delete rankings[1].tb_anchor
                rankings[1].disciplinary_point = true
                rankings[1].tb_notes =
                    h2h +
                    'Tiebreak by Disciplinary points: ' +
                    rankings[1].team.name +
                    ' ' +
                    rankings[1].fp +
                    ' >< ' +
                    rankings[0].team.name +
                    ' ' +
                    rankings[0].fp
            }
            // Fair play points: WC2018
            else {
                rankings[0].tb_anchor = '(fp)'
                rankings[0].tb_notes =
                    'Tiebreak by Fair play points: ' + rankings[0].team.name + ' ' + rankings[0].fp + ' >< ' + rankings[1].team.name + ' ' + rankings[1].fp
                rankings[1].tb_anchor = '(fp)'
                rankings[1].tb_notes =
                    'Tiebreak by Fair play points: ' + rankings[1].team.name + ' ' + rankings[1].fp + ' >< ' + rankings[0].team.name + ' ' + rankings[0].fp
            }
        }
    }
    flattenSubpools(group, config)
}

export const createFairplaySubpools = (pool, config) => {
    if (!pool || !pool.rankings || !config) return
    pool.subpools = []
    pool.rankings.forEach((r) => {
        const foundPool = pool.subpools.find((p) => p.fp === r.fp)
        if (foundPool) {
            foundPool.rankings.push(r)
        } else {
            pool.subpools.push({ pts: pool.pts, gd: r.gd, gf: r.gf, fp: r.fp, rankings: [r] })
        }
    })
}

export const drawLots = (group, config) => {
    if (!group || !group.pools || !config) return
    if (isDoneSorting(group, config)) return
    addSortPath(group, 'lots')

    const pools = group.pools
    for (var i = 0; i < pools.length; i++) {
        const p = pools[i]
        const rankings = p.rankings

        if (!p.sorted) {
            // WC1970 || WC1990
            // AFCON1965 || AFCON1988 || AFCON2015
            // GC2000
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
                    rankings[0].tb_notes = 'Tiebreak by Drawing lots: ' + rankings[0].team.draw_lot_notes
                    rankings[1].tb_anchor = '(dl)'
                    rankings[1].tb_notes = 'Tiebreak by Drawing lots: ' + rankings[1].team.draw_lot_notes
                }
            }
            // GC2002
            else {
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
                    r.tb_notes = 'Tiebreak by Drawing lots: ' + r.team.draw_lot_notes
                })
            }
        }
    }
}

// CONFEDC1995
export const sortTieLastMatch = (group, config) => {
    if (!group || !group.pools || !config) return
    if (isDoneSorting(group, config)) return
    addSortPath(group, 'tielastmatch')

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

export const processPartialAdvancement = (stage, config) => {
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
            sortGroup(stage.partial, { ...config, tiebreakers: config.partial_tiebreakers, sort: 'partial' })
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
                    } else if (a.other === 'relegate_playoff') {
                        t.relegated_playoff = true
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
    if (group.pools) {
        group.rankings = []
        let rank = 0
        group.pools.forEach((p) => {
            p.rankings.forEach((t) => {
                rank++
                t.rank = rank
                group.rankings.push(t)
            })
        })
    } else {
        let rank = 0
        group.rankings.forEach((t) => {
            rank++
            t.rank = rank
        })
    }
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
            const foundRelegatedPlayoff = foundPosition.next === 'relegate' && foundPosition.other === 'relegate_playoff'
            let foundPartial
            if (foundPosition.rankings) {
                foundPartial = foundPosition.rankings.find(
                    (t2) =>
                        t2.id === t.id &&
                        ((foundWildCard && t2.wild_card) || (foundRelegated && t2.relegated) || (foundRelegatedPlayoff && t2.relegated_playoff)),
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
                } else if (foundPosition.next === 'advance_playoff') {
                    t.advanced_playoff = true
                } else if (foundPosition.next === 'wild_card') {
                    t.wild_card = true
                } else if (foundPosition.next === 'wild_card2') {
                    t.wild_card2 = true
                } else if (foundPosition.next === 'transfer') {
                    t.transferred = true
                } else if (foundPosition.next === 'relegate_playoff') {
                    t.relegated_playoff = true
                } else if (foundPosition.next === 'relegate') {
                    if (foundPartial) {
                        if (foundPartial.relegated) {
                            t.relegated = true
                        }
                        if (foundPartial.relegated_playoff) {
                            t.relegated_playoff = true
                        }
                    } else {
                        t.relegated = true
                    }
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

export const getPartialAdvancementRankings = (stage) => {
    if (!stage || !stage.advancements || !stage.advancements.positions) return
    return stage.advancements.positions.filter((a) => a.count)
}

export const isPointsTiebreaker = (config) => {
    const { tiebreakers } = config
    if (!tiebreakers) return false
    return tiebreakers.find((tb) => tb === 'points') != null
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

export const isAwayGoalsTiebreaker = (config) => {
    const { tiebreakers } = config
    if (!tiebreakers) return false
    return tiebreakers.find((tb) => tb === 'awaygoals') != null
}

export const isGroupPlayoffTiebreaker = (config) => {
    const { tiebreakers } = config
    if (!tiebreakers) return false
    return tiebreakers.find((tb) => tb === 'groupplayoff') != null
}

export const isDisciplinaryPointsTiebreaker = (config) => {
    const { tiebreakers } = config
    if (!tiebreakers) return false
    return tiebreakers.find((tb) => tb === 'disciplinarypoints') != null
}

export const isFairPlayPointsTiebreaker = (config) => {
    const { tiebreakers } = config
    if (!tiebreakers) return false
    return tiebreakers.find((tb) => tb === 'fairplaypoints') != null
}

export const isTieLastMatchTiebreaker = (config) => {
    const { tiebreakers } = config
    if (!tiebreakers) return false
    return tiebreakers.find((tb) => tb === 'tielastmatch') != null
}

export const isHead2HeadBeforeGoalDifference = (config) => {
    const { tiebreakers } = config
    if (!tiebreakers) return false
    const index1 = tiebreakers.findIndex((tb) => tb === 'h2hpoints')
    const index2 = tiebreakers.findIndex((tb) => tb === 'goaldifference')
    return index1 !== -1 && index2 !== -1 && index1 < index2
}
