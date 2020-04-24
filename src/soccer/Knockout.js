import React, { useState } from 'react'
import { DisplaySchedule, getDateMatchArrayPair, BracketBox } from './Helper'
import { Row, Col, Collapse, Button } from 'reactstrap'

const BracketColInner = (props) => {
  const { round, colIndex } = props

  return (
    <React.Fragment>
      {colIndex === 0 && <Row className="bracket-gap-height-00"></Row>}
      {colIndex === 1 && <Row className="bracket-gap-height-10"></Row>}
      {colIndex === 2 && <Row className="bracket-gap-height-20"></Row>}
      <Row className="no-gutters">
        <Col sm="12">
          <div className="h2-ff1 margin-top-md d-none d-lg-block">{round.name}</div>
          <div className="h2-ff1 margin-top-md d-block d-lg-none">{round.short_name}</div>
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
  const tp = stage.rounds.filter((s) => s.name === 'Third place')
  const thirdPlace = tp.length === 1 ? tp[0] : null
  const [collapse, setCollapse] = useState(true)
  const [status, setStatus] = useState('Opened')
  const onEntering = () => setStatus('Opening...')
  const onEntered = () => setStatus('Opened')
  const onExiting = () => setStatus('Closing...')
  const onExited = () => setStatus('Closed')
  const toggle = () => setCollapse(!collapse)

  return (
    <React.Fragment>
      <Row className="mt-3 text-center">
        <Col sm="12">
          <Button outline color="primary" onClick={toggle} style={{ marginBottom: '1rem', width: '50%' }} className="h2-ff3">
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
          {stage.rounds.map((r, index) => {
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

const getMatchArrayByDate = (round) => {
  let tmp = []
  round.matches.forEach((m) => {
    tmp.push(m)
  })
  return getDateMatchArrayPair(tmp)
}

const reorderMatches = (stage) => {
  stage.rounds.map((r) => {
    r.matches.sort((a, b) => {
      if (a.order < b.order) {
        return -1
      } else if (a.order > b.order) {
        return 1
      } else {
        return 0
      }
    })
    return null
  })
  return stage
}

const Knockout = (props) => {
  const { stage } = props
  const newStage = reorderMatches(stage)
  return (
    <React.Fragment>
      <Bracket stage={newStage} />
      {newStage.rounds.map((r) => {
        return <DisplaySchedule round={{ name: r.name, ...getMatchArrayByDate(r) }} key={r.name} />
      })}
    </React.Fragment>
  )
}

export default Knockout
