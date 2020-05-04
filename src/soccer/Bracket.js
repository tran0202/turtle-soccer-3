import React, { useState } from 'react'
import { getFlagSrc, isWinner, getTeamName, AetTooltip, PenTooltip } from './Helper'
import { Row, Col, Collapse, Button } from 'reactstrap'
import moment from 'moment'

const BracketBox = (props) => {
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

const BracketColInner = (props) => {
  const { round, colIndex } = props

  return (
    <React.Fragment>
      {colIndex === 0 && <Row className="bracket-gap-height-00"></Row>}
      {colIndex === 1 && <Row className="bracket-gap-height-10"></Row>}
      {colIndex === 2 && <Row className="bracket-gap-height-20"></Row>}
      <Row className="no-gutters bracket-col-height">
        <Col xs={{ size: 11, offset: 1 }}>
          <div className="h2-ff1 margin-top-md d-none d-lg-block">{round.name}</div>
          <div className="h4-ff1 margin-top-md d-block d-lg-none">{round.short_name}</div>
        </Col>
      </Row>
      {round.matches.map((m, index) => (
        <BracketBox match={m} key={index} colIndex={colIndex} lastBox={index === round.matches.length - 1} />
      ))}
    </React.Fragment>
  )
}

const BracketCol = (props) => {
  const { round, colIndex } = props
  return (
    <Col className="col-brk-22">
      <BracketColInner round={round} colIndex={colIndex} />
    </Col>
  )
}

const BracketFinalCol = (props) => {
  const { round, thirdPlace } = props
  // console.log('thirdPlace', thirdPlace)
  return (
    <Col className="col-brk-22">
      <Row className="bracket-gap-height-30"></Row>
      <BracketColInner round={round} />
      <BracketColInner round={thirdPlace} />
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

const Bracket = (props) => {
  const { stage } = props
  const thirdPlace = stage.rounds ? stage.rounds.find((s) => s.name === 'Third place') : {}
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
            Bracket&nbsp;
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
            stage.rounds.map((r, index) => {
              const hookCount = r.matches.length / 2
              if (r.name === 'Third place') {
                return null
              } else if (r.name === 'Final') {
                return <BracketFinalCol round={r} thirdPlace={thirdPlace} key={r.name} />
              } else {
                return (
                  <React.Fragment key={r.name}>
                    <BracketCol round={r} colIndex={index} />
                    <BracketHook1 colIndex={index} hookCount={hookCount} />
                    <BracketHook2 colIndex={index} hookCount={hookCount} />
                  </React.Fragment>
                )
              }
            })}
        </Row>
      </Collapse>
    </React.Fragment>
  )
}

export default Bracket
