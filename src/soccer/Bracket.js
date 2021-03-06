import React, { useState } from 'react'
import {
  getFlagSrc,
  isWinner,
  isAggregateWinner,
  isAwayGoalsWinner,
  isSharedBronze,
  getBracketTeamName,
  getBracketTeamCode,
  AetTooltip,
  AwayGoalsTooltip,
  AwardedTooltip,
  GoldenGoalTooltip,
  SilverGoalTooltip,
  PenTooltip,
  WalkoverTooltip,
  ReplayTooltip,
  CoinTossTooltip,
  ByeTooltip,
  WithdrewTooltip,
  MatchPostponedTooltip,
  MatchVoidedTooltip,
  DisqualifiedTooltip,
  SharedBronzeTooltip,
  ConsolationTooltip,
  Extra140Tooltip,
  PlayoffSecondRoundTooltip,
  ReplacementTooltip,
} from './Helper'
import { hasReplay } from './RankingsHelper'
import { getTeamArray } from './DataHelper'
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

const getMatchDate = (match, config) => {
  if (!match) return
  return (
    <React.Fragment>
      {config.showMatchYear ? moment(match.date).format('MMMM D') : moment(match.date).format('MMM D, YYYY')}{' '}
      {match.replay_date && <React.Fragment>({moment(match.replay_date).format('MMMM D')})</React.Fragment>}
    </React.Fragment>
  )
}

const getMatchPairDate = (match) => {
  if (!match) return
  return <React.Fragment>{match.date ? moment(match.date).format('MMM D, YYYY') : ''}</React.Fragment>
}

export const getBracketClubLogoImg = (id, config) => {
  if (!id) return
  const team = getTeamArray().find((t) => t.id === id)
  if (team) {
    return (
      <React.Fragment>
        <img
          className="bracket-logo-xxxs bracket-logo-xxs bracket-logo-xs bracket-logo-sm"
          src={`/assets/images/${config.logo_path}/${team.logo_filename}`}
          alt={id}
          title={id}
        />
      </React.Fragment>
    )
  } else {
    console.log('Team error', team)
  }
}

export const getTeamFlag = (id, config) => {
  if (!id) return
  return (
    <React.Fragment>
      {config.team_type_id === 'CLUB' && getBracketClubLogoImg(id, config)}
      {config.team_type_id !== 'CLUB' && (
        <img className="bracket-flag-xxxs bracket-flag-xxs bracket-flag-xs bracket-flag-sm" src={getFlagSrc(id)} alt={id} title={id} />
      )}
    </React.Fragment>
  )
}

const BracketPairBox = (props) => {
  const { pair, colIndex, lastBox, config } = props
  if (!pair || !pair.matches || pair.matches.length === 0) return null
  const m1 = pair.matches[0]
  const m2 = pair.matches.length > 1 ? pair.matches[1] : {}
  // console.log('m2', m2)
  const m2_away_score =
    (m2.away_score !== undefined ? m2.away_score : 0) + parseInt(m2.match_type === 'secondleg' && m2.away_extra_score !== undefined ? m2.away_extra_score : 0)
  const m2_home_score =
    (m2.home_score !== undefined ? m2.home_score : 0) + parseInt(m2.match_type === 'secondleg' && m2.home_extra_score !== undefined ? m2.home_extra_score : 0)
  return (
    <React.Fragment>
      <Row className="no-gutters box-sm bracket-box-height">
        <Col sm="12" className="bracket-box-header-height border-bottom-gray5">
          <Row className="no-gutters">
            <Col xs={{ size: 11, offset: 1 }}>
              <span className="box-time d-block d-lg-none">
                {getMatchPairDate(m1)}
                {` | `}
                {getMatchPairDate(m2)}
              </span>
              <span className="box-time d-none d-lg-block">
                {getMatchPairDate(m1)}
                {`, `}
                {m1.city}
                {m2 && (
                  <React.Fragment>
                    {` | `}
                    {getMatchPairDate(m2)}
                    {m2.date ? `, ` : ``}
                    {m2.city}
                  </React.Fragment>
                )}
              </span>
            </Col>
          </Row>
        </Col>
        <Col sm="12" className="bracket-half-box-height border-bottom-gray5">
          <Row className="no-gutters h3-ff3">
            <Col xs={{ size: 2, offset: 1 }} className="d-none d-lg-block">
              {getTeamFlag(m1.home_team, config)}
            </Col>
            <Col xs={{ size: 2, offset: 1 }} className="d-none d-md-block d-lg-none">
              {getTeamFlag(m1.home_team, config)}
            </Col>
            <Col xs={{ size: 2, offset: 1 }} className="d-none d-sm-block d-md-none">
              {getTeamFlag(m1.home_team, config)}
            </Col>
            <Col xs={{ size: 6 }} className={`box-team-name ${isAggregateWinner('H', m1) ? '' : 'box-team-name-light'} d-none d-xl-block`}>
              {getBracketTeamName(m1.home_team)}
              {isAwayGoalsWinner('H', m1) && <AwayGoalsTooltip target="awayGoalsTooltip" anchor="(a)" />}
              {m2.home_extra_score != null && m2.away_extra_score != null && m2.home_extra_score < m2.away_extra_score && getExtraTimeTooltip(m2, config)}
            </Col>
            <Col xs={{ size: 6 }} className={`box-team-name ${isAggregateWinner('H', m1) ? '' : 'box-team-name-light'} d-none d-lg-block d-xl-none`}>
              {getBracketTeamName(m1.home_team)}
              {isAwayGoalsWinner('H', m1) && <AwayGoalsTooltip target="awayGoalsTooltip" anchor="(a)" />}
              {m2.home_extra_score != null &&
                m2.away_extra_score != null &&
                m2.home_extra_score < m2.away_extra_score &&
                getExtraTimeTooltip(m2, { ...config, shortAnchor: true })}
            </Col>
            <Col xs={{ size: 6 }} className={`box-team-name ${isAggregateWinner('H', m1) ? '' : 'box-team-name-light'} d-none d-md-block d-lg-none`}>
              {getBracketTeamCode(m1.home_team, config)}
              {isAwayGoalsWinner('H', m1) && <AwayGoalsTooltip target="awayGoalsTooltip" anchor="(a)" />}
              {m2.home_extra_score != null && m2.away_extra_score != null && m2.home_extra_score < m2.away_extra_score && getExtraTimeTooltip(m2, config)}
            </Col>
            <Col xs={{ size: 6 }} className={`box-team-name ${isAggregateWinner('H', m1) ? '' : 'box-team-name-light'} d-none d-sm-block d-md-none`}>
              {getBracketTeamCode(m1.home_team, config)}
              {isAwayGoalsWinner('H', m1) && <AwayGoalsTooltip target="awayGoalsTooltip" anchor="(a)" />}
              {m2.home_extra_score != null &&
                m2.away_extra_score != null &&
                m2.home_extra_score < m2.away_extra_score &&
                getExtraTimeTooltip(m2, { ...config, shortAnchor: true })}
            </Col>
            <Col
              xs={{ size: 8, offset: 1 }}
              className={`box-team-name ${isAggregateWinner('H', m1) ? '' : 'box-team-name-light'} d-block d-xs-block d-sm-none`}
            >
              {getTeamFlag(m1.home_team, config)}
              &nbsp;
              {getBracketTeamCode(m1.home_team, config)}
              {isAwayGoalsWinner('H', m1) && <AwayGoalsTooltip target="awayGoalsTooltip" anchor="(a)" />}
              {m2.home_extra_score != null &&
                m2.away_extra_score != null &&
                m2.home_extra_score < m2.away_extra_score &&
                getExtraTimeTooltip(m2, { ...config, shortAnchor: true })}
            </Col>
            <Col xs={{ size: 1 }} className={`box-score ${isAggregateWinner('H', m1) ? '' : 'box-score-light'}`}>
              {m1.home_score}
            </Col>
            <Col xs={{ size: 1 }} className={`box-score ${isAggregateWinner('H', m1) ? '' : 'box-score-light'}`}>
              {m2.away_score !== undefined ? m2_away_score : ''}
            </Col>
            <Col xs={{ size: 1 }} className={`box-score ${isAggregateWinner('H', m1) ? '' : 'box-score-light'}`}>
              {m1.home_aggregate_score_1st_leg}
            </Col>
            {/* {m1.home_extra_score == null && (
              <Col xs={{ size: 1 }} className={`box-score ${isWinner('H', m1) ? '' : 'box-score-light'}`}>
                {m1.home_score}
              </Col>
            )} */}
            {/* {match.home_extra_score != null && (
              <Col xs={{ size: 3 }} className={`box-score ${isWinner('H', match) ? '' : 'box-score-light'}`}>
                {parseInt(match.home_score) + parseInt(match.home_extra_score)}
                {match.home_penalty_score != null && <React.Fragment>&nbsp;({match.home_penalty_score})</React.Fragment>}
                {match.home_replay_score != null && <React.Fragment>({match.home_replay_score})</React.Fragment>}
                {match.void_notes && <MatchVoidedTooltip target="matchVoidedTooltip" anchor="(v)" notes={match.void_notes} />}
                {(match.home_awarded || match.home_awarded_score_not_counted) && match.awarded_text && (
                  <AwardedTooltip target={`awarded_${match.home_team}_${match.away_team}`} content={match.awarded_text} />
                )}
              </Col>
            )} */}
          </Row>
        </Col>
        <Col sm="12" className="bracket-half-box-height">
          <Row className="no-gutters h4-ff3">
            <Col xs={{ size: 2, offset: 1 }} className="d-none d-lg-block">
              {m1 && <React.Fragment>{getTeamFlag(m1.away_team, config)}</React.Fragment>}
            </Col>
            <Col xs={{ size: 2, offset: 1 }} className="d-none d-md-block d-lg-none">
              {m1 && <React.Fragment>{getTeamFlag(m1.away_team, config)}</React.Fragment>}
            </Col>
            <Col xs={{ size: 2, offset: 1 }} className="d-none d-sm-block d-md-none">
              {m1 && <React.Fragment>{getTeamFlag(m1.away_team, config)}</React.Fragment>}
            </Col>
            <Col xs={{ size: 6 }} className={`box-team-name ${isAggregateWinner('A', m1) ? '' : 'box-team-name-light'} d-none d-xl-block`}>
              {getBracketTeamName(m1.away_team)}
              {isAwayGoalsWinner('A', m1) && <AwayGoalsTooltip target="awayGoalsTooltip" anchor="(a)" />}
              {m2.home_extra_score != null && m2.away_extra_score != null && m2.home_extra_score > m2.away_extra_score && getExtraTimeTooltip(m2, config)}
            </Col>
            <Col xs={{ size: 6 }} className={`box-team-name ${isAggregateWinner('A', m1) ? '' : 'box-team-name-light'} d-none d-lg-block d-xl-none`}>
              {getBracketTeamName(m1.away_team)}
              {isAwayGoalsWinner('A', m1) && <AwayGoalsTooltip target="awayGoalsTooltip" anchor="(a)" />}
              {m2.home_extra_score != null &&
                m2.away_extra_score != null &&
                m2.home_extra_score > m2.away_extra_score &&
                getExtraTimeTooltip(m2, { ...config, shortAnchor: true })}
            </Col>
            <Col xs={{ size: 6 }} className={`box-team-name ${isAggregateWinner('A', m1) ? '' : 'box-team-name-light'} d-none d-md-block d-lg-none`}>
              {getBracketTeamCode(m1.away_team, config)}
              {isAwayGoalsWinner('A', m1) && <AwayGoalsTooltip target="awayGoalsTooltip" anchor="(a)" />}
              {m2.home_extra_score != null && m2.away_extra_score != null && m2.home_extra_score > m2.away_extra_score && getExtraTimeTooltip(m2, config)}
            </Col>
            <Col xs={{ size: 6 }} className={`box-team-name ${isAggregateWinner('A', m1) ? '' : 'box-team-name-light'} d-none d-sm-block d-md-none`}>
              {getBracketTeamCode(m1.away_team, config)}
              {isAwayGoalsWinner('A', m1) && <AwayGoalsTooltip target="awayGoalsTooltip" anchor="(a)" />}
              {m2.home_extra_score != null &&
                m2.away_extra_score != null &&
                m2.home_extra_score > m2.away_extra_score &&
                getExtraTimeTooltip(m2, { ...config, shortAnchor: true })}
            </Col>
            <Col
              xs={{ size: 8, offset: 1 }}
              className={`box-team-name ${isAggregateWinner('A', m1) ? '' : 'box-team-name-light'} d-block d-xs-block d-sm-none`}
            >
              {getTeamFlag(m1.away_team, config)}
              &nbsp;
              {getBracketTeamCode(m1.away_team, config)}
              {isAwayGoalsWinner('A', m1) && <AwayGoalsTooltip target="awayGoalsTooltip" anchor="(a)" />}
              {m2.home_extra_score != null &&
                m2.away_extra_score != null &&
                m2.home_extra_score > m2.away_extra_score &&
                getExtraTimeTooltip(m2, { ...config, shortAnchor: true })}
            </Col>
            <Col xs={{ size: 1 }} className={`box-score ${isAggregateWinner('A', m1) ? '' : 'box-score-light'}`}>
              {m1.away_score}
            </Col>
            <Col xs={{ size: 1 }} className={`box-score ${isAggregateWinner('A', m1) ? '' : 'box-score-light'}`}>
              {m2.home_score !== undefined ? m2_home_score : ''}
            </Col>
            <Col xs={{ size: 1 }} className={`box-score ${isAggregateWinner('A', m1) ? '' : 'box-score-light'}`}>
              {m2.home_aggregate_score_2nd_leg}
            </Col>
            {/* {m1.away_extra_score == null && (
              <Col xs={{ size: 3 }} className={`box-score ${isWinner('A', m1) ? '' : 'box-score-light'}`}>
                {m1.away_score}
                {match.away_penalty_score != null && <React.Fragment>&nbsp;({match.away_penalty_score})</React.Fragment>}
                {match.away_replay_score != null && <React.Fragment>({match.away_replay_score})</React.Fragment>}
              </Col>
            )} */}
            {/* {match.away_extra_score != null && (
              <Col xs={{ size: 3 }} className={`box-score ${isWinner('A', match) ? '' : 'box-score-light'}`}>
                {parseInt(match.away_score) + parseInt(match.away_extra_score)}
                {match.away_penalty_score != null && <React.Fragment>&nbsp;({match.away_penalty_score})</React.Fragment>}
                {match.away_replay_score != null && <React.Fragment>({match.away_replay_score})</React.Fragment>}
              </Col>
            )} */}
          </Row>
        </Col>
      </Row>
      {colIndex === 0 && !lastBox && <Row className="bracket-gap-height-01"></Row>}
      {colIndex === 1 && !lastBox && <Row className="bracket-gap-height-11"></Row>}
      {colIndex === 2 && !lastBox && <Row className="bracket-gap-height-21"></Row>}
    </React.Fragment>
  )
}

const BracketBox = (props) => {
  const { match, colIndex, lastBox, config } = props
  // console.log('config', config)
  return (
    <React.Fragment>
      <Row className="no-gutters box-sm bracket-box-height">
        <Col sm="12" className="bracket-box-header-height border-bottom-gray5">
          <Row className="no-gutters">
            <Col xs={{ size: 11, offset: 1 }}>
              <span className="box-time d-block d-lg-none">
                {getMatchDate(match, config)}
                {match.city ? ` | ${match.city}` : ``}
              </span>
              <span className="box-time d-none d-lg-block">
                {getMatchDate(match, config)}
                {match.stadium && match.city ? ` | ${match.stadium}, ${match.city}` : ``}
              </span>
            </Col>
          </Row>
        </Col>
        <Col sm="12" className="bracket-half-box-height border-bottom-gray5">
          <Row className="no-gutters h3-ff3">
            <Col xs={{ size: 2, offset: 1 }} className="d-none d-lg-block">
              {getTeamFlag(match.home_team, config)}
            </Col>
            <Col xs={{ size: 2, offset: 1 }} className="d-none d-md-block d-lg-none">
              {getTeamFlag(match.home_team, config)}
            </Col>
            <Col xs={{ size: 2, offset: 1 }} className="d-none d-sm-block d-md-none">
              {getTeamFlag(match.home_team, config)}
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
              {match.home_penalty_score > match.away_penalty_score && <PenTooltip target="penTooltip1" anchor="(pen.)" />}
              {match.home_replay_score != null && match.away_replay_score != null && match.home_replay_score > match.away_replay_score && (
                <ReplayTooltip target="replayTooltip" anchor="(rep.)" />
              )}
              {match.home_coin_toss && <CoinTossTooltip target="coinTossTooltip" anchor="(coin.)" />}
              {match.home_bye && <ByeTooltip target={`byeTooltip_${match.home_team}_${match.away_team}`} anchor="(bye)" notes={match.bye_notes} />}
              {match.home_withdrew && <WithdrewTooltip target="withdrewTooltip" anchor="(wdr)" />}
              {match.postponed && <MatchPostponedTooltip target="matchPostponedTooltip" anchor="(ppd)" notes={match.postponed_notes} />}
              {isSharedBronze(match) && <SharedBronzeTooltip target="sharedBronzeTooltip" notes={match.shared_bronze_text} />}
              {match.extra_140 && <Extra140Tooltip target={`extra140`} />}
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
              {match.home_penalty_score > match.away_penalty_score && <PenTooltip target="penTooltip1" anchor="(p)" />}
              {match.home_replay_score != null && match.away_replay_score != null && match.home_replay_score > match.away_replay_score && (
                <ReplayTooltip target="replayTooltip" anchor="(r)" />
              )}
              {match.home_coin_toss && <CoinTossTooltip target="coinTossTooltip" anchor="(ct)" />}
              {match.home_bye && <ByeTooltip target={`byeTooltip_${match.home_team}_${match.away_team}`} anchor="(b)" notes={match.bye_notes} />}
              {match.home_withdrew && <WithdrewTooltip target="withdrewTooltip" anchor="(wdr)" />}
              {match.postponed && <MatchPostponedTooltip target="matchPostponedTooltip" anchor="(ppd)" notes={match.postponed_notes} />}
              {isSharedBronze(match) && <SharedBronzeTooltip target="sharedBronzeTooltip" notes={match.shared_bronze_text} />}
              {match.extra_140 && <Extra140Tooltip target={`extra140`} />}
            </Col>
            <Col xs={{ size: 6 }} className={`box-team-name ${isWinner('H', match) ? '' : 'box-team-name-light'} d-none d-md-block d-lg-none`}>
              {getBracketTeamCode(match.home_team, config)}
              {match.walkover && match.home_walkover && (
                <WalkoverTooltip target={`walkover_${match.home_team}_${match.away_team}`} content={match.walkover} anchor="(w/o)" />
              )}
              {match.home_extra_score != null &&
                match.away_extra_score != null &&
                match.home_extra_score > match.away_extra_score &&
                getExtraTimeTooltip(match, config)}
              {match.home_penalty_score > match.away_penalty_score && <PenTooltip target="penTooltip1" anchor="(pen.)" />}
              {match.home_replay_score != null && match.away_replay_score != null && match.home_replay_score > match.away_replay_score && (
                <ReplayTooltip target="replayTooltip" anchor="(rep.)" />
              )}
              {match.home_coin_toss && <CoinTossTooltip target="coinTossTooltip" anchor="(coin.)" />}
              {match.home_bye && <ByeTooltip target={`byeTooltip_${match.home_team}_${match.away_team}`} anchor="(bye)" notes={match.bye_notes} />}
              {match.home_withdrew && <WithdrewTooltip target="withdrewTooltip" anchor="(wdr)" />}
              {match.postponed && <MatchPostponedTooltip target="matchPostponedTooltip" anchor="(ppd)" notes={match.postponed_notes} />}
              {isSharedBronze(match) && <SharedBronzeTooltip target="sharedBronzeTooltip" notes={match.shared_bronze_text} />}
              {match.extra_140 && <Extra140Tooltip target={`extra140`} />}
            </Col>
            <Col xs={{ size: 6 }} className={`box-team-name ${isWinner('H', match) ? '' : 'box-team-name-light'} d-none d-sm-block d-md-none`}>
              {getBracketTeamCode(match.home_team, config)}
              {match.walkover && match.home_walkover && (
                <WalkoverTooltip target={`walkover_${match.home_team}_${match.away_team}`} content={match.walkover} anchor="(w)" />
              )}
              {match.home_extra_score != null &&
                match.away_extra_score != null &&
                match.home_extra_score > match.away_extra_score &&
                getExtraTimeTooltip(match, { ...config, shortAnchor: true })}
              {match.home_penalty_score > match.away_penalty_score && <PenTooltip target="penTooltip1" anchor="(p)" />}
              {match.home_replay_score != null && match.away_replay_score != null && match.home_replay_score > match.away_replay_score && (
                <ReplayTooltip target="replayTooltip" anchor="(r)" />
              )}
              {match.home_coin_toss && <CoinTossTooltip target="coinTossTooltip" anchor="(ct)" />}
              {match.home_bye && <ByeTooltip target={`byeTooltip_${match.home_team}_${match.away_team}`} anchor="(b)" notes={match.bye_notes} />}
              {match.home_withdrew && <WithdrewTooltip target="withdrewTooltip" anchor="(wdr)" />}
              {match.postponed && <MatchPostponedTooltip target="matchPostponedTooltip" anchor="(ppd)" notes={match.postponed_notes} />}
              {isSharedBronze(match) && <SharedBronzeTooltip target="sharedBronzeTooltip" notes={match.shared_bronze_text} />}
              {match.extra_140 && <Extra140Tooltip target={`extra140`} />}
            </Col>
            <Col xs={{ size: 8, offset: 1 }} className={`box-team-name ${isWinner('H', match) ? '' : 'box-team-name-light'} d-block d-xs-block d-sm-none`}>
              {getTeamFlag(match.home_team, config)}
              &nbsp;
              {getBracketTeamCode(match.home_team, config)}
              {match.walkover && match.home_walkover && (
                <WalkoverTooltip target={`walkover_${match.home_team}_${match.away_team}`} content={match.walkover} anchor="(w)" />
              )}
              {match.home_extra_score != null &&
                match.away_extra_score != null &&
                match.home_extra_score > match.away_extra_score &&
                getExtraTimeTooltip(match, { ...config, shortAnchor: true })}
              {match.home_penalty_score > match.away_penalty_score && <PenTooltip target="penTooltip1" anchor="(p)" />}
              {match.home_replay_score != null && match.away_replay_score != null && match.home_replay_score > match.away_replay_score && (
                <ReplayTooltip target="replayTooltip" anchor="(r)" />
              )}
              {match.home_coin_toss && <CoinTossTooltip target="coinTossTooltip" anchor="(ct)" />}
              {match.home_bye && <ByeTooltip target={`byeTooltip_${match.home_team}_${match.away_team}`} anchor="(b)" notes={match.bye_notes} />}
              {match.home_withdrew && <WithdrewTooltip target="withdrewTooltip" anchor="(wdr)" />}
              {match.postponed && <MatchPostponedTooltip target="matchPostponedTooltip" anchor="(ppd)" notes={match.postponed_notes} />}
              {isSharedBronze(match) && <SharedBronzeTooltip target="sharedBronzeTooltip" notes={match.shared_bronze_text} />}
              {match.extra_140 && <Extra140Tooltip target={`extra140`} />}
            </Col>
            {match.home_extra_score == null && (
              <Col xs={{ size: 3 }} className={`box-score ${isWinner('H', match) ? '' : 'box-score-light'}`}>
                {match.home_score}
                {match.home_penalty_score != null && <React.Fragment>&nbsp;({match.home_penalty_score})</React.Fragment>}
                {match.home_replay_score != null && <React.Fragment>({match.home_replay_score})</React.Fragment>}
                {match.void_notes && <MatchVoidedTooltip target="matchVoidedTooltip" anchor="(v)" notes={match.void_notes} />}
                {(match.home_awarded || match.home_awarded_score_not_counted) && match.awarded_text && (
                  <AwardedTooltip target={`awarded_${match.home_team}_${match.away_team}`} content={match.awarded_text} />
                )}
              </Col>
            )}
            {match.home_extra_score != null && (
              <Col xs={{ size: 3 }} className={`box-score ${isWinner('H', match) ? '' : 'box-score-light'}`}>
                {parseInt(match.home_score) + parseInt(match.home_extra_score)}
                {match.home_penalty_score != null && <React.Fragment>&nbsp;({match.home_penalty_score})</React.Fragment>}
                {match.home_replay_score != null && <React.Fragment>({match.home_replay_score})</React.Fragment>}
                {match.void_notes && <MatchVoidedTooltip target="matchVoidedTooltip" anchor="(v)" notes={match.void_notes} />}
                {(match.home_awarded || match.home_awarded_score_not_counted) && match.awarded_text && (
                  <AwardedTooltip target={`awarded_${match.home_team}_${match.away_team}`} content={match.awarded_text} />
                )}
              </Col>
            )}
          </Row>
        </Col>
        <Col sm="12" className="bracket-half-box-height">
          <Row className="no-gutters h4-ff3">
            <Col xs={{ size: 2, offset: 1 }} className="d-none d-lg-block">
              {getTeamFlag(match.away_team, config)}
            </Col>
            <Col xs={{ size: 2, offset: 1 }} className="d-none d-md-block d-lg-none">
              {getTeamFlag(match.away_team, config)}
            </Col>
            <Col xs={{ size: 2, offset: 1 }} className="d-none d-sm-block d-md-none">
              {getTeamFlag(match.away_team, config)}
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
              {match.home_penalty_score < match.away_penalty_score && <PenTooltip target="penTooltip2" anchor="(pen.)" />}
              {match.home_replay_score != null && match.away_replay_score != null && match.home_replay_score < match.away_replay_score && (
                <ReplayTooltip target="replayTooltip" anchor="(rep.)" />
              )}
              {match.away_coin_toss && <CoinTossTooltip target="coinTossTooltip" anchor="(coin.)" />}
              {match.away_withdrew && <WithdrewTooltip target="withdrewTooltip" anchor="(wdr)" />}
              {match.away_disqualified && <DisqualifiedTooltip target="disqualifiedTooltip" anchor="(dq)" notes={match.disqualified_notes} />}
              {match.away_replacement && <ReplacementTooltip target="replacementTooltip" notes={match.replacement_notes} />}
              {isSharedBronze(match) && <SharedBronzeTooltip target="sharedBronzeTooltip" notes={match.shared_bronze_text} />}
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
              {match.home_penalty_score < match.away_penalty_score && <PenTooltip target="penTooltip2" anchor="(p)" />}
              {match.home_replay_score != null && match.away_replay_score != null && match.home_replay_score < match.away_replay_score && (
                <ReplayTooltip target="replayTooltip" anchor="(r)" />
              )}
              {match.away_coin_toss && <CoinTossTooltip target="coinTossTooltip" anchor="(ct)" />}
              {match.away_withdrew && <WithdrewTooltip target="withdrewTooltip" anchor="(wdr)" />}
              {match.away_disqualified && <DisqualifiedTooltip target="disqualifiedTooltip" anchor="(dq)" notes={match.disqualified_notes} />}
              {match.away_replacement && <ReplacementTooltip target="replacementTooltip" notes={match.replacement_notes} />}
              {isSharedBronze(match) && <SharedBronzeTooltip target="sharedBronzeTooltip" notes={match.shared_bronze_text} />}
            </Col>
            <Col xs={{ size: 6 }} className={`box-team-name ${isWinner('A', match) ? '' : 'box-team-name-light'} d-none d-md-block d-lg-none`}>
              {getBracketTeamCode(match.away_team, config)}
              {match.walkover && match.away_walkover && (
                <WalkoverTooltip target={`walkover_${match.away_team}_${match.home_team}`} content={match.walkover} anchor="(w/o)" />
              )}
              {match.home_extra_score != null &&
                match.away_extra_score != null &&
                match.home_extra_score < match.away_extra_score &&
                getExtraTimeTooltip(match, config)}
              {match.home_penalty_score < match.away_penalty_score && <PenTooltip target="penTooltip2" anchor="(pen.)" />}
              {match.home_replay_score != null && match.away_replay_score != null && match.home_replay_score < match.away_replay_score && (
                <ReplayTooltip target="replayTooltip" anchor="(rep.)" />
              )}
              {match.away_coin_toss && <CoinTossTooltip target="coinTossTooltip" anchor="(coin.)" />}
              {match.away_withdrew && <WithdrewTooltip target="withdrewTooltip" anchor="(wdr)" />}
              {match.away_disqualified && <DisqualifiedTooltip target="disqualifiedTooltip" anchor="(dq)" notes={match.disqualified_notes} />}
              {match.away_replacement && <ReplacementTooltip target="replacementTooltip" notes={match.replacement_notes} />}
              {isSharedBronze(match) && <SharedBronzeTooltip target="sharedBronzeTooltip" notes={match.shared_bronze_text} />}
            </Col>
            <Col xs={{ size: 6 }} className={`box-team-name ${isWinner('A', match) ? '' : 'box-team-name-light'} d-none d-sm-block d-md-none`}>
              {getBracketTeamCode(match.away_team, config)}
              {match.walkover && match.away_walkover && (
                <WalkoverTooltip target={`walkover_${match.away_team}_${match.home_team}`} content={match.walkover} anchor="(w)" />
              )}
              {match.home_extra_score != null &&
                match.away_extra_score != null &&
                match.home_extra_score < match.away_extra_score &&
                getExtraTimeTooltip(match, { ...config, shortAnchor: true })}
              {match.home_penalty_score < match.away_penalty_score && <PenTooltip target="penTooltip2" anchor="(p)" />}
              {match.home_replay_score != null && match.away_replay_score != null && match.home_replay_score < match.away_replay_score && (
                <ReplayTooltip target="replayTooltip" anchor="(r)" />
              )}
              {match.away_coin_toss && <CoinTossTooltip target="coinTossTooltip" anchor="(ct)" />}
              {match.away_withdrew && <WithdrewTooltip target="withdrewTooltip" anchor="(wdr)" />}
              {match.away_disqualified && <DisqualifiedTooltip target="disqualifiedTooltip" anchor="(dq)" notes={match.disqualified_notes} />}
              {match.away_replacement && <ReplacementTooltip target="replacementTooltip" notes={match.replacement_notes} />}
              {isSharedBronze(match) && <SharedBronzeTooltip target="sharedBronzeTooltip" notes={match.shared_bronze_text} />}
            </Col>
            <Col xs={{ size: 8, offset: 1 }} className={`box-team-name ${isWinner('A', match) ? '' : 'box-team-name-light'} d-block d-xs-block d-sm-none`}>
              {getTeamFlag(match.away_team, config)}
              &nbsp;
              {getBracketTeamCode(match.away_team, config)}
              {match.walkover && match.away_walkover && (
                <WalkoverTooltip target={`walkover_${match.away_team}_${match.home_team}`} content={match.walkover} anchor="(w)" />
              )}
              {match.home_extra_score != null &&
                match.away_extra_score != null &&
                match.home_extra_score < match.away_extra_score &&
                getExtraTimeTooltip(match, { ...config, shortAnchor: true })}
              {match.home_penalty_score < match.away_penalty_score && <PenTooltip target="penTooltip1" anchor="(p)" />}
              {match.home_replay_score != null && match.away_replay_score != null && match.home_replay_score < match.away_replay_score && (
                <ReplayTooltip target="replayTooltip" anchor="(r)" />
              )}
              {match.away_coin_toss && <CoinTossTooltip target="coinTossTooltip" anchor="(ct)" />}
              {match.away_withdrew && <WithdrewTooltip target="withdrewTooltip" anchor="(wdr)" />}
              {match.away_disqualified && <DisqualifiedTooltip target="disqualifiedTooltip" anchor="(dq)" notes={match.disqualified_notes} />}
              {match.away_replacement && <ReplacementTooltip target="replacementTooltip" notes={match.replacement_notes} />}
              {isSharedBronze(match) && <SharedBronzeTooltip target="sharedBronzeTooltip" notes={match.shared_bronze_text} />}
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
  const roundName =
    round.name && (config.tournamentTypeId === 'MOFT' || config.tournamentTypeId === 'WOFT')
      ? round.name
          .replace('Consolation First Round', 'Consol 1st')
          .replace('Consolation Semi-finals', 'Consol Semi')
          .replace('Third-place', 'Bronze medal')
          .replace('Final', 'Gold medal')
          .replace('Silver medal match', 'Silver medal')
          .replace('Playoff First Round', 'P/o 1st round')
          .replace('Playoff Second Round', 'P/o 2nd round')
      : round.name.replace('Preliminary Semi-finals', 'Prelim Semi').replace('Preliminary Final', 'Prelim Final')

  const roundNameBlock = (
    <React.Fragment>
      {roundName}
      {(roundName === 'Consol 1st' || roundName === 'Consol Semi' || roundName === 'P/o 1st round') && round.consolation_notes && (
        <ConsolationTooltip target="consolationTooltip" notes={round.consolation_notes} />
      )}
      {roundName === 'P/o 2nd round' && <PlayoffSecondRoundTooltip target="playoffSecondRoundTooltip" />}
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
            {(roundName === 'Consol Semi' || roundName === 'P/o 1st round') && round.consolation_notes && (
              <ConsolationTooltip target="consolationTooltip" notes={round.consolation_notes} />
            )}
            {roundName === 'P/o 2nd round' && <PlayoffSecondRoundTooltip target="playoffSecondRoundTooltip" />}
          </div>
        </Col>
      </Row>
      {!config.two_legged &&
        round.matches &&
        round.matches.map((m, index) => <BracketBox match={m} colIndex={colIndex} lastBox={index === round.matches.length - 1} config={config} key={index} />)}
      {config.two_legged &&
        round.pairs &&
        round.pairs.map((p, index) => <BracketPairBox pair={p} colIndex={colIndex} lastBox={index === round.pairs.length - 1} config={config} key={index} />)}
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
  const { round, thirdPlace, silverMedal, config } = props
  return (
    <Col className="col-brk-22">
      {config.roundCount === 2 && !thirdPlace && <Row className="bracket-gap-height-10"></Row>}
      {config.roundCount === 3 && thirdPlace && <Row className="bracket-gap-height-10"></Row>}
      {((config.roundCount === 4 && thirdPlace) || (config.roundCount === 3 && !thirdPlace)) && <Row className="bracket-gap-height-20"></Row>}
      {(config.roundCount === 5 || (config.roundCount === 4 && !thirdPlace)) && <Row className="bracket-gap-height-30"></Row>}
      <BracketColInner round={round} config={config} />
      {thirdPlace && <BracketColInner round={thirdPlace} config={config} />}
      {silverMedal && <BracketColInner round={silverMedal} config={config} />}
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

const BracketPairs = (props) => {
  const { stage, config } = props
  // console.log('stage', stage)
  let silverMedal = stage.rounds ? stage.rounds.find((s) => s.name === 'Silver medal match') : {}
  const filteredRounds = stage.rounds ? stage.rounds.filter((r) => r.name !== 'Preliminary round' && r.name !== 'Silver medal match') : []
  let thirdPlace = filteredRounds.find((s) => s.name === 'Third-place')
  return (
    <Row className="no-gutters mb-5">
      {filteredRounds &&
        filteredRounds.map((_r, index) => {
          const r = hasReplay(_r) ? attachReplayMatches(_r) : _r
          if (r.pairs && r.pairs.length > 0) {
            const hookCount = r.pairs.length % 2 === 0 ? r.pairs.length / 2 : (r.pairs.length - 1) / 2
            if (r.name === 'Third-place') {
              thirdPlace = r
              return null
            } else if (r.name === 'Final') {
              return (
                <BracketFinalCol
                  round={r}
                  thirdPlace={thirdPlace}
                  silverMedal={silverMedal}
                  config={{ ...config, roundCount: filteredRounds.length, two_legged: false }}
                  key={r.name}
                />
              )
            } else {
              return (
                <React.Fragment key={r.name}>
                  <BracketCol round={r} colIndex={index} config={config} />
                  <BracketHook1 colIndex={index} hookCount={hookCount} />
                  <BracketHook2 colIndex={index} hookCount={hookCount} />
                </React.Fragment>
              )
            }
          } else if (r.matches) {
            r.matches.sort((a, b) => {
              if (a.bracket_order > b.bracket_order) {
                return 1
              } else if (a.bracket_order < b.bracket_order) {
                return -1
              } else {
                return 0
              }
            })
            const hookCount = r.matches.length % 2 === 0 ? r.matches.length / 2 : (r.matches.length - 1) / 2
            if (r.name === 'Third-place') {
              thirdPlace = r
              return null
            } else if (r.name === 'Final') {
              return (
                <BracketFinalCol
                  round={r}
                  thirdPlace={thirdPlace}
                  silverMedal={silverMedal}
                  config={{ ...config, roundCount: filteredRounds.length, two_legged: false }}
                  key={r.name}
                />
              )
            } else {
              return (
                <React.Fragment key={r.name}>
                  <BracketCol round={r} colIndex={index} config={{ ...config, two_legged: false }} />
                  <BracketHook1 colIndex={index} hookCount={hookCount} />
                  <BracketHook2 colIndex={index} hookCount={hookCount} />
                </React.Fragment>
              )
            }
          }
          return null
        })}
    </Row>
  )
}

const BracketMatches = (props) => {
  const { stage, config } = props
  // console.log('stage', stage)
  let silverMedal = stage.rounds ? stage.rounds.find((s) => s.name === 'Silver medal match') : {}
  const filteredRounds = stage.rounds ? stage.rounds.filter((r) => r.name !== 'Preliminary round' && r.name !== 'Silver medal match') : []
  let thirdPlace = filteredRounds.find((s) => s.name === 'Third-place')
  return (
    <Row className="no-gutters mb-5">
      {filteredRounds &&
        filteredRounds.map((_r, index) => {
          const r = hasReplay(_r) ? attachReplayMatches(_r) : _r
          if (r.matches) {
            const hookCount = r.matches.length % 2 === 0 ? r.matches.length / 2 : (r.matches.length - 1) / 2
            if (r.name === 'Third-place') {
              thirdPlace = r
              return null
            } else if (r.name === 'Final') {
              return (
                <BracketFinalCol
                  round={r}
                  thirdPlace={thirdPlace}
                  silverMedal={silverMedal}
                  config={{ ...config, roundCount: filteredRounds.length }}
                  key={r.name}
                />
              )
            } else {
              return (
                <React.Fragment key={r.name}>
                  <BracketCol round={r} colIndex={index} config={config} />
                  <BracketHook1 colIndex={index} hookCount={hookCount} />
                  <BracketHook2 colIndex={index} hookCount={hookCount} />
                </React.Fragment>
              )
            }
          }
          return null
        })}
    </Row>
  )
}

const Bracket = (props) => {
  const { stage, config } = props
  // console.log('config', config)
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
            {config.consolation_bracket && config.consolation_bracket_name && <React.Fragment>{config.consolation_bracket_name} Bracket&nbsp;</React.Fragment>}
            {status === 'Opening...' && <i className="bx bx-dots-vertical-rounded"></i>}
            {status === 'Opened' && <i className="bx bx-chevron-up-square"></i>}
            {status === 'Closing...' && <i className="bx bx-dots-vertical-rounded"></i>}
            {status === 'Closed' && <i className="bx bx-chevron-down-square"></i>}
          </Button>
        </Col>
      </Row>
      <Collapse isOpen={collapse} onEntering={onEntering} onEntered={onEntered} onExiting={onExiting} onExited={onExited}>
        {!config.two_legged && <BracketMatches stage={stage} config={config} />}
        {config.two_legged && <BracketPairs stage={stage} config={config} />}
      </Collapse>
    </React.Fragment>
  )
}

export default Bracket
