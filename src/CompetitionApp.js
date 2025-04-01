import React, { useState } from 'react'
import { Container, Row, Col, TabContent, TabPane, Nav, NavLink } from 'reactstrap'
import classnames from 'classnames'
import { getTournamentTitleFont } from './core/Helper'
import { getTeams, getTeamFlagId, getTeamName } from './core/TeamHelper'
import { getCompetition } from './core/TournamentHelper'
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

const StandingsHeader = () => {
    return (
        <Row className="no-gutters ranking-tbl-header team-row padding-tb-md text-center">
            <Col className="col-box-5"></Col>
            <Col className="col-box-95">
                <Row>
                    <Col className="col-box-7"></Col>
                    <Col className="col-box-27"></Col>
                    <Col className="col-box-7">MP</Col>
                    <Col className="col-box-7">W</Col>
                    <Col className="col-box-7">D</Col>
                    <Col className="col-box-7">L</Col>
                    <Col className="col-box-7">GF</Col>
                    <Col className="col-box-7">GA</Col>
                    <Col className="col-box-7">+/-</Col>
                    <Col className="col-box-13">Pts</Col>
                </Row>
            </Col>
        </Row>
    )
}

const StandingsRow = (props) => {
    const { ranking, config } = props
    return (
        <Row className={`no-gutters ranking-tbl standing-row no-margin-bottom`}>
            <Col className="col-box-7 col-box-no-padding-lr text-end">{getTeamFlagId(ranking.id, config)}</Col>
            <Col className="col-box-27">{ranking.team.name}</Col>
            <Col className="col-box-7 text-center">{ranking.mp}</Col>
            <Col className="col-box-7 text-center">{ranking.w}</Col>
            <Col className="col-box-7 text-center">{ranking.d}</Col>
            <Col className="col-box-7 text-center">{ranking.l}</Col>
            <Col className="col-box-7 text-center">{ranking.gf}</Col>
            <Col className="col-box-7 text-center">{ranking.ga}</Col>
            <Col className="col-box-7 text-center">
                {ranking.gd > 0 ? '+' : ''}
                {ranking.gd}
            </Col>
            <Col className="col-box-13 text-center">{ranking.pts}</Col>
        </Row>
    )
}

const StandingsPools = (props) => {
    const { round, config } = props
    return (
        round.pools &&
        round.pools.map((p) => {
            const rankColPadding =
                p.rankings && p.rankings.length === 1 ? 'rank-col-padding2-1' : p.rankings.length === 2 ? 'rank-col-padding2-2' : 'rank-col-padding2-3'
            return (
                <React.Fragment key={p.pool_rank}>
                    <Row className={`mt-3 no-gutters ranking-tbl box-sm padding-tb-sm`}>
                        <Col className={`col-box-5 text-center ${rankColPadding}`}>{p.pool_rank}</Col>
                        <Col className="col-box-95">
                            {p.rankings.map((r) => {
                                return <StandingsRow key={r.id} ranking={r} config={config} />
                            })}
                        </Col>
                    </Row>
                </React.Fragment>
            )
        })
    )
}

const StandingsTable = (props) => {
    const { competition, config } = props
    return (
        <React.Fragment>
            <StandingsHeader />
            <StandingsPools round={competition} config={config} />
        </React.Fragment>
    )
}

const CompetitionTabs = (props) => {
    const { competition, config } = props
    const { tournaments } = competition
    const [activeTab, setActiveTab] = useState('All-time Standings')
    const toggle = (tab) => {
        if (activeTab !== tab) setActiveTab(tab)
    }

    return (
        <React.Fragment>
            <Nav tabs className="mt-4 mb-4">
                <NavLink
                    className={classnames({ active: activeTab === 'Tournament Results' })}
                    onClick={() => {
                        toggle('Tournament Results')
                    }}
                >
                    Tournament Results
                </NavLink>
                <NavLink
                    className={classnames({ active: activeTab === 'All-time Standings' })}
                    onClick={() => {
                        toggle('All-time Standings')
                    }}
                >
                    All-time Standings
                </NavLink>
            </Nav>
            <TabContent activeTab={activeTab}>
                <TabPane tabId="Tournament Results">
                    <TournamentsTable tournaments={tournaments} config={config} />
                </TabPane>
                <TabPane tabId="All-time Standings">
                    <StandingsTable competition={competition} config={config} />
                </TabPane>
            </TabContent>
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
                        <CompetitionTabs competition={competition} config={competitionConfig} />
                    </Row>
                </Container>
            </Page>
        )
    }
}

export default CompetitionApp
