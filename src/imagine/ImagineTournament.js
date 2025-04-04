import React, { useState } from 'react'
import { Collapse, Row, Col, Button } from 'reactstrap'
import Seeding from '../components/Seeding'
import Entrants from '../components/Entrants'
import Results from '../components/Results'
import Matches from '../components/Matches'
import Groups from '../components/Groups'
import PartialAdvancement from '../components/PartialAdvancement'
import Knockout from '../tournament/Knockout'

const ImagineTournamentCollapse = (props) => {
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
            <Row className="text-center padding-top-md padding-left-sm">
                <Col sm="12" md="12">
                    <Button outline color="primary" onClick={toggle} className="h2-ff5 green btn-collapse-green">
                        {title}&nbsp;
                        {status === 'Opening...' && <i className="bx bx-dots-vertical-rounded"></i>}
                        {status === 'Opened' && <i className="bx bx-chevron-up-square"></i>}
                        {status === 'Closing...' && <i className="bx bx-dots-vertical-rounded"></i>}
                        {status === 'Closed' && <i className="bx bx-chevron-down-square"></i>}
                    </Button>
                </Col>
            </Row>
            <Collapse isOpen={collapse} onEntering={onEntering} onEntered={onEntered} onExiting={onExiting} onExited={onExited}>
                <Row className="mb-3 text-start padding-left-sm">
                    <Col sm="12" md="12">
                        {children}
                    </Col>
                </Row>
            </Collapse>
        </React.Fragment>
    )
}

class ImagineTournament extends React.Component {
    render() {
        const { tournament, config } = this.props
        const tournament_id = tournament && tournament.id ? tournament.id : ''
        const isPlayoff = tournament_id.includes('play-off')
        const showSeeding = (s) =>
            s.type.includes('_drawpair') ||
            s.type.includes('_predetpair') ||
            s.type.includes('_oddpot') ||
            s.type.includes('_evenpot') ||
            s.type.includes('_outsidepot')
        const showEntrants = (s) => s.type.includes('_nopot') || s.type === 'knockout_' || s.type === 'knockout_lastroundrank'
        return (
            <React.Fragment>
                {tournament &&
                    tournament.stages &&
                    tournament.stages.map((s) => {
                        return !isPlayoff ? (
                            <ImagineTournamentCollapse key={tournament_id + s.name} title={s.name} initialStatus="Opened">
                                {s.type && showSeeding(s) && (
                                    <React.Fragment>
                                        <Seeding stage={s} config={config} />
                                        <Row className="border-bottom-gray4 margin-left-sm margin-top-md" />
                                    </React.Fragment>
                                )}
                                {s.type && showEntrants(s) && (
                                    <React.Fragment>
                                        <Entrants stage={s} config={config} />
                                        <Row className="border-bottom-gray4 margin-left-sm margin-top-md" />
                                    </React.Fragment>
                                )}
                                {s.type && s.type.includes('pair_') && (
                                    <React.Fragment>
                                        <Results stage={s} config={config} />
                                        <Row className="border-bottom-gray4 margin-left-sm margin-top-md" />
                                        <Matches stage={s} config={config} />
                                    </React.Fragment>
                                )}
                                {s.type && s.type.includes('roundrobin_') && (
                                    <React.Fragment>
                                        <Groups stage={s} config={config} />
                                    </React.Fragment>
                                )}
                                {s.partial_advancement && (
                                    <React.Fragment>
                                        <PartialAdvancement stage={s} config={config} isImagine={true} />
                                    </React.Fragment>
                                )}
                                {s.type && s.type.includes('knockout_') && (
                                    <React.Fragment>
                                        <Knockout stage={s} config={config} isImagine={true} />
                                    </React.Fragment>
                                )}
                            </ImagineTournamentCollapse>
                        ) : (
                            <React.Fragment key={tournament_id + s.name}>
                                <Entrants stage={s} config={config} />
                                <Row className="border-bottom-gray4 margin-left-sm margin-top-md" />
                                <Knockout stage={s} config={config} isImagine={true} />
                            </React.Fragment>
                        )
                    })}
            </React.Fragment>
        )
    }
}

export default ImagineTournament
