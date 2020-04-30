import React, { useState } from 'react'
import TeamArray from '../data/Team.json'
import NationArray from '../data/Nation.json'
import { Row, Col, Tooltip } from 'reactstrap'
import moment from 'moment'

export const getTournamentConfig = (tournament) => {
  return {
    id: tournament.id,
    name: tournament.name,
    color: tournament.color,
    start_date: tournament.start_date,
    end_date: tournament.end_date,
    golden_goal_rule: tournament.golden_goal_rule,
    head_to_head_tiebreaker: tournament.head_to_head_tiebreaker,
    logo_filename: tournament.logo_filename,
    third_place_ranking: tournament.third_place_ranking,
    points_for_win: tournament.points_for_win,
    mascot_filename: tournament.mascot_filename,
    active: tournament.active,
  }
}

export const getRoundRobinStage = (stages) => {
  const result = stages.filter((s) => s.type === 'roundrobin')
  return result
}

export const getKnockoutStage = (stages) => {
  const result = stages.filter((s) => s.type === 'knockout')
  return result
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

export const isWinner = (who, match) => {
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

export const getDateMatchArrayPair = (matches_array) => {
  let matches = [],
    dates = []
  matches_array.sort((a, b) => {
    if (a.date + a.time < b.date + b.time) {
      return -1
    } else if (a.date + a.time > b.date + a.time) {
      return 1
    } else {
      return 0
    }
  })
  matches_array.forEach((t) => {
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

export const DisplaySchedule = (props) => {
  const { round } = props
  const { name, dates, matches } = round
  // console.log('dates', dates)
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
              {moment(value).format('dddd, MMMM D')}
            </Col>
            {matches[value].map((m, index) => (
              <Col sm="12" className="padding-tb-md border-bottom-gray5" key={index}>
                <Row>
                  <Col sm="2" xs="1" className="font-10 margin-top-time-xs">
                    {m.time}
                    {m.group && (
                      <React.Fragment>
                        <br />
                        {m.group}
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
                  <Col sm="3" xs="3" className="team-name text-uppercase text-right team-name-no-padding-right">
                    {getTeamName(m.home_team)}
                  </Col>
                  <Col sm="1" xs="1" className="padding-top-sm text-center">
                    <img className="flag-sm flag-md" src={getFlagSrc(m.home_team)} alt={m.home_team} />
                  </Col>
                  <Col sm="2" xs="2" className="score text-center score-no-padding-right">
                    {(!m.home_extra_score || !m.away_extra_score) && (
                      <React.Fragment>
                        {m.home_score}-{m.away_score}
                      </React.Fragment>
                    )}
                    {m.home_extra_score && m.away_extra_score && (
                      <React.Fragment>
                        {parseInt(m.home_score) + parseInt(m.home_extra_score)}-{parseInt(m.away_score) + parseInt(m.away_extra_score)}
                        <AetTooltip target="aetTooltip3" anchor="(a.e.t.)" />
                        {m.home_penalty_score && m.away_penalty_score && (
                          <React.Fragment>
                            <br />
                            {m.home_penalty_score}-{m.away_penalty_score} <PenTooltip target="penTooltip3" anchor="(pen.)" />
                          </React.Fragment>
                        )}
                      </React.Fragment>
                    )}
                  </Col>
                  <Col sm="1" xs="1" className="padding-top-sm text-center flag-no-padding-left">
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

export const AetTooltip = (props) => {
  const { target, anchor } = props
  const content = 'after extra time'
  return (
    <TurtleTooltip target={target} placement="top" content={content}>
      &nbsp;
      <span className="box-tip-text" href="#" id={target}>
        {anchor}
      </span>
    </TurtleTooltip>
  )
}

export const PenTooltip = (props) => {
  const { target, anchor } = props
  const content = 'penalty shoot-out'
  return (
    <TurtleTooltip target={target} placement="top" content={content}>
      &nbsp;
      <span className="box-tip-text" href="#" id={target}>
        {anchor}
      </span>
    </TurtleTooltip>
  )
}

export const FairPlayTooltip = (props) => {
  const { target, points } = props
  const content = `fair play points: ${points}`
  return (
    <TurtleTooltip target={target} placement="top" content={content}>
      &nbsp;
      <span className="box-tip-text" href="#" id={target}>
        [*]
      </span>
    </TurtleTooltip>
  )
}

const TurtleTooltip = (props) => {
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
