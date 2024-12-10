import React, { useState } from 'react'
import { Container, Collapse, Row, Col, Button, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import classnames from 'classnames'
import ConfederationArray from './data/Confederations.json'
import { getActiveFIFATeamArray, getRandomHostTeamArray, getTournament, processQualifications } from './core/TeamHelper'
import Page from './core/Page'
import QualifiedTable from './qualified/QualifiedTable'
import Qualification from './qualification/Qualification'

export const WorldCupCollapse = (props) => {
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
                        <div className="container">{children}</div>
                    </Col>
                </Row>
            </Collapse>
        </React.Fragment>
    )
}

const ConfederationQualifications = (props) => {
    const { state, qualifications } = props
    const [activeTab, setActiveTab] = useState('Inter-confederation-play-offs')
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
                                    <Qualification state={state} qualification={q} />
                                </TabPane>
                            )}
                        </React.Fragment>
                    ))}
            </TabContent>
        </React.Fragment>
    )
}

class WorldCupApp extends React.Component {
    constructor(props) {
        super(props)
        document.title = 'World Cup - Turtle Soccer'

        this.state = {
            qualifiedTeams: [],
            qualifications: [],
            tournament: {},
            config: {},
        }
    }

    getData = () => {
        const tournament = getTournament()
        const teamArray = getActiveFIFATeamArray()
        const qualifiedTeams = getRandomHostTeamArray(teamArray, tournament)
        const qualifications = processQualifications(teamArray, qualifiedTeams, tournament)
        this.setState({
            qualifiedTeams,
            qualifications,
            tournament,
            config: { team_type_id: 'MNT', confederations: ConfederationArray, teams: teamArray },
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
                <Container className="container-xxxl">
                    <h1 className="h1-ff5 text-center mt-3 mb-3">World Cup 2026</h1>

                    <WorldCupCollapse title="Qualified Teams" initialStatus="Closed">
                        <QualifiedTable state={this.state} />
                    </WorldCupCollapse>

                    <WorldCupCollapse title="Confederation Qualifications" initialStatus="Opened">
                        <ConfederationQualifications state={this.state} qualifications={qualifications} />
                    </WorldCupCollapse>
                </Container>
            </Page>
        )
    }
}

export default WorldCupApp
