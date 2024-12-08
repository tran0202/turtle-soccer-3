import React from 'react'
import randomInteger from 'random-int'
import Tournament from '../data/Tournament.json'
import ConfederationArray from '../data/Confederations.json'
import NationArray from '../data/Nations.json'
import MensTeamArray from '../data/Mens.json'
import { getTeamArray } from './DataHelper'
import { calculateGroupRankings } from './RankingsHelper'

export const getTeamName = (id, config) => {
    if (!id || !config || !config.teams) return
    const team = config.teams.find((t) => t.id === id)
    if (team) {
        return team.name
    } else {
        console.log('Team error', team)
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

export const getConfederationLogo = (t, config) => {
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

export const getTeamFlag = (t, config) => {
    if (!t || !t.nation) return
    return (
        <React.Fragment>
            {config.team_type_id !== 'CLUB' && (
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
                    alt={`${id} ${team.nation.official_name}`}
                    title={`${id} ${team.nation.official_name}`}
                />
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

export const getTeamFlagName = (t, config) => {
    if (!t) return
    return (
        <React.Fragment>
            {getTeamFlag(t, config)}
            <span className="padding-top-xs">&nbsp;{t.name}</span>
        </React.Fragment>
    )
}

export const getTournament = () => {
    return Tournament
}

export const setFIFAMember = () => {
    NationArray.forEach((n) => {
        n.fifa_member = !n.not_fifa_member ? true : false
    })
}

export const getActiveFIFATeamArray = () => {
    setFIFAMember()
    const result = []
    MensTeamArray.forEach((t) => {
        const foundNation = NationArray.find((n) => t.nation_id === n.id && n.end_date === '' && n.fifa_member)
        if (t.parent_team_id === '' && foundNation) {
            t.nation = foundNation
            const foundConf = ConfederationArray.find((c) => foundNation.confederation_id === c.id)
            if (foundConf) {
                t.confederation = foundConf
            }
            result.push(t)
        }
    })
    return result
}

export const getConfederation = (id) => {
    const result = ConfederationArray.find((c) => c.id === id)
    return result ? result : {}
}

export const randomHostIndex = (count, confederation_id) => {
    if (!confederation_id) return
    let result = []
    const conf = getConfederation(confederation_id)
    while (result.length !== count) {
        const randomIndex = randomInteger(0, conf.member_count - 1)
        const found = result.find((i) => i + 1 === randomIndex + 1)
        if (!found) {
            result.push(randomIndex)
        }
    }
    return result
}

export const getRandomHostTeamArray = (teamArray, tournament) => {
    if (!teamArray || !tournament || !tournament.details) return
    const result = []
    const confederation_id = tournament.details.host.confederation_id
    const teams = teamArray.filter((t) => t.confederation && t.confederation.id === confederation_id)
    const host_count = tournament.details.host.teams.length
    teams.length >= host_count &&
        randomHostIndex(host_count, confederation_id).forEach((i) => {
            const team = { ...teams[i], qualification_method: 'Hosts', qualification_date: '2023-02-14' }
            result.push(team)
        })
    return result
}

export const getRandomMensTeamArray = (teamArray) => {
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
    // if (result.length > 0) {
    //     result[result.length - 1].rank = ''
    //     result[result.length - 1].points = 0
    // }
    return result
}

export const processQualifications = (teamArray, qualifiedTeams, tournament) => {
    if (!tournament || !tournament.qualifications) return
    const qualifications = []
    tournament.qualifications.forEach((q) => {
        const draws = createDraws(q, teamArray, qualifiedTeams)
        const stages = createPots(q, draws)
        processStages(q, qualifiedTeams, tournament)
        qualifications.push({ id: q.id, draws, stages })
    })
    return qualifications
}

export const createDraws = (qualification, teamArray, qualifiedTeams) => {
    if (!qualification) return
    const draws = []
    qualification.draws &&
        qualification.draws.forEach((d) => {
            const allRankings = getRandomMensTeamArray(teamArray)
            const confRankings =
                qualification.id !== 'Inter-confederation play-offs' ? getConfederationRankings(allRankings, qualification.id, qualifiedTeams) : allRankings
            draws.push({ ...d, rankings: confRankings })
            d.rankings = confRankings
        })
    return draws
}

export const getConfederationRankings = (teamArray, confederation_id, qualifiedTeams) => {
    const result = []
    const confRankings = teamArray.filter((t) => t.confederation && t.confederation.id === confederation_id)

    let count = 0
    confRankings.forEach((t) => {
        if (!qualifiedTeams.find((t2) => t2.id === t.id)) {
            count++
            t.conf_rank = count
            t.draw_seed = count
            result.push(t)
        }
    })
    return result
}

// Pre-existing Pots being made based on pre-determined rankings.
export const createPots = (qualification, draws) => {
    if (!qualification || !qualification.stages) return
    const stages = []
    qualification.stages.forEach((s) => {
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

export const processStages = (qualification, qualifiedTeams, tournament) => {
    if (!qualification || !qualification.stages) return
    qualification.stages.forEach((s) => {
        preparePots(s)
        createDrawPotTable(s)
        createStage(s, tournament)
        const nextStage = getNextStage(s, qualification, tournament)
        finishStage(s, nextStage)
        qualifyStage(qualification, s, qualifiedTeams)
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
}

// Some Pots already existed. New Pots being made from entering teams.
// 10 teams from 1st round go to Pot 4. 9 of them will be drawn to groups. The last (10th) team moves to Pot 3.
// type = roundrobin2leg_oddpot
export const prepareOddPot = (stage) => {
    if (!stage || !stage.entering_placement || !stage.entering_teams) return
    stage.entering_placement.forEach((p) => {
        const foundPot = stage.pots.find((p2) => p2.name === p.name)
        const newPot = {}
        newPot.rankings = []
        for (var i = 0; i < p.count; i++) {
            const notDrawnTeams = stage.entering_teams.filter((t) => !t.already_drawn)
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
// type = roundrobin2leg_evenpot
export const prepareEvenPot = (stage) => {
    if (!stage || !stage.entering_placement || !stage.entering_teams || !stage.draw) return
    // console.log('stage.entering_teams:', stage.entering_teams)
    const stageTeams = []
    stage.entering_teams.forEach((t) => {
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
    stage.entering_teams = stageTeams
    const pots = []
    stage.entering_placement.forEach((p, index) => {
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

export const createStage = (stage, tournament) => {
    if (!stage || !stage.type) return
    if (stage.type.includes('pair2leg')) {
        if (stage.type.includes('drawpair') || stage.type.includes('noshowpot')) {
            stage.groups = []
            createPairs(stage)
        }
        if (stage.type.includes('predetpair')) {
            createPreDeterminedPairs(stage)
        }
        createPairMatches(stage)
        calculatePairAggregateScore(stage)
    }
    if (stage.type.includes('roundrobin')) {
        createGroups(stage)
        createGroupMatches(stage)
        calculateGroupRankings(stage, tournament)
    }
    if (stage.type.includes('knockout')) {
        populateFirstRound(stage)
        processRounds(stage)
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
    stage.groups = []
    const team_count = stage.pots.length
    const group_count = stage.pots[0].rankings.length

    for (var i = 0; i < group_count; i++) {
        const new_group = { name: String.fromCharCode(65 + i), teams: [] }
        stage.groups.push(new_group)
    }
    for (var j = 0; j < team_count; j++) {
        for (var k = 0; k < group_count; k++) {
            const notDrawnTeams = stage.pots[team_count - 1 - j].rankings.filter((t) => !t.already_drawn)
            notDrawnTeams.forEach((t, index) => {
                t.temp_index = index
            })
            const randomIndex = randomInteger(0, notDrawnTeams.length - 1)
            const team = notDrawnTeams.find((t) => t.temp_index === randomIndex)
            if (team) {
                team.already_drawn = true
                const new_team = { ...team, pos: team_count - j }
                stage.groups[k].teams.unshift(new_team)
            }
        }
    }
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
        g.matchdays = []
        stage.matchdays.forEach((md, index) => {
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
    if (match.home_score > match.away_score) return true
    if (match.home_score === match.away_score) {
        if (match.home_extra_score > match.away_extra_score) return true
        if (match.home_extra_score === match.away_extra_score) {
            if (match.home_penalty_score > match.away_penalty_score) return true
        }
    }
    return false
}

export const populateFirstRound = (stage) => {
    if (!stage || !stage.rounds) return
    stage.entering_teams &&
        stage.entering_teams.sort((a, b) => {
            return a.rank > b.rank ? 1 : -1
        })
    stage.entering_teams.forEach((t, index) => {
        t.entering_pos = index + 1
    })
    const firstRound = stage.rounds[0]
    if (firstRound) {
        firstRound.entering_teams = stage.entering_teams
    }
}

export const processRounds = (stage) => {
    if (!stage || !stage.rounds) return
    stage.rounds.forEach((r) => {
        r.matches.forEach((m) => {
            populateMatch(m, r)
            getKnockoutScore(m)
        })
        createMatchdays(r)
        finishRound(r, stage)
    })
}

export const populateMatch = (match, round) => {
    if (!match || !round || !round.entering_teams) return
    const homeTeam = round.entering_teams.find((t) => t.entering_pos === match.home_team)
    if (homeTeam) {
        match.home_team = homeTeam.id
    }
    const awayTeam = round.entering_teams.find((t) => t.entering_pos === match.away_team)
    if (awayTeam) {
        match.away_team = awayTeam.id
    }
}

export const createMatchdays = (round) => {
    if (!round || !round.matches) return
    const matchdays = []
    round.matches.forEach((m) => {
        const foundMatchday = matchdays.find((md) => (md.date = m.date))
        if (!foundMatchday) {
            matchdays.push({ date: m.date, matches: [m] })
        } else {
            foundMatchday.matches.push(m)
        }
    })
    round.matchdays = matchdays
}

export const finishRound = (round, stage) => {
    if (!round) return
    const winners = []
    round.matches.forEach((m) => {
        if (isHomeWinMatch(m)) {
            const foundTeam = stage.entering_teams.find((t) => t.id === m.home_team)
            if (foundTeam) {
                foundTeam.entering_pos = m.id
                winners.push(foundTeam)
            }
        } else {
            const foundTeam = stage.entering_teams.find((t) => t.id === m.away_team)
            if (foundTeam) {
                foundTeam.entering_pos = m.id
                winners.push(foundTeam)
            }
        }
    })
    const nextRound = stage.rounds.find((r) => r.name === round.next_round)
    if (nextRound) {
        nextRound.entering_teams = winners
    }
    if (!round.next_round) {
        stage.winners = winners
    }
}

export const getNextStage = (stage, qualification, tournament) => {
    if (!qualification || !stage) return
    if (stage.next_stage === 'Inter-confederation play-offs') {
        const playoff = tournament.qualifications.find((q) => q.id === 'Inter-confederation play-offs')
        if (playoff) {
            return playoff.stages.find((s) => s.name === stage.next_stage)
        }
    }
    return qualification.stages.find((s) => s.name === stage.next_stage)
}

export const finishStage = (stage, nextStage) => {
    if (!stage || !stage.type) return
    if (stage.type.includes('pair2leg')) {
        finishPairStage(stage, nextStage)
    }
    if (stage.type.includes('roundrobin')) {
        finishGroupStage(stage, nextStage)
    }
    if (stage.type.includes('knockout')) {
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
    if (!next_stage.entering_teams) {
        next_stage.entering_teams = advanced_teams
    } else {
        advanced_teams.forEach((t) => {
            next_stage.entering_teams.push(t)
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
                advanced_teams.push(r.team)
            } else if (r.next_rounded) {
                const new_team = { ...r.team }
                delete new_team.draw_seed
                delete new_team.draw_striped
                next_rounded_teams.push(new_team)
            }
        })
    })
    if (advanced_teams.length > 0) {
        if (!next_stage.entering_teams) {
            next_stage.entering_teams = advanced_teams
        } else {
            advanced_teams.forEach((t) => {
                next_stage.entering_teams.push(t)
            })
        }
    }
    if (next_rounded_teams.length > 0) {
        if (!next_stage.entering_teams) {
            next_stage.entering_teams = next_rounded_teams
        } else {
            next_rounded_teams.forEach((t) => {
                next_stage.entering_teams.push(t)
            })
        }
    }
}

export const finishKnockoutStage = (stage, next_stage) => {
    if (!stage || !stage.winners || !next_stage) return
    stage.winners.forEach((t) => {
        if (!next_stage.entering_teams) {
            next_stage.entering_teams = stage.winners
        } else {
            stage.winners.forEach((t) => {
                next_stage.entering_teams.push(t)
            })
        }
    })
}

export const qualifyStage = (qualification, stage, qualifiedTeams) => {
    if (!qualification || !stage || !qualifiedTeams) return
    const { groups } = stage
    groups &&
        groups.forEach((g) => {
            if (g.rankings) {
                const winners = g.rankings.find((t) => t.qualified_position === 'winners')
                if (winners) {
                    const qualification_method = qualification.id + ' ' + stage.name + ' Group ' + g.name + ' winners'
                    qualifiedTeams.push({ ...winners.team, qualification_method, qualification_date: winners.qualified_date })
                }
                const runners_up = g.rankings.find((t) => t.qualified_position === 'runners-up')
                if (runners_up) {
                    const qualification_method = qualification.id + ' ' + stage.name + ' Group ' + g.name + ' runners-up'
                    qualifiedTeams.push({ ...runners_up.team, qualification_method, qualification_date: runners_up.qualified_date })
                }
            }
        })

    qualifiedTeams.sort((a, b) => {
        return a.qualification_date > b.qualification_date ? 1 : -1
    })
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

export const getFlagSrc = (id) => {
    if (!id) return
    const team = getTeamArray().find((t) => t.id === id)
    if (team) {
        const nation = NationArray.find((n) => n.id === team.nation_id)
        if (nation) {
            return '/images/flags/' + nation.details.flag_filename
        } else {
            console.log('Nation error', nation)
        }
    } else {
        console.log('Team error', team)
    }
}

export const getNationSmallFlagImg = (id) => {
    if (!id) return
    const team = getTeamArray().find((t) => t.id === id)
    if (team) {
        const nation = NationArray.find((n) => n.id === team.nation_id)
        if (nation) {
            return (
                <React.Fragment>
                    <img className="flag-xs-2 flag-sm-2" src={`/images/flags/${nation.flag_filename}`} alt={nation.id} title={nation.id} />
                </React.Fragment>
            )
        } else {
            console.log('Nation error', nation)
        }
    } else {
        console.log('Team error', team)
    }
}

export const getClubLogoImg = (id, config) => {
    if (!id) return
    const team = getTeamArray().find((t) => t.id === id)
    if (team) {
        return (
            <React.Fragment>
                <img className="flag-club-sm flag-club-md" src={`/images/${config.logo_path}/${team.logo_filename}`} alt={id} title={id} />
            </React.Fragment>
        )
    } else {
        console.log('Team error', team)
    }
}

// export const getTeamFlag = (id, config) => {
//     if (!id) return
//     return (
//         <React.Fragment>
//             {config.team_type_id === 'CLUB' && getClubLogoImg(id, config)}
//             {config.team_type_id === 'CLUB' && getNationSmallFlagImg(id)}
//             {config.team_type_id !== 'CLUB' && (
//                 <img
//                     className="flag-sm flag-md margin-bottom-xs-4"
//                     src={getFlagSrc(id)}
//                     alt={`${id} ${getNationOfficialName(id)}`}
//                     title={`${id} ${getNationOfficialName(id)}`}
//                 />
//             )}
//         </React.Fragment>
//     )
// }

// export const getTeamFlagName = (id, config) => {
//     if (!id) return
//     return (
//         <React.Fragment>
//             {getTeamFlag(id, config)}
//             <span className="padding-top-xs">&nbsp;{getTeamName(id)}</span>
//         </React.Fragment>
//     )
// }

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
