import React from 'react'
import { Row, Col } from 'reactstrap'
import { NumericFormat } from 'react-number-format'
import { getTeamFlagId, getTeamName } from '../core/TeamHelper'
import { SharedBronzeTooltip } from '../core/TooltipHelper'

const HeroCarousel = (props) => {
    const { images, id } = props
    return (
        <React.Fragment>
            {images && (
                <div id="hero-md" className="carousel slide carousel-fade" data-bs-ride="carousel">
                    <div className="carousel-indicators">
                        {images.map((i, index) => (
                            <button
                                key={index}
                                type="button"
                                data-bs-target="#hero-md"
                                data-bs-slide-to={index}
                                className={`${index === 0 ? 'active' : ''}`}
                                // eslint-disable-next-line jsx-a11y/aria-proptypes
                                aria-current={`${index === 0 ? 'true' : ''}`}
                                aria-label={`Slide ${index + 1}`}
                            />
                        ))}
                    </div>
                    <div className="carousel-inner">
                        {images.map((i, index) => (
                            <div
                                key={index}
                                className={`carousel-item${index === 0 ? ' carousel-item-md active' : ' carousel-item-md'}`}
                                style={{
                                    backgroundImage: `url('/images/tournaments/${id}/${i.filename}')`,
                                    backgroundSize: 'contain',
                                    backgroundColor: '#b3b2b2',
                                }}
                            >
                                <div className="carousel-container">
                                    <div className="carousel-content container">
                                        <h2 className="animated fadeInDown h2-ff8">{i.name}</h2>
                                        <p className="animated fadeInUp">{i.text}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#hero-md" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon icofont-rounded-left" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#hero-md" data-bs-slide="next">
                        <span className="carousel-control-next-icon icofont-rounded-right" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            )}
        </React.Fragment>
    )
}

const TournamentDetails = (props) => {
    const { config } = props
    const { details, competition, statistics, name } = config
    const {
        slogan,
        host,
        team_count,
        confed_count,
        venue_count,
        city_count,
        final_host,
        final_team_count,
        final_venue_count,
        final_city_count,
        competition_team_count,
        transfer_team_count,
        total_team_count,
        total_transfer_team_count,
        association_count,
        mascot,
        mascot_height,
        mascot_filename,
    } = details
    const { total_matches, total_goals, attendance, final_matches, final_goals, final_attendance } = statistics
    const { logo_path } = competition
    return (
        <React.Fragment>
            <Row>
                <Col>
                    <ul className="no-margin-bottom text-start">
                        {slogan && (
                            <li>
                                <i>"{slogan}"</i>
                            </li>
                        )}
                        {host && (
                            <li>
                                Hosted by{' '}
                                {host.map((h, index) => {
                                    return (
                                        <React.Fragment key={index}>
                                            {index !== 0 && index < host.length - 1 ? ', ' : ''}
                                            {index !== 0 && index === host.length - 1 ? ' and ' : ''}
                                            <b>{getTeamName(h, competition)}</b> {getTeamFlagId(h, competition)}
                                        </React.Fragment>
                                    )
                                })}
                            </li>
                        )}
                        {team_count && (
                            <li>
                                <b>{team_count}</b> teams qualified
                                {confed_count && (
                                    <React.Fragment>
                                        , from <b>{confed_count}</b> {confed_count > 1 ? 'confederations' : 'confederation'}
                                    </React.Fragment>
                                )}
                            </li>
                        )}
                        {venue_count && (
                            <li>
                                Played in <b>{venue_count}</b> {venue_count > 1 ? 'stadiums' : 'stadium'} of <b>{city_count}</b> host{' '}
                                {city_count > 1 ? 'cities' : 'city'}
                            </li>
                        )}
                        {competition_team_count && (
                            <React.Fragment>
                                <li>
                                    <b>{total_team_count}</b> teams
                                    {total_transfer_team_count ? (
                                        <React.Fragment>
                                            , plus <b>{total_transfer_team_count}</b> transferred from UCL,
                                        </React.Fragment>
                                    ) : (
                                        ''
                                    )}{' '}
                                    from <b>{association_count}</b> associations participated
                                </li>
                                <li>
                                    <b>{competition_team_count}</b> teams
                                    {transfer_team_count ? (
                                        <React.Fragment>
                                            , plus <b>{transfer_team_count}</b> transferred from UCL,
                                        </React.Fragment>
                                    ) : (
                                        ''
                                    )}{' '}
                                    qualified for the competition group stage
                                </li>
                            </React.Fragment>
                        )}
                        {statistics && total_matches && (
                            <React.Fragment>
                                <li>
                                    Total of <b>{total_matches}</b> matches were played
                                </li>
                                <li>
                                    Total of <b>{total_goals}</b> goals were scored (
                                    <b>
                                        <NumericFormat displayType="text" value={total_goals / total_matches} decimalScale={2} fixedDecimalScale />
                                    </b>{' '}
                                    per match)
                                </li>
                                {attendance && (
                                    <li>
                                        <b>
                                            <NumericFormat displayType="text" value={attendance} decimalScale={0} thousandSeparator="," />
                                        </b>{' '}
                                        in attendance (
                                        <b>
                                            <NumericFormat displayType="text" value={attendance / total_matches} decimalScale={0} thousandSeparator="," />
                                        </b>{' '}
                                        per match)
                                    </li>
                                )}
                            </React.Fragment>
                        )}
                        {final_host && (
                            <li>
                                <b>Finals</b> hosted by{' '}
                                {final_host.map((h, index) => {
                                    return (
                                        <React.Fragment key={index}>
                                            {index !== 0 && index < final_host.length - 1 ? ', ' : ''}
                                            {index !== 0 && index === final_host.length - 1 ? ' and ' : ''}
                                            <b>{getTeamName(h, competition)}</b> {getTeamFlagId(h, competition)}
                                        </React.Fragment>
                                    )
                                })}
                            </li>
                        )}
                        {final_team_count && (
                            <li>
                                <b>{final_team_count}</b> teams qualified for the <b>Finals</b>
                            </li>
                        )}
                        {final_venue_count && (
                            <li>
                                <b>Finals</b> played in <b>{final_venue_count}</b> {final_venue_count > 1 ? 'stadiums' : 'stadium'} of <b>{final_city_count}</b>{' '}
                                host {final_city_count > 1 ? 'cities' : 'city'}
                            </li>
                        )}
                        {statistics && final_matches && (
                            <React.Fragment>
                                <li>
                                    <b>{final_matches} Finals</b> matches were played
                                </li>
                                <li>
                                    <b>{final_goals} Finals</b> goals were scored (
                                    <b>
                                        <NumericFormat displayType="text" value={final_goals / final_matches} decimalScale={2} fixedDecimalScale />
                                    </b>{' '}
                                    per match)
                                </li>
                                {attendance && (
                                    <li>
                                        <b>
                                            <NumericFormat displayType="text" value={final_attendance} decimalScale={0} thousandSeparator="," />
                                        </b>{' '}
                                        in <b>Finals</b> attendance (
                                        <b>
                                            <NumericFormat displayType="text" value={final_attendance / final_matches} decimalScale={0} thousandSeparator="," />
                                        </b>{' '}
                                        per match)
                                    </li>
                                )}
                            </React.Fragment>
                        )}
                    </ul>
                </Col>
            </Row>
            <Row>
                {!mascot_height && (
                    <React.Fragment>
                        <Col xs={{ size: 6, offset: 1 }} className="mt-3">
                            {mascot_filename && (
                                <img
                                    src={`/images/${logo_path}/${mascot_filename}`}
                                    alt={`${name} mascot`}
                                    title={`${name} mascot`}
                                    className="tournament-mascot"
                                />
                            )}
                        </Col>
                        <Col xs={{ size: 4 }} className="padding-top-xxl no-padding-lr text-start">
                            <b>{mascot}</b>
                        </Col>
                    </React.Fragment>
                )}
                {mascot_height && (
                    <React.Fragment>
                        <Col xs={{ size: 10, offset: 1 }} className="mt-3">
                            {mascot_filename && (
                                <React.Fragment>
                                    <img
                                        src={`/images/${logo_path}/${mascot_filename}`}
                                        alt={`${name} mascot`}
                                        title={`${name} mascot`}
                                        className="tournament-mascot"
                                        style={{
                                            height: `${mascot_height}`,
                                        }}
                                    />
                                    <br />
                                    <b>{mascot}</b>
                                </React.Fragment>
                            )}
                        </Col>
                    </React.Fragment>
                )}
            </Row>
        </React.Fragment>
    )
}

const FinalStandingRow = (props) => {
    const { id, label, config } = props
    const { competition } = config
    return (
        <React.Fragment>
            <Row className="margin-tb-sm margin-lr-sm">
                <Col className="box-sm">
                    <Row className="team-name">
                        <Col xs={{ size: 4 }} className="padding-tb-sm padding-left-lg">
                            <b>{label}</b>
                        </Col>
                        <Col xs={{ size: 8 }} className="padding-tb-sm padding-lr-lg">
                            {getTeamFlagId(id, competition)} {getTeamName(id, competition)}
                        </Col>
                    </Row>
                </Col>
            </Row>
        </React.Fragment>
    )
}

const BronzeRow = (props) => {
    const { id, label, config } = props
    const { competition, final_standings, shared_bronze } = config
    const { third_place_text } = final_standings
    return (
        <React.Fragment>
            <Row className="margin-tb-sm margin-lr-sm">
                <Col className="box-sm">
                    <Row className="team-name">
                        <Col xs={{ size: 4 }} className="padding-tb-sm padding-left-lg">
                            <b>{label}</b>
                        </Col>
                        <Col xs={{ size: 8 }} className="padding-tb-sm padding-lr-lg">
                            {!shared_bronze && (
                                <React.Fragment>
                                    {getTeamFlagId(id, competition)} {getTeamName(id, competition)}
                                </React.Fragment>
                            )}
                            {shared_bronze &&
                                id.map((i) => {
                                    return (
                                        <React.Fragment key={i}>
                                            {getTeamFlagId(i, competition)} {getTeamName(i, competition)}
                                            <SharedBronzeTooltip target={`sharedTooltip${i}`} notes={third_place_text} />
                                            <br />
                                        </React.Fragment>
                                    )
                                })}
                        </Col>
                    </Row>
                </Col>
            </Row>
        </React.Fragment>
    )
}

const FinalStandings = (props) => {
    const { config } = props
    const { final_standings, competition, shared_bronze } = config
    const { champions, runners_up, third_place, fourth_place } = final_standings
    const is_olympic = competition.team_type_id.includes('U23')
    const is_semi_finalist1 = final_standings.semi_finalist1 ? true : false
    const is_semi_finalist2 = final_standings.semi_finalist2 ? true : false
    const is_fourth_place = final_standings.fourth_place ? true : false
    const championLabel = is_olympic ? 'Gold Medal' : 'Champions'
    const runnnersupLabel = is_olympic ? 'Silver Medal' : 'Runners-up'
    const thirdPlaceLabel = is_olympic ? 'Bronze Medal' : 'Third-place'
    return (
        <React.Fragment>
            <Row>
                <Col className="award-header">Final Standings</Col>
            </Row>
            <FinalStandingRow id={champions} label={championLabel} config={config} />
            <FinalStandingRow id={runners_up} label={runnnersupLabel} config={config} />
            {!is_semi_finalist1 && <BronzeRow id={third_place} label={thirdPlaceLabel} config={config} />}
            {!shared_bronze && !is_semi_finalist2 && is_fourth_place && <FinalStandingRow id={fourth_place} label="Fourth-place" config={config} />}
        </React.Fragment>
    )
}

const TournamentAwards = (props) => {
    return (
        <React.Fragment>
            <Row>
                <Col className="award-header">Tournament Awards</Col>
            </Row>
        </React.Fragment>
    )
}

class Awards extends React.Component {
    render() {
        const { tournament, config } = this.props
        const { hero_images, id } = config
        return (
            <React.Fragment>
                <Row className="mt-4 mb-4">
                    <Col xs={{ size: 7 }}>
                        <HeroCarousel images={hero_images} id={id} />
                    </Col>
                    <Col className="competition-box">
                        <TournamentDetails tournament={tournament} config={config} />
                    </Col>
                </Row>
                <Row className="mt-4 mb-4">
                    <Col xs={{ size: 5 }} className="award-box">
                        <FinalStandings tournament={tournament} config={config} />
                    </Col>
                    <Col className="award-box">
                        <TournamentAwards tournament={tournament} config={config} />
                    </Col>
                </Row>
            </React.Fragment>
        )
    }
}

export default Awards
