import React from 'react'
import Tournament from '../data/Tournament.json'
import ConfederationArray from '../data/Confederations.json'
import NationArray from '../data/Nations.json'
import MensTeamArray from '../data/teams/Mens.json'
import { getTeamArray } from './DataHelper'
import randomInteger from 'random-int'

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
        t.teams.forEach((t2) => {
            rank = rank + 1
            if (firstInPool) {
                result.push({ rank, ...t2, points: t.points })
                firstInPool = false
            } else {
                result.push({ rank: '--', ...t2, points: t.points })
            }
        })
    })
    result[result.length - 1].rank = ''
    result[result.length - 1].points = 0
    return result
}

export const getConfederationTeamArrays = (teamArray) => {
    const result = []
    ConfederationArray.forEach((c) => {
        if (c.id !== 'FIFA') {
            const confTeams = teamArray.filter((t) => t.confederation && t.confederation.id === c.id)
            confTeams.forEach((t, index) => (t.confRank = index + 1))
            result.push({ id: c.id, teams: confTeams })
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
    if (!teamArray || !tournament) return
    const result = []
    const confederation_id = tournament.details.host.confederation_id
    const teams = teamArray.filter((t) => t.confederation && t.confederation.id === confederation_id)
    const host_count = tournament.details.host.teams.length
    randomHostIndex(host_count, confederation_id).forEach((i) => {
        const team = { ...teams[i], qualificationMethod: 'Hosts', qualificationDate: '2023-02-14' }
        result.push(team)
    })
    return result
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

export const getTeamFlag2 = (t, config) => {
    if (!t) return
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

export const getTeamFlagName2 = (t, config) => {
    if (!t) return
    return (
        <React.Fragment>
            {getTeamFlag2(t, config)}
            <span className="padding-top-xs">&nbsp;{t.name}</span>
        </React.Fragment>
    )
}

// Version 1

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

export const getTeamFlag = (id, config) => {
    if (!id) return
    return (
        <React.Fragment>
            {config.team_type_id === 'CLUB' && getClubLogoImg(id, config)}
            {config.team_type_id === 'CLUB' && getNationSmallFlagImg(id)}
            {config.team_type_id !== 'CLUB' && (
                <img
                    className="flag-sm flag-md margin-bottom-xs-4"
                    src={getFlagSrc(id)}
                    alt={`${id} ${getNationOfficialName(id)}`}
                    title={`${id} ${getNationOfficialName(id)}`}
                />
            )}
        </React.Fragment>
    )
}

export const getTeamFlagName = (id, config) => {
    if (!id) return
    return (
        <React.Fragment>
            {getTeamFlag(id, config)}
            <span className="padding-top-xs">&nbsp;{getTeamName(id)}</span>
        </React.Fragment>
    )
}

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

export const getTeamName = (id) => {
    if (!id) return
    const team = getTeamArray().find((t) => t.id === id)
    if (team) {
        return team.name
    } else {
        console.log('Team error', team)
    }
}

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
