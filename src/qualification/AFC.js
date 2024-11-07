import React, { useState } from 'react'
import { Container, Collapse, Row, Col, Button } from 'reactstrap'
import { getActiveFIFATeamArray, getRandomMensTeamArray, getRandomHostTeamArray, getConfederationTeamArrays, getTournament } from '../core/TeamHelper'
import Page from '../core/Page'
import RankingsTable from '../rankings/RankingsTable'
import QualifiedTable from '../qualified/QualifiedTable'

const SectionCollapse = (props) => {
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
                        <section className="section-bg">
                            <div className="container">{children}</div>
                        </section>
                    </Col>
                </Row>
            </Collapse>
        </React.Fragment>
    )
}

class AFCQualification extends React.Component {
    constructor(props) {
        super(props)
        document.title = 'Qualification - Turtle Soccer'

        // this.state = { allRankings: [], rankings: [], confRankings: [], allTeams: [], qualifiedTeams: [], tournament: {}, config: { team_type_id: 'MNT' } }
    }

    getData = () => {
        // const tournament = getTournament()
        // const teamArray = getActiveFIFATeamArray()
        // const allRankings = getRandomMensTeamArray(teamArray)
        // const confRankings = getConfederationTeamArrays(allRankings)
        // this.setState({
        //     allRankings,
        //     rankings: allRankings,
        //     confRankings,
        //     allTeams: teamArray,
        //     qualifiedTeams: getRandomHostTeamArray(teamArray, tournament),
        //     tournament,
        // })
    }

    setData = (rankings) => {
        this.setState({ rankings })
    }

    componentDidMount() {
        this.getData()
    }

    componentDidUpdate() {
        // window.qualificationStore = this.state
    }

    render() {
        return (
            <Page>
                <Container>
                    <h1 className="h1-ff5 text-center mt-3 mb-3">AFC Qualification</h1>

                    <SectionCollapse title="AFC Rankings">AFC RAnkings</SectionCollapse>
                </Container>
            </Page>
        )
    }
}

export default AFCQualification
