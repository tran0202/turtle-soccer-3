import React, { useState } from 'react'
import { Collapse, Row, Col, Button } from 'reactstrap'
import moment from 'moment'
import { getTeamName, getTeamFlagId } from '../core/TeamHelper'

const MatchesGroupCollapse = (props) => {
    const { title, initialStatus, children } = props
    const [collapse, setCollapse] = useState(initialStatus === 'Opened' ? true : false)
    const [status, setStatus] = useState(initialStatus === 'Opened' ? initialStatus : 'Closed')
    const onEntering = () => setStatus('Opening...')
    const onEntered = () => setStatus('Opened')
    const onExiting = () => setStatus('Closing...')
    const onExited = () => setStatus('Closed')
    const toggle = () => setCollapse(!collapse)

    return (
        <React.Fragment>
            <Row className="text-start padding-tb-md">
                <Col sm="1" md="1"></Col>
                <Col sm="3" md="3">
                    <Button outline color="primary" onClick={toggle} className="h4-ff3">
                        {title}&nbsp;
                        {status === 'Opening...' && <i className="bx bx-dots-vertical-rounded"></i>}
                        {status === 'Opened' && <i className="bx bx-chevron-up-square"></i>}
                        {status === 'Closing...' && <i className="bx bx-dots-vertical-rounded"></i>}
                        {status === 'Closed' && <i className="bx bx-chevron-down-square"></i>}
                    </Button>
                </Col>
            </Row>
            <Collapse isOpen={collapse} onEntering={onEntering} onEntered={onEntered} onExiting={onExiting} onExited={onExited}>
                <Row className="mb-3 text-start">
                    <Col sm="12" md="12">
                        <div className="container">{children}</div>
                    </Col>
                </Row>
            </Collapse>
        </React.Fragment>
    )
}

const MatchDayHeader = (props) => {
    const { matchday } = props
    return (
        <Row className="matchday-header text-start margin-top-md">
            <Col className="col-12 border-bottom-gray4">
                {matchday.name} | {moment(matchday.date).format('MMMM D, YYYY')}
            </Col>
        </Row>
    )
}

const MatchDayRow = (props) => {
    const { matchday, config } = props
    const { matches } = matchday

    return (
        <React.Fragment>
            {matches &&
                matches.map((m, index) => {
                    const homeTeamName = getTeamName(m.home_team, config)
                    const awayTeamName = getTeamName(m.away_team, config)
                    const homeTeamFlag = getTeamFlagId(m.home_team, config)
                    const awayTeamFlag = getTeamFlagId(m.away_team, config)
                    const matchHomeScore = m.home_score
                    const matchAwayScore = m.away_score
                    return (
                        <React.Fragment key={index}>
                            <Row className="no-gutters ranking-tbl padding-tb-md">
                                <Col className="col-box-25 text-end">{homeTeamName}</Col>
                                <Col className="col-box-6">{homeTeamFlag}</Col>
                                <Col className="text-center score-no-padding-right col-box-14">
                                    {matchHomeScore} - {matchAwayScore}
                                </Col>
                                <Col className="col-box-6">{awayTeamFlag}</Col>
                                <Col className="col-box-25">{awayTeamName}</Col>
                            </Row>
                        </React.Fragment>
                    )
                })}
        </React.Fragment>
    )
}

class MatchesGroup extends React.Component {
    render() {
        const { group, config } = this.props
        return (
            <MatchesGroupCollapse title="Matches" initialStatus="Closed">
                {group.matchdays &&
                    group.matchdays.map((md) => {
                        return (
                            <Row key={md.name}>
                                <Col className="col-12">
                                    <MatchDayHeader matchday={md} />
                                    <MatchDayRow matchday={md} config={config} />
                                </Col>
                            </Row>
                        )
                    })}
            </MatchesGroupCollapse>
        )
    }
}

export default MatchesGroup
