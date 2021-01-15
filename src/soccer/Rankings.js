import React from 'react'
import { Row, Col } from 'reactstrap'
import { updateFinalRankings, createSemifinalistsPool, isGoalRatioTiebreaker, getRowStriped, isWildCardExtraRow, getWildCardRowStriped } from './RankingsHelper'
import {
  getFlagSrc,
  getTeamName,
  getNationOfficialName,
  isSuccessor,
  FairPlayTooltip,
  WildCardTooltip,
  SuccessorTooltip,
  Head2HeadTooltip,
  DrawLotTooltip,
} from './Helper'
import NumberFormat from 'react-number-format'

const RankingRowSeparate = (props) => {
  const { round } = props
  // console.log('round', round)
  const roundName = round.name ? round.name.replace('Fifth-place', 'Consolation Round') : ''
  return (
    (round.ranking_type === 'round' || round.ranking_type === 'alltimeround' || round.ranking_type === 'successorround') &&
    roundName !== '' &&
    roundName !== 'Final' &&
    roundName !== 'Third-place' &&
    roundName !== 'Semi-finals' &&
    roundName !== 'Consolation' &&
    roundName !== 'Final Round' && (
      <Row className="no-gutters ranking-tbl team-row padding-tb-md text-center">
        <Col xs="12" className="font-italic gray3">
          {round.ranking_type !== 'successorround' && <React.Fragment>{roundName}</React.Fragment>}
          {round.ranking_type === 'successorround' && <div id={`successor_${roundName.replace(' ', '_')}`}>{roundName}</div>}
        </Col>
      </Row>
    )
  )
}

const showGoalRatio = (config) => {
  return isGoalRatioTiebreaker(config) && config.ranking_type === 'group'
}

export const RankingHead = (props) => {
  const { config } = props
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
          {!showGoalRatio(config) && <Col className="col-box-7">+/-</Col>}
          {showGoalRatio(config) && <Col className="col-box-7">GR</Col>}
          <Col className="col-box-7">Pts</Col>
        </Row>
      </Col>
    </Row>
  )
}

const RankingRow2 = (props) => {
  const { row, config } = props
  const { ranking_type } = config
  return (
    <Row className="no-gutters">
      <Col className="col-box-10">
        <img
          className="flag-sm flag-md"
          src={getFlagSrc(row.id)}
          alt={`${row.id} ${getNationOfficialName(row.id)}`}
          title={`${row.id} ${getNationOfficialName(row.id)}`}
        />
      </Col>
      <Col className="col-box-34 text-uppercase text-left">
        &nbsp;&nbsp;{getTeamName(row.id)}
        {isSuccessor(row.id) && ranking_type === 'alltimeround' && (
          <SuccessorTooltip target={`successorTooltip-${row.id}`} children_teams={row.children_teams} parent_team={getTeamName(row.id)} />
        )}
        {ranking_type === 'successorround' && row.years.length > 1 && (
          <span className="successor-subscript">{`(${row.years[row.years.length - 1]}-${row.years[0]})`}</span>
        )}
        {ranking_type === 'successorround' && row.years.length === 1 && <span className="successor-subscript">{`(${row.years[0]})`}</span>}
      </Col>
      <Col className="col-box-7 padding-top-xxs">{row.mp}</Col>
      <Col className="col-box-7 padding-top-xxs">{row.w}</Col>
      <Col className="col-box-7 padding-top-xxs">{row.d}</Col>
      <Col className="col-box-7 padding-top-xxs">{row.l}</Col>
      <Col className="col-box-7 padding-top-xxs">{row.gf}</Col>
      <Col className="col-box-7 padding-top-xxs">{row.ga}</Col>
      {!showGoalRatio(config) && (
        <Col className="col-box-7 padding-top-xxs">
          {row.gd > 0 ? '+' : ''}
          {row.gd}
        </Col>
      )}
      {showGoalRatio(config) && (
        <Col className="col-box-7 padding-top-xxs">
          {row.gr !== null && <NumberFormat value={row.gr.toFixed(3)} displayType={'text'} />}
          {row.gr === null && <span>&mdash;</span>}
        </Col>
      )}
      <Col className="col-box-7 padding-top-xxs">
        {row.pts}
        <React.Fragment>
          {ranking_type === 'group' && row.h2h_notes && !row.fp && !row.draw_lot_notes && (
            <Head2HeadTooltip target={`h2hTooltip-${row.id}`} h2h_notes={row.h2h_notes} group_playoff={row.group_playoff} />
          )}
          {ranking_type === 'group' && row.fp && <FairPlayTooltip target={`fairPlayTooltip-${row.id}`} fp_notes={row.fp_notes} />}
          {ranking_type === 'group' && row.draw_lot_notes && <DrawLotTooltip target={`drawLotTooltip-${row.id}`} draw_lot_notes={row.draw_lot_notes} />}
        </React.Fragment>
      </Col>
    </Row>
  )
}

export const RankingRow = (props) => {
  const { row, config, index } = props
  // console.log('row', row)
  const { ranking_type, championship_round } = config
  const row_striped = ranking_type === 'group' ? getRowStriped(row, config) : ranking_type === 'wildcard' ? getWildCardRowStriped(row, config) : ''
  const rankColPadding = row.r ? '' : row.length === 2 ? 'rank-col-padding-2' : row.length === 3 ? 'rank-col-padding-3' : 'rank-col-padding-4'
  const gold = (ranking_type === 'round' || championship_round) && row.r === 1 ? ' gold' : ''
  const silver = (ranking_type === 'round' || championship_round) && row.r === 2 ? ' silver' : ''
  const bronze = (ranking_type === 'round' || championship_round) && row.r === 3 ? ' bronze' : ''
  return (
    <Row className={`no-gutters ranking-tbl team-row text-center${row_striped}${gold}${silver}${bronze}`}>
      <Col className={`col-box-5 padding-top-md ${rankColPadding}`}>
        {row.r ? row.r : row[0].r}
        {ranking_type === 'successorround' && index === 0 && `a`}
        {ranking_type === 'successorround' && index === 1 && `b`}
        {ranking_type === 'successorround' && index === 2 && `c`}
        {ranking_type === 'successorround' && index === 3 && `d`}
        {ranking_type === 'successorround' && index === 4 && `e`}
        {ranking_type === 'wildcard' && isWildCardExtraRow(row, config) && (
          <WildCardTooltip target={`wildcardTooltip-${row.r ? row.r : row[0].r}`} content={config.advancement.teams.wild_card.text_extra} />
        )}
      </Col>
      <Col className="ranking-row col-box-95 padding-tb-md">
        {row.r && <RankingRow2 row={row} config={config} />}
        {!row.r && row.map((r) => <RankingRow2 row={r} config={config} key={r.id} />)}
      </Col>
    </Row>
  )
}

const RankingRound = (props) => {
  const { round, config } = props
  // console.log('round', round)
  updateFinalRankings(round)
  if (config.no_third_place && round.name === 'Semi-finals') {
    createSemifinalistsPool(round)
  }
  return (
    <React.Fragment>
      <RankingRowSeparate round={round} />
      {round.final_rankings &&
        round.final_rankings.map((r, index) => <RankingRow row={r} config={{ ...config, ranking_type: round.ranking_type }} key={index} index={index} />)}
    </React.Fragment>
  )
}

const Rankings = (props) => {
  const { rounds, config } = props
  const ranking_type = rounds && rounds.length > 0 ? rounds[0].ranking_type : ''
  return (
    <React.Fragment>
      <Row className="box-xl mb-5">
        <Col xs={{ size: 10, offset: 1 }}>
          <Row className="mt-4"></Row>
          <RankingHead config={{ ...config, ranking_type }} />
          {rounds && rounds.map((r, index) => <RankingRound round={r} config={config} key={index} />)}
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default Rankings
