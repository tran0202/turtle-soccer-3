import React, { useState } from 'react'
import { Collapse, Row, Col, Button } from 'reactstrap'
import MatchesGroup from './MatchesGroup'
import GroupRankingsTable from './GroupRankingsTable'

const GroupsCollapse = (props) => {
    const { title, initialStatus, stage, children } = props
    const [collapse, setCollapse] = useState(initialStatus === 'Opened' ? true : false)
    const [status, setStatus] = useState(initialStatus === 'Opened' ? initialStatus : 'Closed')
    const onEntering = () => setStatus('Opening...')
    const onEntered = () => setStatus('Opened')
    const onExiting = () => setStatus('Closing...')
    const onExited = () => setStatus('Closed')
    const toggle = () => setCollapse(!collapse)

    return (
        <React.Fragment>
            <Row className="text-start padding-top-md padding-left-sm">
                <Col sm="3" md="3">
                    <Button outline color="primary" onClick={toggle} className="h3-ff3 orange btn-collapse-orange">
                        {title}&nbsp;
                        {status === 'Opening...' && <i className="bx bx-dots-vertical-rounded"></i>}
                        {status === 'Opened' && <i className="bx bx-chevron-up-square"></i>}
                        {status === 'Closing...' && <i className="bx bx-dots-vertical-rounded"></i>}
                        {status === 'Closed' && <i className="bx bx-chevron-down-square"></i>}
                    </Button>
                </Col>
                <Col sm="5">
                    <Row>
                        <Col className="advanced-next-round-striped">{stage.advanced_note}</Col>
                    </Row>
                    {stage.next_round_note && (
                        <Row>
                            <Col className="advanced-wild-card-striped">{stage.next_round_note}</Col>
                        </Row>
                    )}
                </Col>
            </Row>
            <Collapse isOpen={collapse} onEntering={onEntering} onEntered={onEntered} onExiting={onExiting} onExited={onExited}>
                <Row className="mb-3 text-start padding-left-sm">
                    <Col sm="12" md="12">
                        <div className="container">{children}</div>
                    </Col>
                </Row>
            </Collapse>
        </React.Fragment>
    )
}

class Groups extends React.Component {
    render() {
        const { state, stage } = this.props
        const title = stage.type && !stage.type.includes('_nopot') ? 'Groups' : 'Standings'
        return (
            <React.Fragment>
                <GroupsCollapse title={title} stage={stage} initialStatus="Closed">
                    {stage.groups &&
                        stage.groups.map((g) => {
                            return (
                                <Row key={g.name} className="mt-5 box-xl">
                                    <Col xs={{ size: 10, offset: 1 }}>
                                        {!stage.type.includes('_nopot') && (
                                            <Row className="no-gutters group-header padding-tb-sm text-start">
                                                <Col className="col-box-5"></Col>
                                                <Col className="col-box-75">Group {g.name}</Col>
                                            </Row>
                                        )}
                                        <GroupRankingsTable group={g} config={state.config} />
                                        <MatchesGroup group={g} config={state.config} />
                                    </Col>
                                </Row>
                            )
                        })}
                </GroupsCollapse>
            </React.Fragment>
        )
    }
}

export default Groups
