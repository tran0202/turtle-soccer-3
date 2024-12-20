import React from 'react'
import { Container, Row, Col } from 'reactstrap'
import { getTournamentTitleFont } from './core/Helper'
import { getTeams, getTeamFlagId, getCompetition, getShortTeamName } from './core/TeamHelper'
import { SharedBronzeTooltip } from './core/TooltipHelper'
import Page from './core/Page'

const TeamCell = (props) => {
    const { id, config } = props
    if (!id) return
    return (
        <React.Fragment>
            {/* {config.team_type_id === 'CLUB' && getClubLogoImg(id, config)}
      {config.team_type_id === 'CLUB' && getNationSmallFlagImg(id)} */}
            {getTeamFlagId(id, config)}
            <br></br>
            {getShortTeamName(id, config)}
        </React.Fragment>
    )
}

const BronzeCell = (props) => {
    const { id, config } = props
    if (config.shared_bronze) {
        return id.map((i) => {
            return (
                <React.Fragment>
                    <TeamCell id={i} config={config} />
                    <SharedBronzeTooltip target="sharedTooltip" notes={config.third_place_text} />
                    <br />
                </React.Fragment>
            )
        })
    } else {
        return <TeamCell id={id} config={config} />
    }
}

const TournamentsRow = (props) => {
    const { tournament, config } = props
    const { short_name, id, index, details, name, final_standings } = tournament
    const tournamentConfig = { ...config, shared_bronze: tournament.shared_bronze, third_place_text: final_standings.third_place_text }
    const row_highlight = index % 2 === 0 ? 'ltblue-striped' : ''
    return (
        <Row className="no-gutters ranking-tbl team-row padding-tb-xs text-start">
            <Col>
                <div className="col-12">
                    <div className={`box-sm ${row_highlight}`}>
                        <Row className="no-gutters">
                            <Col className="col-box-4"></Col>
                            <Col className="col-box-4 text-center padding-top-lg">{index}</Col>
                            <Col className="col-box-20 text-center padding-tb-sm">
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
                            <Col className="col-box-18 text-center padding-tb-md">
                                {final_standings && <TeamCell id={final_standings.champions} config={config} />}
                            </Col>
                            <Col className="col-box-18 text-center padding-tb-md">
                                {final_standings && <TeamCell id={final_standings.runners_up} config={config} />}
                            </Col>
                            <Col className="col-box-18 text-center padding-tb-md">
                                {final_standings && <BronzeCell id={final_standings.third_place} config={tournamentConfig} />}
                            </Col>
                            <Col className="col-box-18 text-center padding-tb-md">
                                {final_standings && <TeamCell id={final_standings.fourth_place} config={config} />}
                            </Col>
                        </Row>
                    </div>
                </div>
            </Col>
        </Row>
    )
}

const TournamentsHeader = (props) => {
    const { config } = props
    const header1 = config.is_olympic ? 'Gold Medalists' : 'Champions'
    const header2 = config.is_olympic ? 'Silver Medalists' : 'Runners-up'
    const header3 = config.is_olympic ? 'Bronze Medalists' : 'Third-place'
    return (
        <Row className="no-gutters ranking-tbl-header team-row padding-tb-md text-start">
            <Col>
                <Row className="no-gutters">
                    <Col className="col-box-4"></Col>
                    <Col className="col-box-4 text-center padding-top-sm">No.</Col>
                    <Col className="col-box-20 text-center padding-top-sm">Edition</Col>
                    <Col className="col-box-18 text-center padding-top-sm">{header1}</Col>
                    <Col className="col-box-18 text-center padding-top-sm">{header2}</Col>
                    <Col className="col-box-18 text-center padding-top-sm">{header3}</Col>
                    <Col className="col-box-18 text-center padding-top-sm">Fourth-place</Col>
                </Row>
            </Col>
        </Row>
    )
}

const TournamentsTable = (props) => {
    const { tournaments, config } = props
    return (
        <React.Fragment>
            <TournamentsHeader config={config} />
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

        this.state = { competition: { tournaments: [] }, config: {} }
    }

    getData = () => {
        const competition = getCompetition(this.props.query.id)
        const is_olympic = competition.team_type_id.includes('U23')
        this.setState({ competition, config: { team_type_id: competition.team_type_id, is_olympic, teams: getTeams(competition.team_type_id) } })
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
        const { competition, config } = this.state
        const competitionConfig = { ...config, logo_path: competition.logo_path }
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
                            <TournamentsTable tournaments={competition.tournaments} config={competitionConfig} />
                        </Col>
                    </Row>
                </Container>
            </Page>
        )
    }
}

export default CompetitionApp
