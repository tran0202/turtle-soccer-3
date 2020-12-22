import React, { useState } from 'react'
import TeamArray from '../data/soccer/Team.json'
import NationArray from '../data/Nation.json'
import { Row, Col, Tooltip } from 'reactstrap'
import moment from 'moment'

export const getTournamentConfig = (tournament) => {
  return {
    id: tournament.id,
    name: tournament.name,
    golden_goal_rule: tournament.golden_goal_rule,
    head_to_head_tiebreaker: tournament.head_to_head_tiebreaker,
    tiebreakers: tournament.tiebreakers,
    third_place_ranking: tournament.third_place_ranking,
    points_for_win: tournament.points_for_win,
    active: tournament.active,
    hero_images: tournament.hero_images,
    details: tournament.details,
    final_standings: tournament.final_standings,
    statistics: tournament.statistics,
    awards: tournament.awards,
  }
}

export const getRoundRobinStages = (stages) => {
  return stages ? stages.filter((s) => s.type === 'roundrobin') : null
}

export const getRoundRobinMdStages = (stages) => {
  return stages ? stages.filter((s) => s.type === 'roundrobinmatchday') : null
}

export const getAllRoundRobinStages = (stages) => {
  return stages ? stages.filter((s) => s.type === 'roundrobin' || s.type === 'roundrobinmatchday') : null
}

export const getKnockoutStages = (stages) => {
  return stages ? stages.filter((s) => s.type === 'knockout') : null
}

export const getDefaultStageTab = (stages) => {
  if (!stages || stages.length === 0) return 'Group-Stage'
  const defaultStageIndex = stages.findIndex((s) => s.default)
  const defaultStageName = defaultStageIndex > -1 ? stages[defaultStageIndex].name : stages[0].name
  return defaultStageName ? defaultStageName.replace(' ', '-') : ''
}

export const getFlagSrc = (id) => {
  const team = TeamArray.find((t) => t.id === id)
  if (team) {
    const nation = NationArray.find((n) => n.id === team.nation_id)
    if (nation) {
      return '/assets/images/flags/' + nation.flag_filename
    } else {
      console.log('Nation error', nation)
    }
  } else {
    console.log('Team error', team)
  }
}

export const getTeamName = (id) => {
  const team = TeamArray.find((t) => t.id === id)
  if (team) {
    return team.name
  } else {
    console.log('Team error', team)
  }
}

export const getShortTeamName = (id) => {
  const team = TeamArray.find((t) => t.id === id)
  if (team) {
    if (team.short_name) {
      return team.short_name
    } else {
      return team.name
    }
  } else {
    console.log('Team error', team)
  }
}

export const getBracketTeamName = (id) => {
  return getShortTeamName(id)
}

export const getParentTeam = (id) => {
  const team = TeamArray.find((t) => t.id === id)
  return TeamArray.find((t) => t.id === team.parent_team_id)
}

export const getBracketTeamCode = (id) => {
  const nation = NationArray.find((n) => n.id === id)
  if (!nation) {
    console.log('Nation error', nation)
  } else if (!nation.code) {
    return id
  } else {
    return nation.code
  }
}

export const isWinner = (who, match) => {
  if (match) {
    if (who === 'H') {
      return (
        match.home_score > match.away_score ||
        (match.home_score === match.away_score && match.home_extra_score > match.away_extra_score) ||
        (match.home_score === match.away_score && match.home_extra_score === match.away_extra_score && match.home_penalty_score > match.away_penalty_score)
      )
    } else {
      return (
        match.home_score < match.away_score ||
        (match.home_score === match.away_score && match.home_extra_score < match.away_extra_score) ||
        (match.home_score === match.away_score && match.home_extra_score === match.away_extra_score && match.home_penalty_score < match.away_penalty_score)
      )
    }
  }
}

export const getMatchArrayByDate = (round, sorted) => {
  let tmp = []
  let tmpPlayoff = []
  round &&
    round.matches &&
    round.matches.forEach((m) => {
      if (!m.group_playoff) {
        tmp.push(m)
      } else {
        tmpPlayoff.push(m)
      }
    })
  const tmp2 = [getDateMatchArrayPair(tmp, sorted), { ...getDateMatchArrayPair(tmpPlayoff, sorted), name: 'Playoff' }]
  return tmpPlayoff.length === 0 ? getDateMatchArrayPair(tmp, sorted) : tmp2
}

export const getDateMatchArrayPair = (matches_array, sorted) => {
  let matches = [],
    dates = []
  if (matches_array) {
    if (sorted) {
      matches_array.sort((a, b) => {
        if (a.date + a.time < b.date + b.time) {
          return -1
        } else if (a.date + a.time > b.date + a.time) {
          return 1
        } else {
          return 0
        }
      })
    }
    matches_array.forEach((t) => {
      if (!matches[t.date]) {
        dates.push(t.date)
        matches[t.date] = []
      }
      matches[t.date].push(t)
    })
  }
  return { dates, matches }
}

export const isHomeLoseAggregate = (data) => {
  const {
    knockoutMatch,
    secondLegMatch,
    aggregate_team,
    away_team,
    home_score,
    away_score,
    home_extra_score,
    away_extra_score,
    home_penalty_score,
    away_penalty_score,
    home_aggregate_score,
    away_aggregate_score,
  } = data
  if (!knockoutMatch) return false
  if (!secondLegMatch) {
    return (
      (home_score != null && away_score != null && home_score < away_score) ||
      (home_extra_score != null && away_extra_score != null && home_extra_score < away_extra_score) ||
      (home_penalty_score != null && home_penalty_score != null && home_penalty_score < away_penalty_score)
    )
  }
  return (
    (home_penalty_score != null && home_penalty_score != null && home_penalty_score < away_penalty_score) ||
    home_aggregate_score < away_aggregate_score ||
    aggregate_team === away_team
  )
}

export const isAwayLoseAggregate = (data) => {
  const {
    knockoutMatch,
    secondLegMatch,
    aggregate_team,
    home_team,
    home_score,
    away_score,
    home_extra_score,
    away_extra_score,
    home_penalty_score,
    away_penalty_score,
    home_aggregate_score,
    away_aggregate_score,
  } = data
  if (!knockoutMatch) return false
  if (!secondLegMatch) {
    return (
      (home_score != null && away_score != null && home_score > away_score) ||
      (home_extra_score != null && away_extra_score != null && home_extra_score > away_extra_score) ||
      (home_penalty_score != null && home_penalty_score != null && home_penalty_score > away_penalty_score)
    )
  }
  return (
    (home_penalty_score != null && home_penalty_score != null && home_penalty_score > away_penalty_score) ||
    home_aggregate_score > away_aggregate_score ||
    aggregate_team === home_team
  )
}

const DisplayAwayGoalsText = (props) => {
  const { param } = props
  const { aggregate_team, home_extra_score, away_extra_score } = param
  return (
    <React.Fragment>
      {aggregate_team && (
        <React.Fragment>
          &gt;&gt;&gt; <b>{getTeamName(aggregate_team)}</b> won on away goals
          {home_extra_score != null && away_extra_score != null && <React.Fragment>&nbsp;after extra time</React.Fragment>}
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

const DisplayExtraTimeText = (props) => {
  const { param } = props
  const { home_team, away_team, home_extra_score, away_extra_score, home_penalty_score, away_penalty_score, group_playoff, goldenGoal } = param
  return (
    <React.Fragment>
      {home_extra_score != null && away_extra_score != null && (
        <React.Fragment>
          {home_penalty_score == null && away_penalty_score == null && !group_playoff && (
            <React.Fragment>
              {home_extra_score !== away_extra_score && <React.Fragment>&nbsp;&gt;&gt;&gt;&nbsp;</React.Fragment>}
              {home_extra_score > away_extra_score && (
                <React.Fragment>
                  <b>{getTeamName(home_team)}</b>
                </React.Fragment>
              )}
              {home_extra_score < away_extra_score && (
                <React.Fragment>
                  <b>{getTeamName(away_team)}</b>
                </React.Fragment>
              )}
              {home_extra_score !== away_extra_score && (
                <React.Fragment>
                  {goldenGoal && home_penalty_score == null && away_penalty_score == null ? (
                    <React.Fragment>&nbsp;won on golden goal</React.Fragment>
                  ) : (
                    <React.Fragment>&nbsp;won after extra time</React.Fragment>
                  )}
                </React.Fragment>
              )}
            </React.Fragment>
          )}
          {home_penalty_score != null && away_penalty_score != null && (
            <React.Fragment>
              &nbsp;&gt;&gt;&gt;&nbsp;
              {home_penalty_score > away_penalty_score && (
                <React.Fragment>
                  <b>{getTeamName(home_team)}</b>
                </React.Fragment>
              )}
              {home_penalty_score < away_penalty_score && (
                <React.Fragment>
                  <b>{getTeamName(away_team)}</b>
                </React.Fragment>
              )}
              &nbsp;won on penalties&nbsp;
              <b>
                {home_penalty_score}-{away_penalty_score}
              </b>
            </React.Fragment>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export const DisplayKnockout2LeggedMatch = (props) => {
  const { m } = props
  const homeLoseData = {
    knockoutMatch: true,
    secondLegMatch: true,
    aggregate_team: m.aggregate_team_1st_leg,
    away_team: m.away_team,
    home_score: null,
    away_score: null,
    home_extra_score: null,
    away_extra_score: null,
    home_penalty_score: m.home_penalty_score_2nd_leg,
    away_penalty_score: m.away_penalty_score_2nd_leg,
    home_aggregate_score: m.home_aggregate_score_1st_leg,
    away_aggregate_score: m.away_aggregate_score_1st_leg,
  }
  const awayLoseData = {
    knockoutMatch: true,
    secondLegMatch: true,
    aggregate_team: m.aggregate_team_1st_leg,
    home_team: m.home_team,
    home_score: null,
    away_score: null,
    home_extra_score: null,
    away_extra_score: null,
    home_penalty_score: m.home_penalty_score_2nd_leg,
    away_penalty_score: m.away_penalty_score_2nd_leg,
    home_aggregate_score: m.home_aggregate_score_1st_leg,
    away_aggregate_score: m.away_aggregate_score_1st_leg,
  }
  return (
    <React.Fragment>
      <Row className="padding-top-md">
        <Col className={`team-name text-uppercase text-right team-name-no-padding-right col-box-25${isHomeLoseAggregate(homeLoseData) ? ' gray3' : ''}`}>
          {getTeamName(m.home_team)}
        </Col>
        <Col className="padding-top-sm text-center col-box-10">
          {m.home_team && <img className="flag-sm flag-md" src={getFlagSrc(m.home_team)} alt={m.home_team} />}
        </Col>
        <Col className="score text-center score-no-padding-right col-box-10">
          {m.home_score != null && m.away_score != null && (
            <React.Fragment>
              {m.home_score}-{m.away_score}
              {m.notes_1st_leg && m.notes_1st_leg.awarded && <AwardedTooltip target={`awarded_${m.home_team}_${m.away_team}`} content={m.notes_1st_leg.text} />}
            </React.Fragment>
          )}
        </Col>
        <Col className="score text-center score-no-padding-right col-box-10">
          {m.home_extra_score_2nd_leg == null && m.away_extra_score_2nd_leg == null && (
            <React.Fragment>
              {m.home_score_2nd_leg}-{m.away_score_2nd_leg}
            </React.Fragment>
          )}
          {m.home_extra_score_2nd_leg != null && m.away_extra_score_2nd_leg != null && (
            <React.Fragment>
              {parseInt(m.home_score_2nd_leg) + parseInt(m.home_extra_score_2nd_leg)}-{parseInt(m.away_score_2nd_leg) + parseInt(m.away_extra_score_2nd_leg)}
              <AetTooltip target="aetTooltip3" anchor="(a.e.t.)" />
            </React.Fragment>
          )}
          {m.notes_2nd_leg && m.notes_2nd_leg.awarded && <AwardedTooltip target={`awarded_${m.away_team}_${m.home_team}`} content={m.notes_2nd_leg.text} />}
        </Col>
        <Col className="score text-center score-no-padding-right col-box-10">
          {m.home_aggregate_score_1st_leg != null && m.away_aggregate_score_1st_leg != null && (
            <React.Fragment>
              {m.home_aggregate_score_1st_leg}-{m.away_aggregate_score_1st_leg}
            </React.Fragment>
          )}
        </Col>
        <Col className="padding-top-sm text-center flag-no-padding-left col-box-10">
          {m.away_team && <img className="flag-sm flag-md" src={getFlagSrc(m.away_team)} alt={m.away_team} />}
        </Col>
        <Col className={`team-name text-uppercase col-box-25${isAwayLoseAggregate(awayLoseData) ? ' gray3' : ''}`}>{getTeamName(m.away_team)}</Col>
      </Row>
      <Row>
        <Col sm={{ size: 6, offset: 6 }} xs={{ size: 6, offset: 6 }} className="aggregate_text margin-top-sm">
          {m.home_aggregate_score_1st_leg != null && m.away_aggregate_score_1st_leg != null && (
            <DisplayAwayGoalsText
              param={{ aggregate_team: m.aggregate_team_1st_leg, home_extra_score: m.home_extra_score_2nd_leg, away_extra_score: m.away_extra_score_2nd_leg }}
            />
          )}
          <DisplayExtraTimeText
            param={{
              home_team: m.home_team,
              away_team: m.away_team,
              home_extra_score: m.home_extra_score_2nd_leg,
              away_extra_score: m.away_extra_score_2nd_leg,
              home_penalty_score: m.home_penalty_score_2nd_leg,
              away_penalty_score: m.away_penalty_score_2nd_leg,
            }}
          />
        </Col>
      </Row>
      <Row className="padding-tb-md border-bottom-gray5"></Row>
    </React.Fragment>
  )
}

const DisplayMatch = (props) => {
  const { m, config } = props
  const homeLoseData = {
    knockoutMatch: config.knockoutMatch,
    secondLegMatch: config.secondLegMatch,
    aggregate_team: m.aggregate_team_2nd_leg,
    away_team: m.away_team,
    home_score: m.home_score,
    away_score: m.away_score,
    home_extra_score: m.home_extra_score,
    away_extra_score: m.away_extra_score,
    home_penalty_score: m.home_penalty_score,
    away_penalty_score: m.away_penalty_score,
    home_aggregate_score: m.home_aggregate_score_2nd_leg,
    away_aggregate_score: m.away_aggregate_score_2nd_leg,
  }
  const awayLoseData = {
    knockoutMatch: config.knockoutMatch,
    secondLegMatch: config.secondLegMatch,
    aggregate_team: m.aggregate_team_2nd_leg,
    home_team: m.home_team,
    home_score: m.home_score,
    away_score: m.away_score,
    home_extra_score: m.home_extra_score,
    away_extra_score: m.away_extra_score,
    home_penalty_score: m.home_penalty_score,
    away_penalty_score: m.away_penalty_score,
    home_aggregate_score: m.home_aggregate_score_2nd_leg,
    away_aggregate_score: m.away_aggregate_score_2nd_leg,
  }
  return (
    <Col sm="12" className="padding-tb-md border-bottom-gray5">
      <Row>
        <Col sm="2" xs="1" className="font-10 margin-top-time-xs">
          {m.time}
          {m.group && (
            <React.Fragment>
              <br />
              {m.group} {m.group_playoff ? 'Playoff' : ''}
            </React.Fragment>
          )}
          <span className="no-display-xs">
            <br />
            {m.stadium}
          </span>
          <span className="no-display-xs">
            <br />
            {m.city}
          </span>
        </Col>
        <Col sm="3" xs="3" className={`team-name text-uppercase text-right team-name-no-padding-right${isHomeLoseAggregate(homeLoseData) ? ' gray3' : ''}`}>
          {getTeamName(m.home_team)}
        </Col>
        <Col sm="1" xs="1" className="padding-top-sm text-center">
          {m.home_team && <img className="flag-sm flag-md" src={getFlagSrc(m.home_team)} alt={m.home_team} />}
        </Col>
        <Col sm="2" xs="2" className="score text-center score-no-padding-right">
          {(m.home_extra_score == null || m.away_extra_score == null) && (
            <React.Fragment>
              {m.home_score}-{m.away_score}
            </React.Fragment>
          )}
          {m.home_extra_score != null && m.away_extra_score != null && (
            <React.Fragment>
              {parseInt(m.home_score) + parseInt(m.home_extra_score)}-{parseInt(m.away_score) + parseInt(m.away_extra_score)}
              {config.goldenGoal && m.home_penalty_score == null && m.away_penalty_score == null ? (
                <GoldenGoalTooltip target="goldengoalTooltip" anchor="(g.g.)" />
              ) : (
                <AetTooltip target="aetTooltip" anchor="(a.e.t.)" />
              )}
            </React.Fragment>
          )}
          {m.notes && m.notes.awarded && <AwardedTooltip target={`awarded_${m.home_team}_${m.away_team}`} content={m.notes.text} />}
        </Col>
        <Col sm="1" xs="1" className="padding-top-sm text-center flag-no-padding-left">
          {m.away_team && <img className="flag-sm flag-md" src={getFlagSrc(m.away_team)} alt={m.away_team} />}
        </Col>
        <Col sm="3" xs="3" className={`team-name text-uppercase${isAwayLoseAggregate(awayLoseData) ? ' gray3' : ''}`}>
          {getTeamName(m.away_team)}
        </Col>
      </Row>
      <Row>
        <Col sm={{ size: 6, offset: 6 }} xs={{ size: 7, offset: 5 }} className="aggregate_text margin-top-sm">
          {m.home_aggregate_score_2nd_leg != null && m.away_aggregate_score_2nd_leg != null && (
            <React.Fragment>
              Aggregate:&nbsp;
              <b>
                {m.home_aggregate_score_2nd_leg}-{m.away_aggregate_score_2nd_leg}
              </b>
              <DisplayAwayGoalsText
                param={{ aggregate_team: m.aggregate_team_2nd_leg, home_extra_score: m.home_extra_score, away_extra_score: m.away_extra_score }}
              />
            </React.Fragment>
          )}
          <DisplayExtraTimeText
            param={{
              home_team: m.home_team,
              away_team: m.away_team,
              home_extra_score: m.home_extra_score,
              away_extra_score: m.away_extra_score,
              home_penalty_score: m.home_penalty_score,
              away_penalty_score: m.away_penalty_score,
              group_playoff: m.group_playoff,
              goldenGoal: config.goldenGoal,
            }}
          />
        </Col>
      </Row>
    </Col>
  )
}

export const DisplaySchedule = (props) => {
  const { round, config } = props
  const { showMatchYear } = config
  const { name, dates, matches } = round
  return (
    <React.Fragment>
      <Row>
        <Col>
          <div className="h2-ff1 margin-top-md">{name}</div>
        </Col>
      </Row>
      {dates &&
        dates.map((value) => (
          <Row key={value}>
            <Col sm="12" className="h4-ff3 border-bottom-gray2 margin-top-md">
              {showMatchYear ? moment(value).format('dddd, MMMM D, YYYY') : moment(value).format('dddd, MMMM D')}
            </Col>
            {matches[value].map((m, index) => (
              <DisplayMatch m={m} config={config} key={index} />
            ))}
          </Row>
        ))}
    </React.Fragment>
  )
}

export const AetTooltip = (props) => {
  const { target, anchor } = props
  const content = 'After extra time'
  return <TopTooltip target={target} content={content} anchor={anchor} />
}

export const GoldenGoalTooltip = (props) => {
  const { target, anchor } = props
  const content = 'Golden goal'
  return <TopTooltip target={target} content={content} anchor={anchor} />
}

export const PenTooltip = (props) => {
  const { target, anchor } = props
  const content = 'Penalty shoot-out'
  return <TopTooltip target={target} content={content} anchor={anchor} />
}

export const FairPlayTooltip = (props) => {
  const { target, points } = props
  const content = `Fair play points: ${points}`
  return <TopTooltip target={target} content={content} />
}

export const Head2HeadTooltip = (props) => {
  const { target, h2h_notes, group_playoff } = props
  const content = group_playoff ? `Playoff: ${h2h_notes}` : `Head-to-head: ${h2h_notes}`
  return <TopTooltip target={target} content={content} />
}

export const DrawLotTooltip = (props) => {
  const { target, draw_lot_notes } = props
  const content = `Drawing lots: ${draw_lot_notes}`
  return <TopTooltip target={target} content={content} />
}

export const AwardedTooltip = (props) => {
  const { target, content } = props
  return <TopTooltip target={target} content={content} anchor="[awd.]" />
}

export const WildCardTooltip = (props) => {
  const { target, content } = props
  return <TopTooltip target={target} content={content} />
}

export const TopTooltip = (props) => {
  const { target, content, anchor } = props
  return (
    <TurtleTooltip target={target} placement="top" content={content}>
      <span className="box-tip-text" href="#" id={target}>
        {anchor ? anchor : '[*]'}
      </span>
    </TurtleTooltip>
  )
}

export const TurtleTooltip = (props) => {
  const { target, placement, content } = props
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const toggle = () => setTooltipOpen(!tooltipOpen)

  return (
    <React.Fragment>
      {props.children}
      <Tooltip target={target} placement={placement} isOpen={tooltipOpen} autohide={false} toggle={toggle}>
        {content}
      </Tooltip>
    </React.Fragment>
  )
}
