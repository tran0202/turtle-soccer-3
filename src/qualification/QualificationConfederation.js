import React, { useState } from 'react'
import { Collapse, Row, Col, Button } from 'reactstrap'
import QualificationRankingsTable from './QualificationRankingsTable'

const DrawPlacement = (props) => {
    const { qual } = props
    return (
        <Row>
            <Col xs="12">
                <ul className="no-margin-bottom">
                    {qual &&
                        qual.rounds.map((r) => {
                            return (
                                <li key={r.name}>
                                    {r.name} Round:{' '}
                                    {r.pots.map((p, index) => {
                                        return 'Pot ' + p.name + ' (ranked ' + p.rankingFrom + '-' + p.rankingTo + (r.pots.length !== index + 1 ? ') || ' : ')')
                                    })}
                                </li>
                            )
                        })}
                </ul>
            </Col>
        </Row>
    )
}

const SectionCollapse = (props) => {
    const { title, initialStatus, qual, children } = props
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
                <Col sm="1"></Col>
                <Col sm="4" md="4">
                    <Button outline color="primary" onClick={toggle} className="h2-ff3">
                        {title}&nbsp;
                        {status === 'Opening...' && <i className="bx bx-dots-vertical-rounded"></i>}
                        {status === 'Opened' && <i className="bx bx-chevron-up-square"></i>}
                        {status === 'Closing...' && <i className="bx bx-dots-vertical-rounded"></i>}
                        {status === 'Closed' && <i className="bx bx-chevron-down-square"></i>}
                    </Button>
                </Col>
                <Col sm="7">
                    <DrawPlacement qual={qual} />
                </Col>
            </Row>
            <Collapse isOpen={collapse} onEntering={onEntering} onEntered={onEntered} onExiting={onExiting} onExited={onExited}>
                <Row className="mb-3 text-start">
                    <Col sm="1"></Col>
                    <Col sm="11" md="11">
                        <section className="section-bg">
                            <div className="container">{children}</div>
                        </section>
                    </Col>
                </Row>
            </Collapse>
        </React.Fragment>
    )
}

class QualificationConfederation extends React.Component {
    render() {
        const { state, confederation } = this.props
        const { tournament } = state
        const { qualification } = tournament
        if (!qualification) return
        const qual = qualification.find((q) => q.id === confederation)
        return (
            <SectionCollapse title={`${confederation} Rankings for Draw`} initialStatus="Opened" qual={qual}>
                <QualificationRankingsTable state={state} />
            </SectionCollapse>
        )
    }
}

export default QualificationConfederation
