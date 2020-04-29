import React from 'react'
import { Row, Col } from 'reactstrap'
import { getFlagSrc, getTeamName, FairPlayTooltip } from './Helper'

export const findTeam = (teamArray, id) => {
  return teamArray.find((t) => t.id === id)
}

const findLastRanking = (team) => {
  if (!team.rankings) {
    return { id: team.id, md: 0, mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, fp: null, h2hm: [] }
  } else {
    return team.rankings[team.rankings.length - 1]
  }
}

const accumulateRanking = (team, match, config) => {
  const side = match.home_team === team.id ? 'home' : 'away'
  team.mp++
  team.md++
  if (parseInt(match.home_score) > parseInt(match.away_score)) {
    if (side === 'home') {
      team.w++
      team.gf += parseInt(match.home_score)
      team.ga += parseInt(match.away_score)
      team.pts += config.points_for_win
    } else {
      team.l++
      team.gf += parseInt(match.away_score)
      team.ga += parseInt(match.home_score)
    }
  } else if (parseInt(match.home_score) === parseInt(match.away_score)) {
    if (side === 'home') {
      team.d++
      team.gf += parseInt(match.home_score)
      team.ga += parseInt(match.away_score)
      team.pts++
    } else {
      team.d++
      team.gf += parseInt(match.away_score)
      team.ga += parseInt(match.home_score)
      team.pts++
    }
  } else {
    if (side === 'home') {
      team.l++
      team.gf += parseInt(match.home_score)
      team.ga += parseInt(match.away_score)
    } else {
      team.w++
      team.gf += parseInt(match.away_score)
      team.ga += parseInt(match.home_score)
      team.pts += config.points_for_win
    }
  }
  team.gd = team.gf - team.ga
  if (side === 'home') {
    if (match.home_fair_pts) {
      team.fp = (team.fp ? team.fp : 0) + parseInt(match.home_fair_pts)
    }
  } else {
    if (match.away_fair_pts) {
      team.fp = (team.fp ? team.fp : 0) + parseInt(match.away_fair_pts)
    }
  }
  team.h2hm.push(match)
}

const calculateGroupTeamRanking = (team, match, config) => {
  const lr = findLastRanking(team)
  const newRanking = { ...lr }
  accumulateRanking(newRanking, match, config)
  if (!team.rankings) {
    let newRankings = []
    newRankings.push(newRanking)
    team.rankings = newRankings
  } else {
    team.rankings.push(newRanking)
  }
}

export const calculateGroupRankings = (group, config) => {
  group.matches.forEach((m, index) => {
    calculateGroupTeamRanking(findTeam(group.teams, m.home_team), m, config)
    calculateGroupTeamRanking(findTeam(group.teams, m.away_team), m, config)
  })
}

export const findRoundAdvancedTeams = (advanced_teams, name) => {
  return advanced_teams.rounds.find((r) => r.name === name)
}

const calculateKnockoutTeamRanking = (team, match, config) => {
  accumulateRanking(team, match, config)
}

export const calculateKnockoutRankings = (advanced_teams, round, config) => {
  round.matches.forEach((m) => {
    calculateKnockoutTeamRanking(findTeam(advanced_teams.final_rankings, m.home_team), m, config)
    calculateKnockoutTeamRanking(findTeam(advanced_teams.final_rankings, m.away_team), m, config)
  })
}

const findHeadtoHeadMatch = (a, b) => {
  return a.h2hm.filter((m) => (m.home_team === a.id && m.away_team === b.id) || (m.home_team === b.id && m.away_team === a.id))
}

const compareFairPoints = (a, b) => {
  if (a.fp > b.fp) {
    return -1
  } else if (a.fp < b.fp) {
    return 1
  } else {
    return 0
  }
}

const matchResult = (id, m) => {
  if (m.home_team === id) {
    if (m.home_score > m.away_score) {
      return 1
    } else if (m.home_score < m.away_score) {
      return -1
    } else {
      return 0
    }
  } else if (m.away_team === id) {
    if (m.home_score > m.away_score) {
      return -1
    } else if (m.home_score < m.away_score) {
      return 1
    } else {
      return 0
    }
  }
}

const saveDrawTeams = (a, b) => {
  if (!a.draws) {
    a.draws = []
    a.draws.push(b.id)
  } else {
    a.draws.push(b.id)
  }
}

export const sortGroupRankings = (group, startingIndex) => {
  group.final_rankings.sort((a, b) => {
    if (a.pts > b.pts) {
      return -1
    } else if (a.pts < b.pts) {
      return 1
    } else {
      if (a.gd > b.gd) {
        return -1
      } else if (a.gd < b.gd) {
        return 1
      } else {
        if (a.gf > b.gf) {
          return -1
        } else if (a.gf < b.gf) {
          return 1
        } else {
          if (group.ranking_type === 'round') {
            saveDrawTeams(a, b)
            saveDrawTeams(b, a)
          }
          const found = findHeadtoHeadMatch(a, b)
          if (found.length === 1) {
            const h2hMatch = found[0]
            const h2hResult = matchResult(a.id, h2hMatch)
            if (h2hResult === 1) {
              return 1
            } else if (h2hResult === -1) {
              return -1
            } else {
              return compareFairPoints(a, b)
            }
          } else {
            return compareFairPoints(a, b)
          }
        }
      }
    }
  })
  group.final_rankings.forEach((t, index) => {
    t.r = index + startingIndex
  })
}

const collectMatchdayRankings = (group, matchDay) => {
  group.teams.forEach((t) => {
    const rankings = t.rankings.find((r) => r.md === matchDay)
    if (!group.final_rankings) {
      const newRankings = []
      newRankings.push(rankings)
      group.final_rankings = newRankings
      group.ranking_type = 'group'
    } else {
      group.final_rankings.push(rankings)
    }
  })
  sortGroupRankings(group, 1)
}

export const collectGroupRankings = (group) => {
  return collectMatchdayRankings(group, 3)
}

export const RankingHead = () => {
  return (
    <Row className="no-gutters ranking-tbl team-row padding-tb-md text-center">
      <Col className="col-box-5"></Col>
      <Col className="col-box-95">
        <Row className="no-gutters">
          <Col className="col-box-10"></Col>
          <Col className="col-box-34"></Col>
          <Col className="col-box-7">MP</Col>
          <Col className="col-box-7">W</Col>
          <Col className="col-box-7">D</Col>
          <Col className="col-box-7">L</Col>
          <Col className="col-box-7">GF</Col>
          <Col className="col-box-7">GA</Col>
          <Col className="col-box-7">+/-</Col>
          <Col className="col-box-7">Pts</Col>
        </Row>
      </Col>
    </Row>
  )
}

const RankingRow2 = (props) => {
  const { row, ranking_type } = props
  return (
    <Row className="no-gutters">
      <Col className="col-box-10">
        <img className="flag-sm flag-md" src={getFlagSrc(row.id)} alt={row.id} />
      </Col>
      <Col className="col-box-34 text-uppercase text-left">&nbsp;&nbsp;{getTeamName(row.id)}</Col>
      <Col className="col-box-7 padding-top-xxs">{row.mp}</Col>
      <Col className="col-box-7 padding-top-xxs">{row.w}</Col>
      <Col className="col-box-7 padding-top-xxs">{row.d}</Col>
      <Col className="col-box-7 padding-top-xxs">{row.l}</Col>
      <Col className="col-box-7 padding-top-xxs">{row.gf}</Col>
      <Col className="col-box-7 padding-top-xxs">{row.ga}</Col>
      <Col className="col-box-7 padding-top-xxs">
        {row.gd > 0 ? '+' : ''}
        {row.gd}
      </Col>
      <Col className="col-box-7 padding-top-xxs">
        {row.pts}
        {ranking_type === 'group' && row.fp && <FairPlayTooltip target={`fairPlayTooltip-${row.id}`} points={row.fp} />}
      </Col>
    </Row>
  )
}

export const RankingRow = (props) => {
  const { row, ranking_type } = props
  const advanced_second_round_striped = ranking_type === 'group' && (row.r === 1 || row.r === 2) ? ' advanced-second-round-striped' : ''
  const rankColPadding = row.r ? '' : row.length === 2 ? 'rank-col-padding-2' : 'rank-col-padding-3'
  return (
    <Row className={`no-gutters ranking-tbl team-row text-center${advanced_second_round_striped}`}>
      <Col className={`col-box-5 padding-top-md ${rankColPadding}`}>{row.r ? row.r : row[0].r}</Col>
      <Col className="ranking-row col-box-95 padding-tb-md">
        {row.r && <RankingRow2 row={row} ranking_type={ranking_type} />}
        {!row.r && row.map((r) => <RankingRow2 row={r} ranking_type={ranking_type} key={r.id} />)}
      </Col>
    </Row>
  )
}
