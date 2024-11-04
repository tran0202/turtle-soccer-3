import React from 'react'
import ConfederationArray from '../data/Confederations.json'
import NationArray from '../data/Nations.json'
import MensTeamArray from '../data/teams/Mens.json'
import { getTeamArray, setNationDetails, setNationConfig } from './DataHelper'
import randomInteger from 'random-int'

export const getActiveFIFATeamArray = (teamArray) => {
    NationArray.forEach((n) => {
        setNationDetails(n)
        setNationConfig(n)
    })
    const result = []
    teamArray.forEach((t) => {
        const foundNation = NationArray.find((n) => t.nation_id === n.id && n.details.end_date === '' && n.config.fifa_member)
        t.nation = foundNation
        if (t.parent_team_id === '' && foundNation) {
            const foundConf = ConfederationArray.find((c) => foundNation.config.confederation_id === c.id)
            if (foundConf) {
                t.confederation = foundConf
            }
            result.push(t)
        }
    })
    return result
}

export const getRandomMensTeamArray = () => {
    const result = [],
        pool = []
    getActiveFIFATeamArray(MensTeamArray).forEach((t) => {
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
                    src={'/images/flags/' + t.nation.details.flag_filename}
                    alt={`${t.id} ${t.nation.details.official_name}`}
                    title={`${t.id} ${t.nation.details.official_name}`}
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
