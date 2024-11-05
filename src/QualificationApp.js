import React, { useState } from 'react'
import { Container, Collapse, Row, Col, Button } from 'reactstrap'
import Page from './core/Page'
import Table from './ranking/Table'

const Format = (props) => {
    const { config, details } = props
    // const init_tiebreakers_collapsed = config.tiebreakers_collapsed !== true ? true : false
    // const init_tiebreakers_status = config.tiebreakers_collapsed !== true ? 'Opened' : 'Closed'
    const [collapse, setCollapse] = useState(true)
    const [status, setStatus] = useState('Opened')
    const onEntering = () => setStatus('Opening...')
    const onEntered = () => setStatus('Opened')
    const onExiting = () => setStatus('Closing...')
    const onExited = () => setStatus('Closed')
    const toggle = () => setCollapse(!collapse)

    return (
        <React.Fragment>
            <Row className="mt-3 text-center">
                <Col sm="12">
                    <Button outline color="primary" onClick={toggle} className="h2-ff3 btn-collapse">
                        Format &amp; Tiebreakers&nbsp;
                        {status === 'Opening...' && <i className="bx bx-dots-vertical-rounded"></i>}
                        {status === 'Opened' && <i className="bx bx-chevron-up-square"></i>}
                        {status === 'Closing...' && <i className="bx bx-dots-vertical-rounded"></i>}
                        {status === 'Closed' && <i className="bx bx-chevron-down-square"></i>}
                    </Button>
                </Col>
            </Row>
            <Collapse isOpen={collapse} onEntering={onEntering} onEntered={onEntered} onExiting={onExiting} onExited={onExited}>
                Something
            </Collapse>
        </React.Fragment>
    )
}

class QualificationApp extends React.Component {
    constructor(props) {
        super(props)
        document.title = 'Qualification - Turtle Soccer'
    }

    render() {
        return (
            <Page>
                <Container>
                    <h1 className="h1-ff5 text-center mt-3 mb-3">World Cup 2026 Qualification</h1>
                    <Format />
                    <Row className="mt-3 mb-3 text-start rankings-page-box">
                        <Col sm="12" md="12">
                            <section className="rankings section-bg">
                                <div className="container">
                                    <Table />
                                </div>
                            </section>
                        </Col>
                    </Row>
                </Container>
            </Page>
        )
    }
}

export default QualificationApp
