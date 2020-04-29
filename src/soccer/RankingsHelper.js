import React from 'react'
import { Row, Col } from 'reactstrap'
import { getFlagSrc, getTeamName, FairPlayTooltip } from './Helper'

const findTeam = (teamArray, id) => {
  const teams = teamArray.filter((t) => t.id === id)
  return teams.length === 1 ? teams[0] : null
}

const findLastRanking = (team, matchDay) => {
  if (matchDay === 1) {
    return { md: 0, mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, fp: null, h2hm: [] }
  } else {
    const rankings = team.rankings.filter((r) => r.md === matchDay - 1)
    return rankings.length === 1 ? rankings[0] : null
  }
}

const calculateTeamRanking = (team, matchDay, match, config) => {
  const side = match.home_team === team.id ? 'home' : 'away'
  const lr = findLastRanking(team, matchDay)
  // console.log('findLastRanking', lr)
  if (lr) {
    let newRanking = { md: matchDay, mp: lr.mp, w: lr.w, d: lr.d, l: lr.l, gf: lr.gf, ga: lr.ga, gd: lr.gd, pts: lr.pts, fp: lr.fp, h2hm: lr.h2hm }
    newRanking.mp++
    if (parseInt(match.home_score) > parseInt(match.away_score)) {
      if (side === 'home') {
        newRanking.w++
        newRanking.gf += parseInt(match.home_score)
        newRanking.ga += parseInt(match.away_score)
        newRanking.pts += config.points_for_win
      } else {
        newRanking.l++
        newRanking.gf += parseInt(match.away_score)
        newRanking.ga += parseInt(match.home_score)
      }
    } else if (parseInt(match.home_score) === parseInt(match.away_score)) {
      if (side === 'home') {
        newRanking.d++
        newRanking.gf += parseInt(match.home_score)
        newRanking.ga += parseInt(match.away_score)
        newRanking.pts++
      } else {
        newRanking.d++
        newRanking.gf += parseInt(match.away_score)
        newRanking.ga += parseInt(match.home_score)
        newRanking.pts++
      }
    } else {
      if (side === 'home') {
        newRanking.l++
        newRanking.gf += parseInt(match.home_score)
        newRanking.ga += parseInt(match.away_score)
      } else {
        newRanking.w++
        newRanking.gf += parseInt(match.away_score)
        newRanking.ga += parseInt(match.home_score)
        newRanking.pts += config.points_for_win
      }
    }
    newRanking.gd = newRanking.gf - newRanking.ga
    if (side === 'home') {
      if (match.home_fair_pts) {
        newRanking.fp = (newRanking.fp ? newRanking.fp : 0) + parseInt(match.home_fair_pts)
      }
    } else {
      if (match.away_fair_pts) {
        newRanking.fp = (newRanking.fp ? newRanking.fp : 0) + parseInt(match.away_fair_pts)
      }
    }
    newRanking.h2hm.push(match)

    if (matchDay === 1) {
      let newRankings = []
      newRankings.push(newRanking)
      team.rankings = newRankings
    } else {
      team.rankings.push(newRanking)
    }
  } else {
    console.log('Error calculating team ', team.id)
  }
}

export const calculateGroupRankings = (group, config) => {
  group.matches.forEach((m, index) => {
    const matchDay = Math.floor(index / 2 + 1)
    calculateTeamRanking(findTeam(group.teams, m.home_team), matchDay, m, config)
    calculateTeamRanking(findTeam(group.teams, m.away_team), matchDay, m, config)
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

export const sortGroupRankings = (group) => {
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
    t.r = index + 1
  })
}

const collectMatchdayRankings = (group, matchDay) => {
  group.teams.forEach((t) => {
    const rankings = t.rankings.filter((r) => r.md === matchDay)
    const saved = { id: t.id, ...rankings[0] }
    if (!group.final_rankings) {
      const newRankings = []
      newRankings.push(saved)
      group.final_rankings = newRankings
      group.ranking_type = 'group'
    } else {
      group.final_rankings.push(saved)
    }
  })
  sortGroupRankings(group)
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

const RankingRow3 = (props) => {
  const { row, ranking_type } = props
  return (
    <Row className="no-gutters">
      <Col className="col-box-10 padding-top-xxs">
        <img className="flag-sm flag-md" src={getFlagSrc(row.id)} alt={row.id} />
      </Col>
      <Col className="col-box-34 padding-top-xxs text-uppercase text-left">&nbsp;{getTeamName(row.id)}</Col>
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

const RankingRow2 = (props) => {
  const { row, ranking_type } = props
  return (
    <Row className="no-gutters">
      <Col className="col-box-10">
        <img className="flag-sm flag-md" src={getFlagSrc(row.id)} alt={row.id} />
      </Col>
      <Col className="col-box-34 text-uppercase text-left">&nbsp;{getTeamName(row.id)}</Col>
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
        {!row.r && row.map((r) => <RankingRow3 row={r} ranking_type={ranking_type} key={r.id} />)}
      </Col>
    </Row>
  )
}
