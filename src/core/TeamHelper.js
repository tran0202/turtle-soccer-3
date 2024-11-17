import React from 'react'
import Tournament from '../data/Tournament.json'
import ConfederationArray from '../data/Confederations.json'
import NationArray from '../data/Nations.json'
import MensTeamArray from '../data/Mens.json'
import { getTeamArray } from './DataHelper'
import randomInteger from 'random-int'

export const getTeamName = (id, config) => {
    if (!id || !config || !config.teams) return
    const team = config.teams.find((t) => t.id === id)
    if (team) {
        return team.name
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
            const team = { ...teams[i], qualificationMethod: 'Hosts', qualificationDate: '2023-02-14' }
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
        let tieRank = 0
        t.teams.forEach((t2) => {
            rank = rank + 1
            if (firstInPool) {
                tieRank = rank
                result.push({ rank, tieRank, ...t2, points: t.points })
                firstInPool = false
            } else {
                result.push({ rank: '--', tieRank, ...t2, points: t.points })
            }
        })
    })
    if (result.length > 0) {
        result[result.length - 1].rank = ''
        result[result.length - 1].points = 0
    }
    return result
}

export const getConfederationRankings = (teamArray, confederation_id) => {
    const result = []
    const confRankings = teamArray.filter((t) => t.confederation && t.confederation.id === confederation_id)
    confRankings.forEach((t, index) => {
        t.confRank = index + 1
        result.push(t)
    })
    return result
}

export const getPotInfo = (rankingArray, pots, stageName) => {
    if (!rankingArray || !pots) return
    const result = []
    rankingArray.forEach((t) => {
        const foundPot = pots.find((p) => p.rankingFrom <= t.confRank && t.confRank <= p.rankingTo)
        const foundIndex = pots.findIndex((p) => p.rankingFrom <= t.confRank && t.confRank <= p.rankingTo)
        if (foundPot) {
            t.qualRound = stageName
            t.qualPot = foundPot.name
            t.qualStriped = foundIndex % 2 === 0 ? true : false
            result.push(t)
        }
    })
    return result
}

export const createDrawRankings = (teamArray, tournament) => {
    if (!tournament) return
    const result = []
    tournament.qualifications.forEach((q) => {
        const draws = []
        const stages = []
        q.draws.forEach((d) => {
            const allRankings = getRandomMensTeamArray(teamArray)
            const confRankings = getConfederationRankings(allRankings, q.id)
            draws.push({ ...d, rankings: confRankings })
        })
        q.stages.forEach((s) => {
            const stageDraw = draws.find((d) => d.id === s.draw_id)
            const stageRankings = getPotInfo(stageDraw.rankings, s.pots, s.name)
            s.pots.forEach((p) => {
                const rankings = []
                stageRankings.forEach((t) => {
                    if (t.qualPot === p.name) {
                        rankings.push(t)
                    }
                })
                p.rankings = rankings
            })
            stages.push(s)
        })
        result.push({ id: q.id, draws, stages })
    })
    return result
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

export const createPairs = (stage) => {
    if (!stage || !stage.pots || stage.pots.length !== 2) return
    const pot1 = stage.pots[0]
    const pot2 = stage.pots[1]
    if (pot1.rankings.length !== pot2.rankings.length) return
    pot1.rankings.forEach((t) => {
        t.alreadyDrawn = false
    })
    pot2.rankings.forEach((t) => {
        t.alreadyDrawn = false
    })
    while (!pot1.rankings.every((t) => t.alreadyDrawn) && !pot2.rankings.every((t) => t.alreadyDrawn)) {
        const pot1NotDrawn = pot1.rankings.filter((t) => !t.alreadyDrawn)
        const pot2NotDrawn = pot2.rankings.filter((t) => !t.alreadyDrawn)
        pot1NotDrawn.forEach((t, index) => {
            t.tempIndex = index
        })
        pot2NotDrawn.forEach((t, index) => {
            t.tempIndex = index
        })
        const randomIndex1 = randomInteger(0, pot1NotDrawn.length - 1)
        const randomIndex2 = randomInteger(0, pot2NotDrawn.length - 1)
        const team1 = pot1NotDrawn.find((t) => t.tempIndex === randomIndex1)
        const team2 = pot2NotDrawn.find((t) => t.tempIndex === randomIndex2)
        if (team1 && team2) {
            team1.alreadyDrawn = true
            team2.alreadyDrawn = true
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

export const createGroups = (stage) => {
    if (!stage) return
    stage.pots.forEach((p) => {
        p.rankings.forEach((t) => {
            t.alreadyDrawn = false
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
            const notDrawnTeams = stage.pots[team_count - 1 - j].rankings.filter((t) => !t.alreadyDrawn)
            notDrawnTeams.forEach((t, index) => {
                t.tempIndex = index
            })
            const randomIndex = randomInteger(0, notDrawnTeams.length - 1)
            const team = notDrawnTeams.find((t) => t.tempIndex === randomIndex)
            if (team) {
                team.alreadyDrawn = true
                const new_team = { ...team, pos: team_count - j }
                stage.groups[k].teams.unshift(new_team)
            }
        }
    }
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
    match.home_score = randomInteger(0, 8)
    match.away_score = randomInteger(0, 8)
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
                const new_match = { date: md.date, home_team: home_team.id, away_team: away_team.id }
                getRandomScore(new_match)
                matches.push(new_match)
            })
            new_matchday.matches = matches
            g.matchdays.push(new_matchday)
        })
    })
}

export const isWinMatch = (match) => {}

export const isHomeWinPair = (group) => {
    if (!group || !group.matches || group.matches.length !== 2) return
    const result = false
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
    return result
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

export const createStage = (stage) => {
    if (!stage) return
    if (stage.type && stage.type.includes('pair2leg')) {
        stage.groups = []
        createPairs(stage)
        createPairMatches(stage)
        calculatePairAggregateScore(stage)
    }
    if (stage.type && stage.type.includes('roundrobin2leg')) {
        createGroups(stage)
        createGroupMatches(stage)
    }
}

export const finishPairStage = (stage, next_stage) => {
    if (!stage || !next_stage) return
    const advanced_teams = []
    stage.groups.forEach((g) => {
        g.teams.forEach((t) => {
            if (t.advanced) {
                delete t.alreadyDrawn
                delete t.advanced
                advanced_teams.push(t)
            }
        })
    })
    next_stage.entering_teams = advanced_teams
}

export const finishStage = (stage, nextStage) => {
    if (!stage) return
    if (stage.type && stage.type.includes('pair2leg')) {
        finishPairStage(stage, nextStage)
    }
}

export const prepareGroupStage = (stage) => {
    if (!stage || !stage.entering_placement) return
    stage.entering_placement.forEach((p) => {
        const foundPot = stage.pots.find((p2) => p2.name === p.name)
        const newPot = {}
        newPot.rankings = []
        for (var i = 0; i < p.count; i++) {
            const notDrawnTeams = stage.entering_teams.filter((t) => !t.alreadyDrawn)
            notDrawnTeams.forEach((t, index) => {
                t.tempIndex = index
            })
            const randomIndex = randomInteger(0, notDrawnTeams.length - 1)
            const team = notDrawnTeams.find((t) => t.tempIndex === randomIndex)
            if (team) {
                team.alreadyDrawn = true
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

export const prepareStage = (stage) => {
    if (!stage) return
    if (stage.type && stage.type.includes('roundrobin2leg')) {
        prepareGroupStage(stage)
    }
}

export const processStages = (qualArray) => {
    if (!qualArray) return
    qualArray.forEach((q) => {
        q.stages.forEach((s) => {
            if (s.type && s.type.includes('pair2leg')) {
                createDrawPotTable(s)
                createStage(s)
                const nextStage = q.stages.find((s2) => s2.name === s.next_stage)
                finishStage(s, nextStage)
            }
            if (s.type && s.type.includes('roundrobin2leg')) {
                prepareStage(s)
                createDrawPotTable(s)
                createStage(s)
            }
        })
    })
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

export const getShortTeamName = (id) => {
    if (!id) return
    const team = getTeamArray().find((t) => t.id === id)
    if (team) {
        if (team.short_name) {
            return team.short_name
        } else {
            return team.name
        }
    } else {
        console.log('Team error', team)
    }
}

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
