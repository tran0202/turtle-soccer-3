import React, { useState } from 'react'
import { Container, Collapse, Row, Col, Button } from 'reactstrap'
import ConfederationArray from './data/Confederations.json'
import { getActiveFIFATeamArray, createDrawRankings, getRandomHostTeamArray, getTournament, processStages } from './core/TeamHelper'
import Page from './core/Page'
import QualifiedTable from './qualified/QualifiedTable'
import ConfederationQualification from './qualification/ConfederationQualification'

export const SectionCollapse = (props) => {
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
            <Row className="text-start padding-top-lg">
                <Col sm="12">
                    <Button outline color="primary" onClick={toggle} className="h2-ff8 btn-collapse-md">
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
                        <div className="container">{children}</div>
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

        this.state = {
            qualifiedTeams: [],
            qualifications: [],
            tournament: {},
            config: { team_type_id: 'MNT', confederations: ConfederationArray },
        }
    }

    getData = () => {
        const tournament = getTournament()
        const teamArray = getActiveFIFATeamArray()
        const qualifiedTeams = getRandomHostTeamArray(teamArray, tournament)
        const qualifications = createDrawRankings(teamArray, tournament)
        processStages(qualifications)
        this.setState({
            qualifiedTeams,
            qualifications,
            tournament,
            config: { ...this.state.config, teams: teamArray },
        })
    }

    setData = (rankings) => {
        this.setState({ rankings })
    }

    componentDidMount() {
        this.getData()
    }

    componentDidUpdate() {
        window.qualificationStore = this.state
    }

    render() {
        const { tournament } = this.state
        const { qualifications } = tournament
        return (
            <Page>
                <Container>
                    <h1 className="h1-ff5 text-center mt-3 mb-3">World Cup 2026 Qualification</h1>

                    <SectionCollapse title="Qualified Teams">
                        <QualifiedTable state={this.state} />
                    </SectionCollapse>

                    {qualifications &&
                        qualifications.map((q) => {
                            return (
                                <SectionCollapse key={q.id} title={`${q.id} Qualification`} initialStatus="Opened">
                                    <ConfederationQualification state={this.state} confederation_id={q.id} />
                                </SectionCollapse>
                            )
                        })}
                </Container>
            </Page>
        )
    }
}

export default QualificationApp
