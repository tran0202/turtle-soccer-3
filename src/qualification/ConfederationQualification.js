import React, { useState } from 'react'
import { Collapse, Row, Col, Button } from 'reactstrap'
import DrawRankings from './DrawRankings'
import Results from './Results'
import Matches from './Matches'
import Groups from './Groups'

const SectionCollapse = (props) => {
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
            <Row className="text-start padding-top-md padding-left-sm">
                <Col sm="12" md="12">
                    <Button outline color="primary" onClick={toggle} className="h2-ff5 green btn-collapse-green">
                        {title}&nbsp;
                        {status === 'Opening...' && <i className="bx bx-dots-vertical-rounded"></i>}
                        {status === 'Opened' && <i className="bx bx-chevron-up-square"></i>}
                        {status === 'Closing...' && <i className="bx bx-dots-vertical-rounded"></i>}
                        {status === 'Closed' && <i className="bx bx-chevron-down-square"></i>}
                    </Button>
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

class ConfederationQualification extends React.Component {
    render() {
        const { state, confederation_id } = this.props
        const { qualifications } = state
        if (!qualifications) return
        const qual = qualifications.find((q) => q.id === confederation_id)
        return (
            <React.Fragment>
                {qual &&
                    qual.stages &&
                    qual.stages.map((s) => {
                        return (
                            <SectionCollapse key={confederation_id + s.name} title={s.name} initialStatus="Opened">
                                <DrawRankings state={state} stage={s} />
                                <Row className="border-bottom-gray4 margin-left-sm margin-top-md" />
                                {s.type && s.type.includes('pair2leg') && (
                                    <React.Fragment>
                                        <Results state={state} stage={s} />
                                        <Row className="border-bottom-gray4 margin-left-sm margin-top-md" />
                                        <Matches state={state} stage={s} />
                                    </React.Fragment>
                                )}
                                {s.type && s.type.includes('roundrobin2leg') && (
                                    <React.Fragment>
                                        <Groups state={state} stage={s} />
                                    </React.Fragment>
                                )}
                            </SectionCollapse>
                        )
                    })}
            </React.Fragment>
        )
    }
}

export default ConfederationQualification
