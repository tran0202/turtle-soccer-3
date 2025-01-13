import React, { useState } from 'react'
import { Container, Collapse, Row, Col, Button, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import classnames from 'classnames'
import { getActiveTeams, getRandomHostTeamArray, getImagine, processSoccerTournament, getConfederations } from './core/TeamHelper'
import Page from './core/Page'
import QualifiedTable from './imagine/QualifiedTable'
import Tournament from './imagine/Tournament'

export const ImagineCollapse = (props) => {
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
                    <Button outline color="primary" onClick={toggle} className="h2-ff8 btn-collapse">
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
                        {children}
                    </Col>
                </Row>
            </Collapse>
        </React.Fragment>
    )
}

const ConfederationQualifications = (props) => {
    const { state, qualifications } = props
    const [activeTab, setActiveTab] = useState('UEFA')
    const toggle = (tab) => {
        if (activeTab !== tab) setActiveTab(tab)
    }

    return (
        <React.Fragment>
            <Nav tabs className="mt-3">
                {qualifications &&
                    qualifications.map((q) => (
                        <NavItem key={q.id}>
                            {q.id && (
                                <NavLink
                                    className={classnames({ active: activeTab === `${q.id.replace(/ /g, '-')}` })}
                                    onClick={() => {
                                        toggle(`${q.id.replace(/ /g, '-')}`)
                                    }}
                                >
                                    {q.id}
                                </NavLink>
                            )}
                        </NavItem>
                    ))}
            </Nav>
            <TabContent activeTab={activeTab}>
                {qualifications &&
                    qualifications.map((q) => (
                        <React.Fragment key={q.id}>
                            {q.id && (
                                <TabPane tabId={q.id.replace(/ /g, '-')}>
                                    <Tournament state={state} tournament={q} />
                                </TabPane>
                            )}
                        </React.Fragment>
                    ))}
            </TabContent>
        </React.Fragment>
    )
}

class ImagineApp extends React.Component {
    constructor(props) {
        super(props)
        document.title = 'Imaginary World Cup - Turtle Soccer'

        this.state = {
            qualifiedTeams: [],
            qualifications: [],
            tournament: {},
            config: {},
        }
    }

    getData = () => {
        const teamTypeId = 'MNT'
        const config = getImagine()
        const teamArray = getActiveTeams(teamTypeId)
        const qualifiedTeams = getRandomHostTeamArray(teamArray, config)
        const qualifications = processSoccerTournament(teamArray, qualifiedTeams, config)
        this.setState({
            qualifiedTeams,
            qualifications,
            tournament: config,
            config: { team_type_id: 'MNT', confederations: getConfederations(), teams: teamArray },
        })
    }

    setData = () => {
        this.setState()
    }

    componentDidMount() {
        this.getData()
    }

    componentDidUpdate() {
        window.imagineStore = this.state
    }

    render() {
        const { tournament } = this.state
        const { qualifications } = tournament
        return (
            <Page>
                <Container className="container-xxxl">
                    <h1 className="h1-ff5 text-center mt-3 mb-3">Imaginary World Cup 2026</h1>

                    <ImagineCollapse title="Qualified Teams" initialStatus="Closed">
                        <QualifiedTable state={this.state} />
                    </ImagineCollapse>

                    <ImagineCollapse title="Confederation Qualifications" initialStatus="Closed">
                        <ConfederationQualifications state={this.state} qualifications={qualifications} />
                    </ImagineCollapse>

                    <ImagineCollapse title="Final" initialStatus="Opened">
                        <Tournament state={this.state} tournament={tournament} />
                    </ImagineCollapse>
                </Container>
            </Page>
        )
    }
}

export default ImagineApp
