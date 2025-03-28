/* eslint-disable no-loop-func */
import Competitions from '../data/Competitions.json'
import NationArray from '../data/Nations.json'
import { getTournamentArray, getTournamentDataArray } from './DataHelper'
import { getTeams, getHostTeamArray } from './TeamHelper'
import { calculateGroupRankings, calculateKnockoutRankings, sortGroup, isAwayGoalsTiebreaker, isGoalRatioTiebreaker } from './RankingsHelper'
import { isHomeWinMatch } from './TeamHelper'

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
    processStandings(tournament, config)
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

export const processStandings = (tournament, config) => {
    if (!tournament || !tournament.stages || !config) return
    const rounds = []
    tournament.stages.forEach((s) => {
        if (s.type === 'roundrobin_final') {
            rounds.push(s)
        } else if (s.type === 'knockout_') {
            s.rounds.forEach((r) => {
                rounds.push(r)
            })
        } else if (s.type === 'pair_') {
            s.rounds.forEach((r) => {
                rounds.push(r)
            })
        }
    })

    for (var k = 0; k < rounds.length - 1; k++) {
        const remainedRankings = []
        if (rounds[k].next_round === rounds[k + 1].name) {
            rounds[k].rankings.forEach((r1, index) => {
                const rankingNextRound = rounds[k + 1].rankings.find((r2) => r2.id === r1.id)
                if (rankingNextRound) {
                    addStandings(rankingNextRound, rounds[k].rankings[index], config)
                } else {
                    remainedRankings.push(rounds[k].rankings[index])
                }
            })
        }
        rounds[k].rankings = remainedRankings
        const standings_config = { ...config, tiebreakers: ['points', 'goaldifference', 'goalsfor', 'penalties'] }
        sortGroup(rounds[k], standings_config)
    }

    const finalRound = rounds[rounds.length - 1]
    if (finalRound.championship) {
        const pools = []
        finalRound.rankings.forEach((r) => {
            pools.push({ rankings: [r] })
        })
        finalRound.pools = pools
        const finalRoundStandings = [{}, {}]
        const finalMatch = finalRound.matches.find((m) => m.final)
        if (finalMatch) {
            const champion = isHomeWinMatch(finalMatch) ? finalMatch.home_team : finalMatch.away_team
            const runner_up = isHomeWinMatch(finalMatch) ? finalMatch.away_team : finalMatch.home_team
            finalRound.pools.forEach((p) => {
                if (p.rankings[0].id === champion) {
                    p.rankings[0].champion = true
                    finalRoundStandings[0] = p
                }
                if (p.rankings[0].id === runner_up) {
                    p.rankings[0].runner_up = true
                    finalRoundStandings[1] = p
                }
            })
        }
        const thirdPlaceMatch = finalRound.matches.find((m) => m.third_place)
        if (thirdPlaceMatch) {
            finalRoundStandings[2] = {}
            finalRoundStandings[3] = {}
            const third_place = isHomeWinMatch(thirdPlaceMatch) ? thirdPlaceMatch.home_team : thirdPlaceMatch.away_team
            const fourth_place = isHomeWinMatch(thirdPlaceMatch) ? thirdPlaceMatch.away_team : thirdPlaceMatch.home_team
            finalRound.pools.forEach((p) => {
                if (p.rankings[0].id === third_place) {
                    p.rankings[0].third_place = true
                    finalRoundStandings[2] = p
                }
                if (p.rankings[0].id === fourth_place) {
                    finalRoundStandings[3] = p
                }
            })
        }
        finalRound.pools = finalRoundStandings
    }
    if (finalRound.championship_round) {
        const pools = []
        finalRound.rankings.forEach((r) => {
            pools.push({ rankings: [r] })
        })
        finalRound.pools = pools
    }

    const excludedSemiFinal = []
    rounds.forEach((r, index) => {
        if (r.name !== 'Semi-finals') {
            excludedSemiFinal.push(r)
        } else {
            const final = rounds[index + 1]
            if (final.name === 'Final') {
                r.pools.forEach((p, index) => {
                    if (index === 0) {
                        p.rankings[0].third_place = true
                    }
                    final.pools.push(p)
                })
            }
        }
    })

    tournament.standing_rounds = excludedSemiFinal.reverse()
    sortPool(tournament, config)
}

export const addStandings = (rankingDest, rankingSource, config) => {
    if (!rankingDest || !rankingSource) return
    rankingDest.mp = rankingDest.mp + rankingSource.mp
    rankingDest.w = rankingDest.w + rankingSource.w
    rankingDest.d = rankingDest.d + rankingSource.d
    rankingDest.l = rankingDest.l + rankingSource.l
    rankingDest.gf = rankingDest.gf + rankingSource.gf
    rankingDest.ga = rankingDest.ga + rankingSource.ga
    rankingDest.gd = rankingDest.gf - rankingDest.ga
    rankingDest.gr = isGoalRatioTiebreaker(config) && rankingDest.ga !== 0 ? rankingDest.gf / rankingDest.ga : null
    rankingDest.pts = rankingDest.pts + rankingSource.pts
}

export const sortPool = (tournament, config) => {
    if (!tournament || !tournament.standing_rounds || !config) return
    let pool_rank = 0
    tournament.standing_rounds.forEach((sr) => {
        sr.pools &&
            sr.pools.forEach((p) => {
                p.pool_rank = pool_rank + 1
                p.rankings &&
                    p.rankings.forEach((r) => {
                        pool_rank++
                    })
                const rankings = p.rankings
                if (rankings) {
                    for (var k = 0; k < rankings.length - 1; k++) {
                        for (var l = k + 1; l < rankings.length; l++) {
                            if (rankings[k].team.name > rankings[l].team.name) {
                                const temp = rankings[k]
                                rankings[k] = rankings[l]
                                rankings[l] = temp
                            }
                        }
                    }
                }
            })
    })
}

export const processStage = (stage, config) => {
    if (!stage || !stage.type || !config) return

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
        collectGroupRankings(stage, config)
    }
    if (stage.type.includes('knockout_')) {
        //     initEntrants(stage)
        processKnockoutRounds(stage, config)
        calculateKnockoutRankings(stage, config)
    }
    if (stage.type.includes('pair_')) {
        processPairPaths(stage, config)
        //     if (stage.type.includes('_drawpair') || stage.type.includes('_noshowpot')) {
        //         stage.groups = []
        //         createPairs(stage)
        //     }
        //     if (stage.type.includes('_predetpair')) {
        //         createPreDeterminedPairs(stage)
        //     }
        //     createPairMatches(stage)
        //     calculatePairAggregateScore(stage)
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

export const collectGroupRankings = (stage, config) => {
    if (!stage || !stage.groups || !config) return
    const rankings = []
    stage.groups.forEach((g) => {
        g.rankings.forEach((r) => {
            const new_r = { ...r }
            delete new_r.advanced
            rankings.push(new_r)
        })
    })
    stage.rankings = rankings
}

export const processKnockoutRounds = (stage, config) => {
    if (!stage || !config) return
    // MOFT1964: Medal Path & Consolation Path
    if (stage.paths) {
        stage.paths.forEach((p) => {
            processRounds(p, stage, config)
        })
    }
    if (stage.rounds) {
        // if (stage.third_place_groups) {
        //     updateFirstRound(stage)
        // }
        processRounds(stage, stage, config)
    }
}

export const processRounds = (set, stage, config) => {
    if (!set || !set.rounds || !stage || !config) return

    set.rounds.forEach((r) => {
        // r.matches.forEach((m) => {
        //     populateMatch(m, stage.entrants)
        //     getKnockoutScore(m)
        // })

        if (r.round_type && r.round_type === 'knockout2legged') {
            calculatePairAggregateScore(r, config)
            prepareBracketPairOrder(r)
        } else {
            createMatchdays(r)
            prepareBracketOrder(r)
        }
        // finishRound(r, path, stage)
    })
}

export const processPairPaths = (stage, config) => {
    if (!stage || !stage.rounds || !config) return

    stage.rounds.forEach((r) => {
        // UCL: Champions Path & League Path
        // UEL: Champions Path & Main Path
        if (r.paths) {
            r.paths.forEach((p) => {
                calculatePairAggregateScore(p, config)
            })
        }
        if (r.pairs) {
            calculatePairAggregateScore(r, config)
        }
    })
}

export const calculatePairAggregateScore = (set, config) => {
    if (!set || !set.pairs) return

    set.pairs.forEach((p) => {
        if (p.blank || !p.matches || p.matches.length === 0 || p.matches.length > 3) return
        // UEL202021
        const hasFirstLegOnly = p.matches.find((m) => m.matchday === 'firstlegonly') !== undefined
        const match1_home_score = p.matches[0].home_score
        const match1_away_score = p.matches[0].away_score
        const match1_home_extra_score = p.matches[0].home_extra_score ? p.matches[0].home_extra_score : 0
        const match1_away_extra_score = p.matches[0].away_extra_score ? p.matches[0].away_extra_score : 0

        if (hasFirstLegOnly) {
            p.agg_home_score = match1_home_score + match1_home_extra_score
            p.agg_away_score = match1_away_score + match1_away_extra_score
            p.agg_home_penalty_score = p.matches[0].home_penalty_score
            p.agg_away_penalty_score = p.matches[0].away_penalty_score
        } else {
            const hasSecondLeg = p.matches.find((m) => m.matchday === 'secondleg') !== undefined
            if (hasSecondLeg) {
                const match2_home_score = p.matches[1].home_score
                const match2_away_score = p.matches[1].away_score
                const match2_home_extra_score = p.matches[1].home_extra_score ? p.matches[1].home_extra_score : 0
                const match2_away_extra_score = p.matches[1].away_extra_score ? p.matches[1].away_extra_score : 0
                p.agg_home_score = match1_home_score + match2_away_score + match2_away_extra_score
                p.agg_away_score = match1_away_score + match2_home_score + match2_home_extra_score
                p.agg_home_penalty_score = p.matches[1].home_penalty_score
                p.agg_away_penalty_score = p.matches[1].away_penalty_score

                const match1_home_pts = match1_home_score > match1_away_score ? config.points_for_win : match1_home_score === match1_away_score ? 1 : 0
                const match1_away_pts = match1_away_score > match1_home_score ? config.points_for_win : match1_away_score === match1_home_score ? 1 : 0
                const match2_home_pts = match2_home_score > match2_away_score ? config.points_for_win : match2_home_score === match2_away_score ? 1 : 0
                const match2_away_pts = match2_away_score > match2_home_score ? config.points_for_win : match2_away_score === match2_home_score ? 1 : 0
                p.agg_home_pts = match1_home_pts + match2_away_pts
                p.agg_away_pts = match1_away_pts + match2_home_pts

                p.home_draw_lot = p.matches[1].away_draw_lot
                p.away_draw_lot = p.matches[1].home_draw_lot

                // COPA1975
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
            }
        }

        const new_config = set.tiebreakers ? { ...config, tiebreakers: set.tiebreakers } : config
        const ihwp = isHomeWinPair(p, new_config)
        p.agg_winner = ihwp ? 'home' : 'away'
        const winTeam = p.teams && p.teams.find((t) => t.id === (ihwp ? p.matches[0].home_team : p.matches[0].away_team))
        if (winTeam) winTeam.advanced = true
    })
}

export const isHomeWinPair = (pair, config) => {
    if (!pair || !pair.matches || pair.matches.length === 0 || pair.matches.length > 3 || !config) return

    const hasFirstLegOnly = pair.matches.find((m) => m.matchday === 'firstlegonly') !== undefined
    if (hasFirstLegOnly) {
        if (pair.agg_home_score > pair.agg_away_score) {
            return true
        } else if (pair.agg_home_score === pair.agg_away_score) {
            return pair.agg_home_penalty_score > pair.agg_away_penalty_score
        } else {
            return false
        }
    } else {
        if (pair.matches[0].home_walkover) return true
        if (pair.matches[0].away_walkover) return false

        const hasSecondLeg = pair.matches.find((m) => m.matchday === 'secondleg') !== undefined
        if (hasSecondLeg) {
            const match1_away_score = pair.matches[0].away_score
            const match2_away_score = pair.matches[1].away_score + pair.matches[1].away_extra_score ? pair.matches[1].away_extra_score : 0
            const match2_home_penalty_score = pair.matches[1].home_penalty_score ? pair.matches[1].home_penalty_score : 0
            const match2_away_penalty_score = pair.matches[1].away_penalty_score ? pair.matches[1].away_penalty_score : 0

            // COPA1983
            if (config.pair_agg_points) {
                if (pair.agg_home_pts > pair.agg_away_pts) {
                    return true
                } else if (pair.agg_home_pts === pair.agg_away_pts) {
                    const hasPlayoff = pair.matches.find((m) => m.matchday === 'playoffleg') !== undefined
                    if (hasPlayoff) {
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

            if (pair.agg_home_score > pair.agg_away_score) {
                return true
            } else if (pair.agg_home_score === pair.agg_away_score) {
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
        }
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
        if (!p.blank) {
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
                home_walkover: p.matches[0].home_walkover,
                away_walkover: p.matches[0].away_walkover,
                walkover_notes: p.matches[0].walkover_notes,
                home_disqualified: p.matches[0].home_disqualified,
                away_disqualified: p.matches[0].away_disqualified,
                disqualified_notes: p.matches[0].disqualified_notes,

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
                home_draw_lot: p.matches[1] && p.matches[1].away_draw_lot,
                away_draw_lot: p.matches[1] && p.matches[1].home_draw_lot,
                draw_lot_notes: p.matches[1] && p.matches[1].draw_lot_notes,

                playoff_home_score: p.matches[2] && p.matches[2].home_score,
                playoff_away_score: p.matches[2] && p.matches[2].away_score,
                playoff_home_extra_score: p.matches[2] && p.matches[2].home_extra_score,
                playoff_away_extra_score: p.matches[2] && p.matches[2].away_extra_score,
                home_playoff_win: p.matches[2] && p.matches[2].home_playoff_win,
                away_playoff_win: p.matches[2] && p.matches[2].away_playoff_win,
                playoff_notes: p.matches[2] && p.matches[2].playoff_notes,

                final: p.final,
            }
            bracketMatches.push(match)
        } else {
            bracketMatches.push({ name: p.name, blank: true, bracket_order: p.bracket_order })
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
