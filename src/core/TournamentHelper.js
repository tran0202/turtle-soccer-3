import Competitions from '../data/Competitions.json'
import NationArray from '../data/Nations.json'
import { getTournamentArray, getTournamentDataArray } from './DataHelper'
import { getTeams, getHostTeamArray } from './TeamHelper'

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
    tournament.competition.nations = NationArray

    tournament.previous_tournament = getPreviousTournament(tournament.competition.tournaments, id)
    tournament.next_tournament = getNextTournament(tournament.competition.tournaments, id)

    const tournamentData = getTournamentData(id)
    processSoccerTournament(tournamentData, tournament)

    return { tournament: tournamentData, config: tournament }
}

export const processSoccerTournament = (tournament, config) => {
    if (!tournament || !config) return
    const teamArray = config.competition.teams
    const qualifiedTeams = getHostTeamArray(config)
    tournament.qualifiedTeams = qualifiedTeams
    // const qualifications = []
    // config.qualifications.forEach((q) => {
    //     const result = processTournament(q, teamArray, qualifiedTeams, config)
    //     qualifications.push({ id: q.id, draws: result.draws, stages: result.stages })
    // })
    processFinal(teamArray, qualifiedTeams, config)
    // return qualifications
}

export const processFinal = (teamArray, qualifiedTeams, config) => {
    if (!config) return
    processTournament(config, teamArray, qualifiedTeams, config)
}

export const processTournament = (tournament, teamArray, qualifiedTeams, config) => {
    if (!tournament) return
    // const draws = createDraws(tournament, teamArray, qualifiedTeams)
    // const stages = createPots(tournament, draws)
    processStages(tournament, qualifiedTeams, config)
    // return { draws, stages }
}

export const processStages = (tournament, qualifiedTeams, config) => {
    if (!tournament || !tournament.stages) return
    tournament.stages.forEach((s) => {
        // preparePots(s)
        // createDrawPotTable(s)
        createStage(s, config)
        // const nextStage = getNextStage(s, tournament, config)
        // finishStage(s, nextStage)
        // qualifyStage(tournament, s, qualifiedTeams, nextStage)
    })
}

export const createStage = (stage, config) => {
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
        // if (!stage.type.includes('_nopot')) {
        //     createGroups(stage)
        // } else {
        //     createSingleGroup(stage)
        // }
        createGroupMatches(stage)
        // calculateGroupRankings(stage, config)
    }
    // if (stage.type.includes('knockout_')) {
    //     initEntrants(stage)
    //     processPathRounds(stage)
    // }
}

export const createGroupMatches = (stage) => {
    if (!stage || !stage.groups) return
    stage.groups.forEach((g) => {
        const startingMatchdays = stage.matchdays ? stage.matchdays : g.matchdays ? g.matchdays : []
        g.matchdays = []
        startingMatchdays.forEach((md) => {
            // const new_matchday = { name: md.name, date: md.date }
            // const matches = []
            // md.matches.forEach((m) => {
            //     const home_team = g.teams.find((t) => t.pos === m.home_pos)
            //     const away_team = g.teams.find((t) => t.pos === m.away_pos)
            //     if (home_team && away_team) {
            //         const new_match = { date: md.date, home_team: home_team.id, away_team: away_team.id }
            //         getRandomScore(new_match)
            //         matches.push(new_match)
            //     }
            // })
            // new_matchday.matches = matches
            // g.matchdays.push(new_matchday)
        })
    })
    // overwriteGroup(stage.groups[0])
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
