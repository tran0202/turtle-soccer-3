import React, { useState } from 'react'
import { Container, Row, Col, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import classnames from 'classnames'
import { getConfederationOrganization, getRegionalConfederations, getTeamFlagName } from './core/TeamHelper'
import Page from './core/Page'

const TeamHeader = () => {
    return (
        <Row className="no-gutters ranking-tbl-header team-row padding-tb-xs text-start">
            <Col>
                <Row className="no-gutters">
                    <Col className="col-box-4"></Col>
                    <Col className="col-box-10">No.</Col>
                    <Col className="col-box-80">Team</Col>
                </Row>
            </Col>
        </Row>
    )
}

const TeamRow = (props) => {
    const { team } = props
    return (
        <Row className="no-gutters ranking-tbl team-row padding-tb-xs text-start">
            <Col>
                <div className="col-12">
                    <div className="box-sm">
                        <Row className="no-gutters">
                            <Col className="col-box-4"></Col>
                            <Col className="col-box-10">{team.index}</Col>
                            <Col className="col-box-80">{getTeamFlagName(team)}</Col>
                        </Row>
                    </div>
                </div>
            </Col>
        </Row>
    )
}

const Confederation = (props) => {
    const { confederation } = props
    const isFIFA = confederation.id === 'FIFA'
    return (
        <React.Fragment>
            <Row>
                <Col sm="12" md="2" className="mb-2">
                    <img
                        src={`/images/confederation_logos/${confederation.logo_filename}`}
                        className="conf-logo"
                        alt={confederation.id}
                        title={confederation.id}
                    />
                </Col>
                <Col sm="12" md="10">
                    <Row>
                        <Col xs="12">{confederation.short_description}</Col>
                    </Row>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h4 className="mt-4 mb-3">Competitions</h4>
                </Col>
            </Row>
            <Row>
                {confederation &&
                    confederation.competitions.map((c) => {
                        return (
                            <React.Fragment key={c.id}>
                                <Col className="competition-box">
                                    <Row>
                                        <Col>
                                            <img
                                                src={`/images/${c.logo_path}/${c.trophy_filename}`}
                                                alt={`${c.name} trophy`}
                                                title={`${c.name} trophy`}
                                                className="conf-logo"
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <h4 className="h5-ff5 text-center mt-4">{c.name}</h4>
                                        </Col>
                                    </Row>
                                </Col>
                            </React.Fragment>
                        )
                    })}
            </Row>
            {!isFIFA && (
                <React.Fragment>
                    <Row>
                        <Col>
                            <h4 className="mt-4">National Teams</h4>
                        </Col>
                    </Row>
                    <Row>
                        {confederation.pots.map((p, index) => {
                            return (
                                <Col key={index}>
                                    <TeamHeader />
                                    {p.teams.map((t) => (
                                        <TeamRow team={t} />
                                    ))}
                                </Col>
                            )
                        })}
                    </Row>
                </React.Fragment>
            )}
        </React.Fragment>
    )
}

const ConfederationTabs = (props) => {
    const { confederations } = props
    const [activeTab, setActiveTab] = useState('AFC')
    const toggle = (tab) => {
        if (activeTab !== tab) setActiveTab(tab)
    }

    return (
        <React.Fragment>
            <Nav tabs className="mt-4 mb-4">
                {confederations &&
                    confederations.map((q) => (
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
                {confederations &&
                    confederations.map((c) => (
                        <React.Fragment key={c.id}>
                            {c.id && (
                                <TabPane tabId={c.id.replace(/ /g, '-')}>
                                    <Confederation confederation={c} />
                                </TabPane>
                            )}
                        </React.Fragment>
                    ))}
            </TabContent>
        </React.Fragment>
    )
}

class OrganizationApp extends React.Component {
    constructor(props) {
        super(props)
        document.title = 'Organization - Turtle Soccer'
        this.state = { confederations: [] }
    }

    getData = () => {
        this.setState({ confederations: getConfederationOrganization() })
    }

    setData = () => {
        this.setState()
    }

    componentDidMount() {
        this.getData()
    }

    componentDidUpdate() {
        window.organizationStore = this.state
    }

    render() {
        const { confederations } = this.state
        return (
            <Page>
                <Container>
                    <h1 className="h1-ff5 text-center mt-4 mb-4">World Soccer</h1>
                    {confederations && confederations.length > 0 && (
                        <React.Fragment>
                            <Row className="mt-4 mb-4 text-left conf-box">
                                <Col sm="12" md="12">
                                    <Confederation confederation={confederations[0]} />
                                </Col>
                            </Row>
                            <ConfederationTabs confederations={getRegionalConfederations()} />
                        </React.Fragment>
                    )}
                </Container>
            </Page>
        )
    }
}

export default OrganizationApp
