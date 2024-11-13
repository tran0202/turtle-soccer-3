import React, { useState } from 'react'
import { Collapse, Row, Col, Button } from 'reactstrap'
import DrawRankings from './DrawRankings'

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
            <Row className="text-start padding-top-md">
                <Col sm="12" md="12">
                    <Button outline color="primary" onClick={toggle} className="h2-ff5">
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
                        <section className="section-bg">
                            <div className="container">{children}</div>
                        </section>
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
                            </SectionCollapse>
                        )
                    })}
            </React.Fragment>
        )
    }
}

export default ConfederationQualification
