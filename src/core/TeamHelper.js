import React from 'react'
import randomInteger from 'random-int'
import Confederations from '../data/Confederations.json'
import Competitions from '../data/Competitions.json'
import Tournament from '../data/Tournament.json'
import NationArray from '../data/Nations.json'
import TeamArray from '../data/Teams.json'
import ClubArray from '../data/Clubs.json'
import ThirdPlaceCombination from '../data/ThirdPlaceCombination.json'
import { getTournamentArray } from './DataHelper'
import { calculateGroupRankings } from './RankingsHelper'

export const getTeamArray = () => {
    return [].concat(TeamArray, ClubArray)
}

export const setFIFAMember = () => {
    NationArray.forEach((n) => {
        n.fifa_member = !n.not_fifa_member ? true : false
    })
}

export const getTeams = (team_type_id, all_member) => {
    setFIFAMember()
    const result = []
    getTeamArray().forEach((t) => {
        const foundNation = NationArray.find((n) => t.nation_id === n.id && (all_member || n.fifa_member) && t.team_type_id === team_type_id)
        if (foundNation) {
            t.nation = foundNation
            const foundConf = getConfederations().find((c) => foundNation.confederation_id === c.id)
            if (foundConf) {
                t.confederation = foundConf
            }
            result.push(t)
        }
    })
    return result
}

export const getActiveTeams = (team_type_id) => {
    setFIFAMember()
    const result = []
    getTeamArray().forEach((t) => {
        const foundNation = NationArray.find((n) => t.nation_id === n.id && n.end_date === '' && n.fifa_member && t.team_type_id === team_type_id)
        if (t.parent_team_id === '' && foundNation) {
            t.nation = foundNation
            const foundConf = getConfederations().find((c) => foundNation.confederation_id === c.id)
            if (foundConf) {
                t.confederation = foundConf
            }
            result.push(t)
        }
    })
    return result
}

export const getNonFIFATeams = (team_type_id) => {
    setFIFAMember()
    const result = []
    getTeamArray().forEach((t) => {
        const foundNation = NationArray.find((n) => t.nation_id === n.id && n.end_date === '' && !n.fifa_member && t.team_type_id === team_type_id)
        if (t.parent_team_id === '' && foundNation) {
            t.nation = foundNation
            const foundConf = getConfederations().find((c) => foundNation.confederation_id === c.id)
            if (foundConf) {
                t.confederation = foundConf
            }
            result.push(t)
        }
    })
    return result
}

// this includes FIFA
export const getConfederations = () => {
    return Confederations
}

export const getRegionalConfederations = () => {
    return getConfederations().filter((c) => c.id !== 'FIFA')
}

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
    }
    return competition
}

export const getConfederationOrganization = () => {
    const confederations = getConfederationCompetitions()
    confederations.forEach((c) => {
        const teamTypeId = 'MNT'
        const teams = getActiveTeams(teamTypeId)
        c.teams = teams.filter((t) => t.confederation.id === c.id)
        if (c.id === 'FIFA') c.teams = teams

        c.teams.sort((a, b) => {
            return a.name > b.name ? 1 : -1
        })

        c.pots = []
        let pot_index = 0
        c.teams.forEach((t, index) => {
            t.index = index + 1
            if (!c.pots[pot_index]) {
                c.pots.push({ id: pot_index + 1, teams: [t] })
            } else {
                c.pots[pot_index].teams.push(t)
            }
            if (c.teams.length > 11 && index + 1 === (pot_index + 1) * Math.ceil(c.teams.length / 4)) {
                pot_index++
            }
        })
        const nonFIFATeams = getNonFIFATeams(teamTypeId)
        c.non_fifa_teams = nonFIFATeams.filter((t) => t.confederation.id === c.id)
        c.non_fifa_teams.sort((a, b) => {
            return a.name > b.name ? 1 : -1
        })
        c.non_fifa_teams.forEach((t, index) => {
            t.index = index + 1
        })
    })
    return confederations
}

export const getConfederationCompetitions = () => {
    const confederations = getConfederations()
    confederations.forEach((c) => {
        c.competitions = getCompetitions().filter((c2) => c2.confederation_id === c.id)
    })
    return confederations
}

export const getTeamName = (id, config) => {
    if (!id || !config || !config.teams) return
    const team = config.teams.find((t) => t.id === id)
    if (team) {
        return team.name
    }
}

export const getShortTeamName = (id, config) => {
    if (!id || !config || !config.teams) return
    const team = config.teams.find((t) => t.id === id)
    if (team) {
        if (team.short_name) return team.short_name
        else return team.name
    } else {
        console.log('Team error', team)
    }
}

export const getBoldText = (text, replace) => {
    if (!text) return
    if (text.includes(replace)) {
        return (
            <React.Fragment>
                <React.Fragment>
                    <span className="font-bold">{replace}</span>
                </React.Fragment>
                {text.replace(replace, '')}
            </React.Fragment>
        )
    } else {
        return <React.Fragment>{text}</React.Fragment>
    }
}

export const getConfederationLogo = (t) => {
    if (!t || !t.confederation) return
    return (
        <React.Fragment>
            <img
                className="conf-logo-sm margin-bottom-xs-4"
                src={'/images/confederation_logos/' + t.confederation.logo_filename}
                alt={`${t.confederation.name}`}
                title={`${t.confederation.name}`}
            />
        </React.Fragment>
    )
}

export const getTeamFlag = (t) => {
    if (!t || !t.nation) return
    return (
        <React.Fragment>
            {t.team_type_id !== 'CLUB' && (
                <img
                    className="flag-sm flag-md margin-bottom-xs-4"
                    src={'/images/flags/' + t.nation.flag_filename}
                    alt={`${t.id} ${t.nation.official_name}`}
                    title={`${t.id} ${t.nation.official_name}`}
                />
            )}
        </React.Fragment>
    )
}

export const getTeamFlagId = (id, config) => {
    if (!id || !config) return
    const team = config.teams.find((t) => t.id === id)
    if (!team) return
    return (
        <React.Fragment>
            {config.team_type_id !== 'CLUB' && (
                <img
                    className="flag-sm flag-md margin-bottom-xs-4"
                    src={'/images/flags/' + team.nation.flag_filename}
                    alt={`${id} ${team.nation.name} ${team.nation.official_name}`}
                    title={`${id} ${team.nation.name} ${team.nation.official_name}`}
                />
            )}
            {config.team_type_id === 'CLUB' && (
                <React.Fragment>
                    <img className="flag-club-sm flag-club-md" src={`/images/${config.logo_path}/${team.logo_filename}`} alt={id} title={id} />{' '}
                    <img
                        className="flag-xs-2 flag-sm-2"
                        src={`/images/flags/${team.nation.flag_filename}`}
                        alt={`${team.nation_id} ${team.nation.name} ${team.nation.official_name}`}
                        title={`${team.nation_id} ${team.nation.name} ${team.nation.official_name}`}
                    />
                </React.Fragment>
            )}
        </React.Fragment>
    )
}

export const getBracketTeamFlagId = (id, config) => {
    if (!id || !config) return
    const team = config.teams.find((t) => t.id === id)
    if (!team) return
    return (
        <React.Fragment>
            {config.team_type_id !== 'CLUB' && (
                <img
                    className="bracket-flag-sm margin-bottom-xs-4"
                    src={'/images/flags/' + team.nation.flag_filename}
                    alt={`${id} ${team.nation.official_name}`}
                    title={`${id} ${team.nation.official_name}`}
                />
            )}
        </React.Fragment>
    )
}

export const getTeamFlagName = (t) => {
    if (!t) return
    return (
        <React.Fragment>
            {getTeamFlag(t)}
            <span className="padding-top-xs">&nbsp;{t.name}</span>
        </React.Fragment>
    )
}

export const getFlagSrc = (id) => {
    if (!id) return
    const team = getTeamArray().find((t) => t.id === id)
    if (team) {
        const nation = NationArray.find((n) => n.id === team.nation_id)
        if (nation) {
            return '/images/flags/' + nation.flag_filename
        } else {
            console.log('Nation error', nation)
        }
    } else {
        console.log('Team error', team)
    }
}

export const getTournament = () => {
    return Tournament
}

export const getConfederation = (id) => {
    const result = getConfederations().find((c) => c.id === id)
    return result ? result : {}
}

export const randomHostIndex = (count, confederation_id) => {
    if (!confederation_id) return
    let result = []
    const conf = getConfederation(confederation_id)
    while (result.length !== count) {
        const randomIndex = randomInteger(0, conf.fifa_member_count - 1)
        const found = result.find((i) => i + 1 === randomIndex + 1)
        if (!found) {
            result.push(randomIndex)
        }
    }
    return result
}

export const getRandomHostTeamArray = (teamArray, config) => {
    if (!teamArray || !config || !config.details) return
    const result = []
    const confederation_id = config.details.host.confederation_id
    const teams = teamArray.filter((t) => t.confederation && t.confederation.id === confederation_id)
    const host_count = config.details.host.teams.length
    teams.length >= host_count &&
        randomHostIndex(host_count, confederation_id).forEach((i) => {
            const team = { ...teams[i], qualification_method: 'Hosts', qualification_date: '2023-02-14' }
            result.push(team)
        })
    return result
}

export const getRandomRankings = (teamArray) => {
    const result = [],
        pool = []
    teamArray.forEach((t) => {
        const randomPoint = randomInteger(0, 200000) / 100
        const found = pool.find((t) => t.points === randomPoint)
        if (!found) {
            pool.push({ teams: [{ ...t }], points: randomPoint })
        } else {
            found.teams.push(t)
        }
    })
    pool.sort((a, b) => {
        return a.points > b.points ? -1 : 1
    })
    let rank = 0
    let firstInPool = true
    pool.forEach((t) => {
        firstInPool = true
        let tie_rank = 0
        t.teams.forEach((t2) => {
            rank = rank + 1
            if (firstInPool) {
                tie_rank = rank
                result.push({ rank, tie_rank, ...t2, points: t.points })
                firstInPool = false
            } else {
                result.push({ rank: '--', tie_rank, ...t2, points: t.points })
            }
        })
    })
    return result
}

export const processSoccerTournament = (teamArray, qualifiedTeams, config) => {
    if (!config || !config.qualifications) return
    const qualifications = []
    config.qualifications.forEach((q) => {
        const result = processTournament(q, teamArray, qualifiedTeams, config)
        qualifications.push({ id: q.id, draws: result.draws, stages: result.stages })
    })
    processFinal(teamArray, qualifiedTeams, config)
    return qualifications
}

export const processFinal = (teamArray, qualifiedTeams, config) => {
    if (!config) return
    processTournament(config, teamArray, qualifiedTeams, config)
}

export const processTournament = (tournament, teamArray, qualifiedTeams, config) => {
    if (!tournament) return
    const draws = createDraws(tournament, teamArray, qualifiedTeams)
    const stages = createPots(tournament, draws)
    processStages(tournament, qualifiedTeams, config)
    return { draws, stages }
}

export const createDraws = (tournament, teamArray, qualifiedTeams) => {
    if (!tournament) return
    const draws = []
    tournament.draws &&
        tournament.draws.forEach((d) => {
            const allRankings = getRandomRankings(teamArray)
            const bannedTeams = tournament.banned
            const confRankings =
                tournament.confederation_id !== 'FIFA'
                    ? getConfederationRankings(allRankings, tournament.id, qualifiedTeams, bannedTeams)
                    : tournament.final
                    ? getFinalRankings(allRankings, qualifiedTeams)
                    : allRankings
            draws.push({ ...d, rankings: confRankings })
            d.rankings = confRankings
        })
    return draws
}

export const getFinalRankings = (teamArray, qualifiedTeams) => {
    const result = []
    qualifiedTeams.forEach((t) => {
        const team = teamArray.find((t2) => t2.id === t.id)
        if (team) {
            result.push(team)
        }
    })
    result.sort((a, b) => {
        return a.points > b.points ? -1 : 1
    })
    result.forEach((t, index) => {
        t.conf_rank = index + 1
        t.draw_seed = index + 1
    })
    return result
}

export const getConfederationRankings = (teamArray, confederation_id, qualifiedTeams, bannedTeams) => {
    const result = []
    const confRankings = teamArray.filter((t) => t.confederation && t.confederation.id === confederation_id)

    let count = 0
    confRankings.forEach((t) => {
        if (!qualifiedTeams.find((t2) => t2.id === t.id)) {
            if (!bannedTeams || (bannedTeams && !bannedTeams.find((t3) => t3.id === t.id))) {
                count++
                t.conf_rank = count
                t.draw_seed = count
                result.push(t)
            }
        }
    })
    return result
}

// Pre-existing Pots being made based on pre-determined rankings.
export const createPots = (tournament, draws) => {
    if (!tournament || !tournament.stages) return
    const stages = []
    tournament.stages.forEach((s) => {
        const stageDraw = draws.find((d) => d.id === s.draw_id)
        s.draw = stageDraw
        if (s.pots) {
            const stageRankings = getPotInfo(s.draw.rankings, s.pots)
            s.pots.forEach((p) => {
                const rankings = []
                stageRankings.forEach((t) => {
                    if (t.draw_pot === p.name) {
                        rankings.push(t)
                    }
                })
                p.rankings = rankings
            })
        }
        stages.push(s)
    })
    return stages
}

export const getPotInfo = (rankingArray, pots) => {
    if (!rankingArray || !pots) return
    const result = []
    rankingArray.forEach((t) => {
        const foundPot = pots.find((p) => p.rankingFrom <= t.conf_rank && t.conf_rank <= p.rankingTo)
        const foundIndex = pots.findIndex((p) => p.rankingFrom <= t.conf_rank && t.conf_rank <= p.rankingTo)
        if (foundPot) {
            const draw_striped = foundIndex % 2 === 0 ? true : false
            result.push({ ...t, draw_pot: foundPot.name, draw_striped })
        }
    })
    return result
}

export const processStages = (tournament, qualifiedTeams, config) => {
    if (!tournament || !tournament.stages) return
    tournament.stages.forEach((s) => {
        preparePots(s)
        createDrawPotTable(s)
        createStage(s, config)
        const nextStage = getNextStage(s, tournament, config)
        finishStage(s, nextStage)
        qualifyStage(tournament, s, qualifiedTeams, nextStage)
    })
}

// Place teams into pots
export const preparePots = (stage) => {
    if (!stage || !stage.type) return
    if (stage.type.includes('_oddpot')) {
        prepareOddPot(stage)
    }
    if (stage.type.includes('_evenpot') || stage.type.includes('_noshowpot')) {
        prepareEvenPot(stage)
    }
    if (stage.type.includes('_outsidepot')) {
        prepareOutsidePot(stage)
    }
}

// Some Pots already existed. New Pots being made from entering teams.
// 10 teams from 1st round go to Pot 4. 9 of them will be drawn to groups. The last (10th) team moves to Pot 3.
// type = roundrobin_oddpot
export const prepareOddPot = (stage) => {
    if (!stage || !stage.entrants_placement || !stage.entrants) return
    stage.entrants_placement.forEach((p) => {
        const foundPot = stage.pots.find((p2) => p2.name === p.name)
        const newPot = {}
        newPot.rankings = []
        for (var i = 0; i < p.count; i++) {
            const notDrawnTeams = stage.entrants.filter((t) => !t.already_drawn)
            notDrawnTeams.forEach((t, index) => {
                t.temp_index = index
            })
            const randomIndex = randomInteger(0, notDrawnTeams.length - 1)
            const team = notDrawnTeams.find((t) => t.temp_index === randomIndex)
            if (team) {
                team.already_drawn = true
                if (!foundPot) {
                    newPot.name = p.name
                    newPot.rankings.push(team)
                } else {
                    foundPot.rankings.push(team)
                }
            }
        }
        if (!foundPot) {
            newPot.rankings.sort((a, b) => {
                return a.rank > b.rank ? 1 : -1
            })
            stage.pots.push(newPot)
        }
    })
}

// New Pots being made solely from entering teams
// 18 teams advanced from 2nd round, drawn into 3 groups of 6.
// type = roundrobin_evenpot
export const prepareEvenPot = (stage) => {
    if (!stage || !stage.entrants_placement || !stage.entrants || !stage.draw) return
    // console.log('stage.entrants:', stage.entrants)
    const stageTeams = []
    stage.entrants.forEach((t) => {
        const foundTeam = stage.draw.rankings.find((t2) => t2.id === t.id)
        if (foundTeam) {
            stageTeams.push({ ...foundTeam })
        }
    })
    stageTeams.sort((a, b) => {
        const tempARank = a.rank !== '' ? a.rank : 1000
        const tempBRank = b.rank !== '' ? b.rank : 1000
        return tempARank > tempBRank ? 1 : -1
    })
    stageTeams.forEach((t, index) => {
        t.draw_seed = index + 1
    })
    stage.entrants = stageTeams
    const pots = []
    stage.entrants_placement.forEach((p, index) => {
        const foundTeams = stageTeams.filter((t) => p.rankingFrom <= t.draw_seed && t.draw_seed <= p.rankingTo)
        if (foundTeams) {
            if (index % 2 === 0) {
                foundTeams.forEach((t) => (t.draw_striped = true))
            }
            pots.push({ ...p, rankings: foundTeams })
        }
    })
    stage.pots = pots
}

export const prepareOutsidePot = (stage) => {
    if (!stage) return
    prepareEvenPot(stage)
    const temp = []
    stage.draw.rankings.forEach((t) => {
        if (!stage.last_stage_winners.find((t2) => t2.id === t.id) && !stage.entrants.find((t3) => t3.id === t.id)) {
            temp.push(t)
        }
    })
    const outside = []
    for (var i = 0; i < stage.outside_entrants.count; i++) {
        outside.push({ ...temp[i], draw_seed: stage.outside_entrants.name + (i + 1) })
    }
    stage.pots.push({ name: stage.outside_entrants.name, rankings: outside })
}

export const createDrawPotTable = (stage) => {
    if (!stage) return
    stage.drawPotRows = []
    let dpr = []
    stage.pots &&
        stage.pots.forEach((p, index) => {
            if (index % 3 !== 2) {
                dpr.push(p)
                if (index === stage.pots.length - 1) {
                    stage.drawPotRows.push(dpr)
                }
            } else {
                dpr.push(p)
                stage.drawPotRows.push(dpr)
                dpr = []
            }
        })
}

export const createStage = (stage, config) => {
    if (!stage || !stage.type) return
    if (stage.type.includes('pair')) {
        if (stage.type.includes('_drawpair') || stage.type.includes('_noshowpot')) {
            stage.groups = []
            createPairs(stage)
        }
        if (stage.type.includes('_predetpair')) {
            createPreDeterminedPairs(stage)
        }
        createPairMatches(stage)
        calculatePairAggregateScore(stage)
    }
    if (stage.type.includes('roundrobin_')) {
        if (!stage.type.includes('_nopot')) {
            createGroups(stage)
        } else {
            createSingleGroup(stage)
        }
        createGroupMatches(stage)
        calculateGroupRankings(stage, config)
    }
    if (stage.type.includes('knockout_')) {
        initEntrants(stage)
        processPathRounds(stage)
    }
}

export const createPairs = (stage) => {
    if (!stage || !stage.pots || stage.pots.length !== 2) return
    const pot1 = stage.pots[0]
    const pot2 = stage.pots[1]
    if (pot1.rankings.length !== pot2.rankings.length) return
    pot1.rankings.forEach((t) => {
        t.already_drawn = false
    })
    pot2.rankings.forEach((t) => {
        t.already_drawn = false
    })
    while (!pot1.rankings.every((t) => t.already_drawn) && !pot2.rankings.every((t) => t.already_drawn)) {
        const pot1NotDrawn = pot1.rankings.filter((t) => !t.already_drawn)
        const pot2NotDrawn = pot2.rankings.filter((t) => !t.already_drawn)
        pot1NotDrawn.forEach((t, index) => {
            t.temp_index = index
        })
        pot2NotDrawn.forEach((t, index) => {
            t.temp_index = index
        })
        const randomIndex1 = randomInteger(0, pot1NotDrawn.length - 1)
        const randomIndex2 = randomInteger(0, pot2NotDrawn.length - 1)
        const team1 = pot1NotDrawn.find((t) => t.temp_index === randomIndex1)
        const team2 = pot2NotDrawn.find((t) => t.temp_index === randomIndex2)
        if (team1 && team2) {
            team1.already_drawn = true
            team2.already_drawn = true
            stage.groups.push({
                name: team1.id + '-' + team2.id,
                teams: [
                    { ...team1, pos: 1 },
                    { ...team2, pos: 2 },
                ],
            })
        }
    }
}

export const createPreDeterminedPairs = (stage) => {
    if (!stage || !stage.groups) return
    stage.groups.forEach((g) => {
        const newTeams = []
        g.teams.forEach((t) => {
            const foundTeam = stage.draw.rankings.find((t2) => t2.conf_rank === t.conf_rank)
            if (foundTeam) {
                newTeams.push({ ...foundTeam, pos: t.pos })
            }
        })
        g.teams = newTeams
    })
    stage.groups.forEach((g) => {
        if (g.teams) g.name = g.teams[0].id + '-' + g.teams[1].id
    })
}

export const createGroups = (stage) => {
    if (!stage || !stage.pots) return
    stage.pots.forEach((p) => {
        p.rankings.forEach((t) => {
            t.already_drawn = false
        })
    })
    if (!stage.groups) {
        stage.groups = []
        for (var n = 0; n < stage.group_count; n++) {
            const new_group = { name: String.fromCharCode(65 + n), teams: [] }
            stage.groups.push(new_group)
        }
    } else {
        stage.groups.forEach((g) => {
            g.teams = []
        })
    }
    let pos = 0
    const isUEFA = stage.pots[0].rankings.length === 12
    for (var m = 0; m < stage.pots.length; m++) {
        let group_index = 0
        if (isUEFA && m === 4) {
            group_index = 6
        }
        while (stage.pots[m].rankings.some((t) => !t.already_drawn)) {
            const notDrawnTeams = stage.pots[m].rankings.filter((t) => !t.already_drawn)
            notDrawnTeams.forEach((t, index) => {
                t.temp_index = index
            })
            const randomIndex = randomInteger(0, notDrawnTeams.length - 1)
            const team = notDrawnTeams.find((t) => t.temp_index === randomIndex)
            if (team) {
                team.already_drawn = true
                const new_team = { ...team, pos: pos + 1 }
                stage.groups[group_index].teams.push(new_team)
            }
            group_index++
            if (group_index === stage.group_count) {
                group_index = 0
                pos++
            }
        }
    }
}

export const createSingleGroup = (stage) => {
    if (!stage || !stage.draw) return
    stage.groups = []
    stage.groups.push({ name: 'A', teams: stage.draw.rankings })
    stage.groups[0].teams.forEach((t, index) => (t.pos = index + 1))
    stage.entrants = stage.groups[0].teams
}

export const createPairMatches = (stage) => {
    if (!stage || !stage.groups) return
    stage.groups.forEach((g) => {
        g.matches = []
        stage.matchdays.forEach((md, index) => {
            md.matches.forEach((m) => {
                const home_team = g.teams.find((t) => t.pos === m.home_pos)
                const away_team = g.teams.find((t) => t.pos === m.away_pos)
                const new_match = { matchday: md.name, date: md.date, home_team: home_team.id, away_team: away_team.id }
                getRandomScore(new_match)
                if (index === 1) {
                    const match1 = g.matches[0]
                    if (match1.home_score === new_match.home_score && match1.away_score === new_match.away_score) {
                        getRandomExtraScore(new_match)
                        if (new_match.home_extra_score === new_match.away_extra_score) {
                            getRandomPenaltyScore(new_match)
                            while (new_match.home_penalty_score === new_match.away_penalty_score) {
                                getRandomPenaltyScore(new_match)
                            }
                        }
                    }
                }
                g.matches.push(new_match)
            })
        })
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
                    getRandomScore(new_match)
                    matches.push(new_match)
                }
            })
            new_matchday.matches = matches
            g.matchdays.push(new_matchday)
        })
    })
    overwriteGroup(stage.groups[0])
}

export const getRandomPenaltyScore = (match) => {
    match.home_penalty_score = randomInteger(0, 5)
    match.away_penalty_score = randomInteger(0, 5)
}

export const getRandomExtraScore = (match) => {
    match.home_extra_score = randomInteger(0, 3)
    match.away_extra_score = randomInteger(0, 3)
}

export const getRandomScore = (match) => {
    match.home_score = randomInteger(0, 3)
    match.away_score = randomInteger(0, 3)
}

export const getKnockoutScore = (match) => {
    if (!match) return
    getRandomScore(match)
    if (match.home_score !== match.away_score) return
    getRandomExtraScore(match)
    if (match.home_extra_score !== match.away_extra_score) return
    getRandomPenaltyScore(match)
    while (match.home_penalty_score === match.away_penalty_score) {
        getRandomPenaltyScore(match)
    }
}

export const calculatePairAggregateScore = (stage) => {
    if (!stage || !stage.groups) return
    stage.groups.forEach((g) => {
        if (g.matches && g.matches.length === 2) {
            const home_extra_score = g.matches[1].away_extra_score ? g.matches[1].away_extra_score : 0
            const away_extra_score = g.matches[1].home_extra_score ? g.matches[1].home_extra_score : 0
            g.agg_home_score = g.matches[0].home_score + g.matches[1].away_score + home_extra_score
            g.agg_away_score = g.matches[0].away_score + g.matches[1].home_score + away_extra_score
            const ihwp = isHomeWinPair(g)
            g.agg_winner = ihwp ? 'home' : 'away'
            const winTeam = g.teams.find((t) => t.id === (ihwp ? g.matches[0].home_team : g.matches[0].away_team))
            if (winTeam) winTeam.advanced = true
        }
    })
}

export const isHomeWinPair = (group) => {
    if (!group || !group.matches || group.matches.length !== 2) return
    const match1_home_score = group.matches[0].home_score
    const match1_away_score = group.matches[0].away_score
    const match2_home_score = group.matches[1].home_score
    const match2_away_score = group.matches[1].away_score
    const match2_home_extra_score = group.matches[1].home_extra_score ? group.matches[1].home_extra_score : 0
    const match2_away_extra_score = group.matches[1].away_extra_score ? group.matches[1].away_extra_score : 0
    const match2_home_penalty_score = group.matches[1].home_penalty_score ? group.matches[1].home_penalty_score : 0
    const match2_away_penalty_score = group.matches[1].away_penalty_score ? group.matches[1].away_penalty_score : 0
    const agg_home_score = match1_home_score + match2_away_score + match2_away_extra_score
    const agg_away_score = match1_away_score + match2_home_score + match2_home_extra_score
    if (agg_home_score > agg_away_score) return true
    else if (agg_home_score === agg_away_score) {
        if (match2_away_score > match1_away_score) {
            group.away_goal_winner = 'home'
            return true
        } else if (match2_away_score === match1_away_score) {
            if (match2_away_penalty_score > match2_home_penalty_score) return true
        } else {
            group.away_goal_winner = 'away'
        }
    }
    return false
}

export const isHomeWinMatch = (match) => {
    if (!match) return
    if (match.away_team === 'BYE') return true
    if (match.home_team === 'BYE') return false
    if (match.home_score > match.away_score) return true
    if (match.home_score === match.away_score) {
        if (match.home_extra_score > match.away_extra_score) return true
        if (match.home_extra_score === match.away_extra_score) {
            if (match.home_penalty_score > match.away_penalty_score) return true
        }
    }
    return false
}

export const initEntrants = (stage) => {
    if (!stage) return
    if (stage.rounds) {
        initEntrantsRound(stage)
    }
    if (stage.paths) {
        if (!stage.type.includes('_outsidepot')) {
            initEntrantsPath(stage)
        } else {
            initEntrantsPathOutside(stage)
        }
    }
}

export const initEntrantsRound = (stage) => {
    if (!stage || !stage.rounds) return
    if (!stage.entrants) {
        const stageEntrants = stage.draw.rankings.filter(
            (t) => stage.entrants_placement[0].rankingFrom <= t.conf_rank && t.conf_rank <= stage.entrants_placement[0].rankingTo,
        )
        stage.entrants = stageEntrants
    }
    if (stage.inter_confederation_playoff) {
        const newEntrants = []
        stage.entrants.forEach((t) => {
            const foundTeam = stage.draw.rankings.find((t2) => t2.id === t.id)
            if (foundTeam) {
                const newTeam = { ...t, rank: foundTeam.rank }
                delete newTeam.entrant_pos
                newEntrants.push(newTeam)
            }
        })
        stage.entrants = newEntrants
    }
    stage.entrants &&
        stage.entrants.sort((a, b) => {
            return a.rank > b.rank ? 1 : -1
        })
    stage.entrants &&
        stage.entrants.forEach((t, index) => {
            if (!t.entrant_pos) {
                t.pos = index + 1
                t.entrant_pos = index + 1
            }
        })
    stage.entrants &&
        stage.entrants.sort((a, b) => {
            return a.pos > b.pos ? 1 : -1
        })
}

export const initEntrantsPath = (stage) => {
    if (!stage || !stage.paths) return
    if (stage.inter_confederation_playoff) {
        const newEntrants = []
        stage.entrants.forEach((t) => {
            const foundTeam = stage.draw.rankings.find((t2) => t2.id === t.id)
            if (foundTeam) {
                const newTeam = { ...t, rank: foundTeam.rank }
                delete newTeam.entrant_pos
                newEntrants.push(newTeam)
            }
        })
        stage.entrants = newEntrants
    }
    stage.entrants &&
        stage.entrants.sort((a, b) => {
            return a.rank > b.rank ? 1 : -1
        })
    stage.entrants &&
        stage.entrants.forEach((t, index) => {
            if (!t.entrant_pos) {
                t.pos = index + 1
                t.entrant_pos = index + 1
            }
        })
}

export const initEntrantsPathOutside = (stage) => {
    if (!stage || !stage.pots) return
    stage.pots.forEach((p) => {
        p.rankings.forEach((t) => (t.already_drawn = false))
        let count = 1
        while (!p.rankings.every((t) => t.already_drawn)) {
            const potNotDrawn = p.rankings.filter((t) => !t.already_drawn)
            potNotDrawn.forEach((t, index) => {
                t.temp_index = index
            })
            const randomIndex = randomInteger(0, potNotDrawn.length - 1)
            const team = potNotDrawn.find((t) => t.temp_index === randomIndex)
            if (team) {
                team.already_drawn = true
                team.pos = 'P' + (p.name === stage.outside_entrants.name ? '4' : p.name) + count
                count++
            }
        }
    })
    stage.pots[stage.pots.length - 1].rankings.forEach((t) => {
        stage.entrants.push(t)
    })
}

export const processPathRounds = (stage) => {
    if (!stage) return
    if (stage.rounds) {
        if (stage.third_place_groups) {
            updateFirstRound(stage)
        }
        processRounds(stage, stage)
    }
    if (stage.paths) {
        stage.paths.forEach((p) => {
            processRounds(p, stage)
        })
    }
}

export const updateFirstRound = (stage) => {
    if (!stage) return
    let third_place_groups = ''
    stage.entrants.forEach((t) => {
        if (t.entrant_pos.includes('3')) {
            third_place_groups = third_place_groups.concat(t.entrant_pos.slice(0, 1))
        }
    })
    stage.third_place_groups_phrase = third_place_groups
    if (stage.rounds) {
        const combination = ThirdPlaceCombination.find((c) => c.id === third_place_groups)
        if (combination) {
            stage.rounds[0].matches.forEach((m) => {
                const opponent = combination.away_opponents.find((o) => o.match === m.id)
                if (opponent) {
                    m.away_team = opponent.away_team
                }
            })
        }
    }
}

export const processRounds = (path, stage) => {
    if (!stage || !path || !path.rounds) return
    path.rounds.forEach((r) => {
        r.matches.forEach((m) => {
            populateMatch(m, stage.entrants)
            getKnockoutScore(m)
        })
        createMatchdays(r)
        finishRound(r, path, stage)
    })
}

export const populateMatch = (match, entrants) => {
    if (!match || !entrants) return
    const homeTeam = entrants.find((t) => t.pos === match.home_team)
    if (homeTeam) {
        match.home_team = homeTeam.id
    }
    const awayTeam = entrants.find((t) => t.pos === match.away_team)
    if (awayTeam) {
        match.away_team = awayTeam.id
    }
}

export const createMatchdays = (round) => {
    if (!round || !round.matches) return
    const matchdays = []
    round.matches.forEach((m) => {
        const final = m.final
        const third_place = m.third_place
        const foundMatchday = matchdays.find((md) => md.date === m.date)
        if (!foundMatchday) {
            matchdays.push({ date: m.date, final, third_place, matches: [m] })
        } else {
            foundMatchday.matches.push(m)
        }
    })
    round.matchdays = matchdays
}

export const finishRound = (round, path, stage) => {
    if (!round || !stage || !stage.entrants) return
    const winners = []
    const losers = []
    const nextRound = path.rounds.find((r) => r.name === round.next_round)
    round.matches.forEach((m) => {
        if (isHomeWinMatch(m)) {
            const winTeam = stage.entrants.find((t) => t.id === m.home_team)
            if (winTeam) {
                if (nextRound && nextRound.third_place) {
                    winTeam.pos = 'W' + m.id
                } else {
                    winTeam.pos = m.id
                }
                if (round.final) {
                    winTeam.qualified_date = m.date
                }
                winners.push(winTeam)
            }
            const loseTeam = stage.entrants.find((t) => t.id === m.away_team)
            if (loseTeam) {
                if (nextRound && nextRound.third_place) {
                    loseTeam.pos = 'L' + m.id
                }
                losers.push(loseTeam)
            }
        } else {
            const winTeam = stage.entrants.find((t) => t.id === m.away_team)
            if (winTeam) {
                if (nextRound && nextRound.third_place) {
                    winTeam.pos = 'W' + m.id
                } else {
                    winTeam.pos = m.id
                }
                if (round.final) {
                    winTeam.qualified_date = m.date
                }
                winners.push(winTeam)
            }
            const loseTeam = stage.entrants.find((t) => t.id === m.home_team)
            if (loseTeam) {
                if (nextRound && nextRound.third_place) {
                    loseTeam.pos = 'L' + m.id
                }
                losers.push(loseTeam)
            }
        }
    })
    if (nextRound) {
        if (!nextRound.third_place) {
            nextRound.entrants = winners
        } else {
            nextRound.entrants = winners.concat(losers)
        }
    }
    if (!round.next_round) {
        if (!stage.winners) {
            stage.winners = winners
        } else {
            winners.forEach((t) => {
                stage.winners.push(t)
            })
        }
        if (!stage.losers) {
            stage.losers = losers
        } else {
            losers.forEach((t) => {
                stage.losers.push(t)
            })
        }
    }
}

export const getNextStage = (stage, tournament, config) => {
    if (!tournament || !stage) return
    if (stage.next_stage === 'Inter-confederation play-offs') {
        const playoff = config.qualifications.find((q) => q.id === 'Inter-confederation play-offs')
        if (playoff) {
            return playoff.stages.find((s) => s.name === stage.next_stage)
        }
    }
    return tournament.stages.find((s) => s.name === stage.next_stage)
}

export const finishStage = (stage, nextStage) => {
    if (!stage || !stage.type) return
    if (stage.type.includes('pair_')) {
        finishPairStage(stage, nextStage)
    }
    if (stage.type.includes('roundrobin_')) {
        finishGroupStage(stage, nextStage)
    }
    if (stage.type.includes('knockout_')) {
        finishKnockoutStage(stage, nextStage)
    }
}

export const finishPairStage = (stage, next_stage) => {
    if (!stage || !next_stage) return
    const advanced_teams = []
    stage.groups.forEach((g) => {
        g.teams.forEach((t) => {
            if (t.advanced) {
                delete t.already_drawn
                delete t.advanced
                advanced_teams.push(t)
            }
        })
    })
    if (!next_stage.entrants) {
        next_stage.entrants = advanced_teams
    } else {
        advanced_teams.forEach((t) => {
            next_stage.entrants.push(t)
        })
    }
}

export const finishGroupStage = (stage, next_stage) => {
    if (!stage || !stage.groups || !next_stage) return
    const qualified_teams = []
    const advanced_teams = []
    const next_rounded_teams = []
    stage.groups.forEach((g) => {
        g.rankings.forEach((r) => {
            if (r.qualified) {
                qualified_teams.push(r.team)
            } else if (r.advanced) {
                advanced_teams.push({ ...r.team, entrant_pos: g.name + r.rank, pos: g.name + r.rank })
            } else if (r.next_rounded) {
                const new_team = { ...r.team }
                if (next_stage.type === 'knockout_final') {
                    new_team.entrant_pos = g.name + r.rank
                    new_team.pos = g.name + r.rank
                }
                delete new_team.draw_seed
                delete new_team.draw_striped
                next_rounded_teams.push(new_team)
            }
        })
    })
    if (advanced_teams.length > 0) {
        if (!next_stage.entrants) {
            next_stage.entrants = advanced_teams
        } else {
            advanced_teams.forEach((t) => {
                next_stage.entrants.push(t)
            })
        }
    }
    if (next_rounded_teams.length > 0) {
        if (!next_stage.entrants) {
            next_stage.entrants = next_rounded_teams
        } else {
            next_rounded_teams.forEach((t) => {
                next_stage.entrants.push(t)
            })
        }
    }
}

export const finishKnockoutStage = (stage, next_stage) => {
    if (!stage || !stage.winners || !next_stage) return
    if (stage.winners && stage.advancement && stage.advancement[0].will === 'next_round') {
        if (!next_stage.entrants) {
            next_stage.entrants = stage.winners
        } else {
            stage.winners.forEach((t) => {
                next_stage.entrants.push(t)
            })
        }
    }
}

export const qualifyStage = (tournament, stage, qualifiedTeams, next_stage) => {
    if (!stage || !stage.type) return
    if (stage.type.includes('roundrobin_')) {
        qualifyGroupStage(tournament, stage, qualifiedTeams, next_stage)
    }
    if (stage.type.includes('knockout_')) {
        qualifyKnockoutStage(tournament, stage, qualifiedTeams, next_stage)
    }
}

export const qualifyGroupStage = (tournament, stage, qualifiedTeams, next_stage) => {
    if (!tournament || tournament.final || !stage || !qualifiedTeams) return
    const { groups } = stage
    const last_stage_winners = []
    groups &&
        groups.forEach((g) => {
            if (g.rankings) {
                const stageName = !stage.type.includes('_nopot') ? ' ' + stage.name + ' Group ' + g.name : ''
                const winners = g.rankings.find((t) => t.qualified_position === 'winners')
                if (winners) {
                    const qualification_method = tournament.id + stageName + ' winners'
                    qualifiedTeams.push({ ...winners.team, qualification_method, qualification_date: winners.qualified_date })
                    last_stage_winners.push(winners)
                }
                const runners_up = g.rankings.find((t) => t.qualified_position === 'runners-up')
                if (runners_up) {
                    const qualification_method = tournament.id + stageName + ' runners-up'
                    qualifiedTeams.push({ ...runners_up.team, qualification_method, qualification_date: runners_up.qualified_date })
                }
                const third = g.rankings.find((t) => t.qualified_position === '3rd place')
                if (third) {
                    const qualification_method = tournament.id + stageName + ' 3rd place'
                    qualifiedTeams.push({ ...third.team, qualification_method, qualification_date: third.qualified_date })
                }
                const fourth = g.rankings.find((t) => t.qualified_position === '4th place')
                if (fourth) {
                    const qualification_method = tournament.id + stageName + ' 4th place'
                    qualifiedTeams.push({ ...fourth.team, qualification_method, qualification_date: fourth.qualified_date })
                }
                const fifth = g.rankings.find((t) => t.qualified_position === '5th place')
                if (fourth) {
                    const qualification_method = tournament.id + stageName + ' 5th place'
                    qualifiedTeams.push({ ...fifth.team, qualification_method, qualification_date: fifth.qualified_date })
                }
                const sixth = g.rankings.find((t) => t.qualified_position === '6th place')
                if (fourth) {
                    const qualification_method = tournament.id + stageName + ' 6th place'
                    qualifiedTeams.push({ ...sixth.team, qualification_method, qualification_date: sixth.qualified_date })
                }
            }
        })
    next_stage.last_stage_winners = last_stage_winners
    qualifiedTeams.sort((a, b) => {
        return a.qualification_date >= b.qualification_date ? 1 : -1
    })
}

export const qualifyKnockoutStage = (tournament, stage, qualifiedTeams, next_stage) => {
    if (!tournament || !stage || !qualifiedTeams) return
    if (stage.advancement && stage.advancement[0].will === 'qualify') {
        const qualification_method =
            tournament.id === 'Inter-confederation play-offs' ? tournament.id + ' winners' : tournament.id + ' ' + stage.name + ' winners'
        stage.winners &&
            stage.winners.forEach((t) => {
                qualifiedTeams.push({ ...t, qualification_method, qualification_date: t.qualified_date })
            })
    }
    qualifiedTeams.sort((a, b) => {
        return a.qualification_date >= b.qualification_date ? 1 : -1
    })
    if (stage.advancement && stage.advancement[1] && stage.advancement[1].will === 'next_round' && stage.losers) {
        if (!next_stage.entrants) {
            next_stage.entrants = stage.losers
        } else {
            stage.losers.forEach((t) => {
                const new_team = { ...t }
                delete new_team.entrant_pos
                next_stage.entrants.push(new_team)
            })
        }
    }
}

export const overwriteGroup = (group) => {
    // // For draw pool - h2h win points
    // group.matchdays[0].matches[0].home_score = 4
    // group.matchdays[0].matches[0].away_score = 0
    // group.matchdays[0].matches[1].home_score = 3
    // group.matchdays[0].matches[1].away_score = 0
    // group.matchdays[1].matches[0].home_score = 0
    // group.matchdays[1].matches[0].away_score = 2
    // group.matchdays[1].matches[1].home_score = 2
    // group.matchdays[1].matches[1].away_score = 0
    // group.matchdays[2].matches[0].home_score = 2
    // group.matchdays[2].matches[0].away_score = 1
    // group.matchdays[2].matches[1].home_score = 0
    // group.matchdays[2].matches[1].away_score = 4
    // group.matchdays[3].matches[0].home_score = 4
    // group.matchdays[3].matches[0].away_score = 0
    // group.matchdays[3].matches[1].home_score = 1
    // group.matchdays[3].matches[1].away_score = 2
    // group.matchdays[4].matches[0].home_score = 0
    // group.matchdays[4].matches[0].away_score = 4
    // group.matchdays[4].matches[1].home_score = 0
    // group.matchdays[4].matches[1].away_score = 3
    // group.matchdays[5].matches[0].home_score = 0
    // group.matchdays[5].matches[0].away_score = 2
    // group.matchdays[5].matches[1].home_score = 2
    // group.matchdays[5].matches[1].away_score = 0
    // // For draw pool - h2h win goal difference
    // group.matchdays[0].matches[0].home_score = 4
    // group.matchdays[0].matches[0].away_score = 0
    // group.matchdays[0].matches[1].home_score = 3
    // group.matchdays[0].matches[1].away_score = 4
    // group.matchdays[1].matches[0].home_score = 0
    // group.matchdays[1].matches[0].away_score = 2
    // group.matchdays[1].matches[1].home_score = 2
    // group.matchdays[1].matches[1].away_score = 0
    // group.matchdays[2].matches[0].home_score = 2
    // group.matchdays[2].matches[0].away_score = 1
    // group.matchdays[2].matches[1].home_score = 0
    // group.matchdays[2].matches[1].away_score = 2
    // group.matchdays[3].matches[0].home_score = 4
    // group.matchdays[3].matches[0].away_score = 0
    // group.matchdays[3].matches[1].home_score = 1
    // group.matchdays[3].matches[1].away_score = 2
    // group.matchdays[4].matches[0].home_score = 0
    // group.matchdays[4].matches[0].away_score = 4
    // group.matchdays[4].matches[1].home_score = 1
    // group.matchdays[4].matches[1].away_score = 0
    // group.matchdays[5].matches[0].home_score = 1
    // group.matchdays[5].matches[0].away_score = 0
    // group.matchdays[5].matches[1].home_score = 2
    // group.matchdays[5].matches[1].away_score = 0
    // // For draw pool - h2h win away goal
    // group.matchdays[0].matches[0].home_score = 4
    // group.matchdays[0].matches[0].away_score = 0
    // group.matchdays[0].matches[1].home_score = 2
    // group.matchdays[0].matches[1].away_score = 5
    // group.matchdays[1].matches[0].home_score = 0
    // group.matchdays[1].matches[0].away_score = 2
    // group.matchdays[1].matches[1].home_score = 1
    // group.matchdays[1].matches[1].away_score = 0
    // group.matchdays[2].matches[0].home_score = 2
    // group.matchdays[2].matches[0].away_score = 1
    // group.matchdays[2].matches[1].home_score = 0
    // group.matchdays[2].matches[1].away_score = 2
    // group.matchdays[3].matches[0].home_score = 4
    // group.matchdays[3].matches[0].away_score = 0
    // group.matchdays[3].matches[1].home_score = 1
    // group.matchdays[3].matches[1].away_score = 2
    // group.matchdays[4].matches[0].home_score = 0
    // group.matchdays[4].matches[0].away_score = 4
    // group.matchdays[4].matches[1].home_score = 1
    // group.matchdays[4].matches[1].away_score = 0
    // group.matchdays[5].matches[0].home_score = 2
    // group.matchdays[5].matches[0].away_score = 1
    // group.matchdays[5].matches[1].home_score = 2
    // group.matchdays[5].matches[1].away_score = 0
    // // For draw pool - h2h draw - fair play points
    // group.matchdays[0].matches[0].home_score = 1
    // group.matchdays[0].matches[0].away_score = 2
    // group.matchdays[0].matches[0].away_fair_pts = -1
    // group.matchdays[0].matches[1].home_score = 1
    // group.matchdays[0].matches[1].away_score = 2
    // group.matchdays[0].matches[1].away_fair_pts = -2
    // group.matchdays[1].matches[0].home_score = 0
    // group.matchdays[1].matches[0].away_score = 1
    // group.matchdays[1].matches[0].home_fair_pts = -1
    // group.matchdays[1].matches[1].home_score = 0
    // group.matchdays[1].matches[1].away_score = 1
    // group.matchdays[1].matches[1].home_fair_pts = -1
    // group.matchdays[2].matches[0].home_score = 3
    // group.matchdays[2].matches[0].away_score = 0
    // group.matchdays[2].matches[1].home_score = 2
    // group.matchdays[2].matches[1].away_score = 2
    // group.matchdays[2].matches[1].home_fair_pts = -2
    // group.matchdays[2].matches[1].away_fair_pts = -3
    // group.matchdays[3].matches[0].home_score = 2
    // group.matchdays[3].matches[0].away_score = 2
    // group.matchdays[3].matches[1].home_score = 0
    // group.matchdays[3].matches[1].away_score = 3
    // group.matchdays[4].matches[0].home_score = 2
    // group.matchdays[4].matches[0].away_score = 1
    // group.matchdays[4].matches[1].home_score = 2
    // group.matchdays[4].matches[1].away_score = 1
    // group.matchdays[5].matches[0].home_score = 1
    // group.matchdays[5].matches[0].away_score = 0
    // group.matchdays[5].matches[1].home_score = 1
    // group.matchdays[5].matches[1].away_score = 0
    // // For draw pool - h2h draw - drawing lots
    // group.matchdays[0].matches[0].home_score = 1
    // group.matchdays[0].matches[0].away_score = 1
    // group.matchdays[0].matches[1].home_score = 1
    // group.matchdays[0].matches[1].away_score = 1
    // group.matchdays[1].matches[0].home_score = 1
    // group.matchdays[1].matches[0].away_score = 1
    // group.matchdays[1].matches[0].home_fair_pts = -2
    // group.matchdays[1].matches[0].away_fair_pts = -2
    // group.matchdays[1].matches[1].home_score = 0
    // group.matchdays[1].matches[1].away_score = 1
    // group.matchdays[2].matches[0].home_score = 0
    // group.matchdays[2].matches[0].away_score = 0
    // group.matchdays[2].matches[1].home_score = 0
    // group.matchdays[2].matches[1].away_score = 0
    // group.matchdays[3].matches[0].home_score = 0
    // group.matchdays[3].matches[0].away_score = 0
    // group.matchdays[3].matches[1].home_score = 0
    // group.matchdays[3].matches[1].away_score = 0
    // group.matchdays[4].matches[0].home_score = 1
    // group.matchdays[4].matches[0].away_score = 1
    // group.matchdays[4].matches[1].home_score = 1
    // group.matchdays[4].matches[1].away_score = 1
    // group.matchdays[5].matches[0].home_score = 1
    // group.matchdays[5].matches[0].away_score = 0
    // group.matchdays[5].matches[1].home_score = 1
    // group.matchdays[5].matches[1].away_score = 1
}

// ----------------------------- Version 1 ----------------------------------

export const getNationOfficialName = (id) => {
    const team = getTeamArray().find((t) => t.id === id)
    if (team) {
        const nation = NationArray.find((n) => n.id === team.nation_id)
        if (nation) {
            return nation.details.official_name
        } else {
            console.log('Nation error', nation)
        }
    } else {
        console.log('Team error', team)
    }
}

// export const getTeamName = (id) => {
//     if (!id) return
//     const team = getTeamArray().find((t) => t.id === id)
//     if (team) {
//         return team.name
//     } else {
//         console.log('Team error', team)
//     }
// }

// export const getShortTeamName = (id) => {
//     if (!id) return
//     const team = getTeamArray().find((t) => t.id === id)
//     if (team) {
//         if (team.short_name) {
//             return team.short_name
//         } else {
//             return team.name
//         }
//     } else {
//         console.log('Team error', team)
//     }
// }

export const getBracketTeamName = (id) => {
    return getShortTeamName(id)
}

export const getParentTeam = (id) => {
    const team = getTeamArray().find((t) => t.id === id)
    return getTeamArray().find((t) => t.id === team.parent_team_id)
}

export const getBracketTeamCode = (id, config) => {
    if (!id) return
    const team = getTeamArray().find((t) => t.id === id)
    if (!team) {
        console.log('Team error', team)
        return
    }
    if (config.team_type_id === 'CLUB') {
        return team.id
    }
    const nation = NationArray.find((n) => n.id === team.nation_id)
    if (!nation) {
        console.log('Nation error', nation)
    } else if (!nation.code) {
        return team.nation_id
    } else {
        return nation.code
    }
}

export const isSuccessor = (id) => {
    const team = getTeamArray().find((t) => t.id === id)
    return !team || !team.successor ? false : team.successor
}
