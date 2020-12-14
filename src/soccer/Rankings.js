import React from 'react'
import { Row, Col } from 'reactstrap'
import { createDrawPool, updateDraws, updateFinalRankings, getRowStriped, isWildCardExtraRow, getWildCardRowStriped } from './RankingsHelper'
import { getFlagSrc, getTeamName, FairPlayTooltip, WildCardTooltip, Head2HeadTooltip } from './Helper'

const RankingRowSeparate = (props) => {
  const { round } = props
  return (
    round.ranking_type === 'round' &&
    round.name !== 'Final' &&
    round.name !== 'Third place' && (
      <Row className="no-gutters ranking-tbl team-row padding-tb-md text-center">
        <Col xs="12" className="font-italic gray3">
          {round.name}
        </Col>
      </Row>
    )
  )
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
        {ranking_type === 'group' && row.h2h_notes && <Head2HeadTooltip target={`h2hTooltip-${row.id}`} h2h_notes={row.h2h_notes} />}
      </Col>
    </Row>
  )
}

export const RankingRow = (props) => {
  const { row, ranking_type, config } = props
  const row_striped = ranking_type === 'group' ? getRowStriped(row, config) : ranking_type === 'wildcard' ? getWildCardRowStriped(row, config) : ''
  const rankColPadding = row.r ? '' : row.length === 2 ? 'rank-col-padding-2' : 'rank-col-padding-3'
  const gold = ranking_type === 'round' && row.r === 1 ? ' gold' : ''
  const silver = ranking_type === 'round' && row.r === 2 ? ' silver' : ''
  const bronze = ranking_type === 'round' && row.r === 3 ? ' bronze' : ''
  return (
    <Row className={`no-gutters ranking-tbl team-row text-center${row_striped}${gold}${silver}${bronze}`}>
      <Col className={`col-box-5 padding-top-md ${rankColPadding}`}>
        {row.r ? row.r : row[0].r}
        {ranking_type === 'wildcard' && isWildCardExtraRow(row, config) && (
          <WildCardTooltip target={`wildcardTooltip-${row.r ? row.r : row[0].r}`} content={config.advancement.teams.wild_card.text_extra} />
        )}
      </Col>
      <Col className="ranking-row col-box-95 padding-tb-md">
        {row.r && <RankingRow2 row={row} ranking_type={ranking_type} />}
        {!row.r && row.map((r) => <RankingRow2 row={r} ranking_type={ranking_type} key={r.id} />)}
      </Col>
    </Row>
  )
}

const RankingRound = (props) => {
  const { round, config } = props
  createDrawPool(round)
  updateDraws(round)
  updateFinalRankings(round)
  return (
    <React.Fragment>
      <RankingRowSeparate round={round} />
      {round.final_rankings && round.final_rankings.map((r, index) => <RankingRow row={r} ranking_type={round.ranking_type} config={config} key={index} />)}
    </React.Fragment>
  )
}

const Rankings = (props) => {
  const { rounds, config } = props
  return (
    <React.Fragment>
      <Row className="box-xl mb-5">
        <Col xs={{ size: 10, offset: 1 }}>
          <Row className="mt-4"></Row>
          <RankingHead />
          {rounds && rounds.map((r, index) => <RankingRound round={r} config={config} key={index} />)}
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default Rankings
