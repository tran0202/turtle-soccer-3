import React, { useState } from 'react'
import { Collapse, Row, Col, Button } from 'reactstrap'
import { getBoldText } from '../core/TeamHelper'
import PairSummary from './PairSummary'

const ResultsCollapse = (props) => {
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
                <Col sm="9">{getBoldText(stage.advanced_note, 'Bolded')}</Col>
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

class Results extends React.Component {
    render() {
        const { stage, config } = this.props
        return (
            <React.Fragment>
                <ResultsCollapse title="Results" stage={stage} initialStatus="Opened">
                    <Row className="mt-5 box-xl">
                        <Col xs={{ size: 10, offset: 1 }}>{stage.type && stage.type.includes('pair') && <PairSummary round={stage} config={config} />}</Col>
                    </Row>
                </ResultsCollapse>
            </React.Fragment>
        )
    }
}

export default Results
