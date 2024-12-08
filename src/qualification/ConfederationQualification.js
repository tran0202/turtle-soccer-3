import React, { useState } from 'react'
import { Collapse, Row, Col, Button } from 'reactstrap'
import DrawSeeding from './DrawSeeding'
import Entrants from './Entrants'
import Results from './Results'
import Matches from './Matches'
import Groups from './Groups'
import Brackets from './Brackets'
import PartialAdvancement from './PartialAdvancement'

const ConfederationQualificationCollapse = (props) => {
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
            <Row className="text-center padding-top-md padding-left-sm">
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
        const { state, qualification } = this.props
        const qualification_id = qualification ? qualification.id : ''
        const isPlayoff = qualification_id.includes('play-off')
        return (
            <React.Fragment>
                {qualification &&
                    qualification.stages &&
                    qualification.stages.map((s) => {
                        return !isPlayoff ? (
                            <ConfederationQualificationCollapse key={qualification_id + s.name} title={s.name} initialStatus="Opened">
                                {s.type && !s.type.includes('_noshowpot') && !s.type.includes('knockout') && !s.type.includes('_nopot') && (
                                    <React.Fragment>
                                        <DrawSeeding state={state} stage={s} />
                                        <Row className="border-bottom-gray4 margin-left-sm margin-top-md" />
                                    </React.Fragment>
                                )}
                                {s.type && s.type.includes('_nopot') && (
                                    <React.Fragment>
                                        <Entrants state={state} stage={s} />
                                        <Row className="border-bottom-gray4 margin-left-sm margin-top-md" />
                                    </React.Fragment>
                                )}
                                {s.type && s.type.includes('pair2leg') && (
                                    <React.Fragment>
                                        <Results state={state} stage={s} />
                                        <Row className="border-bottom-gray4 margin-left-sm margin-top-md" />
                                        <Matches state={state} stage={s} />
                                    </React.Fragment>
                                )}
                                {s.type && s.type.includes('roundrobin') && (
                                    <React.Fragment>
                                        <Groups state={state} stage={s} />
                                    </React.Fragment>
                                )}
                                {s.partial_advancement && (
                                    <React.Fragment>
                                        <PartialAdvancement state={state} stage={s} />
                                    </React.Fragment>
                                )}
                                {s.type && s.type.includes('knockout') && (
                                    <React.Fragment>
                                        <Brackets state={state} stage={s} />
                                        <Matches state={state} stage={s} />
                                    </React.Fragment>
                                )}
                            </ConfederationQualificationCollapse>
                        ) : (
                            <React.Fragment key={qualification_id + s.name}>
                                <Brackets state={state} stage={s} />
                                <Matches state={state} stage={s} />
                            </React.Fragment>
                        )
                    })}
            </React.Fragment>
        )
    }
}

export default ConfederationQualification
