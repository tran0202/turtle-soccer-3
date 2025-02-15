import React from 'react'
import { Row, Col } from 'reactstrap'
import { NumericFormat } from 'react-number-format'
import { getTeamFlagId, getPlayerFlagId, getTeamName, getCapLastName } from '../core/TeamHelper'
import { SharedBronzeTooltip, GoldenBallRejectedTooltip } from '../core/TooltipHelper'

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
    const adjustedHost = !host ? null : Array.isArray(host) ? host : host.teams
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
                        {adjustedHost && (
                            <li>
                                Hosted by{' '}
                                {adjustedHost.map((h, index) => {
                                    const h_id = typeof h === 'string' ? h : h.id
                                    return (
                                        <React.Fragment key={index}>
                                            {index !== 0 && index < adjustedHost.length - 1 ? ', ' : ''}
                                            {index !== 0 && index === adjustedHost.length - 1 ? ' and ' : ''}
                                            <b>{getTeamName(h_id, competition)}</b> {getTeamFlagId(h_id, competition)}
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
    const championIcon = label.includes('Champions') || label.includes('Gold')
    const runnersupIcon = label.includes('Runners-up') || label.includes('Silver')
    const fourthIcon = label.includes('Fourth')
    return (
        <React.Fragment>
            <Row className="margin-tb-sm margin-lr-sm">
                <Col className="box-sm">
                    <Row className="team-name">
                        <Col xs={{ size: 5 }} className="padding-tb-sm padding-left-lg">
                            {championIcon && <img className="award-icon margin-bottom-xs-4" src={'/images/awards/1st-place.png'} alt={`1st`} title={`1st`} />}
                            {runnersupIcon && <img className="award-icon margin-bottom-xs-4" src={'/images/awards/2nd-place.png'} alt={`2nd`} title={`2nd`} />}
                            {fourthIcon && <span className="padding-left-md-2"> </span>} <b>{label}</b>
                        </Col>
                        <Col xs={{ size: 7 }} className="padding-tb-sm padding-lr-md">
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
    const thirdIcon = label.includes('Third') || label.includes('Bronze')
    return (
        <React.Fragment>
            <Row className="margin-tb-sm margin-lr-sm">
                <Col className="box-sm">
                    <Row className="team-name">
                        <Col xs={{ size: 5 }} className="padding-tb-sm padding-left-lg">
                            {thirdIcon && <img className="award-icon margin-bottom-xs-4" src={'/images/awards/3rd-place.png'} alt={`3rd`} title={`3rd`} />}{' '}
                            <b>{label}</b>
                        </Col>
                        <Col xs={{ size: 7 }} className="padding-tb-sm padding-lr-md">
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
    const thirdPlaceLabel = is_olympic ? 'Bronze Medal' : 'Third place'
    return (
        <React.Fragment>
            <Row>
                <Col className="award-header">Final Standings</Col>
            </Row>
            <FinalStandingRow id={champions} label={championLabel} config={config} />
            <FinalStandingRow id={runners_up} label={runnnersupLabel} config={config} />
            {!is_semi_finalist1 && <BronzeRow id={third_place} label={thirdPlaceLabel} config={config} />}
            {!shared_bronze && !is_semi_finalist2 && is_fourth_place && <FinalStandingRow id={fourth_place} label="Fourth place" config={config} />}
        </React.Fragment>
    )
}

const FairPlayBlock = (props) => {
    const { id, label, config, highlighted } = props
    const { competition } = config
    return (
        <React.Fragment>
            {id.map((i, index) => (
                <Row key={index} className="margin-tb-sm margin-lr-sm">
                    <Col className={`box-sm ${highlighted ? 'ltblue-striped' : ''}`}>
                        <Row className="team-name">
                            <Col xs={{ size: 4 }} className="padding-tb-sm padding-left-lg">
                                {index === 0 && <span className="weight-medium padding-tb-xs padding-lr-sm">{label}</span>}
                            </Col>
                            <Col xs={{ size: 8 }} className="padding-tb-sm padding-lr-lg">
                                {getTeamFlagId(i, competition)} {getTeamName(i, competition)}
                            </Col>
                        </Row>
                    </Col>
                </Row>
            ))}
        </React.Fragment>
    )
}

const AwardRow = (props) => {
    const { index, label, award, highlighted, config } = props
    const { competition, awards } = config
    const { ball_label, boot_label, glove_label } = awards
    const { player, team, club, club2, goals, assists, minutes, rejected, rejected_notes } = award
    const isClubCompetition = competition.team_type_id === 'CLUB'
    const labelHighlighted =
        label.includes('Gold') || label.includes('BestPlayer') || label.includes('Scorer1')
            ? 'gold'
            : label.includes('Silver') || label.includes('Scorer2')
            ? 'silver'
            : label.includes('Bronze') || label.includes('Scorer3')
            ? 'bronze'
            : ''
    let convertedLabel = label
    if (ball_label) {
        convertedLabel = label.includes('Ball') ? ball_label : label
    }
    if (boot_label && label.includes('Boot')) {
        if (boot_label === 'Top goalscorer') {
            convertedLabel = label.includes('Gold') ? 'TopGoalscorer' : label.includes('Silver') ? 'Runner-up' : label.includes('Bronze') ? 'Third place' : ''
            if (label.includes('Boots')) {
                convertedLabel = label.includes('Gold')
                    ? 'TopGoalscorers'
                    : label.includes('Silver')
                    ? 'Runners-up'
                    : label.includes('Bronze')
                    ? 'Third places'
                    : ''
            }
        }
        if (boot_label === 'Top Scorer') {
            convertedLabel = label.includes('Gold') ? 'Top Scorer' : ''
            if (label.includes('Boots')) {
                convertedLabel = label.includes('Gold') ? 'Top Scorers' : ''
            }
        }
        if (boot_label === 'shoe') {
            convertedLabel = label.includes('Gold') ? 'Golden Shoe' : label.includes('Silver') ? 'Silver Shoe' : label.includes('Bronze') ? 'Bronze Shoe' : ''
            if (label.includes('Boots')) {
                convertedLabel = label.includes('Gold')
                    ? 'Golden Shoes'
                    : label.includes('Silver')
                    ? 'Silver Shoes'
                    : label.includes('Bronze')
                    ? 'Bronze Shoes'
                    : ''
            }
        }
    }
    if (glove_label && label.includes('Glove')) {
        convertedLabel = glove_label
        if (label.includes('Gloves')) {
            convertedLabel = convertedLabel.concat('s')
        }
    }
    return (
        <React.Fragment>
            <Row className="margin-tb-sm margin-lr-sm">
                <Col className={`box-sm ${highlighted ? 'ltblue-striped' : ''}`}>
                    <Row className="team-name">
                        <Col xs={{ size: 4 }} className="padding-top-sm-2 padding-bottom-sm padding-left-lg">
                            {index === 0 && (
                                <React.Fragment>
                                    <span className={`weight-medium padding-tb-xs padding-lr-sm ${labelHighlighted}`}>
                                        {convertedLabel}
                                        {(label.includes('Ball') || label.includes('BestPlayer')) && <i className="icofont-soccer"></i>}
                                        {(label.includes('Boot') || label.includes('Scorer')) && <i className="icofont-kick"></i>}
                                        {label.includes('Glove') && <i className="icofont-goal-keeper"></i>}
                                    </span>
                                </React.Fragment>
                            )}
                        </Col>
                        <Col xs={{ size: 8 }} className="padding-tb-sm padding-lr-lg">
                            {isClubCompetition ? getPlayerFlagId(club, club2, team, competition) : getTeamFlagId(team, competition)} {getCapLastName(player)}{' '}
                            {goals && (
                                <React.Fragment>
                                    ({goals} goals
                                    {assists && (
                                        <React.Fragment>
                                            , {assists} {assists === 1 ? 'assist' : 'assists'}
                                        </React.Fragment>
                                    )}
                                    {minutes && <React.Fragment>, {minutes} minutes</React.Fragment>})
                                </React.Fragment>
                            )}
                            {rejected && <GoldenBallRejectedTooltip target="goldenBallTooltip" notes={rejected_notes} />}
                        </Col>
                    </Row>
                </Col>
            </Row>
        </React.Fragment>
    )
}

const AwardBlock = (props) => {
    const { id, label, config, highlighted } = props
    return (
        <React.Fragment>
            {id.map((i, index) => (
                <AwardRow key={index} index={index} label={label} award={i} highlighted={highlighted} config={config} />
            ))}
        </React.Fragment>
    )
}

const FinalTopScorerCategory = (props) => {
    const { final_top_scorer1, final_top_scorer2, final_top_scorer3, highlighted, config } = props
    const final_top_scorer1_label = final_top_scorer1 && final_top_scorer1.length > 1 ? 'FinalTopScorers1' : 'FinalTopScorer1'
    const final_top_scorer2_label = final_top_scorer2 && final_top_scorer2.length > 1 ? 'FinalTopScorers2' : 'FinalTopScorer2'
    const final_top_scorer3_label = final_top_scorer3 && final_top_scorer3.length > 1 ? 'FinalTopScorers3' : 'FinalTopScorer3'
    return (
        <React.Fragment>
            {final_top_scorer1 && <AwardBlock id={final_top_scorer1} label={final_top_scorer1_label} highlighted={highlighted} config={config} />}
            {final_top_scorer2 && <AwardBlock id={final_top_scorer2} label={final_top_scorer2_label} highlighted={highlighted} config={config} />}
            {final_top_scorer3 && <AwardBlock id={final_top_scorer3} label={final_top_scorer3_label} highlighted={highlighted} config={config} />}
        </React.Fragment>
    )
}

const Category = (props) => {
    const { cat, label, labels, highlighted, config } = props
    const cat_label = cat && cat.length > 1 ? labels : label
    return <React.Fragment>{cat && <AwardBlock id={cat} label={cat_label} highlighted={highlighted} config={config} />}</React.Fragment>
}

const BootCategory = (props) => {
    const { golden_boot, silver_boot, bronze_boot, highlighted, config } = props
    const golden_boot_label = golden_boot && golden_boot.length > 1 ? 'Golden Boots' : 'Golden Boot'
    const silver_boot_label = silver_boot && silver_boot.length > 1 ? 'Silver Boots' : 'Silver Boot'
    const bronze_boot_label = bronze_boot && bronze_boot.length > 1 ? 'Bronze Boots' : 'Bronze Boot'
    return (
        <React.Fragment>
            {golden_boot && <AwardBlock id={golden_boot} label={golden_boot_label} highlighted={highlighted} config={config} />}
            {silver_boot && <AwardBlock id={silver_boot} label={silver_boot_label} highlighted={highlighted} config={config} />}
            {bronze_boot && <AwardBlock id={bronze_boot} label={bronze_boot_label} highlighted={highlighted} config={config} />}
        </React.Fragment>
    )
}

const BallCategory = (props) => {
    const { golden_ball, highlighted, config } = props
    return (
        <React.Fragment>
            {golden_ball && golden_ball.length > 0 && (
                <AwardRow index={0} award={golden_ball[0]} label="Golden Ball" highlighted={highlighted} config={config} />
            )}
            {golden_ball && golden_ball.length > 1 && (
                <AwardRow index={0} award={golden_ball[1]} label="Silver Ball" highlighted={highlighted} config={config} />
            )}
            {golden_ball && golden_ball.length > 2 && (
                <AwardRow index={0} award={golden_ball[2]} label="Bronze Ball" highlighted={highlighted} config={config} />
            )}
        </React.Fragment>
    )
}

const TournamentAwards = (props) => {
    const { config } = props
    const { awards } = config
    const {
        golden_boot,
        silver_boot,
        bronze_boot,
        golden_ball,
        best_young_player,
        golden_glove,
        fair_play_team,
        final_best_player,
        final_top_scorer1,
        final_top_scorer2,
        final_top_scorer3,
        final_best_young_player,
        best_defender,
        best_midfielder,
        best_forward,
        award_category_highlighted,
    } = awards
    const is_ball_highlighted = award_category_highlighted && award_category_highlighted.includes('ball')
    const is_boot_highlighted = award_category_highlighted && award_category_highlighted.includes('boot')
    const is_glove_highlighted = award_category_highlighted && award_category_highlighted.includes('glove')
    const is_young_highlighted = award_category_highlighted && award_category_highlighted.includes('young')
    const is_fair_highlighted = award_category_highlighted && award_category_highlighted.includes('fair')
    const is_final_ball_highlighted = award_category_highlighted && award_category_highlighted.includes('final_ball')
    const is_final_boot_highlighted = award_category_highlighted && award_category_highlighted.includes('final_boot')
    const is_final_young_highlighted = award_category_highlighted && award_category_highlighted.includes('final_young')
    const is_best_defender_highlighted = award_category_highlighted && award_category_highlighted.includes('defender')
    const is_best_midfielder_highlighted = award_category_highlighted && award_category_highlighted.includes('midfielder')
    const is_best_forward_highlighted = award_category_highlighted && award_category_highlighted.includes('forward')
    return (
        <React.Fragment>
            <Row>
                <Col className="award-header">Tournament Awards</Col>
            </Row>
            <BallCategory golden_ball={golden_ball} highlighted={is_ball_highlighted} config={config} />
            <BootCategory golden_boot={golden_boot} silver_boot={silver_boot} bronze_boot={bronze_boot} highlighted={is_boot_highlighted} config={config} />
            {golden_glove && <Category cat={golden_glove} label="'Golden Glove" labels="'Golden Gloves" highlighted={is_glove_highlighted} config={config} />}
            {best_young_player && <AwardRow index={0} award={best_young_player} label="BestYoungPlayer" highlighted={is_young_highlighted} config={config} />}
            {fair_play_team && <FairPlayBlock id={fair_play_team} label="Fair Play" highlighted={is_fair_highlighted} config={config} />}
            {final_best_player && (
                <Category cat={final_best_player} label="FinalBestPlayer" labels="FinalBestPlayers" highlighted={is_final_ball_highlighted} config={config} />
            )}
            <FinalTopScorerCategory
                final_top_scorer1={final_top_scorer1}
                final_top_scorer2={final_top_scorer2}
                final_top_scorer3={final_top_scorer3}
                highlighted={is_final_boot_highlighted}
                config={config}
            />
            {final_best_young_player && (
                <Category
                    cat={final_best_young_player}
                    label="FinalYoungPlayer"
                    labels="FinalYoungPlayers"
                    highlighted={is_final_young_highlighted}
                    config={config}
                />
            )}
            {best_defender && (
                <Category cat={best_defender} label="Best Defender" labels="Best Defenders" highlighted={is_best_defender_highlighted} config={config} />
            )}
            {best_midfielder && (
                <Category
                    cat={best_midfielder}
                    label="Best Midfielder"
                    labels="Best Midfielders"
                    highlighted={is_best_midfielder_highlighted}
                    config={config}
                />
            )}
            {best_forward && (
                <Category cat={best_forward} label="Best Forward" labels="Best Forwards" highlighted={is_best_forward_highlighted} config={config} />
            )}
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
                        <TournamentDetails config={config} />
                    </Col>
                </Row>
                <Row className="mt-4 mb-4">
                    <Col xs={{ size: 5 }} className="award-box">
                        <FinalStandings config={config} />
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
