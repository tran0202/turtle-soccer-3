import React, { useState } from 'react'
import { Collapse, Row, Col, Button } from 'reactstrap'
import GroupRankingsTable from './GroupRankingsTable'
import { getPartialAdvancementRankings } from '../core/RankingsHelper'

const PartialAdvancementCollapse = (props) => {
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
                <Col sm="4" md="4">
                    <Button outline color="primary" onClick={toggle} className="h3-ff3 orange btn-collapse-orange">
                        {title}&nbsp;
                        {status === 'Opening...' && <i className="bx bx-dots-vertical-rounded"></i>}
                        {status === 'Opened' && <i className="bx bx-chevron-up-square"></i>}
                        {status === 'Closing...' && <i className="bx bx-dots-vertical-rounded"></i>}
                        {status === 'Closed' && <i className="bx bx-chevron-down-square"></i>}
                    </Button>
                </Col>
                <Col sm="5">
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

class PartialAdvancement extends React.Component {
    render() {
        const { state, stage } = this.props
        const config = { ...state.config, added_group: true }
        const pa = getPartialAdvancementRankings(stage)
        return (
            <React.Fragment>
                <PartialAdvancementCollapse title="Rankings of Runners-up" stage={stage}>
                    {pa &&
                        pa.map((g) => {
                            return (
                                <Row key={g.name} className="mt-5 box-xl">
                                    <Col xs={{ size: 10, offset: 1 }}>
                                        <GroupRankingsTable group={g} config={config} />
                                    </Col>
                                </Row>
                            )
                        })}
                </PartialAdvancementCollapse>
            </React.Fragment>
        )
    }
}

export default PartialAdvancement
