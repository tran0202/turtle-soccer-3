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
        }
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
        // console.log('allMatches:', allMatches)
        g.teams.forEach((t) => {
            const ranking = getBlankRanking(t.id)
            ranking.team = t
            accumulateRanking(ranking, allMatches, tournament)
            g.rankings.push(ranking)
        })
    })
}
