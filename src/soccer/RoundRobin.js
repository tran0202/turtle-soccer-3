import React from 'react'
import TeamArray from '../data/Team.json'
import NationArray from '../data/Nation.json'
import { Row, Col } from 'reactstrap'
import moment from 'moment'

const getMatchArrayByDate = (stage) => {
  let matches = [],
    dates = [],
    tmp = []
  stage.groups.forEach((g) => {
    g.matches.forEach((m) => {
      tmp.push({ ...m, group: g.name })
    })
  })
  tmp.sort((a, b) => {
    if (a.date + a.time < b.date + b.time) {
      return -1
    } else if (a.date + a.time > b.date + a.time) {
      return 1
    } else {
      return 0
    }
  })
  tmp.forEach((t) => {
    if (matches[t.date]) {
      matches[t.date].push(t)
    } else {
      dates.push(t.date)
      matches[t.date] = []
      matches[t.date].push(t)
    }
  })
  return { dates, matches }
}

const getFlagSrc = (id) => {
  const team = TeamArray.filter((t) => t.id === id)
  if (team.length === 1) {
    const nation = NationArray.filter((n) => n.id === team[0].nation_id)
    if (nation.length === 1) {
      return '/assets/images/flags/' + nation[0].flag_filename
    } else {
      console.log('Nation error', nation)
    }
  } else {
    console.log('Team error', team)
  }
}

const getTeamName = (id) => {
  const team = TeamArray.filter((t) => t.id === id)
  if (team.length === 1) {
    return team[0].name
  } else {
    console.log('Team error', team)
  }
}

const RoundRobin = (props) => {
  const { stage } = props
  const { dates, matches } = getMatchArrayByDate(stage)
  // console.log('matches', matches)
  // console.log('dates', dates)
  return (
    <React.Fragment>
      {dates.map((value) => (
        <Row key={value}>
          <Col sm="12" className="h4-ff3 border-bottom-gray2 margin-top-md">
            {moment(value).format('dddd, MMMM D')}
          </Col>
          {matches[value].map((m, index) => (
            <Col sm="12" className="padding-tb-md border-bottom-gray5" key={index}>
              <Row>
                <Col sm="2" xs="2" className="font-10 margin-top-time-xs">
                  {m.time}
                  <br />
                  {m.group}
                  <span className="no-display-xs">
                    <br />
                    {m.stadium}
                  </span>
                  <span className="no-display-xs">
                    <br />
                    {m.city}
                  </span>
                </Col>
                <Col sm="3" xs="3" className="team-name text-uppercase text-right team-name-no-padding-right">
                  {getTeamName(m.home_team)}
                </Col>
                <Col sm="1" xs="1" className="padding-top-sm text-center">
                  <img className="flag-sm flag-md" src={getFlagSrc(m.home_team)} alt={m.home_team} />
                </Col>
                <Col sm="2" xs="2" className="score text-uppercase text-center">
                  {m.home_score}-{m.away_score}
                </Col>
                <Col sm="1" xs="1" className="padding-top-sm text-center">
                  <img className="flag-sm flag-md" src={getFlagSrc(m.away_team)} alt={m.away_team} />
                </Col>
                <Col sm="3" xs="3" className="team-name text-uppercase">
                  {getTeamName(m.away_team)}
                </Col>
              </Row>
            </Col>
          ))}
        </Row>
      ))}
    </React.Fragment>
  )
}

export default RoundRobin
