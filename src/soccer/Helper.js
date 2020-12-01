import React, { useState } from 'react'
import TeamArray from '../data/soccer/Team.json'
import NationArray from '../data/Nation.json'
import TournamentArray from '../data/soccer/Tournament.json'
import TournamentWCArray from '../data/soccer/TournamentWC.json'
import TournamentDataWCArray from '../data/soccer/TournamentDataWC.json'
import QualificationTournamentWCArray from '../data/soccer/QualificationTournamentWC.json'
import QualificationTournamentDataWCArray from '../data/soccer/QualificationTournamentDataWC.json'
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

export const getTournamentArray = () => {
  return TournamentArray.concat(TournamentWCArray)
}

export const getTournamentDataArray = () => {
  return TournamentDataWCArray
}

export const getQualificationTournamentArray = () => {
  return QualificationTournamentWCArray
}

export const getQualificationTournamentDataArray = () => {
  return QualificationTournamentDataWCArray
}

export const getRoundRobinStage = (stages) => {
  return stages ? stages.filter((s) => s.type === 'roundrobin') : null
}

export const getKnockoutStage = (stages) => {
  return stages ? stages.filter((s) => s.type === 'knockout') : null
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
  round.matches &&
    round.matches.forEach((m) => {
      tmp.push(m)
    })
  return getDateMatchArrayPair(tmp, sorted)
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
      if (matches[t.date]) {
        matches[t.date].push(t)
      } else {
        dates.push(t.date)
        matches[t.date] = []
        matches[t.date].push(t)
      }
    })
  }
  return { dates, matches }
}

export const DisplaySchedule = (props) => {
  const { round, showMatchYear } = props
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
                  <Col
                    sm="3"
                    xs="3"
                    className={`team-name text-uppercase text-right team-name-no-padding-right${
                      m.home_aggregate_score < m.away_aggregate_score ? ' gray3' : ''
                    }`}
                  >
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
                        <AetTooltip target="aetTooltip3" anchor="(a.e.t.)" />
                        {m.home_penalty_score && m.away_penalty_score && (
                          <React.Fragment>
                            <br />
                            {m.home_penalty_score}-{m.away_penalty_score}
                            <PenTooltip target="penTooltip3" anchor="(pen.)" />
                          </React.Fragment>
                        )}
                      </React.Fragment>
                    )}
                    {m.notes && m.notes.awarded && <AwardedTooltip target={`awarded_${m.home_team}_${m.away_team}`} content={m.notes.text} />}
                    {m.home_aggregate_score != null && m.away_aggregate_score != null && (
                      <React.Fragment>
                        <br />
                        Agg: {m.home_aggregate_score}-{m.away_aggregate_score}
                      </React.Fragment>
                    )}
                  </Col>
                  <Col sm="1" xs="1" className="padding-top-sm text-center flag-no-padding-left">
                    {m.away_team && <img className="flag-sm flag-md" src={getFlagSrc(m.away_team)} alt={m.away_team} />}
                  </Col>
                  <Col sm="3" xs="3" className={`team-name text-uppercase${m.home_aggregate_score > m.away_aggregate_score ? ' gray3' : ''}`}>
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
  return <TopTooltip target={target} content={content} anchor={anchor} />
}

export const PenTooltip = (props) => {
  const { target, anchor } = props
  const content = 'penalty shoot-out'
  return <TopTooltip target={target} content={content} anchor={anchor} />
}

export const FairPlayTooltip = (props) => {
  const { target, points } = props
  const content = `fair play points: ${points}`
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
      &nbsp;
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
