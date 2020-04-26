import React, { useState } from 'react'
import { Row, Col, Collapse, Button } from 'reactstrap'
import { DisplaySchedule, getDateMatchArrayPair } from './Helper'
import Rankings from './Rankings'

const findTeam = (teamArray, id) => {
  const teams = teamArray.filter((t) => t.id === id)
  return teams.length === 1 ? teams[0] : null
}

const findLastRanking = (team, matchDay) => {
  if (matchDay === 1) {
    return { md: 0, mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, fp: null, pts: 0 }
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
    let newRanking = { md: matchDay, mp: lr.mp, w: lr.w, d: lr.d, l: lr.l, gf: lr.gf, ga: lr.ga, gd: lr.gd, fp: lr.fp, pts: lr.pts }
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

const calculateGroupRanking = (group, config) => {
  group.matches.forEach((m, index) => {
    const matchDay = Math.floor(index / 2 + 1)
    calculateTeamRanking(findTeam(group.teams, m.home_team), matchDay, m, config)
    calculateTeamRanking(findTeam(group.teams, m.away_team), matchDay, m, config)
    // console.log('calculateTeamRanking', m.home_team, findTeam(group.teams, m.home_team).rankings)
    // console.log('calculateTeamRanking', m.away_team, findTeam(group.teams, m.away_team).rankings)
  })
}

const getMatchArrayByDate = (group) => {
  return getDateMatchArrayPair(group.matches)
}

const GroupPlay = (props) => {
  const { group, config } = props
  const [collapse, setCollapse] = useState(false)
  const [status, setStatus] = useState('Closed')
  const onEntering = () => setStatus('Opening...')
  const onEntered = () => setStatus('Opened')
  const onExiting = () => setStatus('Closing...')
  const onExited = () => setStatus('Closed')
  const toggle = () => setCollapse(!collapse)
  calculateGroupRanking(group, config)
  return (
    <React.Fragment>
      <Row className="mt-3 text-center">
        <Col sm="12">
          <Button outline color="primary" onClick={toggle} className="h2-ff3 btn-collapse">
            {group.name}&nbsp;
            {status === 'Opening...' && <i className="bx bx-dots-vertical-rounded"></i>}
            {status === 'Opened' && <i className="bx bx-chevron-up-square"></i>}
            {status === 'Closing...' && <i className="bx bx-dots-vertical-rounded"></i>}
            {status === 'Closed' && <i className="bx bx-chevron-down-square"></i>}
          </Button>
        </Col>
      </Row>
      <Collapse isOpen={collapse} onEntering={onEntering} onEntered={onEntered} onExiting={onExiting} onExited={onExited}>
        <DisplaySchedule round={getMatchArrayByDate(group)} />
        <Row className="mb-5"></Row>
      </Collapse>
      <Rankings config={config} rounds={[group]} />
    </React.Fragment>
  )
}

export default GroupPlay
