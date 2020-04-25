import React from 'react'
import { Row, Col } from 'reactstrap'
import { RankingRow } from './Helper'

// const sortGroupRanking = (group, config) => {
//   group.matches.forEach((m, index) => {
//     const matchDay = Math.floor(index / 2 + 1)
//     calculateTeamRanking(findTeam(group.teams, m.home_team), matchDay, m, config)
//     calculateTeamRanking(findTeam(group.teams, m.away_team), matchDay, m, config)
//     // console.log('calculateTeamRanking', m.home_team, findTeam(group.teams, m.home_team).rankings)
//     // console.log('calculateTeamRanking', m.away_team, findTeam(group.teams, m.away_team).rankings)
//   })
//   matches_array.sort((a, b) => {
//     if (a.date + a.time < b.date + b.time) {
//       return -1
//     } else if (a.date + a.time > b.date + a.time) {
//       return 1
//     } else {
//       return 0
//     }
//   })
// }

const collectMatchdayRankings = (round, matchDay) => {
  let result = []
  round.teams.forEach((t) => {
    const rankings = t.rankings.filter((r) => r.md === matchDay)
    result.push({ id: t.id, ...rankings[0] })
  })
  return result
}

const RankingHead = () => {
  return (
    <Row className="no-gutters ranking-tbl team-row padding-tb-md text-center">
      <Col className="col-box-5"></Col>
      <Col className="col-box-10"></Col>
      <Col className="col-box-25"></Col>
      <Col className="col-box-7">MP</Col>
      <Col className="col-box-7">W</Col>
      <Col className="col-box-7">D</Col>
      <Col className="col-box-7">L</Col>
      <Col className="col-box-7">GF</Col>
      <Col className="col-box-7">GA</Col>
      <Col className="col-box-7">+/-</Col>
      <Col className="col-box-7">Pts</Col>
    </Row>
  )
}

const RankingRound = (props) => {
  const { round } = props
  const rows = collectMatchdayRankings(round, 3)
  // console.log('rows', rows)
  return (
    <React.Fragment>
      {rows.map((r, index) => (
        <RankingRow row={r} index={index} key={index} />
      ))}
      <Row className="mb-4"></Row>
    </React.Fragment>
  )
}

const Rankings = (props) => {
  const { config, rounds } = props
  return (
    <React.Fragment>
      <Row className="box-xl mb-5">
        <Col xs={{ size: 10, offset: 1 }}>
          <RankingHead />
          {rounds.map((r, index) => (
            <RankingRound config={config} round={r} key={index} />
          ))}
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default Rankings
