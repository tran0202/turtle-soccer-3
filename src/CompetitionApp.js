import React from 'react'
import { Container, Row, Col, Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import { NumericFormat } from 'react-number-format'
import { getTournamentTitleFont } from './core/Helper'
import { getActiveTeams, getRandomRankings, getFlagSrc, getCompetition } from './core/TeamHelper'
import Page from './core/Page'

const TeamCell = (props) => {
    const { id, config } = props
    if (!id) return
    return (
        <React.Fragment>
            {/* {config.team_type_id === 'CLUB' && getClubLogoImg(id, config)}
      {config.team_type_id === 'CLUB' && getNationSmallFlagImg(id)} */}
            {config.team_type_id !== 'CLUB' && <img className="flag-sm flag-md " src={getFlagSrc(id)} alt={id} title={id} />}
            <br></br>
            {/* {getShortTeamName(id)} */}
        </React.Fragment>
    )
}

const TournamentsRow = (props) => {
    const { tournament, config } = props
    const { short_name, id, index, details, name, final_standings } = tournament
    return (
        <Row className="no-gutters ranking-tbl team-row padding-tb-xs text-start">
            <Col>
                <div className="col-12">
                    <div className="box-sm">
                        <Row className="no-gutters">
                            <Col className="col-box-4"></Col>
                            <Col className="col-box-6 text-center padding-top-lg">{index}</Col>
                            <Col className="col-box-10 text-center padding-tb-sm">
                                {!short_name && (
                                    <React.Fragment>
                                        {tournament.details.logo_filename && (
                                            <a href={`/tournament/${id}`}>
                                                <img
                                                    src={`/images/${config.logo_path}/${details.logo_filename}`}
                                                    alt={name}
                                                    title={name}
                                                    className="tournament-logo"
                                                />
                                            </a>
                                        )}
                                    </React.Fragment>
                                )}
                                {tournament.short_name && (
                                    <React.Fragment>
                                        {details.logo_filename && (
                                            <React.Fragment>
                                                <a href={`/tournament/${id}`}>
                                                    <img
                                                        src={`/images/${config.logo_path}/${details.logo_filename}`}
                                                        alt={name}
                                                        title={name}
                                                        className="tournament-logo-sm"
                                                    />
                                                </a>
                                                <p className="competition-tbl-short-name">{short_name}</p>
                                            </React.Fragment>
                                        )}
                                    </React.Fragment>
                                )}
                            </Col>
                            <Col className="col-box-10 text-center padding-tb-sm">
                                {final_standings && <TeamCell id={final_standings.champions} config={config} />}
                            </Col>
                        </Row>
                    </div>
                </div>
            </Col>
        </Row>
    )
}

const TournamentsHeader = (props) => {
    // const { state, func } = props
    // const { config } = state
    // const { confederations } = config
    return (
        <Row className="no-gutters ranking-tbl-header team-row padding-tb-md text-start">
            <Col>
                <Row className="no-gutters">
                    <Col className="col-box-4"></Col>
                    <Col className="col-box-6 text-center padding-top-sm">No.</Col>
                    <Col className="col-box-10 text-center padding-top-sm">Edition</Col>
                    <Col className="col-box-20 text-center padding-top-sm">Champions</Col>
                    <Col className="col-box-20 text-center padding-top-sm">Runners-up</Col>
                    <Col className="col-box-20 text-center padding-top-sm">Third-place</Col>
                    <Col className="col-box-20 text-center padding-top-sm">Fourth-place</Col>
                </Row>
            </Col>
        </Row>
    )
}

const TournamentsTable = (props) => {
    const { tournaments, config } = props
    return (
        <React.Fragment>
            <TournamentsHeader />
            {tournaments.map((t) => (
                <TournamentsRow key={t.id} tournament={t} config={config} />
            ))}
        </React.Fragment>
    )
}

class CompetitionApp extends React.Component {
    constructor(props) {
        super(props)
        document.title = 'Competition - Turtle Soccer'

        this.state = { competition: { tournaments: [] } }
    }

    getData = () => {
        this.setState({ competition: getCompetition(this.props.query.id) })
    }

    setData = () => {
        this.setState()
    }

    componentDidMount() {
        this.getData()
    }

    componentDidUpdate() {
        const { competition } = this.state
        document.title = competition.name + ' - Turtle Soccer'
        window.competitionStore = this.state
    }

    render() {
        const { competition } = this.state
        const config = { logo_path: competition.logo_path }
        return (
            <Page>
                <Container>
                    <h1 className={`text-center mt-3 mb-2 ${getTournamentTitleFont(competition)}`} style={{ color: competition.color }}>
                        {competition.name}
                    </h1>
                    <Row className="mt-4 mb-4 text-start conf-box">
                        <Col xs="9">
                            <Row>
                                <Col xs="12">{competition.descriptions && competition.descriptions.map((d, index) => <p key={index}>{d}</p>)}</Col>
                            </Row>
                        </Col>
                        <Col xs="3" className="text-end">
                            {competition.trophy_filename && (
                                <img
                                    src={`/images/${competition.logo_path}/${competition.trophy_filename}`}
                                    alt={`Trophy ${competition.name}`}
                                    title={`Trophy ${competition.name}`}
                                    className="competition-trophy"
                                />
                            )}
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <div className="h2-ff1 margin-top-md">Tournament Results</div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <TournamentsTable tournaments={competition.tournaments} config={config} />
                        </Col>
                    </Row>
                </Container>
            </Page>
        )
    }
}

export default CompetitionApp
