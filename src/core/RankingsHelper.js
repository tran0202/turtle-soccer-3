/* eslint-disable no-loop-func */
import { isHomeWinMatch } from './TeamHelper'

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
        collectH2HMatches(g)
        createPools(g, config)
        sortPools(g, config)
        flattenPools(g)
        processPartialAdvancement(stage, config)
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
        } else {
            if (ranking.id === m.home_team) {
                if (isHomeWinMatch(m)) {
                    ranking.playoff = true
                    ranking.playoff_win = true
                    ranking.playoff_win_note = m.group_playoff_note
                } else {
                    ranking.playoff = true
                    ranking.playoff_win = false
                }
            }
            if (ranking.id === m.away_team) {
                if (isHomeWinMatch(m)) {
                    ranking.playoff = true
                    ranking.playoff_win = false
                } else {
                    ranking.playoff = true
                    ranking.playoff_win = true
                    ranking.playoff_win_note = m.group_playoff_note
                }
            }
        }
        if (m.tie_last_match) {
            if (ranking.id === m.home_team) {
                if (isHomeWinMatch(m)) {
                    ranking.tie_last_match = true
                    ranking.tie_last_match_win = true
                    ranking.tie_last_match_win_note = m.tie_last_match_note
                } else {
                    ranking.tie_last_match = true
                    ranking.tie_last_match_win = false
                }
            }
            if (ranking.id === m.away_team) {
                if (isHomeWinMatch(m)) {
                    ranking.tie_last_match = true
                    ranking.tie_last_match_win = false
                } else {
                    ranking.tie_last_match = true
                    ranking.tie_last_match_win = true
                    ranking.tie_last_match_win_note = m.tie_last_match_note
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
                // 3. Transfer the total fair play points to h2h teams
                ranking.fp = t.fp
                p.h2h_rankings.push(ranking)
            })
            // 4. Sort the rankings
            const result = sortRankings(p.h2h_rankings, { ...config, sort: 'h2h' })
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
                }
            }
            if (config.sort === 'h2h' && rankings[i].pts !== rankings[j].pts) {
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
    }
    return { h2htie }
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
        if (isH2HTiebreaker(config)) {
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
    return { ranking1, ranking2, h2htie }
}

export const compareFairPlay = (ranking1, ranking2, config) => {
    if (!ranking1 || !ranking2 || !config) return
    if (ranking1.fp < ranking2.fp) {
        const temp = ranking1
        ranking1 = { ...ranking2 }
        ranking2 = { ...temp }
        ranking1.fair_play_win = true
        ranking2.fair_play_win = false
        ranking1.fair_play_win_note = ranking1.team.name + ' ' + ranking1.fp + ' | ' + ranking2.team.name + ' ' + ranking2.fp
    }
    return { ranking1, ranking2 }
}

export const compareTieLastMatch = (ranking1, ranking2, config) => {
    if (!ranking1 || !ranking2 || !config) return
    if (ranking1.tie_last_match && ranking2.tie_last_match) {
        if (ranking2.tie_last_match_win) {
            const temp = ranking1
            ranking1 = { ...ranking2 }
            ranking2 = { ...temp }
        }
    }
    return { ranking1, ranking2 }
}

export const drawingLots = (ranking1, ranking2, config) => {
    if (!ranking1 || !ranking2 || !config) return
    const winlot1 = config.sort === 'h2h' || config.sort === 'h2htie' || config.sort === 'partial' ? ranking1.team.win_lot : ranking1.rankings[0].team.win_lot
    const winlot2 = config.sort === 'h2h' || config.sort === 'h2htie' || config.sort === 'partial' ? ranking2.team.win_lot : ranking2.rankings[0].team.win_lot
    if (winlot1 || winlot2) {
        if (winlot2) {
            const temp = ranking1
            ranking1 = { ...ranking2 }
            ranking2 = { ...temp }
        }
        if (config.sort === 'h2h') {
            ranking1.draw_lot_win = true
            ranking2.draw_lot_win = false
            ranking1.draw_lot_win_note = ranking1.team.win_lot_note
        }
        if (config.sort === 'pool') {
            ranking1.rankings[0].draw_lot_win = true
            ranking2.rankings[0].draw_lot_win = false
            ranking1.rankings[0].draw_lot_win_note = ranking1.rankings[0].team.win_lot_note
        }
    }
    return { ranking1, ranking2 }
}

export const flattenPools = (group) => {
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
            sortRankings(rankings, { ...config, sort: 'partial' })
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

export const isPointTiebreaker = (config) => {
    const { tiebreakers } = config
    if (!tiebreakers) return false
    return tiebreakers.find((tb) => tb === 'point') != null
}

export const isH2HTiebreaker = (config) => {
    const { tiebreakers } = config
    if (!tiebreakers) return false
    return tiebreakers.find((tb) => tb === 'head2head') != null
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

// export const isOnlyPointGoalDifferenceTiebreaker = (config) => {
//     return isPointTiebreaker(config) && isGoalDifferenceTiebreaker(config) && !isGoalForTiebreaker(config)
// }

// export const isHead2HeadBeforeGoalDifference = (config) => {
//     const { tiebreakers } = config
//     if (!tiebreakers) return false
//     return (
//         tiebreakers.findIndex((tb) => tb === 'head2head') <
//         tiebreakers.findIndex((tb) => tb === 'goaldifferenceandgoalscored' || tb === 'goaldifferencegoalscoredwins')
//     )
// }
