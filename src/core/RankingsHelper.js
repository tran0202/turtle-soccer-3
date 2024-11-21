/* eslint-disable no-loop-func */
import randomInteger from 'random-int'

export const getBlankRanking = (teamId) => {
    return { id: teamId, mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 }
}

export const accumulateRanking = (ranking, matches, tournament) => {
    if (!ranking || !matches) return
    matches.forEach((m) => {
        if (ranking.id === m.home_team) {
            ranking.mp++
            if (m.home_score > m.away_score) {
                ranking.w++
                ranking.pts += parseInt(tournament.points_for_win)
            } else if (m.home_score === m.away_score) {
                ranking.d++
                ranking.pts++
            } else {
                ranking.l++
            }
            ranking.gf += parseInt(m.home_score)
            ranking.ga += parseInt(m.away_score)
            ranking.gd = ranking.gf - ranking.ga
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
                ranking.pts += parseInt(tournament.points_for_win)
            }
            ranking.gf += parseInt(m.away_score)
            ranking.ga += parseInt(m.home_score)
            ranking.gd = ranking.gf - ranking.ga
            if (m.away_fair_pts) {
                if (ranking.fp) {
                    ranking.fp += parseInt(m.away_fair_pts)
                } else {
                    ranking.fp = parseInt(m.away_fair_pts)
                }
            }
        }
    })
}

export const collectH2HMatches = (pool, matchdays) => {
    if (!pool || !matchdays) return
    if (pool.teams.length > 1) {
        pool.h2h_matches = []
        for (var i = 0; i < pool.teams.length - 1; i++) {
            for (var j = i + 1; j < pool.teams.length; j++) {
                // eslint-disable-next-line no-loop-func
                matchdays.forEach((md) => {
                    md.matches.forEach((m) => {
                        if (
                            (m.home_team === pool.teams[i].id && m.away_team === pool.teams[j].id) ||
                            (m.home_team === pool.teams[j].id && m.away_team === pool.teams[i].id)
                        ) {
                            pool.h2h_matches.push(m)
                        }
                    })
                })
            }
        }
    }
}

export const createDrawPools = (group, tournament) => {
    if (!group) return
    group.draw_pools = []
    group.rankings.forEach((r) => {
        const foundPool = group.draw_pools.find((p) => p.pts === r.pts && p.gd === r.gd && p.gf === r.gf)
        if (foundPool) {
            foundPool.teams.push(r)
        } else {
            group.draw_pools.push({ pts: r.pts, gd: r.gd, gf: r.gf, teams: [r] })
        }
    })
    group.draw_pools.forEach((p) => {
        // If the pool has more than 1 team:
        if (p.teams.length > 1) {
            // 1. Collect the h2h matches
            collectH2HMatches(p, group.matchdays)
            // 2. Accumulate the rankings
            p.h2h_rankings = []
            p.teams.forEach((t) => {
                const ranking = getBlankRanking(t.id)
                ranking.team = t.team
                accumulateRanking(ranking, p.h2h_matches, tournament)
                // 3. Transfer the total fair play points to h2h teams
                ranking.fp = t.fp
                p.h2h_rankings.push(ranking)
            })
            // 4. Sort the rankings
            sortRankings(p.h2h_rankings, p.h2h_matches)
            // 5. Update the pool
            for (var i = 0; i < p.teams.length; i++) {
                p.teams[i] = {
                    ...p.teams[i],
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
                }
            }
        }
    })
}

export const sortRankings = (rankings, h2h_matches) => {
    if (!rankings) return
    for (var i = 0; i < rankings.length - 1; i++) {
        for (var j = i + 1; j < rankings.length; j++) {
            // Point
            if (rankings[i].pts < rankings[j].pts) {
                const temp = rankings[i]
                rankings[i] = { ...rankings[j] }
                rankings[j] = { ...temp }
                rankings[i].h2h_point_win = true
                rankings[j].h2h_point_win = false
                rankings[i].h2h_point_win_note = rankings[i].pts + '/' + rankings[j].pts
            }

            // Goal differential
            if (rankings[i].pts === rankings[j].pts && rankings[i].gd < rankings[j].gd) {
                const temp = rankings[i]
                rankings[i] = { ...rankings[j] }
                rankings[j] = { ...temp }
                rankings[i].h2h_gd_win = true
                rankings[j].h2h_gd_win = false
                rankings[i].h2h_gd_win_note = rankings[i].gd + '/' + rankings[j].gd
            }

            // Goal forward
            if (rankings[i].pts === rankings[j].pts && rankings[i].gd === rankings[j].gd && rankings[i].gf < rankings[j].gf) {
                const temp = rankings[i]
                rankings[i] = { ...rankings[j] }
                rankings[j] = { ...temp }
                rankings[i].h2h_gf_win = true
                rankings[j].h2h_gf_win = false
                rankings[i].h2h_gf_win_note = rankings[i].gf + '/' + rankings[j].gf
            }

            // Away goal
            if (rankings[i].pts === rankings[j].pts && rankings[i].gd === rankings[j].gd && rankings[i].gf === rankings[j].gf) {
                // eslint-disable-next-line no-loop-func
                const match1 = h2h_matches && h2h_matches.find((m) => m.home_team === rankings[i].team.id)
                const match2 = h2h_matches && h2h_matches.find((m) => m.home_team === rankings[j].team.id)
                if (match1.away_score > match2.away_score) {
                    const temp = rankings[i]
                    rankings[i] = { ...rankings[j] }
                    rankings[j] = { ...temp }
                    rankings[i].away_goal_win = true
                    rankings[j].away_goal_win = false
                    rankings[i].away_goal_win_note = match1.away_score + '/' + match2.away_score
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
                rankings[i].fair_play_win = true
                rankings[j].fair_play_win = false
                rankings[i].fair_play_win_note = rankings[i].fp + '/' + rankings[j].fp
            }

            // Drawing lots
            if (
                rankings[i].pts === rankings[j].pts &&
                rankings[i].gd === rankings[j].gd &&
                rankings[i].gf === rankings[j].gf &&
                rankings[i].fp &&
                rankings[i].fp === rankings[j].fp
            ) {
                const drawingLot = randomInteger(0, 1) === 0
                if (drawingLot) {
                    const temp = rankings[i]
                    rankings[i] = { ...rankings[j] }
                    rankings[j] = { ...temp }
                    console.log('Draw Lot Win Move Up')
                }
                rankings[i].draw_lot_win = true
                rankings[j].draw_lot_win = false
                rankings[i].draw_lot_win_note = rankings[i].id + '/' + rankings[j].id
            }
        }
    }
}

export const sortGroupRankings = (group, tournament) => {
    if (!group) return
    createDrawPools(group, tournament)
    sortRankings(group.draw_pools)
}

export const flattenDrawPools = (group, advancement) => {
    // console.log('advancement:', advancement)
    if (!group || !advancement || advancement.length === 0) return
    group.rankings = []
    let rank = 0
    group.draw_pools.forEach((p) => {
        p.teams.forEach((t) => {
            rank++
            t.rank = rank
            const foundAdvancement = advancement.find((a) => a.pos === rank)
            if (foundAdvancement) {
                if (foundAdvancement.will === 'qualify') {
                    t.qualified = true
                } else if (foundAdvancement.will === 'advance') {
                    t.advanced = true
                } else if (foundAdvancement.will === 'next_round') {
                    t.next_rounded = true
                }
            }
            group.rankings.push(t)
        })
    })
}

export const calculateGroupRankings = (stage, tournament) => {
    if (!stage || !stage.groups) return
    stage.groups.forEach((g) => {
        g.rankings = []
        const allMatches = []
        g.matchdays.forEach((md) => {
            md.matches.forEach((m) => {
                allMatches.push(m)
            })
        })
        g.teams.forEach((t) => {
            const ranking = getBlankRanking(t.id)
            ranking.team = t
            accumulateRanking(ranking, allMatches, tournament)
            g.rankings.push(ranking)
        })
        sortGroupRankings(g, tournament)
        flattenDrawPools(g, stage.advancement)
    })
}
