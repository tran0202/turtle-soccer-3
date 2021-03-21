import React, { useState } from 'react'
import { getTeamArray } from './DataHelper'
import NationArray from '../data/Nation.json'
import { Row, Col, Tooltip } from 'reactstrap'
import moment from 'moment'

export const getTournamentConfig = (tournament) => {
  return {
    id: tournament.id,
    name: tournament.name,
    year: tournament.year,
    tournament_type_id: tournament.tournament_type_id,
    golden_goal_rule: tournament.golden_goal_rule,
    silver_goal_rule: tournament.silver_goal_rule,
    tiebreakers_collapsed: tournament.tiebreakers_collapsed,
    tiebreakers: tournament.tiebreakers,
    no_third_place: tournament.no_third_place,
    points_for_win: tournament.points_for_win,
    show_match_year: tournament.show_match_year,
    active: tournament.active,
    hero_images: tournament.hero_images,
    details: tournament.details,
    final_standings: tournament.final_standings,
    statistics: tournament.statistics,
    awards: tournament.awards,
  }
}

export const getTournamentTypeConfig = (tournamentType) => {
  return {
    team_type_id: tournamentType.team_type_id,
    confederation_id: tournamentType.confederation_id,
    logo_path: tournamentType.logo_path,
    sport_id: tournamentType.sport_id,
  }
}

const getFormat = (rrStage) => {
  const { groups, advancement, home_and_away, odd_format } = rrStage
  const groupCount = groups ? groups.length : 0
  const teamCount = groups && groups[0] && groups[0].teams ? groups[0].teams.length : 0
  return { groupCount, teamCount, totalCount: groupCount * teamCount, advancement, home_and_away, odd_format }
}

export const getStageConfig = (tournament, stage) => {
  if (!stage) return
  const format = getFormat(stage)
  // console.log('format', format)
  return stage.tiebreakers
    ? { ...getTournamentConfig(tournament), ...format, tiebreakers: stage.tiebreakers }
    : { ...getTournamentConfig(tournament), ...format }
}

export const getTournamentTitleFont = (tournamentType) => {
  let fontClassName
  switch (tournamentType.id) {
    case 'WC':
      fontClassName = 'h1-ff5 tournament-title-WC'
      break
    case 'WWC':
      fontClassName = 'tournament-title-WWC'
      break
    case 'MOFT':
      fontClassName = 'h1-ff5 tournament-title-MOFT'
      break
    case 'WOFT':
      fontClassName = 'tournament-title-WOFT'
      break
    case 'CONFEDC':
      fontClassName = 'h1-ff5 tournament-title-CONFEDC'
      break
    case 'EURO':
      fontClassName = 'tournament-title-EURO'
      break
    case 'UNL':
      fontClassName = 'h1-ff5 tournament-title-UNL'
      break
    case 'UCL':
      fontClassName = 'h1-ff5 tournament-title-UCL'
      break
    case 'UEL':
      fontClassName = 'h1-ff5 tournament-title-UEL'
      break
    case 'COPA':
      fontClassName = 'tournament-title-COPA'
      break
    case 'GC':
      fontClassName = 'tournament-title-GC'
      break
    case 'AFCON':
      fontClassName = 'tournament-title-AFCON'
      break
    case 'AAC':
      fontClassName = 'tournament-title-AAC'
      break
    case 'ONC':
      fontClassName = 'tournament-title-ONC'
      break
    default:
      fontClassName = 'h1-ff5 tournament-title'
  }
  return fontClassName
}

export const getAllocationStages = (stages) => {
  return stages ? stages.filter((s) => s.type === 'allocation') : null
}

export const getRoundRobinStages = (stages) => {
  return stages ? stages.filter((s) => s.type === 'roundrobin') : null
}

export const getRoundRobinMdStages = (stages) => {
  return stages ? stages.filter((s) => s.type === 'roundrobinmatchday') : null
}

export const getAllRoundRobinStages = (stages) => {
  return stages ? stages.filter((s) => s.type === 'roundrobin' || s.type === 'roundrobinmatchday' || s.type === 'roundrobinleaguematchday') : null
}

export const getLeagueRoundRobinMdStages = (leagues) => {
  if (!leagues) return null
  const rrLeagues = []
  leagues.forEach((l) => {
    if (l.stages) {
      const rrStages = l.stages.filter((s) => s.type === 'roundrobinleaguematchday')
      if (rrStages.length > 0) {
        rrLeagues.push({ ...l, stages: rrStages })
      }
    }
  })
  return rrLeagues
}

export const getKnockoutStages = (stages) => {
  return stages ? stages.filter((s) => s.type === 'knockout' || s.type === 'knockout2legged') : null
}

export const getKnockoutMultiple2LeggedStages = (stages) => {
  return stages ? stages.filter((s) => s.type === 'knockoutmultiple2legged') : null
}

export const splitPathMatches = (stage, round) => {
  // console.log('stage', stage)
  if (!stage.multiple_paths || !round || !round.matches) return []
  return [
    { path: 'Champions', matches: round.matches.filter((m) => m.path === 'Champions') },
    { path: 'League', matches: round.matches.filter((m) => m.path === 'League') },
    { path: 'Main', matches: round.matches.filter((m) => m.path === 'Main') },
  ]
}

export const splitPathDatesMatches = (round) => {
  if (!round || !round.dates || !round.matches) return []
  const _matches = []
  round.dates.forEach((d) => {
    round.matches[d].forEach((m) => {
      _matches.push(m)
    })
  })
  const championMatches = _matches.filter((m) => m.path === 'Champions')
  const leagueMatches = _matches.filter((m) => m.path === 'League')
  const mainMatches = _matches.filter((m) => m.path === 'Main')
  const _championDates = []
  const _leagueDates = []
  const _mainDates = []
  const _championMatches = []
  const _leagueMatches = []
  const _mainMatches = []
  championMatches.forEach((m) => {
    if (_championDates.find((d) => d === m.date) === undefined) {
      _championDates.push(m.date)
    }
    if (!_championMatches[m.date]) {
      _championMatches[m.date] = []
    }
    _championMatches[m.date].push(m)
  })
  leagueMatches.forEach((m) => {
    if (_leagueDates.find((d) => d === m.date) === undefined) {
      _leagueDates.push(m.date)
    }
    if (!_leagueMatches[m.date]) {
      _leagueMatches[m.date] = []
    }
    _leagueMatches[m.date].push(m)
  })
  mainMatches.forEach((m) => {
    if (_mainDates.find((d) => d === m.date) === undefined) {
      _mainDates.push(m.date)
    }
    if (!_mainMatches[m.date]) {
      _mainMatches[m.date] = []
    }
    _mainMatches[m.date].push(m)
  })
  _championDates.sort((a, b) => {
    if (a > b) {
      return 1
    } else if (a < b) {
      return -1
    } else {
      return 0
    }
  })
  _leagueDates.sort((a, b) => {
    if (a > b) {
      return 1
    } else if (a < b) {
      return -1
    } else {
      return 0
    }
  })
  _mainDates.sort((a, b) => {
    if (a > b) {
      return 1
    } else if (a < b) {
      return -1
    } else {
      return 0
    }
  })
  return [
    { path: 'Champions', dates: _championDates, matches: _championMatches },
    { path: 'League', dates: _leagueDates, matches: _leagueMatches },
    { path: 'Main', dates: _mainDates, matches: _mainMatches },
  ]
}

export const getDefaultStageTab = (stages) => {
  if (!stages || stages.length === 0) return 'Group-Stage'
  const defaultStageIndex = stages.findIndex((s) => s.default)
  const defaultStageName = defaultStageIndex > -1 ? stages[defaultStageIndex].name : stages[0].name
  return defaultStageName ? defaultStageName.replace(' ', '-') : ''
}

export const getDefaultMdTab = (leagues) => {
  const temp = 'Matchday-1'
  if (!leagues || leagues.length === 0) return temp
  const _l = leagues.find((l) => l.default_matchday)
  return _l !== undefined ? _l.default_matchday.replace(' ', '-') : temp
}

export const getDefaultLeagueTab = (leagues) => {
  const temp = 'League-A'
  if (!leagues || leagues.length === 0) return temp
  const _l = leagues.find((l) => l.default)
  return _l !== undefined ? _l.name.replace(' ', '-') : temp
}

export const getFlagSrc = (id) => {
  if (!id) return
  const team = getTeamArray().find((t) => t.id === id)
  if (team) {
    const nation = NationArray.find((n) => n.id === team.nation_id)
    if (nation) {
      return '/assets/images/flags/' + nation.flag_filename
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
          <img className="flag-xs-2 flag-sm-3" src={`/assets/images/flags/${nation.flag_filename}`} alt={nation.id} title={nation.id} />
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
        <img className="flag-club-sm flag-club-md" src={`/assets/images/${config.logo_path}/${team.logo_filename}`} alt={id} title={id} />
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
      {config.team_type_id !== 'CLUB' && <img className="flag-sm flag-md" src={getFlagSrc(id)} alt={id} title={id} />}
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
      return nation.official_name
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

export const isSharedBronze = (match) => {
  return match.shared_bronze
}

export const isSuccessor = (id) => {
  const team = getTeamArray().find((t) => t.id === id)
  return !team.successor ? false : team.successor
}

export const isWinner = (who, match) => {
  // console.log('match', match)
  if (match) {
    if (who === 'H') {
      if (match.match_void) return match.away_withdrew
      return (
        match.home_walkover ||
        match.home_coin_toss ||
        match.home_bye ||
        match.home_playoff_win ||
        (!match.second_leg &&
          (match.home_score > match.away_score ||
            (match.home_score === match.away_score && match.home_extra_score > match.away_extra_score) ||
            (match.home_score === match.away_score &&
              match.home_extra_score === match.away_extra_score &&
              match.home_penalty_score > match.away_penalty_score) ||
            match.home_replay_score > match.away_replay_score)) ||
        (match.second_leg && match.home_aggregate_score_2nd_leg > match.away_aggregate_score_2nd_leg) ||
        (match.second_leg &&
          match.home_aggregate_score_2nd_leg === match.away_aggregate_score_2nd_leg &&
          match.home_penalty_score > match.away_penalty_score) ||
        (match.second_leg && match.aggregate_team_2nd_leg === match.home_team)
      )
    } else {
      if (match.match_void) return match.home_withdrew
      return (
        match.away_walkover ||
        match.away_coin_toss ||
        (!match.second_leg &&
          (match.home_score < match.away_score ||
            (match.home_score === match.away_score && match.home_extra_score < match.away_extra_score) ||
            (match.home_score === match.away_score &&
              match.home_extra_score === match.away_extra_score &&
              match.home_penalty_score < match.away_penalty_score) ||
            match.home_replay_score < match.away_replay_scoreg)) ||
        (match.second_leg && match.home_aggregate_score_2nd_leg < match.away_aggregate_score_2nd_leg) ||
        (match.second_leg &&
          match.home_aggregate_score_2nd_leg === match.away_aggregate_score_2nd_leg &&
          match.home_penalty_score < match.away_penalty_score) ||
        (match.second_leg && match.aggregate_team_2nd_leg === match.away_team)
      )
    }
  }
}

export const isAggregateWinner = (who, match) => {
  // console.log('match', match)
  if (match.match_type === 'firstlegonly') {
    return isWinner(who, match)
  }
  if (match) {
    if (who === 'H') {
      return (
        match.match_type === 'firstleg' &&
        (match.home_aggregate_score_1st_leg > match.away_aggregate_score_1st_leg ||
          match.aggregate_team_1st_leg === match.home_team ||
          (match.home_aggregate_score_1st_leg === match.away_aggregate_score_1st_leg && match.home_penalty_score_2nd_leg > match.away_penalty_score_2nd_leg))
      )
    } else {
      return (
        match.match_type === 'firstleg' &&
        (match.home_aggregate_score_1st_leg < match.away_aggregate_score_1st_leg ||
          match.aggregate_team_1st_leg === match.away_team ||
          (match.home_aggregate_score_1st_leg === match.away_aggregate_score_1st_leg && match.home_penalty_score_2nd_leg < match.away_penalty_score_2nd_leg))
      )
    }
  }
}

export const isAwayGoalsWinner = (who, match) => {
  // console.log('match', match)
  if (match) {
    if (who === 'H') {
      return match.match_type === 'firstleg' && match.aggregate_team_1st_leg === match.home_team
    } else {
      return match.match_type === 'firstleg' && match.aggregate_team_1st_leg === match.away_team
    }
  }
}

export const getMatchArrayByDate = (round, sorted) => {
  let tmp = []
  let tmpPlayoff = []
  let tmpReplay = []
  round &&
    round.matches &&
    round.matches.forEach((m) => {
      if (!m.group_playoff && !m.replay) {
        tmp.push(m)
      } else if (m.replay) {
        tmpReplay.push(m)
      } else {
        tmpPlayoff.push(m)
      }
    })
  if (tmpPlayoff.length === 0 && tmpReplay.length === 0) {
    return getDateMatchArrayPair(tmp, sorted)
  } else if (tmpReplay.length > 0) {
    return [getDateMatchArrayPair(tmp, sorted), { ...getDateMatchArrayPair(tmpReplay, sorted), name: `${round.name} Replay` }]
  } else {
    return [getDateMatchArrayPair(tmp, sorted), { ...getDateMatchArrayPair(tmpPlayoff, sorted), name: 'Playoff' }]
  }
}

export const getDateMatchArrayPair = (matches_array, sorted) => {
  let matches = [],
    dates = []
  if (matches_array) {
    if (sorted) {
      matches_array.sort((a, b) => {
        if (a.date + a.time < b.date + b.time) {
          return -1
        } else if (a.date + a.time > b.date + a.time) {
          return 1
        } else {
          return 0
        }
      })
    }
    matches_array.forEach((t) => {
      if (!matches[t.date]) {
        dates.push(t.date)
        matches[t.date] = []
      }
      matches[t.date].push(t)
    })
  }
  return { dates, matches }
}

export const reorderMatches = (matches) => {
  matches &&
    matches.sort((a, b) => {
      if (a.bracket_order < b.bracket_order) {
        return -1
      } else if (a.bracket_order > b.bracket_order) {
        return 1
      } else {
        return 0
      }
    })
  return matches
}

export const getFinalPathStage = (stage) => {
  if (!stage.rounds) return
  const newRounds = stage.rounds.filter(
    (r) =>
      r.name !== 'Consolation First Round' &&
      r.name !== 'Consolation Semi-finals' &&
      r.name !== 'Fifth-place' &&
      r.name !== 'Playoff First Round' &&
      r.name !== 'Playoff Second Round',
  )
  return { ...stage, rounds: newRounds }
}

export const getConsolationPathStage = (stage) => {
  if (!stage.rounds) return
  const newRounds = stage.rounds.filter(
    (r) =>
      r.name === 'Consolation First Round' ||
      r.name === 'Consolation Semi-finals' ||
      r.name === 'Fifth-place' ||
      r.name === 'Playoff First Round' ||
      r.name === 'Playoff Second Round',
  )
  return { ...stage, rounds: newRounds }
}

export const getBracketStage = (stage) => {
  if (!stage) return {}
  const rounds = []
  stage.rounds &&
    stage.rounds.forEach((r) => {
      const roundMatches = []
      r.matches &&
        r.matches.forEach((m) => {
          roundMatches.push(m)
        })
      rounds.push({ ...r, matches: reorderMatches(roundMatches) })
    })
  return { ...stage, rounds }
}

export const collectPairMatches = (round) => {
  if (!round || !round.pairs) return []
  const matches = []
  round.pairs.forEach((p) => {
    p &&
      p.matches &&
      p.matches.forEach((m) => {
        matches.push(m)
      })
  })
  round.matches = matches
}

export const collectMdMatches = (group) => {
  let matches = []
  group.matchdays &&
    group.matchdays.forEach((md) => {
      md.matches &&
        md.matches.forEach((m) => {
          matches.push(m)
        })
    })
  group.matches = matches
}

export const collectMdMatchesPair = (stage) => {
  const { groups } = stage
  let all_matches = []
  let tmp = []
  let mdMatches = []
  let matchdays = []
  groups &&
    groups.forEach((g) => {
      g &&
        g.matchdays &&
        g.matchdays.forEach((md) => {
          if (md) {
            if (matchdays.find((_md) => _md === md.name) === undefined) {
              matchdays.push(md.name)
            }
            md.matches &&
              md.matches.forEach((m) => {
                if (m) {
                  m.group = g.name
                  m.matchday = md.name
                  all_matches.push(m)
                }
              })
          }
        })
    })
  all_matches.forEach((m) => {
    if (!tmp[m.matchday]) {
      tmp[m.matchday] = []
    }
    tmp[m.matchday].push(m)
  })
  matchdays.forEach((md) => {
    if (tmp[md]) {
      mdMatches[md] = { matches: tmp[md] }
    }
  })
  // console.log('mdMatches', mdMatches)
  return { matchdays, mdMatches }
}

export const isKnockout2LeggedStageValid = (stage) => {
  if (stage.type !== 'knockout2legged') {
    console.log('Not a knockout2legged stage')
    return false
  }
  if (!stage.rounds || stage.rounds.length < 2) {
    console.log('Invalid knockout2legged stage')
    return false
  }
  const firstLeg = stage.rounds.find((r) => r.round_type === 'firstleg')
  let secondLeg = stage.rounds.find((r) => r.round_type === 'secondleg')
  if (!firstLeg.matches || firstLeg.matches.length === 0) {
    console.log('No matches in first leg')
    return false
  }
  if (!secondLeg.matches || secondLeg.matches.length === 0) {
    console.log('No matches in second leg')
  }
  return true
}

export const calculateAggregateScore = (stage) => {
  if (!isKnockout2LeggedStageValid(stage)) return

  const firstLeg = stage.rounds.find((r) => r.round_type === 'firstleg')
  let secondLeg = stage.rounds.find((r) => r.round_type === 'secondleg')
  let playoffLeg = stage.rounds.find((r) => r.round_type === 'playoffleg')
  secondLeg.matches.forEach((m2) => {
    playoffLeg &&
      playoffLeg.matches.some((m3) => {
        if (m2.home_team === m3.away_team && m2.away_team === m3.home_team) {
          if (m3.home_playoff_win) {
            m2.away_aggregate_playoff_win = m3.home_playoff_win
            m2.playoff_notes = m3.playoff_notes
          }
        }
        return m2.home_team === m3.away_team && m2.away_team === m3.home_team
      })
    firstLeg.matches.some((m1) => {
      if (m2.home_team === m1.away_team && m2.away_team === m1.home_team) {
        m1.round_type = firstLeg.round_type
        m2.round_type = secondLeg.round_type
        m1.first_leg = true
        m2.second_leg = true
        m1.home_score_2nd_leg = m2.away_score
        m1.away_score_2nd_leg = m2.home_score
        m1.home_extra_score_2nd_leg = m2.away_extra_score
        m1.away_extra_score_2nd_leg = m2.home_extra_score
        m1.home_penalty_score_2nd_leg = m2.away_penalty_score
        m1.away_penalty_score_2nd_leg = m2.home_penalty_score
        if (m1.home_awarded) {
          m1.home_awarded_1st_leg = m1.home_awarded
          m1.awarded_text_1st_leg = m1.awarded_text
        }
        if (m1.away_awarded) {
          m1.away_awarded_1st_leg = m1.away_awarded
          m1.awarded_text_1st_leg = m1.awarded_text
        }
        if (m2.home_awarded) {
          m1.home_awarded_2nd_leg = m2.home_awarded
          m1.awarded_text_2nd_leg = m2.awarded_text
          // console.log('home_awarded', m2.home_awarded)
          // console.log('awarded_text', m2.awarded_text)
        }
        if (m2.away_awarded) {
          m1.away_awarded_2nd_leg = m2.away_awarded
          m1.awarded_text_2nd_leg = m2.awarded_text
        }
        if (m1.home_score != null && m1.away_score != null && m2.home_score != null && m2.away_score != null) {
          m1.home_aggregate_score_1st_leg = parseInt(m1.home_score) + parseInt(m2.away_score)
          m1.away_aggregate_score_1st_leg = parseInt(m1.away_score) + parseInt(m2.home_score)
          if (m2.home_extra_score != null && m2.away_extra_score != null) {
            m1.home_aggregate_score_1st_leg = m1.home_aggregate_score_1st_leg + parseInt(m2.away_extra_score)
            m1.away_aggregate_score_1st_leg = m1.away_aggregate_score_1st_leg + parseInt(m2.home_extra_score)
          }
          m2.home_aggregate_score_2nd_leg = parseInt(m2.home_score) + parseInt(m1.away_score)
          m2.away_aggregate_score_2nd_leg = parseInt(m2.away_score) + parseInt(m1.home_score)
          if (m2.home_extra_score != null && m2.away_extra_score != null) {
            m2.home_aggregate_score_2nd_leg = m2.home_aggregate_score_2nd_leg + parseInt(m2.home_extra_score)
            m2.away_aggregate_score_2nd_leg = m2.away_aggregate_score_2nd_leg + parseInt(m2.away_extra_score)
          }
        }
        if (m1.home_aggregate_score_1st_leg === m1.away_aggregate_score_1st_leg) {
          if (m1.away_score > m2.away_score) {
            m1.aggregate_team_1st_leg = m2.home_team
          } else if (m1.away_score < m2.away_score) {
            m1.aggregate_team_1st_leg = m1.home_team
          } else if (m2.away_extra_score > 0) {
            m1.aggregate_team_1st_leg = m2.away_team
          }
        }
        if (m2.home_aggregate_score_2nd_leg === m2.away_aggregate_score_2nd_leg) {
          if (m1.away_score > m2.away_score) {
            m2.aggregate_team_2nd_leg = m2.home_team
          } else if (m1.away_score < m2.away_score) {
            m2.aggregate_team_2nd_leg = m1.home_team
          } else if (m2.away_extra_score > 0) {
            m2.aggregate_team_2nd_leg = m2.away_team
          }
        }
        if (m1.home_coin_toss) {
          m2.away_coin_toss = true
        } else if (m1.away_coin_toss) {
          m2.home_coin_toss = true
        } else if (m2.home_coin_toss) {
          m1.away_coin_toss = true
        } else if (m2.away_coin_toss) {
          m1.home_coin_toss = true
        }
        if (m1.bypass_away_goals) {
          m2.bypass_away_goals = m1.bypass_away_goals
        } else if (m2.bypass_away_goals) {
          m1.bypass_away_goals = m2.bypass_away_goals
        }
        if (m1.need_playoff) {
          firstLeg.need_playoff = m1.need_playoff
          secondLeg.need_playoff = m1.need_playoff
          m2.need_playoff = m1.need_playoff
        } else if (m2.need_playoff) {
          firstLeg.need_playoff = m2.need_playoff
          secondLeg.need_playoff = m2.need_playoff
          m1.need_playoff = m2.need_playoff
        }
        if (m2.away_aggregate_playoff_win) {
          m1.home_aggregate_playoff_win = m2.away_aggregate_playoff_win
          m1.playoff_notes = m2.playoff_notes
        }
      }
      return m2.home_team === m1.away_team && m2.away_team === m1.home_team
    })
  })
}

export const calculateAggregateScore2 = (round) => {
  if (!round || !round.pairs) return
  round.pairs.forEach((p) => {
    if (p.matches) {
      const m1 = p.matches.find((m) => m.match_type === 'firstleg')
      const m2 = p.matches.find((m) => m.match_type === 'secondleg')
      if (m1 !== undefined && m2 !== undefined && m2.home_team === m1.away_team && m2.away_team === m1.home_team) {
        // m1.round_type = firstLeg.round_type
        // m2.round_type = secondLeg.round_type
        m1.first_leg = true
        m2.second_leg = true
        m1.home_score_2nd_leg = m2.away_score
        m1.away_score_2nd_leg = m2.home_score
        m1.home_extra_score_2nd_leg = m2.away_extra_score
        m1.away_extra_score_2nd_leg = m2.home_extra_score
        m1.home_penalty_score_2nd_leg = m2.away_penalty_score
        m1.away_penalty_score_2nd_leg = m2.home_penalty_score
        if (m1.home_awarded) {
          m1.home_awarded_1st_leg = m1.home_awarded
          m1.awarded_text_1st_leg = m1.awarded_text
        }
        if (m1.away_awarded) {
          m1.away_awarded_1st_leg = m1.away_awarded
          m1.awarded_text_1st_leg = m1.awarded_text
        }
        if (m2.home_awarded) {
          m1.home_awarded_2nd_leg = m2.home_awarded
          m1.awarded_text_2nd_leg = m2.awarded_text
          // console.log('home_awarded', m2.home_awarded)
          // console.log('awarded_text', m2.awarded_text)
        }
        if (m2.away_awarded) {
          m1.away_awarded_2nd_leg = m2.away_awarded
          m1.awarded_text_2nd_leg = m2.awarded_text
        }
        if (m1.home_score != null && m1.away_score != null && m2.home_score != null && m2.away_score != null) {
          m1.home_aggregate_score_1st_leg = parseInt(m1.home_score) + parseInt(m2.away_score)
          m1.away_aggregate_score_1st_leg = parseInt(m1.away_score) + parseInt(m2.home_score)
          if (m2.home_extra_score != null && m2.away_extra_score != null) {
            m1.home_aggregate_score_1st_leg = m1.home_aggregate_score_1st_leg + parseInt(m2.away_extra_score)
            m1.away_aggregate_score_1st_leg = m1.away_aggregate_score_1st_leg + parseInt(m2.home_extra_score)
          }
          m2.home_aggregate_score_2nd_leg = parseInt(m2.home_score) + parseInt(m1.away_score)
          m2.away_aggregate_score_2nd_leg = parseInt(m2.away_score) + parseInt(m1.home_score)
          if (m2.home_extra_score != null && m2.away_extra_score != null) {
            m2.home_aggregate_score_2nd_leg = m2.home_aggregate_score_2nd_leg + parseInt(m2.home_extra_score)
            m2.away_aggregate_score_2nd_leg = m2.away_aggregate_score_2nd_leg + parseInt(m2.away_extra_score)
          }
        }
        if (m1.home_aggregate_score_1st_leg === m1.away_aggregate_score_1st_leg) {
          if (m1.away_score > m2.away_score) {
            m1.aggregate_team_1st_leg = m2.home_team
          } else if (m1.away_score < m2.away_score) {
            m1.aggregate_team_1st_leg = m1.home_team
          } else if (m2.away_extra_score > 0) {
            m1.aggregate_team_1st_leg = m2.away_team
          }
        }
        if (m2.home_aggregate_score_2nd_leg === m2.away_aggregate_score_2nd_leg) {
          if (m1.away_score > m2.away_score) {
            m2.aggregate_team_2nd_leg = m2.home_team
          } else if (m1.away_score < m2.away_score) {
            m2.aggregate_team_2nd_leg = m1.home_team
          } else if (m2.away_extra_score > 0) {
            m2.aggregate_team_2nd_leg = m2.away_team
          }
        }
        if (m1.home_coin_toss) {
          m2.away_coin_toss = true
        } else if (m1.away_coin_toss) {
          m2.home_coin_toss = true
        } else if (m2.home_coin_toss) {
          m1.away_coin_toss = true
        } else if (m2.away_coin_toss) {
          m1.home_coin_toss = true
        }
        if (m1.bypass_away_goals) {
          m2.bypass_away_goals = m1.bypass_away_goals
        } else if (m2.bypass_away_goals) {
          m1.bypass_away_goals = m2.bypass_away_goals
        }
        if (m1.need_playoff) {
          // firstLeg.need_playoff = m1.need_playoff
          // secondLeg.need_playoff = m1.need_playoff
          m2.need_playoff = m1.need_playoff
        } else if (m2.need_playoff) {
          // firstLeg.need_playoff = m2.need_playoff
          // secondLeg.need_playoff = m2.need_playoff
          m1.need_playoff = m2.need_playoff
        }
        if (m2.away_aggregate_playoff_win) {
          m1.home_aggregate_playoff_win = m2.away_aggregate_playoff_win
          m1.playoff_notes = m2.playoff_notes
        }
      }
      // console.log('m2', m2)
      // console.log('m1', m1)
    }
  })
}

export const isHomeLoseAggregate = (data) => {
  const {
    knockoutMatch,
    secondLegMatch,
    aggregate_team,
    away_team,
    home_score,
    away_score,
    home_extra_score,
    away_extra_score,
    home_penalty_score,
    away_penalty_score,
    home_aggregate_score,
    away_aggregate_score,
    match_void,
    need_playoff,
    away_withdrew,
  } = data
  if (!knockoutMatch) return false
  if (!secondLegMatch) {
    return (
      !(match_void && away_withdrew) &&
      ((home_score != null && away_score != null && home_score < away_score) ||
        (home_extra_score != null && away_extra_score != null && home_extra_score < away_extra_score) ||
        (home_penalty_score != null && home_penalty_score != null && home_penalty_score < away_penalty_score))
    )
  }
  return (
    (home_penalty_score != null && home_penalty_score != null && home_penalty_score < away_penalty_score) ||
    (!need_playoff && home_aggregate_score < away_aggregate_score) ||
    aggregate_team === away_team
  )
}

export const isAwayLoseAggregate = (data) => {
  const {
    knockoutMatch,
    secondLegMatch,
    aggregate_team,
    home_team,
    home_score,
    away_score,
    home_extra_score,
    away_extra_score,
    home_penalty_score,
    away_penalty_score,
    home_aggregate_score,
    away_aggregate_score,
    match_void,
    need_playoff,
    home_withdrew,
  } = data
  // console.log('data', data)
  if (!knockoutMatch) return false
  if (!secondLegMatch) {
    return (
      !(match_void && home_withdrew) &&
      ((home_score != null && away_score != null && home_score > away_score) ||
        (home_extra_score != null && away_extra_score != null && home_extra_score > away_extra_score) ||
        (home_penalty_score != null && home_penalty_score != null && home_penalty_score > away_penalty_score))
    )
  }
  return (
    (home_penalty_score != null && home_penalty_score != null && home_penalty_score > away_penalty_score) ||
    (!need_playoff && home_aggregate_score > away_aggregate_score) ||
    aggregate_team === home_team
  )
}

const DisplayAwayGoalsText = (props) => {
  const { param } = props
  const { aggregate_team, home_extra_score, away_extra_score } = param
  return (
    <React.Fragment>
      {aggregate_team && (
        <React.Fragment>
          &gt;&gt;&gt; <b>{getTeamName(aggregate_team)}</b> won on away goals
          {home_extra_score != null && away_extra_score != null && <React.Fragment>&nbsp;after extra time</React.Fragment>}
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

const DisplayExtraTimeText = (props) => {
  const { param } = props
  const {
    home_team,
    away_team,
    home_extra_score,
    away_extra_score,
    home_penalty_score,
    away_penalty_score,
    home_coin_toss,
    away_coin_toss,
    group_playoff,
    round_type,
    goldenGoal,
    silverGoal,
    void_notes,
  } = param
  return (
    <React.Fragment>
      {void_notes && <React.Fragment>&gt;&gt;&gt;&nbsp;{void_notes}</React.Fragment>}
      {!void_notes && (
        <React.Fragment>
          {home_extra_score != null && away_extra_score != null && (
            <React.Fragment>
              {home_penalty_score == null && away_penalty_score == null && !group_playoff && (
                <React.Fragment>
                  {home_extra_score !== away_extra_score && <React.Fragment>&nbsp;&gt;&gt;&gt;&nbsp;</React.Fragment>}
                  {home_extra_score > away_extra_score && (
                    <React.Fragment>
                      <b>{getTeamName(home_team)}</b>
                    </React.Fragment>
                  )}
                  {home_extra_score < away_extra_score && (
                    <React.Fragment>
                      <b>{getTeamName(away_team)}</b>
                    </React.Fragment>
                  )}
                  {home_extra_score !== away_extra_score && (
                    <React.Fragment>
                      {(goldenGoal || silverGoal) && home_penalty_score == null && away_penalty_score == null ? (
                        goldenGoal ? (
                          <React.Fragment>&nbsp;won on golden goal</React.Fragment>
                        ) : (
                          <React.Fragment>&nbsp;won on silver goal</React.Fragment>
                        )
                      ) : (
                        <React.Fragment>&nbsp;won after extra time</React.Fragment>
                      )}
                    </React.Fragment>
                  )}
                </React.Fragment>
              )}
            </React.Fragment>
          )}
          {home_penalty_score != null && away_penalty_score != null && (
            <React.Fragment>
              &nbsp;&gt;&gt;&gt;&nbsp;
              {home_penalty_score > away_penalty_score && (
                <React.Fragment>
                  <b>{getTeamName(home_team)}</b>
                </React.Fragment>
              )}
              {home_penalty_score < away_penalty_score && (
                <React.Fragment>
                  <b>{getTeamName(away_team)}</b>
                </React.Fragment>
              )}
              &nbsp;won on penalties&nbsp;
              <b>
                {home_penalty_score}-{away_penalty_score}
              </b>
              {home_extra_score == null && away_extra_score == null && <React.Fragment>&nbsp;(No extra time was played)</React.Fragment>}
            </React.Fragment>
          )}
          {home_coin_toss && (round_type === 'secondleg' || round_type === undefined) && (
            <React.Fragment>
              &nbsp;&gt;&gt;&gt;&nbsp;<b>{getTeamName(home_team)}</b> won on coin toss
            </React.Fragment>
          )}
          {away_coin_toss && (round_type === 'secondleg' || round_type === undefined) && (
            <React.Fragment>
              &nbsp;&gt;&gt;&gt;&nbsp;<b>{getTeamName(away_team)}</b> won on coin toss
            </React.Fragment>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export const DisplayKnockout2LeggedMatch = (props) => {
  const { m, config } = props
  const homeLoseData = {
    knockoutMatch: true,
    secondLegMatch: m.match_type !== 'firstlegonly',
    aggregate_team: m.aggregate_team_1st_leg,
    away_team: m.away_team,
    home_score: m.home_score,
    away_score: m.away_score,
    home_extra_score: m.home_extra_score,
    away_extra_score: m.away_extra_score,
    home_penalty_score: m.home_penalty_score_2nd_leg,
    away_penalty_score: m.away_penalty_score_2nd_leg,
    home_aggregate_score: m.home_aggregate_score_1st_leg,
    away_aggregate_score: m.away_aggregate_score_1st_leg,
    need_playoff: m.need_playoff,
  }
  const awayLoseData = {
    knockoutMatch: true,
    secondLegMatch: m.match_type !== 'firstlegonly',
    aggregate_team: m.aggregate_team_1st_leg,
    home_team: m.home_team,
    home_score: m.home_score,
    away_score: m.away_score,
    home_extra_score: m.home_extra_score,
    away_extra_score: m.away_extra_score,
    home_penalty_score: m.home_penalty_score_2nd_leg,
    away_penalty_score: m.away_penalty_score_2nd_leg,
    home_aggregate_score: m.home_aggregate_score_1st_leg,
    away_aggregate_score: m.away_aggregate_score_1st_leg,
    need_playoff: m.need_playoff,
  }
  return (
    <React.Fragment>
      <Row className="padding-top-md">
        <Col
          className={`team-name text-uppercase text-right team-name-no-padding-right col-box-25${
            isHomeLoseAggregate(homeLoseData) || m.away_walkover || m.away_coin_toss ? ' gray3' : ''
          }`}
        >
          {getTeamName(m.home_team)}
          {m.home_aggregate_playoff_win && <PlayoffWinTooltip target={`playoffWin_${m.home_team}_${m.away_team}`} notes={m.playoff_notes} />}
        </Col>
        <Col className="padding-top-sm text-center col-box-10">{getTeamFlag(m.home_team, config)}</Col>
        <Col className="score text-center score-no-padding-right col-box-10">
          {m.home_score != null && m.away_score != null && (
            <React.Fragment>
              {m.walkover && <WalkoverTooltip target={`walkover_${m.home_team}_${m.away_team}`} content={m.walkover} anchor="(w/o)" />}
              {!m.walkover && (
                <React.Fragment>
                  {m.home_score}-{m.away_score}
                </React.Fragment>
              )}
              {(m.home_awarded_1st_leg || m.away_awarded_1st_leg) && m.awarded_text_1st_leg && (
                <AwardedTooltip target={`awarded_${m.home_team}_${m.away_team}`} content={m.awarded_text_1st_leg} />
              )}
            </React.Fragment>
          )}
        </Col>
        <Col className="score text-center score-no-padding-right col-box-10">
          {m.home_score_2nd_leg != null && m.away_score_2nd_leg != null && m.home_extra_score_2nd_leg == null && m.away_extra_score_2nd_leg == null && (
            <React.Fragment>
              {m.home_score_2nd_leg}-{m.away_score_2nd_leg}
            </React.Fragment>
          )}
          {m.home_extra_score_2nd_leg != null && m.away_extra_score_2nd_leg != null && (
            <React.Fragment>
              {parseInt(m.home_score_2nd_leg) + parseInt(m.home_extra_score_2nd_leg)}-{parseInt(m.away_score_2nd_leg) + parseInt(m.away_extra_score_2nd_leg)}
              <AetTooltip target="aetTooltip3" anchor="(a.e.t.)" />
            </React.Fragment>
          )}
          {(m.home_awarded_2nd_leg || m.away_awarded_2nd_leg) && m.awarded_text_2nd_leg && (
            <AwardedTooltip target={`awarded_${m.home_team}_${m.away_team}`} content={m.awarded_text_2nd_leg} />
          )}
        </Col>
        <Col className="score text-center score-no-padding-right col-box-10">
          {m.home_aggregate_score_1st_leg != null && m.away_aggregate_score_1st_leg != null && (
            <React.Fragment>
              {m.home_aggregate_score_1st_leg}-{m.away_aggregate_score_1st_leg}
            </React.Fragment>
          )}
        </Col>
        <Col className="padding-top-sm text-center flag-no-padding-left col-box-10">{getTeamFlag(m.away_team, config)}</Col>
        <Col
          className={`team-name text-uppercase col-box-25${
            isAwayLoseAggregate(awayLoseData) || m.home_walkover || m.home_aggregate_playoff_win || m.home_coin_toss ? ' gray3' : ''
          }`}
        >
          {getTeamName(m.away_team)}
        </Col>
      </Row>
      <Row>
        <Col sm={{ size: 6, offset: 6 }} xs={{ size: 6, offset: 6 }} className="aggregate_text margin-top-sm">
          {m.home_aggregate_score_1st_leg != null && m.away_aggregate_score_1st_leg != null && !m.bypass_away_goals && (
            <DisplayAwayGoalsText
              param={{ aggregate_team: m.aggregate_team_1st_leg, home_extra_score: m.home_extra_score_2nd_leg, away_extra_score: m.away_extra_score_2nd_leg }}
            />
          )}
          <DisplayExtraTimeText
            param={{
              home_team: m.home_team,
              away_team: m.away_team,
              home_extra_score: m.home_extra_score_2nd_leg,
              away_extra_score: m.away_extra_score_2nd_leg,
              home_penalty_score: m.home_penalty_score_2nd_leg,
              away_penalty_score: m.away_penalty_score_2nd_leg,
              home_coin_toss: m.home_coin_toss,
              away_coin_toss: m.away_coin_toss,
            }}
          />
        </Col>
      </Row>
      <Row className="padding-tb-md border-bottom-gray5"></Row>
    </React.Fragment>
  )
}

export const DisplayMatch = (props) => {
  const { m, config } = props
  const homeLoseData = {
    knockoutMatch: config.knockoutMatch,
    secondLegMatch: config.secondLegMatch,
    aggregate_team: m.aggregate_team_2nd_leg,
    away_team: m.away_team,
    home_score: m.home_score,
    away_score: m.away_score,
    home_extra_score: m.home_extra_score,
    away_extra_score: m.away_extra_score,
    home_penalty_score: m.home_penalty_score,
    away_penalty_score: m.away_penalty_score,
    home_aggregate_score: m.home_aggregate_score_2nd_leg,
    away_aggregate_score: m.away_aggregate_score_2nd_leg,
    match_void: m.match_void,
    need_playoff: m.need_playoff,
    home_withdrew: m.home_withdrew,
    away_withdrew: m.away_withdrew,
  }
  const awayLoseData = {
    knockoutMatch: config.knockoutMatch,
    secondLegMatch: config.secondLegMatch,
    aggregate_team: m.aggregate_team_2nd_leg,
    home_team: m.home_team,
    home_score: m.home_score,
    away_score: m.away_score,
    home_extra_score: m.home_extra_score,
    away_extra_score: m.away_extra_score,
    home_penalty_score: m.home_penalty_score,
    away_penalty_score: m.away_penalty_score,
    home_aggregate_score: m.home_aggregate_score_2nd_leg,
    away_aggregate_score: m.away_aggregate_score_2nd_leg,
    match_void: m.match_void,
    need_playoff: m.need_playoff,
    home_withdrew: m.home_withdrew,
    away_withdrew: m.away_withdrew,
  }
  // console.log('awayLoseData', awayLoseData)
  // console.log('isAwayLoseAggregate(awayLoseData)', isAwayLoseAggregate(awayLoseData))
  const borderBottomColor = m.match_type === 'secondleg' || m.match_type === 'firstlegonly' ? 'border-bottom-gray2' : 'border-bottom-gray5'
  return (
    <Col sm="12" className={`padding-tb-md ${borderBottomColor}`}>
      <Row>
        <Col sm="2" xs="1" className="font-10 margin-top-time-xs">
          {config.hideDateGroup && (
            <React.Fragment>{config.showMatchYear ? moment(m.date).format('dddd, MMMM D, YYYY') : moment(m.date).format('dddd, MMMM D')}</React.Fragment>
          )}
          <br />
          {m.time}
          {m.group && (
            <React.Fragment>
              <br />
              {m.group} {m.group_playoff ? 'Playoff' : ''}
            </React.Fragment>
          )}
          <span className="no-display-xs">
            <br />
            {m.stadium}
          </span>
          <span className="no-display-xs">
            <br />
            {m.city}
          </span>
        </Col>
        <Col
          sm="3"
          xs="3"
          className={`team-name text-uppercase text-right team-name-no-padding-right${
            isHomeLoseAggregate(homeLoseData) || m.away_walkover || (m.away_coin_toss && m.round_type !== 'firstleg') || m.home_withdrew || m.postponed
              ? ' gray3'
              : ''
          }`}
        >
          {getTeamName(m.home_team)}
          {m.home_bye && <ByeTooltip target={`byeTooltip_${m.home_team}_${m.away_team}`} anchor="(bye)" notes={m.bye_notes} />}
          {m.home_withdrew && <span className="withdrew-subscript">(withdrew)</span>}
          {m.home_playoff_win && <PlayoffWinTooltip target={`playoffWin_${m.home_team}_${m.away_team}`} notes={m.playoff_notes} />}
          {m.home_awarded_adjust && m.awarded_adjust_text && (
            <AwardedTooltip target={`awardedAdjust_${m.home_team}_${m.away_team}`} content={m.awarded_adjust_text} />
          )}
        </Col>
        <Col sm="1" xs="1" className="padding-top-sm text-center">
          {getTeamFlag(m.home_team, config)}
        </Col>

        <Col sm="2" xs="2" className={`score text-center score-no-padding-right${m.postponed ? ' withdrew-subscript gray3' : ''}`}>
          {(m.home_extra_score == null || m.away_extra_score == null) && (
            <React.Fragment>
              {m.walkover && <WalkoverTooltip target={`walkover_${m.home_team}_${m.away_team}`} content={m.walkover} anchor="(w/o)" />}
              {m.postponed && (
                <React.Fragment>
                  postponed
                  {m.postponed_notes && (
                    <React.Fragment>
                      <br></br>
                      {m.postponed_notes}
                    </React.Fragment>
                  )}
                </React.Fragment>
              )}
              {m.match_cancelled && (
                <React.Fragment>
                  cancelled
                  <CancelledTooltip target={`cancelled_${m.home_team}_${m.away_team}`} notes={m.cancelled_text} />
                </React.Fragment>
              )}
              {!m.walkover && !m.postponed && !m.match_cancelled && (
                <React.Fragment>
                  {m.home_score}-{m.away_score}
                </React.Fragment>
              )}
            </React.Fragment>
          )}
          {m.home_extra_score != null && m.away_extra_score != null && (
            <React.Fragment>
              {parseInt(m.home_score) + parseInt(m.home_extra_score)}-{parseInt(m.away_score) + parseInt(m.away_extra_score)}
              {(config.goldenGoal || config.silverGoal) &&
              (m.home_extra_score !== 0 || m.away_extra_score !== 0) &&
              m.home_penalty_score == null &&
              m.away_penalty_score == null ? (
                config.goldenGoal ? (
                  <GoldenGoalTooltip target="goldengoalTooltip" anchor="(g.g.)" />
                ) : (
                  <SilverGoalTooltip target="silvergoalTooltip" anchor="(s.g.)" />
                )
              ) : (
                <AetTooltip target="aetTooltip" anchor="(a.e.t.)" />
              )}
            </React.Fragment>
          )}
          {(m.home_awarded || m.home_awarded_score_not_counted || m.away_awarded) && m.awarded_text && (
            <AwardedTooltip target={`awarded_${m.home_team}_${m.away_team}`} content={m.awarded_text} />
          )}
          {m.extra_140 && <Extra140Tooltip target={`extra140`} />}
        </Col>
        <Col sm="1" xs="1" className="padding-top-sm text-center flag-no-padding-left">
          {getTeamFlag(m.away_team, config)}
        </Col>
        <Col
          sm="3"
          xs="3"
          className={`team-name text-uppercase${
            isAwayLoseAggregate(awayLoseData) ||
            m.home_walkover ||
            m.home_playoff_win ||
            (m.home_coin_toss && m.round_type !== 'firstleg') ||
            m.home_bye ||
            m.away_withdrew ||
            m.postponed
              ? ' gray3'
              : ''
          }`}
        >
          {getTeamName(m.away_team)}
          {m.away_disqualified && <DisqualifiedTooltip target="disqualifiedTooltip" anchor="(dq)" notes={m.disqualified_notes} />}
          {m.away_replacement && <ReplacementTooltip target="replacementTooltip" notes={m.replacement_notes} />}
          {m.away_withdrew && <span className="withdrew-subscript">(withdrew)</span>}
        </Col>
      </Row>
      <Row>
        <Col sm={{ size: 6, offset: 6 }} xs={{ size: 7, offset: 5 }} className="aggregate_text margin-top-sm">
          {m.home_aggregate_score_2nd_leg != null && m.away_aggregate_score_2nd_leg != null && (
            <React.Fragment>
              Aggregate:&nbsp;
              <b>
                {m.home_aggregate_score_2nd_leg}-{m.away_aggregate_score_2nd_leg}
              </b>
              {!m.bypass_away_goals && (
                <DisplayAwayGoalsText
                  param={{ aggregate_team: m.aggregate_team_2nd_leg, home_extra_score: m.home_extra_score, away_extra_score: m.away_extra_score }}
                />
              )}
            </React.Fragment>
          )}
          <DisplayExtraTimeText
            param={{
              home_team: m.home_team,
              away_team: m.away_team,
              home_extra_score: m.home_extra_score,
              away_extra_score: m.away_extra_score,
              home_penalty_score: m.home_penalty_score,
              away_penalty_score: m.away_penalty_score,
              home_coin_toss: m.home_coin_toss,
              away_coin_toss: m.away_coin_toss,
              group_playoff: m.group_playoff,
              round_type: m.round_type,
              goldenGoal: config.goldenGoal,
              silverGoal: config.silverGoal,
              void_notes: m.void_notes,
            }}
          />
          {isSharedBronze(m) && <React.Fragment>&gt;&gt;&gt;&nbsp;{m.shared_bronze_text}</React.Fragment>}
        </Col>
      </Row>
    </Col>
  )
}

export const DisplaySchedule2 = (props) => {
  const { round, config } = props
  const { showMatchYear, hideDateGroup } = config
  const { dates, matches } = round
  // if (!matches || matches.length === 0) return null
  return (
    <React.Fragment>
      {dates && dates.length > 0 && config.path_name && (
        <Row>
          <Col>
            <div className="h3-ff6 margin-top-md">{config.path_name}</div>
          </Col>
        </Row>
      )}
      {dates &&
        dates.map((value) => (
          <Row key={value}>
            {!hideDateGroup && (
              <Col sm="12" className="h4-ff3 border-bottom-gray2 margin-top-md">
                {showMatchYear ? moment(value).format('dddd, MMMM D, YYYY') : moment(value).format('dddd, MMMM D')}
              </Col>
            )}
            {matches[value].map((m, index) => (
              <DisplayMatch m={m} config={config} key={index} />
            ))}
          </Row>
        ))}
    </React.Fragment>
  )
}

export const DisplaySchedule = (props) => {
  const { round, config } = props
  const { multiple_paths } = config
  // console.log('multiple_paths', multiple_paths)
  const { name, dates, consolation_notes } = round
  const pathDatesMatches = multiple_paths ? splitPathDatesMatches(round) : []
  dates.sort((a, b) => {
    if (a > b) {
      return 1
    } else if (a < b) {
      return -1
    } else {
      return 0
    }
  })
  let groupName =
    name && (config.tournamentTypeId === 'MOFT' || config.tournamentTypeId === 'WOFT')
      ? name.replace('Third-place', 'Bronze medal match').replace('Final', 'Gold medal match')
      : name
  return (
    <React.Fragment>
      <Row>
        <Col>
          <div className="h2-ff1 margin-top-md">
            {groupName}
            {(groupName === 'Consolation First Round' || groupName === 'Consolation Semi-finals' || groupName === 'Playoff First Round') &&
              consolation_notes && <ConsolationTooltip target="consolationTooltip" notes={consolation_notes} />}
            {groupName === 'Playoff Second Round' && <PlayoffSecondRoundTooltip target="playoffSecondRoundTooltip" />}
          </div>
        </Col>
      </Row>
      {!multiple_paths && <DisplaySchedule2 round={round} config={config} />}
      {multiple_paths &&
        pathDatesMatches.map((p) => (
          <DisplaySchedule2 round={{ dates: p.dates, matches: p.matches }} config={{ ...config, path_name: `${p.path} Path` }} key={p.path} />
        ))}
    </React.Fragment>
  )
}

export const AetTooltip = (props) => {
  const { target, anchor } = props
  const content = 'After extra time'
  return <TopTooltip target={target} content={content} anchor={anchor} />
}

export const AwayGoalsTooltip = (props) => {
  const { target, anchor } = props
  const content = 'Won on away goals'
  return <TopTooltip target={target} content={content} anchor={anchor} />
}

export const GoldenGoalTooltip = (props) => {
  const { target, anchor } = props
  const content = 'Golden goal'
  return <TopTooltip target={target} content={content} anchor={anchor} />
}

export const SilverGoalTooltip = (props) => {
  const { target, anchor } = props
  const content = 'Silver goal'
  return <TopTooltip target={target} content={content} anchor={anchor} />
}

export const PenTooltip = (props) => {
  const { target, anchor } = props
  const content = 'Penalty shoot-out'
  return <TopTooltip target={target} content={content} anchor={anchor} />
}

export const ReplayTooltip = (props) => {
  const { target, anchor } = props
  const content = 'Replay'
  return <TopTooltip target={target} content={content} anchor={anchor} />
}

export const CoinTossTooltip = (props) => {
  const { target, anchor } = props
  const content = 'Coin toss'
  return <TopTooltip target={target} content={content} anchor={anchor} />
}

export const ByeTooltip = (props) => {
  const { target, anchor, notes } = props
  const content = `Bye${notes ? `: ${notes}` : ''}`
  return <TopTooltip target={target} content={content} anchor={anchor} />
}

export const WithdrewTooltip = (props) => {
  const { target, anchor } = props
  const content = 'Withdrew'
  return <TopTooltip target={target} content={content} anchor={anchor} />
}

export const MatchPostponedTooltip = (props) => {
  const { target, anchor, notes } = props
  const content = `Match postponed ${notes ? notes : ''}`
  return <TopTooltip target={target} content={content} anchor={anchor} />
}

export const MatchVoidedTooltip = (props) => {
  const { target, anchor, notes } = props
  const content = `Match voided${notes ? `: ${notes}` : ''}`
  return <TopTooltip target={target} content={content} anchor={anchor} />
}

export const ReplacementTooltip = (props) => {
  const { target, notes } = props
  const content = `Replacement${notes ? `: ${notes}` : ''}`
  return <TopTooltip target={target} content={content} />
}

export const PlayoffWinTooltip = (props) => {
  const { target, notes } = props
  const content = `Playoff${notes ? `: ${notes}` : ''}`
  return <TopTooltip target={target} content={content} />
}

export const DisqualifiedTooltip = (props) => {
  const { target, anchor, notes } = props
  const content = `Disqualified${notes ? `: ${notes}` : ''}`
  return <TopTooltip target={target} content={content} anchor={anchor} />
}

export const FairPlayTooltip = (props) => {
  const { target, fp_notes } = props
  const content = `Fair play points: ${fp_notes}`
  return <TopTooltip target={target} content={content} />
}

export const Head2HeadTooltip = (props) => {
  const { target, h2h_notes, group_playoff } = props
  const content = group_playoff ? `Playoff: ${h2h_notes}` : `Head-to-head: ${h2h_notes}`
  return <TopTooltip target={target} content={content} />
}

export const DrawLotTooltip = (props) => {
  const { target, draw_lot_notes } = props
  const content = `Drawing lots: ${draw_lot_notes}`
  return <TopTooltip target={target} content={content} />
}

export const AwardedTooltip = (props) => {
  const { target, content } = props
  return <TopTooltip target={target} content={content} anchor="(awd.)" />
}

export const SharedBronzeTooltip = (props) => {
  const { target, notes } = props
  return <TopTooltip target={target} content={notes} />
}

export const GoldenBallRejectedTooltip = (props) => {
  const { target, notes } = props
  const content = `Award Rejected${notes ? `: ${notes}` : ''}`
  return <TopTooltip target={target} content={content} />
}

export const ConsolationTooltip = (props) => {
  const { target, notes } = props
  const content = notes
  return <TopTooltip target={target} content={content} />
}

export const PlayoffSecondRoundTooltip = (props) => {
  const { target } = props
  const content = `Winner will face Netherlands for the silver medal`
  return <TopTooltip target={target} content={content} />
}

export const SemifinalistsTooltip = (props) => {
  const { target } = props
  const content = `No third-place match was played. Semi-finalists are listed in alphabetical order.`
  return <TopTooltip target={target} content={content} />
}

export const Extra140Tooltip = (props) => {
  const { target } = props
  const content = `After 120 minutes expired with the score tied at 1-1, both captains and the referee agreed to play a second extra time of 2x10 minutes, meaning this match lasted 140 minutes.`
  return <TopTooltip target={target} content={content} />
}

export const WalkoverTooltip = (props) => {
  const { target, content, anchor } = props
  return <TopTooltip target={target} content={content} anchor={anchor} />
}

export const CancelledTooltip = (props) => {
  const { target, notes } = props
  const content = `Cancelled${notes ? `: ${notes}` : ''}`
  return <TopTooltip target={target} content={content} />
}

export const WildCardTooltip = (props) => {
  const { target, content } = props
  return <TopTooltip target={target} content={content} />
}

export const ExcludedFourthPlaceTooltip = (props) => {
  const { target } = props
  const content = `Excluded the results against the fourth-placed teams.`
  return <TopTooltip target={target} content={content} />
}

export const ExcludedQualfyingRoundsTooltip = (props) => {
  const { target } = props
  const content = `Excluded the results in the qualifying rounds.`
  return <TopTooltip target={target} content={content} />
}

export const SuccessorTooltip = (props) => {
  const { target, children_teams, parent_team } = props
  let content = () => {
    if (!children_teams) {
      // console.log('parent_team', parent_team)
      return (
        <React.Fragment>
          As a successor, {parent_team}'s rankings might include ones' that it succeeded.&nbsp;
          <a href={`#successor_${parent_team.replace(' ', '_')}`}>See breakdown below.</a>
        </React.Fragment>
      )
    }
    return (
      <React.Fragment>
        As a successor, {parent_team}'s rankings include participation as&nbsp;
        {children_teams.reverse().map((ct, index) => {
          return (
            <React.Fragment key={index}>
              <img className="flag-xxs" src={getFlagSrc(ct.id)} alt={ct.id} title={ct.id} />
              &nbsp;
              {getTeamName(ct.id)}
              {ct.year && ct.year.length === 1 && <React.Fragment>&nbsp;in {ct.year[0]}</React.Fragment>}
              {ct.year && ct.year.length > 1 && (
                <React.Fragment>
                  &nbsp;from {ct.year[ct.year.length - 1]} to {ct.year[0]}
                </React.Fragment>
              )}
              {index < children_teams.length - 2 && <React.Fragment>,&nbsp;</React.Fragment>}
              {index === children_teams.length - 2 && <React.Fragment>&nbsp;and&nbsp;</React.Fragment>}
              {index === children_teams.length - 1 && <React.Fragment>.</React.Fragment>}
            </React.Fragment>
          )
        })}
        &nbsp;<a href={`#successor_${parent_team.replace(' ', '_')}`}>See breakdown below.</a>
      </React.Fragment>
    )
  }
  return <TopTooltip target={target} content={content()} />
}

export const TopTooltip = (props) => {
  const { target, content, anchor } = props
  return (
    <TurtleTooltip target={target} placement="top" content={content}>
      <span className="box-tip-text" href="#" id={target}>
        {anchor ? anchor : '(*)'}
      </span>
    </TurtleTooltip>
  )
}

export const TurtleTooltip = (props) => {
  const { target, placement, content } = props
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const toggle = () => setTooltipOpen(!tooltipOpen)

  return (
    <React.Fragment>
      {props.children}
      <Tooltip
        target={target}
        placement={placement}
        isOpen={tooltipOpen}
        autohide={false}
        toggle={toggle}
        delay={{ hide: 500 }}
        innerClassName="successor-tooltip"
      >
        {content}
      </Tooltip>
    </React.Fragment>
  )
}
