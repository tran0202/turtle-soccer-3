import React, { useState } from 'react'
import { Collapse, Row, Col, Button } from 'reactstrap'
import SeedingTable from './SeedingTable'

const DrawPlacement = (props) => {
    const { stage } = props
    return (
        <Row>
            <Col xs="12">
                <ul className="no-margin-bottom">
                    {stage.draw_note && <li>{stage.draw_note}</li>}
                    {stage &&
                        stage.pots &&
                        stage.pots.map((p) => {
                            return p.rankingFrom ? <li key={p.name}>{'Pot ' + p.name + ' (seed numbers ' + p.rankingFrom + '-' + p.rankingTo + ')'}</li> : ''
                        })}
                </ul>
            </Col>
        </Row>
    )
}

const SeedingCollapse = (props) => {
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
                <Col sm="9">
                    <DrawPlacement stage={stage} />
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

class Seeding extends React.Component {
    render() {
        const { stage, config } = this.props
        return (
            <React.Fragment>
                <SeedingCollapse title="Seeding" stage={stage} initialStatus="Opened">
                    <SeedingTable stage={stage} config={config} />
                </SeedingCollapse>
            </React.Fragment>
        )
    }
}

export default Seeding
