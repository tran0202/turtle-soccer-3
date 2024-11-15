import React, { useState } from 'react'
import { Collapse, Row, Col, Button } from 'reactstrap'
import { getBoldText } from '../core/TeamHelper'
import ResultsPairTable from './ResultsPairTable'

const SectionCollapse = (props) => {
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
            <Row className="text-start padding-top-md">
                <Col sm="3" md="3">
                    <Button outline color="primary" onClick={toggle} className="h3-ff3">
                        {title}&nbsp;
                        {status === 'Opening...' && <i className="bx bx-dots-vertical-rounded"></i>}
                        {status === 'Opened' && <i className="bx bx-chevron-up-square"></i>}
                        {status === 'Closing...' && <i className="bx bx-dots-vertical-rounded"></i>}
                        {status === 'Closed' && <i className="bx bx-chevron-down-square"></i>}
                    </Button>
                </Col>
                <Col sm="9">{getBoldText(stage.result_note, 'Bolded')}</Col>
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

class Results extends React.Component {
    render() {
        const { state, stage } = this.props
        return (
            <React.Fragment>
                <SectionCollapse title="Results" initialStatus="Opened" stage={stage}>
                    {stage.type && stage.type.includes('pair') && <ResultsPairTable state={state} stage={stage} />}
                </SectionCollapse>
            </React.Fragment>
        )
    }
}

export default Results
