import React, { useState } from 'react'
import { Container, Collapse, Row, Col, Button } from 'reactstrap'
import { getRandomMensTeamArray } from './core/TeamHelper'
import Page from './core/Page'
import Table from './ranking/Table'

const SectionCollapse = (props) => {
    const { title, children } = props
    const [collapse, setCollapse] = useState(false)
    const [status, setStatus] = useState('Closed')
    const onEntering = () => setStatus('Opening...')
    const onEntered = () => setStatus('Opened')
    const onExiting = () => setStatus('Closing...')
    const onExited = () => setStatus('Closed')
    const toggle = () => setCollapse(!collapse)

    return (
        <React.Fragment>
            <Row className="mt-3 text-start padding-top-lg">
                <Col sm="12">
                    <Button outline color="primary" onClick={toggle} className="h2-ff3 btn-collapse-md">
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
                        <section className="rankings section-bg">
                            <div className="container">{children}</div>
                        </section>
                    </Col>
                </Row>
            </Collapse>
        </React.Fragment>
    )
}

class QualificationApp extends React.Component {
    constructor(props) {
        super(props)
        document.title = 'Qualification - Turtle Soccer'

        this.state = { allRankings: [], rankings: [], config: { team_type_id: 'MNT' } }
    }

    getData = () => {
        const allRankings = getRandomMensTeamArray()
        this.setState({ allRankings, rankings: allRankings })
    }

    setData = (rankings) => {
        this.setState({ rankings })
    }

    componentDidMount() {
        this.getData()
    }

    componentDidUpdate() {
        window.rankingsStore = this.state
    }

    render() {
        return (
            <Page>
                <Container>
                    <h1 className="h1-ff5 text-center mt-3 mb-3">World Cup 2026 Qualification</h1>

                    <SectionCollapse title="World Rankings">
                        <Table state={this.state} func={this.setData} />
                    </SectionCollapse>

                    <SectionCollapse title="Qualified Teams">Qualified Teams</SectionCollapse>

                    <SectionCollapse title="AFC Qualification">AFC Qualification</SectionCollapse>
                </Container>
            </Page>
        )
    }
}

export default QualificationApp
