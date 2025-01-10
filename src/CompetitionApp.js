import React from 'react'
import { Container, Row, Col } from 'reactstrap'
import { getTournamentTitleFont } from './core/Helper'
import { getTeams, getTeamFlagId, getCompetition, getTeamName } from './core/TeamHelper'
import { SharedBronzeTooltip, SemifinalistsTooltip, ShortNameTooltip } from './core/TooltipHelper'
import Page from './core/Page'

const TeamCell = (props) => {
    const { id, config } = props
    if (!id) return
    return (
        <React.Fragment>
            {getTeamFlagId(id, config)}
            <br></br>
            {getTeamName(id, config)}
        </React.Fragment>
    )
}

const BronzeCell = (props) => {
    const { id, config } = props
    if (config.shared_bronze) {
        return id.map((i) => {
            return (
                <React.Fragment key={i}>
                    <TeamCell id={i} config={config} />
                    <SharedBronzeTooltip target="sharedTooltip" notes={config.third_place_text} />
                    <br />
                </React.Fragment>
            )
        })
    } else if (config.is_semi_finalist1) {
        return (
            <React.Fragment>
                <TeamCell id={id} config={config} />
                {!config.all_semi_finalist && <SemifinalistsTooltip target={`semifinalist1Tooltip_${config.id}`} notes={config.semi_finalist_text} />}
                <br />
            </React.Fragment>
        )
    } else {
        return <TeamCell id={id} config={config} />
    }
}

const FourthCell = (props) => {
    const { id, config } = props
    if (config.is_semi_finalist2) {
        return (
            <React.Fragment>
                <TeamCell id={id} config={config} />
                {!config.all_semi_finalist && <SemifinalistsTooltip target={`semifinalist2Tooltip_${config.id}`} notes={config.semi_finalist_text} />}
                <br />
            </React.Fragment>
        )
    } else {
        return <TeamCell id={id} config={config} />
    }
}

const TournamentsRow = (props) => {
    const { tournament, config } = props
    const { short_name, short_name_tooltip, id, index, details, name, final_standings, shared_bronze, era } = tournament
    const row_highlight = index % 2 === 0 ? 'ltblue-striped' : ''
    const tournamentLogo = short_name && short_name ? 'tournament-logo-sm' : 'tournament-logo'
    const thirdPlace = final_standings && final_standings.third_place ? final_standings.third_place : final_standings.semi_finalist1
    const fourthPlace = final_standings && final_standings.fourth_place ? final_standings.fourth_place : final_standings.semi_finalist2
    const is_semi_finalist1 = final_standings.semi_finalist1 ? true : false
    const is_semi_finalist2 = final_standings.semi_finalist2 ? true : false
    const tournamentConfig = {
        ...config,
        id,
        shared_bronze,
        third_place_text: final_standings.third_place_text,
        is_semi_finalist1,
        is_semi_finalist2,
        semi_finalist_text: final_standings.semi_finalist_text,
    }
    return (
        <React.Fragment>
            {era && (
                <Row>
                    <Col>
                        <div className="h2-ff1 margin-tb-md">{era}</div>
                    </Col>
                </Row>
            )}
            <Row className="no-gutters ranking-tbl team-row padding-tb-xs text-start">
                <Col>
                    <div className="col-12">
                        <div className={`box-sm ${row_highlight}`}>
                            <Row className="no-gutters">
                                <Col className="col-box-4"></Col>
                                <Col className="col-box-4 text-center padding-top-lg">{index}</Col>
                                <Col className="col-box-20 text-center padding-tb-sm">
                                    {details.logo_filename && (
                                        <React.Fragment>
                                            <a href={`/tournament/${id}`}>
                                                <img
                                                    src={`/images/${config.logo_path}/${details.logo_filename}`}
                                                    alt={name}
                                                    title={name}
                                                    className={tournamentLogo}
                                                />
                                            </a>
                                            {short_name && (
                                                <p className="competition-tbl-short-name">
                                                    {short_name}{' '}
                                                    {short_name_tooltip && (
                                                        <ShortNameTooltip target="shortnameTooltip" content={short_name_tooltip} anchor="..." />
                                                    )}
                                                </p>
                                            )}
                                        </React.Fragment>
                                    )}
                                </Col>
                                <Col className="col-box-18 text-center padding-tb-md-2">
                                    {final_standings && <TeamCell id={final_standings.champions} config={config} />}
                                </Col>
                                <Col className="col-box-18 text-center padding-tb-md-2">
                                    {final_standings && <TeamCell id={final_standings.runners_up} config={config} />}
                                </Col>
                                <Col className="col-box-18 text-center padding-tb-md-2">
                                    {final_standings && <BronzeCell id={thirdPlace} config={tournamentConfig} />}
                                </Col>
                                <Col className="col-box-18 text-center padding-tb-md-2">
                                    {final_standings && <FourthCell id={fourthPlace} config={tournamentConfig} />}
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Col>
            </Row>
        </React.Fragment>
    )
}

const TournamentsHeader = (props) => {
    const { config } = props
    const header1 = config.is_olympic ? 'Gold Medalists' : 'Champions'
    const header2 = config.is_olympic ? 'Silver Medalists' : 'Runners-up'
    const header3 = config.is_olympic ? (
        'Bronze Medalists'
    ) : config.all_third_place_game ? (
        'Third place'
    ) : config.all_semi_finalist ? (
        <React.Fragment>
            Semi-finalist 1
            <SemifinalistsTooltip target={`semifinalist1Tooltip_${config.id}`} notes={config.all_semi_finalist_text} />
        </React.Fragment>
    ) : (
        <React.Fragment>
            Third place
            <br />/ Semi-finalist 1
        </React.Fragment>
    )
    const header4 =
        config.is_olympic || config.all_third_place_game ? (
            'Fourth place'
        ) : config.all_semi_finalist ? (
            <React.Fragment>
                Semi-finalist 2
                <SemifinalistsTooltip target={`semifinalist1Tooltip_${config.id}`} notes={config.all_semi_finalist_text} />
            </React.Fragment>
        ) : (
            <React.Fragment>
                Fourth place
                <br />/ Semi-finalist 2
            </React.Fragment>
        )
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
                    <Col className="col-box-18 text-center padding-top-sm">{header4}</Col>
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
        this.setState({
            competition,
            config: {
                team_type_id: competition.team_type_id,
                is_olympic,
                all_third_place_game: competition.all_third_place_game,
                all_semi_finalist: competition.all_semi_finalist,
                all_semi_finalist_text: competition.all_semi_finalist_text,
                teams: getTeams(competition.team_type_id, competition.all_members),
            },
        })
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
