import React from 'react'
import { Row, Col } from 'reactstrap'
import { RankingHead, RankingRow } from './RankingsHelper'

const mergeArray = (a, b) => {
  b.forEach((be) => {
    let merging = true
    a.forEach((ae) => {
      if (ae === be) {
        merging = false
      }
    })
    if (merging) {
      a.push(be)
    }
  })
}

const createDrawPool = (round) => {
  let pools = []
  round.final_rankings.forEach((r) => {
    if (r.draws) {
      const tmp = [r.id, ...r.draws]
      if (pools.length === 0) {
        pools.push(tmp)
      } else {
        let found = false
        let pool = null
        pools.forEach((p) => {
          p.forEach((e) => {
            tmp.forEach((t) => {
              if (t === e) {
                found = true
              }
            })
          })
          pool = p
        })
        if (found) {
          mergeArray(pool, tmp)
        } else {
          pools.push(tmp)
        }
      }
    }
  })
  round.draw_pools = pools
}

const updateDraws = (round) => {
  round.final_rankings.forEach((r) => {
    if (r.draws) {
      round.draw_pools.forEach((p) => {
        const found = p.includes(r.id)
        if (found) {
          mergeArray(r.draws, p)
        }
      })
    }
  })
}

const updateFinalRankings = (round) => {
  let newFinalRankings = []
  let previousDrawCount = 0
  let rankingBundle = []
  round.final_rankings.forEach((r) => {
    const drawCount = r.draws ? r.draws.length : 0
    if (drawCount > 0) {
      rankingBundle.push(r)
    } else {
      if (previousDrawCount > 0) {
        newFinalRankings.push(rankingBundle)
        rankingBundle = []
      }
      newFinalRankings.push(r)
    }
    previousDrawCount = drawCount
  })
  round.final_rankings = newFinalRankings
}

const RankingRound = (props) => {
  const { round } = props
  createDrawPool(round)
  updateDraws(round)
  updateFinalRankings(round)
  return (
    <React.Fragment>
      {round.final_rankings.map((r, index) => (
        <RankingRow row={r} ranking_type={round.ranking_type} key={index} />
      ))}
    </React.Fragment>
  )
}

const Rankings = (props) => {
  const { rounds } = props
  return (
    <React.Fragment>
      <Row className="box-xl mb-5">
        <Col xs={{ size: 10, offset: 1 }}>
          <Row className="mt-4"></Row>
          <RankingHead />
          {rounds.map((r, index) => (
            <RankingRound round={r} key={index} />
          ))}
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default Rankings
