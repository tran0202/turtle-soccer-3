import Competitions from '../data/Competitions.json'
import NationArray from '../data/Nations.json'
import { getTournamentArray, getTournamentDataArray } from './DataHelper'
import { getTeams, getHostTeamArray } from './TeamHelper'
import { calculateGroupRankings, isAwayGoalsTiebreaker } from './RankingsHelper'

// ----------------------------- Competition ----------------------------------

export const getCompetitions = () => {
    return Competitions
}

export const getCompetition = (competition_id) => {
    const competition = getCompetitions().find((c) => c.id === competition_id)
    if (competition) {
        const tournaments = getTournamentArray().filter((t) => t.competition_id === competition_id)
        tournaments.forEach((t, index) => {
            t.index = tournaments.length - index
        })
        competition.tournaments = tournaments
        competition.teams = getTeams(competition.team_type_id, competition.all_members)
        competition.nations = NationArray
    }
    return competition
}

// ----------------------------- Tournament ----------------------------------

export const getTournamentData = (id) => {
    const result = getTournamentDataArray().find((t) => t.id === id)
    return result
}

export const getTournament = (id) => {
    const tournaments = getTournamentArray()
    const tournament = tournaments.find((t) => t.id === id)

    tournament.competition = getCompetition(tournament.competition_id)
    tournament.competition.tournaments.sort((a, b) => {
        return a > b ? 1 : -1
    })

    const tournamentData = getTournamentData(id)
    tournamentData.previous_tournament = getPreviousTournament(tournament.competition.tournaments, id)
    tournamentData.next_tournament = getNextTournament(tournament.competition.tournaments, id)

    processSoccerTournament(tournamentData, tournament)

    return { tournament: tournamentData, config: tournament }
}

export const processSoccerTournament = (tournament, config) => {
    if (!tournament || !config) return
    const qualifiedTeams = getHostTeamArray(config)
    tournament.qualifiedTeams = qualifiedTeams
    // const qualifications = []
    // config.qualifications.forEach((q) => {
    //     const result = processTournament(q, teamArray, qualifiedTeams, config)
    //     qualifications.push({ id: q.id, draws: result.draws, stages: result.stages })
    // })
    processFinal(tournament, config)
    // return qualifications
}

export const processFinal = (tournament, config) => {
    if (!tournament || !config) return
    processTournament(tournament, config)
}

export const processTournament = (tournament, config) => {
    if (!tournament || !config) return
    // const draws = createDraws(tournament, teamArray, qualifiedTeams)
    // const stages = createPots(tournament, draws)
    if (tournament.leagues) {
        processLeagues(tournament, config)
    }
    processStages(tournament, config)
    // return { draws, stages }
}

export const processLeagues = (tournament, config) => {
    if (!tournament || !tournament.leagues || !config) return
    tournament.stages = []
    tournament.leagues.forEach((l) => {
        l.stages &&
            l.stages.forEach((s) => {
                tournament.stages.push(s)
            })
    })
}

export const processStages = (tournament, config) => {
    if (!tournament || !tournament.stages || !config) return
    tournament.stages.forEach((s) => {
        // preparePots(s)
        // createDrawPotTable(s)
        processStage(s, config)
        // const nextStage = getNextStage(s, tournament, config)
        // finishStage(s, nextStage)
        // qualifyStage(tournament, s, qualifiedTeams, nextStage)
    })
}

export const processStage = (stage, config) => {
    if (!stage || !stage.type) return
    // if (stage.type.includes('pair')) {
    //     if (stage.type.includes('_drawpair') || stage.type.includes('_noshowpot')) {
    //         stage.groups = []
    //         createPairs(stage)
    //     }
    //     if (stage.type.includes('_predetpair')) {
    //         createPreDeterminedPairs(stage)
    //     }
    //     createPairMatches(stage)
    //     calculatePairAggregateScore(stage)
    // }
    if (stage.type.includes('roundrobin_')) {
        if (stage.type.includes('_final')) {
            processGroups(stage, config)
        } else if (stage.type.includes('_nopot')) {
            // createSingleGroup(stage)
        } else {
            // createGroups(stage)
        }
        // createGroupMatches(stage)
        calculateGroupRankings(stage, config)
    }
    if (stage.type.includes('knockout_')) {
        //     initEntrants(stage)
        processPathRounds(stage, config)
    }
    if (stage.type.includes('pair_')) {
        processRounds(stage, stage, config)
    }
}

export const processGroups = (stage, config) => {
    if (!stage || !stage.groups || !config || !config.competition) return
    stage.groups.forEach((g) => {
        const new_teams = []
        g.teams &&
            g.teams.forEach((t) => {
                const team = config.competition.teams.find((t2) => t2.id === t.id)
                if (team) {
                    new_teams.push({ ...team, ...t })
                }
            })
        g.teams = new_teams
    })
}

export const createGroupMatches = (stage) => {
    if (!stage || !stage.groups) return
    stage.groups.forEach((g) => {
        const startingMatchdays = stage.matchdays ? stage.matchdays : g.matchdays ? g.matchdays : []
        g.matchdays = []
        startingMatchdays.forEach((md) => {
            const new_matchday = { name: md.name, date: md.date }
            const matches = []
            md.matches.forEach((m) => {
                const home_team = g.teams.find((t) => t.pos === m.home_pos)
                const away_team = g.teams.find((t) => t.pos === m.away_pos)
                if (home_team && away_team) {
                    const new_match = { date: md.date, home_team: home_team.id, away_team: away_team.id }
                    // getRandomScore(new_match)
                    matches.push(new_match)
                }
            })
            new_matchday.matches = matches
            g.matchdays.push(new_matchday)
        })
    })
    // overwriteGroup(stage.groups[0])
}

export const processPathRounds = (stage, config) => {
    if (!stage) return
    if (stage.rounds) {
        // if (stage.third_place_groups) {
        //     updateFirstRound(stage)
        // }
        processRounds(stage, stage, config)
    }
    if (stage.paths) {
        stage.paths.forEach((p) => {
            processRounds(p, stage, config)
        })
    }
}

export const processRounds = (path, stage, config) => {
    if (!stage || !path || !path.rounds) return
    path.rounds.forEach((r) => {
        // r.matches.forEach((m) => {
        //     populateMatch(m, stage.entrants)
        //     getKnockoutScore(m)
        // })

        if (r.round_type) {
            if (r.round_type === 'knockout2legged') {
                calculatePairAggregateScore(r, config)
                prepareBracketPairOrder(r)
            } else if (r.round_type === 'pairs2legged') {
                calculatePairAggregateScore(r, config)
            }
        } else {
            createMatchdays(r)
            prepareBracketOrder(r)
        }
        // finishRound(r, path, stage)
    })
}

export const calculatePairAggregateScore = (stage, config) => {
    if (!stage || !stage.pairs) return
    stage.pairs.forEach((p) => {
        if (p.matches && p.matches.length <= 3) {
            const hasFirstLegOnly = p.matches.find((m) => m.matchday === 'firstlegonly') !== undefined
            if (hasFirstLegOnly) {
            }
            if (!hasFirstLegOnly) {
                const match1_home_score = p.matches[0].home_score
                const match1_away_score = p.matches[0].away_score
                const match2_home_score = p.matches[1].home_score
                const match2_away_score = p.matches[1].away_score
                const match2_home_extra_score = p.matches[1].home_extra_score ? p.matches[1].home_extra_score : 0
                const match2_away_extra_score = p.matches[1].away_extra_score ? p.matches[1].away_extra_score : 0
                const agg_home_score = match1_home_score + match2_away_score + match2_away_extra_score
                const agg_away_score = match1_away_score + match2_home_score + match2_home_extra_score
                p.agg_home_score = agg_home_score
                p.agg_away_score = agg_away_score
                p.agg_home_penalty_score = p.matches[1].home_penalty_score
                p.agg_away_penalty_score = p.matches[1].away_penalty_score
                const match1_home_pts =
                    p.matches[0].home_score > p.matches[0].away_score ? config.points_for_win : p.matches[0].home_score === p.matches[0].away_score ? 1 : 0
                const match1_away_pts =
                    p.matches[0].away_score > p.matches[0].home_score ? config.points_for_win : p.matches[0].away_score === p.matches[0].home_score ? 1 : 0
                const match2_home_pts =
                    p.matches[1].home_score > p.matches[1].away_score ? config.points_for_win : p.matches[1].home_score === p.matches[1].away_score ? 1 : 0
                const match2_away_pts =
                    p.matches[1].away_score > p.matches[1].home_score ? config.points_for_win : p.matches[1].away_score === p.matches[1].home_score ? 1 : 0
                p.agg_home_pts = match1_home_pts + match2_away_pts
                p.agg_away_pts = match1_away_pts + match2_home_pts
                p.home_draw_lot = p.matches[1].away_draw_lot
                p.away_draw_lot = p.matches[1].home_draw_lot

                const hasPlayoff = p.matches.find((m) => m.matchday === 'playoffleg') !== undefined
                if (hasPlayoff) {
                    const match3_home_score = p.matches[2].home_score
                    const match3_away_score = p.matches[2].away_score
                    const match3_home_extra_score = p.matches[2].home_extra_score ? p.matches[2].home_extra_score : 0
                    const match3_away_extra_score = p.matches[2].away_extra_score ? p.matches[2].away_extra_score : 0
                    p.playoff_home_score = match3_home_score + match3_home_extra_score
                    p.playoff_away_score = match3_away_score + match3_away_extra_score
                    p.playoff_home_pts =
                        p.playoff_home_score > p.playoff_away_score ? config.points_for_win : p.playoff_home_score === p.playoff_away_score ? 1 : 0
                    p.playoff_away_pts =
                        p.playoff_away_score > p.playoff_home_score ? config.points_for_win : p.playoff_away_score === p.playoff_home_score ? 1 : 0
                }
            } else {
                p.agg_home_score = p.matches[0].home_score
                p.agg_away_score = p.matches[0].away_score
            }
            const ihwp = isHomeWinPair(p, stage.tiebreakers ? { ...config, tiebreakers: stage.tiebreakers } : config)
            p.agg_winner = ihwp ? 'home' : 'away'
            const winTeam = p.teams && p.teams.find((t) => t.id === (ihwp ? p.matches[0].home_team : p.matches[0].away_team))
            if (winTeam) winTeam.advanced = true
        }
    })
}

export const isHomeWinPair = (pair, config) => {
    if (!pair || !pair.matches || pair.matches.length > 3 || !config) return
    const hasFirstLegOnly = pair.matches.find((m) => m.matchday === 'firstlegonly') !== undefined
    if (!hasFirstLegOnly) {
        const match1_away_score = pair.matches[0].away_score
        const match2_away_extra_score = pair.matches[1].away_extra_score ? pair.matches[1].away_extra_score : 0
        const match2_away_score = pair.matches[1].away_score + match2_away_extra_score
        const match2_home_penalty_score = pair.matches[1].home_penalty_score ? pair.matches[1].home_penalty_score : 0
        const match2_away_penalty_score = pair.matches[1].away_penalty_score ? pair.matches[1].away_penalty_score : 0
        if (config.pair_agg_points) {
            if (pair.agg_home_pts > pair.agg_away_pts) {
                return true
            } else if (pair.agg_home_pts === pair.agg_away_pts) {
                if (pair.playoff_home_pts && pair.playoff_away_pts) {
                    if (pair.playoff_home_pts > pair.playoff_away_pts) {
                        return true
                    } else if (pair.playoff_home_pts === pair.playoff_away_pts) {
                        return pair.agg_home_score > pair.agg_away_score
                    } else {
                        return false
                    }
                }
                if (pair.agg_home_score > pair.agg_away_score) {
                    return true
                } else if (pair.agg_home_score === pair.agg_away_score) {
                    if (pair.matches[1].home_draw_lot) return false
                    if (pair.matches[1].away_draw_lot) return true
                } else {
                    return false
                }
            } else {
                return false
            }
        }
        if (pair.agg_home_score > pair.agg_away_score) return true
        else if (pair.agg_home_score === pair.agg_away_score) {
            if (isAwayGoalsTiebreaker(config)) {
                if (match2_away_score > match1_away_score) {
                    pair.away_goal_winner = 'home'
                    return true
                } else if (match2_away_score === match1_away_score) {
                    if (match2_away_penalty_score > match2_home_penalty_score) return true
                } else {
                    pair.away_goal_winner = 'away'
                }
            } else {
                return match2_away_penalty_score > match2_home_penalty_score
            }
        }
    } else {
        if (pair.agg_home_score > pair.agg_away_score) return true
    }
    return false
}

export const prepareBracketOrder = (round) => {
    if (!round || !round.matches) return
    const bracketMatches = []
    round.matches.forEach((m) => {
        if (!m.replay) {
            if (m.replay_required) {
                const foundReplay = round.matches.find((m2) => m2.home_team === m.home_team && m2.away_team === m.away_team && m2.replay)
                if (foundReplay) {
                    m.home_replay_score = foundReplay.home_score
                    m.away_replay_score = foundReplay.away_score
                }
            }
            const m2 = { ...m }
            bracketMatches.push(m2)
        }
    })
    bracketMatches.sort((a, b) => {
        if (a.bracket_order < b.bracket_order) {
            return -1
        } else if (a.bracket_order > b.bracket_order) {
            return 1
        } else {
            return 0
        }
    })
    round.bracketMatches = round.final ? round.matches : bracketMatches
}

export const prepareBracketPairOrder = (round) => {
    if (!round || !round.pairs) return
    const bracketMatches = []
    round.pairs.forEach((p) => {
        const match = {
            ...p,
            home_team: p.matches[0].home_team,
            away_team: p.matches[0].away_team,
            leg1_home_score: p.matches[0].home_score,
            leg1_away_score: p.matches[0].away_score,
            leg1_date: p.matches[0].date,
            leg1_time: p.matches[0].time,
            leg1_city: p.matches[0].city,
            leg1_stadium: p.matches[0].stadium,
            leg2_home_score: p.matches[1] && p.matches[1].away_score,
            leg2_away_score: p.matches[1] && p.matches[1].home_score,
            leg2_home_extra_score: p.matches[1] && p.matches[1].away_extra_score,
            leg2_away_extra_score: p.matches[1] && p.matches[1].home_extra_score,
            leg2_home_penalty_score: p.matches[1] && p.matches[1].away_penalty_score,
            leg2_away_penalty_score: p.matches[1] && p.matches[1].home_penalty_score,
            leg2_date: p.matches[1] && p.matches[1].date,
            leg2_time: p.matches[1] && p.matches[1].time,
            leg2_city: p.matches[1] && p.matches[1].city,
            leg2_stadium: p.matches[1] && p.matches[1].stadium,
            playoff_home_score: p.matches[2] && p.matches[2].home_score,
            playoff_away_score: p.matches[2] && p.matches[2].away_score,
            playoff_home_extra_score: p.matches[2] && p.matches[2].home_extra_score,
            playoff_away_extra_score: p.matches[2] && p.matches[2].away_extra_score,
            home_playoff_win: p.matches[2] && p.matches[2].home_playoff_win,
            away_playoff_win: p.matches[2] && p.matches[2].away_playoff_win,
            playoff_notes: p.matches[2] && p.matches[2].playoff_notes,
            home_draw_lot: p.matches[1] && p.matches[1].away_draw_lot,
            away_draw_lot: p.matches[1] && p.matches[1].home_draw_lot,
            draw_lot_notes: p.matches[1] && p.matches[1].draw_lot_notes,
            final: p.final,
        }
        bracketMatches.push(match)
    })
    bracketMatches.sort((a, b) => {
        if (a.bracket_order < b.bracket_order) {
            return -1
        } else if (a.bracket_order > b.bracket_order) {
            return 1
        } else {
            return 0
        }
    })
    round.bracketMatches = bracketMatches
}

export const createMatchdays = (round) => {
    if (!round || !round.matches) return
    const matchdays = []
    round.matches.forEach((m) => {
        const final = m.final
        const third_place = m.third_place
        const replay = m.replay
        if (!final && !third_place) {
            const foundMatchday = matchdays.find((md) => md.date === m.date)
            if (!foundMatchday) {
                matchdays.push({ date: m.date, replay, matches: [m] })
            } else {
                foundMatchday.matches.push(m)
            }
        } else {
            matchdays.push({ date: m.date, final, third_place, replay, matches: [m] })
        }
    })
    round.matchdays = matchdays
}

export const getPreviousTournament = (tournaments, current_id) => {
    const current_tournament_index = tournaments.findIndex((t) => t.id === current_id)
    return current_tournament_index !== -1 && current_tournament_index !== 0
        ? { id: tournaments[current_tournament_index - 1].id, year: tournaments[current_tournament_index - 1].year }
        : {}
}

export const getNextTournament = (tournaments, current_id) => {
    const current_tournament_index = tournaments.findIndex((t) => t.id === current_id)
    return current_tournament_index !== -1 && current_tournament_index !== tournaments.length - 1
        ? { id: tournaments[current_tournament_index + 1].id, year: tournaments[current_tournament_index + 1].year }
        : {}
}
