/* eslint-disable no-loop-func */
import Competitions from '../data/Competitions.json'
import NationArray from '../data/Nations.json'
import { getTournamentArray, getTournamentDataArray } from './DataHelper'
import { getTeams, getHostTeamArray } from './TeamHelper'
import {
    calculateGroupRankings,
    calculateKnockoutRankings,
    calculatePairRankings,
    sortGroup,
    sortGroup2,
    sortPositions,
    isPositionsTiebreaker,
    isAwayGoalsTiebreaker,
    isGoalRatioTiebreaker,
    accumulateRanking,
} from './RankingsHelper'
import { isHomeWinMatch } from './TeamHelper'

const standings_tiebreakers = ['points', 'goaldifference', 'goalsfor', 'penalties']

// ----------------------------- Competition ----------------------------------

export const getCompetitions = () => {
    return Competitions
}

export const getCompetition = (competition_id) => {
    const competition = getCompetitions().find((c) => c.id === competition_id)
    if (competition) {
        const tournaments = getTournamentArray().filter((t) => t.competition_id === competition_id)
        competition.teams = getTeams(competition.team_type_id, competition.all_members)
        competition.nations = NationArray
        tournaments.forEach((t, index) => {
            t.index = tournaments.length - index
            const tournamentData = getTournamentData(t.id)
            processSoccerTournament(tournamentData, { ...t, competition })
            t.data = tournamentData
        })
        competition.tournaments = tournaments
        collectAlltimeStandings(competition)
    }
    return competition
}

export const collectAlltimeStandings = (competition) => {
    if (!competition || !competition.tournaments) return
    let alltime_pools = []
    competition.tournaments.forEach((t) => {
        t.data.standing_rounds &&
            t.data.standing_rounds.forEach((sr) => {
                sr.pools &&
                    sr.pools.forEach((p) => {
                        p.rankings.forEach((r) => {
                            !p.withdrew && alltime_pools.push({ ...r, rankings: [r], year: t.year })
                        })
                    })
            })
    })
    const all_rankings = []
    alltime_pools.forEach((p) => {
        const parent_id = p.rankings[0].team.parent_team_id ? p.rankings[0].team.parent_team_id : p.rankings[0].id
        const ranking = all_rankings.find((r) => r.id === parent_id)
        const parent_team = competition.teams.find((t) => t.id === p.rankings[0].team.parent_team_id)
        const parent_ranking = p.rankings[0].team.parent_team_id
            ? { ...p.rankings[0], id: p.rankings[0].team.parent_team_id, team: parent_team }
            : { ...p.rankings[0] }
        parent_ranking.predecessor_rankings = [{ ...p.rankings[0], year: p.year }]
        if (ranking) {
            addStandings(ranking, p.rankings[0], {})
            ranking.predecessor_rankings.push({ ...p.rankings[0], year: p.year })
        } else {
            all_rankings.push(parent_ranking)
        }
    })
    all_rankings.forEach((r) => {
        const new_pr = []
        r.predecessor_rankings.forEach((pr) => {
            const ranking = new_pr.find((r2) => r2.id === pr.id)
            if (ranking) {
                addStandings(ranking, pr, {})
                ranking.yearFrom = pr.year
            } else {
                new_pr.push({ ...pr, yearTo: pr.year })
            }
        })
        r.predecessor_rankings = new_pr
    })

    competition.rankings = all_rankings
    const standings_config = { tiebreakers: standings_tiebreakers }
    sortGroup(competition, standings_config)
    let pool_rank = 0
    competition.pools.forEach((p) => {
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

    collectStandingRounds(tournament, config)
    processStandingRounds(tournament, config)
    processConsolationRounds(tournament, config)
    processFinalRounds(tournament, config)
    finalizeStandingRounds(tournament, config)
}

export const collectStandingRounds = (tournament, config) => {
    if (!tournament || !tournament.stages || !config) return
    const rounds = []
    const consolation_rounds = []
    tournament.stages.forEach((s) => {
        if (s.type === 'roundrobin_final') {
            // UNL
            if (config.position_league_rankings) {
                const position_pools = []
                s.groups.forEach((g) => {
                    g.rankings.forEach((r, index) => {
                        const final_r = g.final_standings_excluded ? g.final_standings_rankings.find((r2) => r2.id === r.id) : r
                        const ppool_name = s.name.includes('League') ? s.name + ' - Pos ' + (index + 1) : s.name
                        const ppool = position_pools.find((pp) => pp.pos === index + 1)
                        if (ppool) {
                            ppool.rankings.push(final_r)
                        } else {
                            position_pools.push({ pos: index + 1, name: ppool_name, rankings: [final_r] })
                        }
                    })
                })
                position_pools.forEach((pp) => {
                    rounds.push(pp)
                })
            } else {
                rounds.push(s)
            }
        } else if (s.type === 'knockout_') {
            s.paths &&
                s.paths.forEach((p) => {
                    if (p.name === 'Medal Path' || p.name === 'Gold Medal Path') {
                        p.rounds.forEach((r) => {
                            rounds.push({ ...r, type: s.type })
                        })
                    } else if (p.name === 'Consolation Path' || p.name === 'Silver and Bronze Medal Path') {
                        p.rounds.forEach((r) => {
                            consolation_rounds.push({ ...r, type: s.type })
                        })
                    }
                })
            s.rounds &&
                s.rounds.forEach((r) => {
                    rounds.push({ ...r, type: s.type })
                })
        } else if (s.type === 'pair_') {
            s.rounds.forEach((r) => {
                rounds.push({ ...r, type: s.type })
            })
        }
    })
    tournament.standing_rounds = rounds
    if (consolation_rounds.length > 0) {
        tournament.consolation_rounds = consolation_rounds
    }
}

export const processStandingRounds = (tournament, config) => {
    if (!tournament || !tournament.standing_rounds || !config) return

    let rounds = tournament.standing_rounds
    // UNL
    if (config.position_league_rankings) {
        for (var kk = 0; kk < rounds.length; kk++) {
            const standings_config = { ...config, tiebreakers: standings_tiebreakers }
            sortGroup(rounds[kk], standings_config)
        }
        const new_rounds = []
        rounds.forEach((r) => {
            if (!r.final) {
                new_rounds.push(r)
            } else {
                r.rankings = rounds[0].rankings
                new_rounds.unshift(r)
            }
        })
        new_rounds.splice(1, 1)
        rounds = new_rounds
    } else {
        for (var k = 0; k < rounds.length - 1; k++) {
            const remainedRankings = []
            if (rounds[k].next_round === rounds[k + 1].name) {
                if (rounds[k + 1].type === 'knockout_' && config.knockout_standing_tiebreakers) {
                    rounds[k + 1].rankings.forEach((r) => {
                        r.round_gd = r.gd
                        r.round_gf = r.gf
                        r.round_pts = r.pts
                    })
                }
                rounds[k].rankings.forEach((r1, index) => {
                    const rankingNextRound = rounds[k + 1].rankings.find((r2) => r2.id === r1.id)
                    if (rankingNextRound) {
                        addStandings(rankingNextRound, rounds[k].rankings[index], config)
                        if (rounds[k].rankings[index].team.point_deduction_notes) {
                            rankingNextRound.team.point_deduction = rounds[k].rankings[index].team.point_deduction
                            rankingNextRound.team.point_deduction_notes = rounds[k].rankings[index].team.point_deduction_notes
                        }
                    } else {
                        if (rounds[k].next_bye_round && rounds[k].next_bye_round === rounds[k + 2].name) {
                            const rankingNextByeRound = rounds[k + 2].rankings.find((r2) => r2.id === r1.id)
                            if (rankingNextByeRound) {
                                addStandings(rankingNextByeRound, rounds[k].rankings[index], config)
                            } else {
                                remainedRankings.push(rounds[k].rankings[index])
                            }
                        } else {
                            remainedRankings.push(rounds[k].rankings[index])
                        }
                    }
                })
            }
            rounds[k].rankings = remainedRankings

            let standings_config = { ...config, tiebreakers: standings_tiebreakers }
            // AAC2023
            // AFCON2013
            if (rounds[k].type === 'roundrobin_final' && config.group_standing_tiebreakers) {
                standings_config = { ...config, tiebreakers: config.group_standing_tiebreakers }
                if (isPositionsTiebreaker(standings_config)) {
                    sortPositions(rounds[k], standings_config)
                } else {
                    sortGroup(rounds[k], standings_config)
                }
                // AAC2023
                // AFCON2013
            } else if (rounds[k].type === 'knockout_' && config.knockout_standing_tiebreakers) {
                standings_config = { ...config, tiebreakers: config.knockout_standing_tiebreakers }
                sortGroup2(rounds[k], standings_config)
            } else {
                sortGroup(rounds[k], standings_config)
            }
        }
    }
    tournament.standing_rounds = rounds
}

export const processConsolationRounds = (tournament, config) => {
    if (!tournament || !tournament.standing_rounds || !tournament.consolation_rounds || !config) return

    let rounds = tournament.standing_rounds
    const consolation_rounds = tournament.consolation_rounds
    // Consolation path: MOFT1964
    if (config.id === 'MOFT1964' || config.id === 'MOFT1920') {
        const index = rounds.findIndex((r) => r.next_consolation_round)
        rounds.splice(index + 1, 0, consolation_rounds[0], consolation_rounds[1])
        if (consolation_rounds.length === 3) {
            rounds.splice(index + 3, 0, consolation_rounds[2])
        }

        const index2 = rounds.findIndex((r) => r.next_consolation_round)
        let remainedRankings = []
        rounds[index2].rankings.forEach((r1, index) => {
            const rankingNextRound = rounds[index2 + 1].rankings.find((r2) => r2.id === r1.id)
            if (rankingNextRound) {
                addStandings(rankingNextRound, rounds[index2].rankings[index], config)
            } else {
                remainedRankings.push(rounds[index2].rankings[index])
            }
        })
        rounds[index2].rankings = remainedRankings
        const standings_config = { ...config, tiebreakers: standings_tiebreakers }
        sortGroup(rounds[index2], standings_config)

        rounds[index2 + 1].rankings.forEach((r1, index) => {
            const rankingNextRound = rounds[index2 + 2].rankings.find((r2) => r2.id === r1.id)
            if (rankingNextRound) {
                addStandings(rankingNextRound, rounds[index2 + 1].rankings[index], config)
            } else {
                remainedRankings.push(rounds[index2 + 1].rankings[index])
            }
        })
        rounds[index2 + 1].rankings = remainedRankings
        sortGroup(rounds[index2 + 1], standings_config)

        let pools = []
        const fifthPlaceRound = rounds[index2 + 2]
        fifthPlaceRound.rankings.forEach((r) => {
            pools.push({ rankings: [r] })
        })
        fifthPlaceRound.pools = pools
        const fifthPlaceRoundStandings = [{}, {}]
        const fifthPlaceMatch = fifthPlaceRound.matches[0]
        if (fifthPlaceMatch) {
            const fifthPlace = isHomeWinMatch(fifthPlaceMatch) ? fifthPlaceMatch.home_team : fifthPlaceMatch.away_team
            const sixthPlace = isHomeWinMatch(fifthPlaceMatch) ? fifthPlaceMatch.away_team : fifthPlaceMatch.home_team
            fifthPlaceRound.pools.forEach((p) => {
                if (p.rankings[0].id === fifthPlace) {
                    fifthPlaceRoundStandings[0] = p
                }
                if (p.rankings[0].id === sixthPlace) {
                    fifthPlaceRoundStandings[1] = p
                }
            })
        }
        fifthPlaceRound.pools = fifthPlaceRoundStandings

        // MOFT1920
        if (config.id === 'MOFT1920') {
            rounds[index2 + 2].rankings.forEach((r1, index) => {
                const rankingNextRound = rounds[index2 + 3].rankings.find((r2) => r2.id === r1.id)
                if (rankingNextRound) {
                    addStandings(rankingNextRound, rounds[index2 + 2].rankings[index], config)
                }
            })
            pools = []
            rounds[index2 + 3].rankings.forEach((r) => {
                pools.push({ rankings: [r] })
            })
            rounds[index2 + 3].pools = pools

            // NED
            addStandings(rounds[5].pools[0].rankings[0], rounds[4].pools[1].rankings[0], config)
        }
    }
    tournament.standing_rounds = rounds
}

export const processFinalRounds = (tournament, config) => {
    if (!tournament || !tournament.standing_rounds || !config) return

    const rounds = tournament.standing_rounds
    // Final round
    const finalRound = config.position_league_rankings ? rounds[0] : rounds[rounds.length - 1]
    if (finalRound.championship) {
        const pools = []
        finalRound.rankings.forEach((r) => {
            pools.push({ rankings: [r] })
        })
        finalRound.pools = pools
        const finalRoundStandings = [{}, {}]
        if (finalRound.matches) {
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
                if (thirdPlaceMatch.shared_bronze) {
                    finalRound.pools.forEach((p) => {
                        if (p.rankings[0].id === thirdPlaceMatch.home_team) {
                            p.rankings[0].third_place = true
                            p.rankings[0].shared_bronze = true
                            p.rankings[0].shared_bronze_notes = thirdPlaceMatch.shared_bronze_notes
                            finalRoundStandings[2] = p
                        }
                        if (p.rankings[0].id === thirdPlaceMatch.away_team) {
                            p.rankings[0].third_place = true
                            p.rankings[0].shared_bronze = true
                            p.rankings[0].shared_bronze_notes = thirdPlaceMatch.shared_bronze_notes
                            finalRoundStandings[3] = p
                        }
                    })
                } else {
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
            }
        }
        if (finalRound.pairs) {
            const finalPair = finalRound.pairs.find((p) => p.final)
            if (finalPair) {
                const champion = isHomeWinPair(finalPair, config) ? finalPair.matches[0].home_team : finalPair.matches[0].away_team
                const runner_up = isHomeWinPair(finalPair, config) ? finalPair.matches[0].away_team : finalPair.matches[0].home_team
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
}

export const finalizeStandingRounds = (tournament, config) => {
    if (!tournament || !tournament.standing_rounds || !config) return

    const rounds = tournament.standing_rounds
    const excludedSemiFinal = []
    rounds.forEach((r, index) => {
        if ((r.name !== 'Semi-finals' && r.name !== 'Relegation play-outs') || config.no_third_place || config.id === 'MOFT1908') {
            excludedSemiFinal.push(r)
        } else if (r.name === 'Relegation play-outs') {
        } else {
            const final = rounds[index + 1]
            if (final.name === 'Final') {
                // UNL
                if (config.position_league_rankings) {
                    let pools = []
                    r.rankings.forEach((r) => {
                        pools.push({ rankings: [r] })
                    })
                    r.pools = pools
                    pools = []
                    final.rankings.forEach((r) => {
                        pools.push({ rankings: [r] })
                    })
                    final.pools = pools
                }
                r.pools.forEach((p, index) => {
                    if (index === 0) {
                        p.rankings[0].third_place = true
                    }
                    final.pools.push(p)
                })
            }
        }
    })

    tournament.standing_rounds = config.position_league_rankings ? excludedSemiFinal : excludedSemiFinal.reverse()
    if (config.id === 'MOFT1920') {
        customAdjustMOFT1920(tournament.standing_rounds)
    }
    if (config.id === 'MOFT1908') {
        customAdjustMOFT1908(tournament.standing_rounds)
    }
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
        calculatePairRankings(stage, config)
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
            const playoffMatchday = g.matchdays.find((md) => md.name === 'Play-off')
            const playoff = playoffMatchday && playoffMatchday.matches.find((m) => m.group_playoff)
            let new_r = { ...r }
            delete new_r.advanced
            if (playoff) {
                accumulateRanking(new_r, playoffMatchday.matches, { ...config, group_playoff_override: true })
            }
            if (new_r.pts === -1) {
                new_r.withdrew = true
            }
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

export const customAdjustMOFT1920 = (standing_rounds) => {
    const tch = standing_rounds[0].pools.find((p) => p.rankings[0].id === 'TCH_U23MNT')
    tch.rankings[0].disqualified = true
    tch.rankings[0].disqualified_notes =
        'Czechoslovakia walked off the field in the 40th minute of the final to protest the officiating and then was ejected from the competition.'
    delete tch.rankings[0].runner_up
    standing_rounds[0].pools.splice(1, 1)
    standing_rounds[5].pools.push(tch)

    const esp = standing_rounds[1].pools.find((p) => p.rankings[0].id === 'ESP-1875-1931_U23MNT')
    esp.rankings[0].runner_up = true
    standing_rounds[1].pools.splice(0, 1)
    standing_rounds[2].pools.splice(0, 1)
    standing_rounds[0].pools.splice(1, 0, esp)

    // NED
    standing_rounds[1].pools.splice(0, 1)

    const swe = standing_rounds[3].pools.find((p) => p.rankings[0].id === 'SWE_U23MNT')
    standing_rounds[3].pools.splice(0, 1)
    standing_rounds[2].pools.splice(1, 0, swe)

    const fra = standing_rounds[0].pools.find((p) => p.rankings[0].id === 'FRA_U23MNT')
    standing_rounds[0].pools.splice(3, 1)
    standing_rounds[2].pools.splice(2, 0, fra)

    const nor = standing_rounds[3].pools.find((p) => p.rankings[0].id === 'NOR_U23MNT')
    standing_rounds[3].pools.splice(0, 1)
    standing_rounds[2].pools.splice(3, 0, nor)

    standing_rounds[2].name = 'Play-offs'
}

export const customAdjustMOFT1908 = (standing_rounds) => {
    const swe = standing_rounds[0].pools.find((p) => p.rankings[0].id === 'SWE_U23MNT')
    swe.rankings[0].mp = 2
    swe.rankings[0].l = 2
    swe.rankings[0].gf = 1
    swe.rankings[0].ga = 14
    swe.rankings[0].gd = -13
    standing_rounds[2].pools.splice(1, 1)
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
