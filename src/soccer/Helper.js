import React, { useState } from 'react'
import TeamArray from '../data/Team.json'
import NationArray from '../data/Nation.json'
import { Row, Col, Tooltip } from 'reactstrap'
import moment from 'moment'

const getFlagSrc = (id) => {
  const team = TeamArray.filter((t) => t.id === id)
  if (team.length === 1) {
    const nation = NationArray.filter((n) => n.id === team[0].nation_id)
    if (nation.length === 1) {
      return '/assets/images/flags/' + nation[0].flag_filename
    } else {
      console.log('Nation error', nation)
    }
  } else {
    console.log('Team error', team)
  }
}

const getTeamName = (id) => {
  const team = TeamArray.filter((t) => t.id === id)
  if (team.length === 1) {
    return team[0].name
  } else {
    console.log('Team error', team)
  }
}

const isWinner = (who, match) => {
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

export const BracketBox = (props) => {
  const { match, colIndex, lastBox } = props
  return (
    <React.Fragment>
      <Row className="no-gutters box-sm bracket-box-height">
        <Col sm="12" className="bracket-box-header-height border-bottom-gray5">
          <Row className="no-gutters">
            <Col xs={{ size: 11, offset: 1 }}>
              <span className="box-time d-block d-lg-none">{moment(match.date).format('MMMM D')}</span>
              <span className="box-time d-none d-lg-block">
                {moment(match.date).format('MMMM D')} | {match.stadium}
              </span>
            </Col>
          </Row>
        </Col>
        <Col sm="12" className="bracket-half-box-height border-bottom-gray5">
          <Row className="no-gutters h3-ff3">
            <Col xs={{ size: 2, offset: 1 }} className="d-none d-lg-block">
              <img className="flag-sm-2" src={getFlagSrc(match.home_team)} alt={match.home_team} />
            </Col>
            <Col xs={{ size: 2, offset: 1 }} className="d-none d-md-block d-lg-none">
              <img className="flag-xs-2" src={getFlagSrc(match.home_team)} alt={match.home_team} />
            </Col>
            <Col xs={{ size: 2, offset: 1 }} className="d-none d-sm-block d-md-none">
              <img className="flag-xxs" src={getFlagSrc(match.home_team)} alt={match.home_team} />
            </Col>
            <Col xs={{ size: 6 }} className={`box-team-name ${isWinner('H', match) ? '' : 'box-team-name-light'} d-none d-lg-block`}>
              {getTeamName(match.home_team)}
              {match.home_extra_score && match.away_extra_score && match.home_extra_score > match.away_extra_score && (
                <AetTooltip target="aetTooltip1" anchor="(a.e.t.)" />
              )}
              {match.home_extra_score &&
                match.away_extra_score &&
                match.home_extra_score === match.away_extra_score &&
                match.home_penalty_score > match.away_penalty_score && <PenTooltip target="penTooltip1" anchor="(pen.)" />}
            </Col>
            <Col xs={{ size: 6 }} className={`box-team-name ${isWinner('H', match) ? '' : 'box-team-name-light'} d-none d-md-block d-lg-none`}>
              {match.home_team}
              {match.home_extra_score && match.away_extra_score && match.home_extra_score > match.away_extra_score && (
                <AetTooltip target="aetTooltip1" anchor="(a.e.t.)" />
              )}
              {match.home_extra_score &&
                match.away_extra_score &&
                match.home_extra_score === match.away_extra_score &&
                match.home_penalty_score > match.away_penalty_score && <PenTooltip target="penTooltip1" anchor="(pen.)" />}
            </Col>
            <Col xs={{ size: 6 }} className={`box-team-name ${isWinner('H', match) ? '' : 'box-team-name-light'} d-none d-sm-block d-md-none`}>
              {match.home_team}
              {match.home_extra_score && match.away_extra_score && match.home_extra_score > match.away_extra_score && (
                <AetTooltip target="aetTooltip1" anchor="(e)" />
              )}
              {match.home_extra_score &&
                match.away_extra_score &&
                match.home_extra_score === match.away_extra_score &&
                match.home_penalty_score > match.away_penalty_score && <PenTooltip target="penTooltip1" anchor="(p)" />}
            </Col>
            <Col xs={{ size: 8, offset: 1 }} className={`box-team-name ${isWinner('H', match) ? '' : 'box-team-name-light'} d-block d-xs-block d-sm-none`}>
              <img className="flag-xxs" src={getFlagSrc(match.home_team)} alt={match.home_team} />
              &nbsp;
              {match.home_team}
              {match.home_extra_score && match.away_extra_score && match.home_extra_score > match.away_extra_score && (
                <AetTooltip target="aetTooltip1" anchor="(e)" />
              )}
              {match.home_extra_score &&
                match.away_extra_score &&
                match.home_extra_score === match.away_extra_score &&
                match.home_penalty_score > match.away_penalty_score && <PenTooltip target="penTooltip1" anchor="(p)" />}
            </Col>
            {!match.home_extra_score && (
              <Col xs={{ size: 3 }} className={`box-score ${isWinner('H', match) ? '' : 'box-score-light'}`}>
                {match.home_score}
              </Col>
            )}
            {match.home_extra_score && (
              <Col xs={{ size: 3 }} className={`box-score ${isWinner('H', match) ? '' : 'box-score-light'}`}>
                {parseInt(match.home_score) + parseInt(match.home_extra_score)}
                {match.home_penalty_score && <React.Fragment>&nbsp;({match.home_penalty_score})</React.Fragment>}
              </Col>
            )}
          </Row>
        </Col>
        <Col sm="12" className="bracket-half-box-height">
          <Row className="no-gutters h4-ff3">
            <Col xs={{ size: 2, offset: 1 }} className="d-none d-lg-block">
              <img className="flag-sm-2" src={getFlagSrc(match.away_team)} alt={match.away_team} />
            </Col>
            <Col xs={{ size: 2, offset: 1 }} className="d-none d-md-block d-lg-none">
              <img className="flag-xs-2" src={getFlagSrc(match.away_team)} alt={match.away_team} />
            </Col>
            <Col xs={{ size: 2, offset: 1 }} className="d-none d-sm-block d-md-none">
              <img className="flag-xxs" src={getFlagSrc(match.away_team)} alt={match.away_team} />
            </Col>
            <Col xs={{ size: 6 }} className={`box-team-name ${isWinner('A', match) ? '' : 'box-team-name-light'} d-none d-lg-block`}>
              {getTeamName(match.away_team)}
              {match.home_extra_score && match.away_extra_score && match.home_extra_score < match.away_extra_score && (
                <AetTooltip target="aetTooltip2" anchor="(a.e.t.)" />
              )}
              {match.home_extra_score &&
                match.away_extra_score &&
                match.home_extra_score === match.away_extra_score &&
                match.home_penalty_score < match.away_penalty_score && <PenTooltip target="penTooltip2" anchor="(pen.)" />}
            </Col>
            <Col xs={{ size: 6 }} className={`box-team-name ${isWinner('A', match) ? '' : 'box-team-name-light'} d-none d-md-block d-lg-none`}>
              {match.away_team}
              {match.home_extra_score && match.away_extra_score && match.home_extra_score < match.away_extra_score && (
                <AetTooltip target="aetTooltip2" anchor="(a.e.t.)" />
              )}
              {match.home_extra_score &&
                match.away_extra_score &&
                match.home_extra_score === match.away_extra_score &&
                match.home_penalty_score < match.away_penalty_score && <PenTooltip target="penTooltip2" anchor="(pen.)" />}
            </Col>
            <Col xs={{ size: 6 }} className={`box-team-name ${isWinner('A', match) ? '' : 'box-team-name-light'} d-none d-sm-block d-md-none`}>
              {match.away_team}
              {match.home_extra_score && match.away_extra_score && match.home_extra_score < match.away_extra_score && (
                <AetTooltip target="aetTooltip2" anchor="(e)" />
              )}
              {match.home_extra_score &&
                match.away_extra_score &&
                match.home_extra_score === match.away_extra_score &&
                match.home_penalty_score < match.away_penalty_score && <PenTooltip target="penTooltip2" anchor="(p)" />}
            </Col>
            <Col xs={{ size: 8, offset: 1 }} className={`box-team-name ${isWinner('A', match) ? '' : 'box-team-name-light'} d-block d-xs-block d-sm-none`}>
              <img className="flag-xxs" src={getFlagSrc(match.away_team)} alt={match.away_team} />
              &nbsp;
              {match.away_team}
              {match.home_extra_score && match.away_extra_score && match.home_extra_score < match.away_extra_score && (
                <AetTooltip target="aetTooltip1" anchor="(e)" />
              )}
              {match.home_extra_score &&
                match.away_extra_score &&
                match.home_extra_score === match.away_extra_score &&
                match.home_penalty_score < match.away_penalty_score && <PenTooltip target="penTooltip1" anchor="(p)" />}
            </Col>
            {!match.away_extra_score && (
              <Col xs={{ size: 3 }} className={`box-score ${isWinner('A', match) ? '' : 'box-score-light'}`}>
                {match.away_score}
              </Col>
            )}
            {match.away_extra_score && (
              <Col xs={{ size: 3 }} className={`box-score ${isWinner('A', match) ? '' : 'box-score-light'}`}>
                {parseInt(match.away_score) + parseInt(match.away_extra_score)}
                {match.away_penalty_score && <React.Fragment>&nbsp;({match.away_penalty_score})</React.Fragment>}
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
                        <span className="font-20"> (a.e.t.)</span>
                        {m.home_penalty_score && m.away_penalty_score && (
                          <React.Fragment>
                            <br />
                            {m.home_penalty_score}-{m.away_penalty_score} <span className="font-20">(pen.)</span>
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

const AetTooltip = (props) => {
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

const PenTooltip = (props) => {
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
