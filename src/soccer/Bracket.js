import React, { useState } from 'react'
import {
  getFlagSrc,
  isWinner,
  isSharedBronze,
  getBracketTeamName,
  getBracketTeamCode,
  AetTooltip,
  GoldenGoalTooltip,
  SilverGoalTooltip,
  PenTooltip,
  WalkoverTooltip,
  ReplayTooltip,
  CoinTossTooltip,
  SharedBronzeTooltip,
  ConsolationTooltip,
} from './Helper'
import { hasReplay } from './RankingsHelper'
import { Row, Col, Collapse, Button } from 'reactstrap'
import moment from 'moment'

const getExtraTimeTooltip = (match, config) => {
  return (
    <React.Fragment>
      {(config.goldenGoal || config.silverGoal) && match.home_penalty_score == null && match.away_penalty_score == null ? (
        config.shortAnchor ? (
          config.goldenGoal ? (
            <GoldenGoalTooltip target="goldengoalTooltip" anchor="(g)" />
          ) : (
            <SilverGoalTooltip target="silvergoalTooltip" anchor="(s)" />
          )
        ) : config.goldenGoal ? (
          <GoldenGoalTooltip target="goldengoalTooltip" anchor="(g.g.)" />
        ) : (
          <SilverGoalTooltip target="silvergoalTooltip" anchor="(s.g.)" />
        )
      ) : config.shortAnchor ? (
        <AetTooltip target="aetTooltip" anchor="(e)" />
      ) : (
        <AetTooltip target="aetTooltip" anchor="(a.e.t.)" />
      )}
    </React.Fragment>
  )
}

const getMatchDate = (match) => {
  if (!match) return
  return (
    <React.Fragment>
      {moment(match.date).format('MMMM D')} {match.replay_date && <React.Fragment>({moment(match.replay_date).format('MMMM D')})</React.Fragment>}
    </React.Fragment>
  )
}

const BracketBox = (props) => {
  const { match, colIndex, lastBox, config } = props
  // console.log('match', match)
  return (
    <React.Fragment>
      <Row className="no-gutters box-sm bracket-box-height">
        <Col sm="12" className="bracket-box-header-height border-bottom-gray5">
          <Row className="no-gutters">
            <Col xs={{ size: 11, offset: 1 }}>
              <span className="box-time d-block d-lg-none">
                {getMatchDate(match)} | {match.city}
              </span>
              <span className="box-time d-none d-lg-block">
                {getMatchDate(match)} | {match.stadium}, {match.city}
              </span>
            </Col>
          </Row>
        </Col>
        <Col sm="12" className="bracket-half-box-height border-bottom-gray5">
          <Row className="no-gutters h3-ff3">
            <Col xs={{ size: 2, offset: 1 }} className="d-none d-lg-block">
              {match.home_team && <img className="flag-sm-2" src={getFlagSrc(match.home_team)} alt={match.home_team} title={match.home_team} />}
            </Col>
            <Col xs={{ size: 2, offset: 1 }} className="d-none d-md-block d-lg-none">
              {match.home_team && <img className="flag-xs-2" src={getFlagSrc(match.home_team)} alt={match.home_team} title={match.home_team} />}
            </Col>
            <Col xs={{ size: 2, offset: 1 }} className="d-none d-sm-block d-md-none">
              {match.home_team && <img className="flag-xxs" src={getFlagSrc(match.home_team)} alt={match.home_team} title={match.home_team} />}
            </Col>
            <Col xs={{ size: 6 }} className={`box-team-name ${isWinner('H', match) ? '' : 'box-team-name-light'} d-none d-xl-block`}>
              {getBracketTeamName(match.home_team)}
              {match.walkover && match.home_walkover && (
                <WalkoverTooltip target={`walkover_${match.home_team}_${match.away_team}`} content={match.walkover} anchor="(w/o)" />
              )}
              {match.home_extra_score != null &&
                match.away_extra_score != null &&
                match.home_extra_score > match.away_extra_score &&
                getExtraTimeTooltip(match, config)}
              {match.home_extra_score != null &&
                match.away_extra_score != null &&
                match.home_extra_score === match.away_extra_score &&
                match.home_penalty_score > match.away_penalty_score && <PenTooltip target="penTooltip1" anchor="(pen.)" />}
              {match.home_replay_score != null && match.away_replay_score != null && match.home_replay_score > match.away_replay_score && (
                <ReplayTooltip target="replayTooltip" anchor="(rep.)" />
              )}
              {match.home_coin_toss && <CoinTossTooltip target="coinTossTooltip" anchor="(coin.)" />}
              {isSharedBronze(match) && <SharedBronzeTooltip target="sharedBronzeTooltip" />}
            </Col>
            <Col xs={{ size: 6 }} className={`box-team-name ${isWinner('H', match) ? '' : 'box-team-name-light'} d-none d-lg-block d-xl-none`}>
              {getBracketTeamName(match.home_team)}
              {match.walkover && match.home_walkover && (
                <WalkoverTooltip target={`walkover_${match.home_team}_${match.away_team}`} content={match.walkover} anchor="(w)" />
              )}
              {match.home_extra_score != null &&
                match.away_extra_score != null &&
                match.home_extra_score > match.away_extra_score &&
                getExtraTimeTooltip(match, { ...config, shortAnchor: true })}
              {match.home_extra_score != null &&
                match.away_extra_score != null &&
                match.home_extra_score === match.away_extra_score &&
                match.home_penalty_score > match.away_penalty_score && <PenTooltip target="penTooltip1" anchor="(p)" />}
              {match.home_replay_score != null && match.away_replay_score != null && match.home_replay_score > match.away_replay_score && (
                <ReplayTooltip target="replayTooltip" anchor="(r)" />
              )}
              {match.home_coin_toss && <CoinTossTooltip target="coinTossTooltip" anchor="(ct)" />}
              {isSharedBronze(match) && <SharedBronzeTooltip target="sharedBronzeTooltip" />}
            </Col>
            <Col xs={{ size: 6 }} className={`box-team-name ${isWinner('H', match) ? '' : 'box-team-name-light'} d-none d-md-block d-lg-none`}>
              {getBracketTeamCode(match.home_team)}
              {match.walkover && match.home_walkover && (
                <WalkoverTooltip target={`walkover_${match.home_team}_${match.away_team}`} content={match.walkover} anchor="(w/o)" />
              )}
              {match.home_extra_score != null &&
                match.away_extra_score != null &&
                match.home_extra_score > match.away_extra_score &&
                getExtraTimeTooltip(match, config)}
              {match.home_extra_score != null &&
                match.away_extra_score != null &&
                match.home_extra_score === match.away_extra_score &&
                match.home_penalty_score > match.away_penalty_score && <PenTooltip target="penTooltip1" anchor="(pen.)" />}
              {match.home_replay_score != null && match.away_replay_score != null && match.home_replay_score > match.away_replay_score && (
                <ReplayTooltip target="replayTooltip" anchor="(rep.)" />
              )}
              {match.home_coin_toss && <CoinTossTooltip target="coinTossTooltip" anchor="(coin.)" />}
              {isSharedBronze(match) && <SharedBronzeTooltip target="sharedBronzeTooltip" />}
            </Col>
            <Col xs={{ size: 6 }} className={`box-team-name ${isWinner('H', match) ? '' : 'box-team-name-light'} d-none d-sm-block d-md-none`}>
              {getBracketTeamCode(match.home_team)}
              {match.walkover && match.home_walkover && (
                <WalkoverTooltip target={`walkover_${match.home_team}_${match.away_team}`} content={match.walkover} anchor="(w)" />
              )}
              {match.home_extra_score != null &&
                match.away_extra_score != null &&
                match.home_extra_score > match.away_extra_score &&
                getExtraTimeTooltip(match, { ...config, shortAnchor: true })}
              {match.home_extra_score != null &&
                match.away_extra_score != null &&
                match.home_extra_score === match.away_extra_score &&
                match.home_penalty_score > match.away_penalty_score && <PenTooltip target="penTooltip1" anchor="(p)" />}
              {match.home_replay_score != null && match.away_replay_score != null && match.home_replay_score > match.away_replay_score && (
                <ReplayTooltip target="replayTooltip" anchor="(r)" />
              )}
              {match.home_coin_toss && <CoinTossTooltip target="coinTossTooltip" anchor="(ct)" />}
              {isSharedBronze(match) && <SharedBronzeTooltip target="sharedBronzeTooltip" />}
            </Col>
            <Col xs={{ size: 8, offset: 1 }} className={`box-team-name ${isWinner('H', match) ? '' : 'box-team-name-light'} d-block d-xs-block d-sm-none`}>
              <img className="flag-xxs" src={getFlagSrc(match.home_team)} alt={match.home_team} title={match.home_team} />
              &nbsp;
              {getBracketTeamCode(match.home_team)}
              {match.walkover && match.home_walkover && (
                <WalkoverTooltip target={`walkover_${match.home_team}_${match.away_team}`} content={match.walkover} anchor="(w)" />
              )}
              {match.home_extra_score != null &&
                match.away_extra_score != null &&
                match.home_extra_score > match.away_extra_score &&
                getExtraTimeTooltip(match, { ...config, shortAnchor: true })}
              {match.home_extra_score != null &&
                match.away_extra_score != null &&
                match.home_extra_score === match.away_extra_score &&
                match.home_penalty_score > match.away_penalty_score && <PenTooltip target="penTooltip1" anchor="(p)" />}
              {match.home_replay_score != null && match.away_replay_score != null && match.home_replay_score > match.away_replay_score && (
                <ReplayTooltip target="replayTooltip" anchor="(r)" />
              )}
              {match.home_coin_toss && <CoinTossTooltip target="coinTossTooltip" anchor="(ct)" />}
              {isSharedBronze(match) && <SharedBronzeTooltip target="sharedBronzeTooltip" />}
            </Col>
            {match.home_extra_score == null && (
              <Col xs={{ size: 3 }} className={`box-score ${isWinner('H', match) ? '' : 'box-score-light'}`}>
                {match.home_score}
                {match.home_penalty_score != null && <React.Fragment>&nbsp;({match.home_penalty_score})</React.Fragment>}
                {match.home_replay_score != null && <React.Fragment>({match.home_replay_score})</React.Fragment>}
              </Col>
            )}
            {match.home_extra_score != null && (
              <Col xs={{ size: 3 }} className={`box-score ${isWinner('H', match) ? '' : 'box-score-light'}`}>
                {parseInt(match.home_score) + parseInt(match.home_extra_score)}
                {match.home_penalty_score != null && <React.Fragment>&nbsp;({match.home_penalty_score})</React.Fragment>}
                {match.home_replay_score != null && <React.Fragment>({match.home_replay_score})</React.Fragment>}
              </Col>
            )}
          </Row>
        </Col>
        <Col sm="12" className="bracket-half-box-height">
          <Row className="no-gutters h4-ff3">
            <Col xs={{ size: 2, offset: 1 }} className="d-none d-lg-block">
              {match.away_team && <img className="flag-sm-2" src={getFlagSrc(match.away_team)} alt={match.away_team} title={match.away_team} />}
            </Col>
            <Col xs={{ size: 2, offset: 1 }} className="d-none d-md-block d-lg-none">
              {match.away_team && <img className="flag-xs-2" src={getFlagSrc(match.away_team)} alt={match.away_team} title={match.away_team} />}
            </Col>
            <Col xs={{ size: 2, offset: 1 }} className="d-none d-sm-block d-md-none">
              {match.away_team && <img className="flag-xxs" src={getFlagSrc(match.away_team)} alt={match.away_team} title={match.away_team} />}
            </Col>
            <Col xs={{ size: 6 }} className={`box-team-name ${isWinner('A', match) ? '' : 'box-team-name-light'} d-none d-xl-block`}>
              {getBracketTeamName(match.away_team)}
              {match.walkover && match.away_walkover && (
                <WalkoverTooltip target={`walkover_${match.away_team}_${match.home_team}`} content={match.walkover} anchor="(w/o)" />
              )}
              {match.home_extra_score != null &&
                match.away_extra_score != null &&
                match.home_extra_score < match.away_extra_score &&
                getExtraTimeTooltip(match, config)}
              {match.home_extra_score != null &&
                match.away_extra_score != null &&
                match.home_extra_score === match.away_extra_score &&
                match.home_penalty_score < match.away_penalty_score && <PenTooltip target="penTooltip2" anchor="(pen.)" />}
              {match.home_replay_score != null && match.away_replay_score != null && match.home_replay_score < match.away_replay_score && (
                <ReplayTooltip target="replayTooltip" anchor="(rep.)" />
              )}
              {isSharedBronze(match) && <SharedBronzeTooltip target="sharedBronzeTooltip" />}
            </Col>
            <Col xs={{ size: 6 }} className={`box-team-name ${isWinner('A', match) ? '' : 'box-team-name-light'} d-none d-lg-block d-xl-none`}>
              {getBracketTeamName(match.away_team)}
              {match.walkover && match.away_walkover && (
                <WalkoverTooltip target={`walkover_${match.away_team}_${match.home_team}`} content={match.walkover} anchor="(w)" />
              )}
              {match.home_extra_score != null &&
                match.away_extra_score != null &&
                match.home_extra_score < match.away_extra_score &&
                getExtraTimeTooltip(match, { ...config, shortAnchor: true })}
              {match.home_extra_score != null &&
                match.away_extra_score != null &&
                match.home_extra_score === match.away_extra_score &&
                match.home_penalty_score < match.away_penalty_score && <PenTooltip target="penTooltip2" anchor="(p)" />}
              {match.home_replay_score != null && match.away_replay_score != null && match.home_replay_score < match.away_replay_score && (
                <ReplayTooltip target="replayTooltip" anchor="(r)" />
              )}
              {isSharedBronze(match) && <SharedBronzeTooltip target="sharedBronzeTooltip" />}
            </Col>
            <Col xs={{ size: 6 }} className={`box-team-name ${isWinner('A', match) ? '' : 'box-team-name-light'} d-none d-md-block d-lg-none`}>
              {getBracketTeamCode(match.away_team)}
              {match.walkover && match.away_walkover && (
                <WalkoverTooltip target={`walkover_${match.away_team}_${match.home_team}`} content={match.walkover} anchor="(w/o)" />
              )}
              {match.home_extra_score != null &&
                match.away_extra_score != null &&
                match.home_extra_score < match.away_extra_score &&
                getExtraTimeTooltip(match, config)}
              {match.home_extra_score != null &&
                match.away_extra_score != null &&
                match.home_extra_score === match.away_extra_score &&
                match.home_penalty_score < match.away_penalty_score && <PenTooltip target="penTooltip2" anchor="(pen.)" />}
              {match.home_replay_score != null && match.away_replay_score != null && match.home_replay_score < match.away_replay_score && (
                <ReplayTooltip target="replayTooltip" anchor="(rep.)" />
              )}
              {isSharedBronze(match) && <SharedBronzeTooltip target="sharedBronzeTooltip" />}
            </Col>
            <Col xs={{ size: 6 }} className={`box-team-name ${isWinner('A', match) ? '' : 'box-team-name-light'} d-none d-sm-block d-md-none`}>
              {getBracketTeamCode(match.away_team)}
              {match.walkover && match.away_walkover && (
                <WalkoverTooltip target={`walkover_${match.away_team}_${match.home_team}`} content={match.walkover} anchor="(w)" />
              )}
              {match.home_extra_score != null &&
                match.away_extra_score != null &&
                match.home_extra_score < match.away_extra_score &&
                getExtraTimeTooltip(match, { ...config, shortAnchor: true })}
              {match.home_extra_score != null &&
                match.away_extra_score != null &&
                match.home_extra_score === match.away_extra_score &&
                match.home_penalty_score < match.away_penalty_score && <PenTooltip target="penTooltip2" anchor="(p)" />}
              {match.home_replay_score != null && match.away_replay_score != null && match.home_replay_score < match.away_replay_score && (
                <ReplayTooltip target="replayTooltip" anchor="(r)" />
              )}
              {isSharedBronze(match) && <SharedBronzeTooltip target="sharedBronzeTooltip" />}
            </Col>
            <Col xs={{ size: 8, offset: 1 }} className={`box-team-name ${isWinner('A', match) ? '' : 'box-team-name-light'} d-block d-xs-block d-sm-none`}>
              <img className="flag-xxs" src={getFlagSrc(match.away_team)} alt={match.away_team} title={match.away_team} />
              &nbsp;
              {getBracketTeamCode(match.away_team)}
              {match.walkover && match.away_walkover && (
                <WalkoverTooltip target={`walkover_${match.away_team}_${match.home_team}`} content={match.walkover} anchor="(w)" />
              )}
              {match.home_extra_score != null &&
                match.away_extra_score != null &&
                match.home_extra_score < match.away_extra_score &&
                getExtraTimeTooltip(match, { ...config, shortAnchor: true })}
              {match.home_extra_score != null &&
                match.away_extra_score != null &&
                match.home_extra_score === match.away_extra_score &&
                match.home_penalty_score < match.away_penalty_score && <PenTooltip target="penTooltip1" anchor="(p)" />}
              {match.home_replay_score != null && match.away_replay_score != null && match.home_replay_score < match.away_replay_score && (
                <ReplayTooltip target="replayTooltip" anchor="(r)" />
              )}
              {isSharedBronze(match) && <SharedBronzeTooltip target="sharedBronzeTooltip" />}
            </Col>
            {match.away_extra_score == null && (
              <Col xs={{ size: 3 }} className={`box-score ${isWinner('A', match) ? '' : 'box-score-light'}`}>
                {match.away_score}
                {match.away_penalty_score != null && <React.Fragment>&nbsp;({match.away_penalty_score})</React.Fragment>}
                {match.away_replay_score != null && <React.Fragment>({match.away_replay_score})</React.Fragment>}
              </Col>
            )}
            {match.away_extra_score != null && (
              <Col xs={{ size: 3 }} className={`box-score ${isWinner('A', match) ? '' : 'box-score-light'}`}>
                {parseInt(match.away_score) + parseInt(match.away_extra_score)}
                {match.away_penalty_score != null && <React.Fragment>&nbsp;({match.away_penalty_score})</React.Fragment>}
                {match.away_replay_score != null && <React.Fragment>({match.away_replay_score})</React.Fragment>}
              </Col>
            )}
          </Row>
        </Col>
      </Row>
      {colIndex === 0 && !lastBox && <Row className="bracket-gap-height-01"></Row>}
      {colIndex === 1 && !lastBox && <Row className="bracket-gap-height-11"></Row>}
      {colIndex === 2 && !lastBox && <Row className="bracket-gap-height-21"></Row>}
    </React.Fragment>
  )
}

const BracketColInner = (props) => {
  const { round, colIndex, config } = props
  // console.log('config', config)
  const roundName =
    round.name && (config.tournamentTypeId === 'MOFT' || config.tournamentTypeId === 'WOFT')
      ? round.name.replace('Third-place', 'Bronze medal').replace('Final', 'Gold medal')
      : round.name

  const roundNameBlock = (
    <React.Fragment>
      {roundName}
      {roundName === 'Consolation' && <ConsolationTooltip target="consolationTooltip" />}
    </React.Fragment>
  )

  return (
    <React.Fragment>
      {colIndex === 0 && <Row className="bracket-gap-height-00"></Row>}
      {colIndex === 1 && <Row className="bracket-gap-height-10"></Row>}
      {colIndex === 2 && <Row className="bracket-gap-height-20"></Row>}
      <Row className="no-gutters bracket-col-height">
        <Col xs={{ size: 11, offset: 1 }}>
          <div className="h2-ff1 margin-top-md d-none d-xl-block">{roundNameBlock}</div>
          <div className="h3-ff1 margin-top-md d-none d-lg-block d-xl-none">{roundNameBlock}</div>
          <div className="h5-ff1 margin-top-md d-none d-md-block d-lg-none">{roundNameBlock}</div>
          <div className="h5-ff1 margin-top-md d-block d-md-none">
            {round.short_name}
            {roundName === 'Consolation' && <ConsolationTooltip target="consolationTooltip" />}
          </div>
        </Col>
      </Row>
      {round.matches.map((m, index) => (
        <BracketBox match={m} colIndex={colIndex} lastBox={index === round.matches.length - 1} config={config} key={index} />
      ))}
    </React.Fragment>
  )
}

const BracketCol = (props) => {
  const { round, colIndex, config } = props
  return (
    <Col className="col-brk-22">
      <BracketColInner round={round} colIndex={colIndex} config={config} />
    </Col>
  )
}

const BracketFinalCol = (props) => {
  const { round, thirdPlace, config } = props
  return (
    <Col className="col-brk-22">
      {config.roundCount === 2 && !thirdPlace && <Row className="bracket-gap-height-10"></Row>}
      {config.roundCount === 3 && thirdPlace && <Row className="bracket-gap-height-10"></Row>}
      {((config.roundCount === 4 && thirdPlace) || (config.roundCount === 3 && !thirdPlace)) && <Row className="bracket-gap-height-20"></Row>}
      {(config.roundCount === 5 || (config.roundCount === 4 && !thirdPlace)) && <Row className="bracket-gap-height-30"></Row>}
      <BracketColInner round={round} config={config} />
      {thirdPlace && <BracketColInner round={thirdPlace} config={config} />}
    </Col>
  )
}

const BracketHook1 = (props) => {
  const { colIndex, hookCount } = props
  return (
    <Col className="col-brk-2">
      {Array.from(Array(hookCount), (e, i) => {
        return (
          <React.Fragment key={i}>
            {colIndex === 0 && (
              <React.Fragment>
                {i === 0 && <Row className="bracket-hook1-gap-height-00"></Row>}
                <Row className="no-gutters">
                  <Col className="col-sm-12 bracket-hook10"></Col>
                </Row>
                {i < hookCount - 1 && <Row className="bracket-hook1-gap-height-01"></Row>}
              </React.Fragment>
            )}
            {colIndex === 1 && (
              <React.Fragment>
                {i === 0 && <Row className="bracket-hook1-gap-height-10"></Row>}
                <Row className="no-gutters">
                  <Col className="col-sm-12 bracket-hook11"></Col>
                </Row>
                {i < hookCount - 1 && <Row className="bracket-hook1-gap-height-11"></Row>}
              </React.Fragment>
            )}
            {colIndex === 2 && (
              <React.Fragment>
                {i === 0 && <Row className="bracket-hook1-gap-height-20"></Row>}
                <Row className="no-gutters">
                  <Col className="col-sm-12 bracket-hook12"></Col>
                </Row>
              </React.Fragment>
            )}
          </React.Fragment>
        )
      })}
    </Col>
  )
}

const BracketHook2 = (props) => {
  const { colIndex, hookCount } = props
  return (
    <Col className="col-brk-2">
      {Array.from(Array(hookCount), (e, i) => {
        return (
          <React.Fragment key={i}>
            {colIndex === 0 && (
              <React.Fragment>
                {i === 0 && (
                  <Row className="no-gutters">
                    <Col className="col-sm-12 bracket-hook200"></Col>
                  </Row>
                )}
                {i > 0 && (
                  <Row className="no-gutters">
                    <Col className="col-sm-12 bracket-hook201"></Col>
                  </Row>
                )}
              </React.Fragment>
            )}
            {colIndex === 1 && (
              <React.Fragment>
                {i === 0 && (
                  <Row className="no-gutters">
                    <Col className="col-sm-12 bracket-hook210"></Col>
                  </Row>
                )}
                {i > 0 && (
                  <Row className="no-gutters">
                    <Col className="col-sm-12 bracket-hook211"></Col>
                  </Row>
                )}
              </React.Fragment>
            )}
            {colIndex === 2 && (
              <React.Fragment>
                {i === 0 && (
                  <Row className="no-gutters">
                    <Col className="col-sm-12 bracket-hook220"></Col>
                  </Row>
                )}
              </React.Fragment>
            )}
          </React.Fragment>
        )
      })}
    </Col>
  )
}

const attachReplayMatches = (round) => {
  if (!round.matches) return
  // console.log('round', round)
  const roundMatches = round.matches.filter((m) => !m.replay)
  const replayMatches = round.matches.filter((m) => m.replay)
  roundMatches.forEach((m) => {
    const cond1 = (rm) => {
      return m.home_team === rm.home_team && m.away_team === rm.away_team
    }
    const cond2 = (rm) => {
      return m.home_team === rm.away_team && m.away_team === rm.home_team
    }
    const rm = replayMatches.find((rm) => cond1(rm) || cond2(rm))
    if (rm) {
      if (m.home_team === rm.home_team && m.away_team === rm.away_team) {
        m.home_replay_score = rm.home_score
        m.away_replay_score = rm.away_score
      } else if (m.home_team === rm.away_team && m.away_team === rm.home_team) {
        m.home_replay_score = rm.away_score
        m.away_replay_score = rm.home_score
      }
      m.replay_date = rm.date
      m.replay_time = rm.time
    }
  })
  return { ...round, matches: roundMatches }
}

const Bracket = (props) => {
  const { stage, config } = props
  const thirdPlace = stage.rounds ? stage.rounds.find((s) => s.name === 'Third-place') : {}
  const [collapse, setCollapse] = useState(false)
  const [status, setStatus] = useState('Closed')
  const onEntering = () => setStatus('Opening...')
  const onEntered = () => setStatus('Opened')
  const onExiting = () => setStatus('Closing...')
  const onExited = () => setStatus('Closed')
  const toggle = () => setCollapse(!collapse)

  return (
    <React.Fragment>
      <Row className="mt-3 text-center">
        <Col sm="12">
          <Button outline color="primary" onClick={toggle} className="h2-ff3 btn-collapse">
            {!config.consolation_bracket && <React.Fragment>Bracket&nbsp;</React.Fragment>}
            {config.consolation_bracket && <React.Fragment>Consolation Bracket&nbsp;</React.Fragment>}
            {status === 'Opening...' && <i className="bx bx-dots-vertical-rounded"></i>}
            {status === 'Opened' && <i className="bx bx-chevron-up-square"></i>}
            {status === 'Closing...' && <i className="bx bx-dots-vertical-rounded"></i>}
            {status === 'Closed' && <i className="bx bx-chevron-down-square"></i>}
          </Button>
        </Col>
      </Row>
      <Collapse isOpen={collapse} onEntering={onEntering} onEntered={onEntered} onExiting={onExiting} onExited={onExited}>
        <Row className="no-gutters mb-5">
          {stage.rounds &&
            stage.rounds.map((_r, index) => {
              const r = hasReplay(_r) ? attachReplayMatches(_r) : _r
              if (r.matches) {
                const hookCount = r.matches.length % 2 === 0 ? r.matches.length / 2 : (r.matches.length - 1) / 2
                if (r.name === 'Third-place') {
                  return null
                } else if (r.name === 'Final') {
                  return <BracketFinalCol round={r} thirdPlace={thirdPlace} config={{ ...config, roundCount: stage.rounds.length }} key={r.name} />
                } else {
                  return (
                    <React.Fragment key={r.name}>
                      <BracketCol round={r} colIndex={index} config={config} />
                      <BracketHook1 colIndex={index} hookCount={hookCount} />
                      <BracketHook2 colIndex={index} hookCount={hookCount} />
                    </React.Fragment>
                  )
                }
              } else {
                return null
              }
            })}
        </Row>
      </Collapse>
    </React.Fragment>
  )
}

export default Bracket
