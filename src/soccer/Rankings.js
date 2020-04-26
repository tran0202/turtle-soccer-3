import React from 'react'
import { Row, Col } from 'reactstrap'
import { RankingRow } from './Helper'

const sortRoundRanking = (round, config) => {
  round.final_rankings.sort((a, b) => {
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
          // More criteria to be applied here
          if (a.fp > b.fp) {
            return -1
          } else if (a.fp < b.fp) {
            return 1
          } else {
            return 0
          }
        }
      }
    }
  })
  round.final_rankings.forEach((t, index) => {
    t.r = index + 1
  })
}

const collectMatchdayRankings = (config, round, matchDay) => {
  round.teams.forEach((t) => {
    const rankings = t.rankings.filter((r) => r.md === matchDay)
    const saved = { id: t.id, ...rankings[0] }
    if (!round.final_rankings) {
      const newRankings = []
      newRankings.push(saved)
      round.final_rankings = newRankings
    } else {
      round.final_rankings.push(saved)
    }
  })
  sortRoundRanking(round, config)
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
  const { round, config } = props
  collectMatchdayRankings(config, round, 3)
  // console.log('rows', rows)
  return (
    <React.Fragment>
      {round.final_rankings.map((r, index) => (
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
