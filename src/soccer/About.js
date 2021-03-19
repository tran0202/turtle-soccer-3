import React from 'react'
import Qualified from './Qualified'
import { getFlagSrc, getNationSmallFlagImg, getClubLogoImg, getTeamFlagName, isWinner, SharedBronzeTooltip, GoldenBallRejectedTooltip } from './Helper'
import { Row, Col } from 'reactstrap'
import moment from 'moment'
import NumberFormat from 'react-number-format'

const findFinalStandings = (tournament) => {
  if (!tournament.stages) {
    return {}
  }
  const koStage = tournament.stages.find((s) => s.type === 'knockout')
  if (koStage && koStage.rounds) {
    const final = koStage.rounds.find((r) => r.name === 'Final')
    const third_place_game = koStage.rounds.find((r) => r.name === 'Third-place')
    let champions, runners_up, third_place, fourth_place
    if (final && final.matches) {
      if (isWinner('H', final.matches[0])) {
        champions = final.matches[0].home_team
        runners_up = final.matches[0].away_team
      } else if (isWinner('A', final.matches[0])) {
        champions = final.matches[0].away_team
        runners_up = final.matches[0].home_team
      }
    }
    if (third_place_game && third_place_game.matches) {
      if (isWinner('H', third_place_game.matches[0])) {
        third_place = third_place_game.matches[0].home_team
        fourth_place = third_place_game.matches[0].away_team
      } else if (isWinner('A', third_place_game.matches[0])) {
        third_place = third_place_game.matches[0].away_team
        fourth_place = third_place_game.matches[0].home_team
      }
    }
    return { fs1: champions, fs2: runners_up, fs3: third_place, fs4: fourth_place }
  }
  return {}
}

const getGoldenBootDetails = (player) => {
  let details = ``
  details = player.goals ? `(${player.goals} goals)` : details
  if (player.assists && player.minutes) {
    details = `(${player.goals} goals, ${player.assists} assists, ${player.minutes} minutes)`
  } else if (player.assists && !player.minutes) {
    details = `(${player.goals} goals, ${player.assists} assists)`
  } else if (!player.assists && player.minutes) {
    details = `(${player.goals} goals, ${player.minutes} minutes)`
  }
  return details
}

const getTopScorerLabel = (tournament, position) => {
  // console.log('tournament', tournament)
  if (!tournament.year || !tournament.tournament_type_id || !tournament.awards || !position) return
  if (position === 1) {
    if (!tournament.awards.golden_boot) return
    if (tournament.tournament_type_id === 'WC') {
      if (tournament.year <= '1978') {
        return tournament.awards.golden_boot.length > 1 ? 'Top scorers' : 'Top scorer'
      } else if (tournament.year <= '2006') {
        return tournament.awards.golden_boot.length > 1 ? 'Golden Shoes' : 'Golden Shoe'
      }
      return 'Golden Boot'
    } else if (tournament.tournament_type_id === 'MOFT' || tournament.tournament_type_id === 'WOFT' || tournament.tournament_type_id === 'AFCON') {
      return tournament.awards.golden_boot.length > 1 ? 'Top scorers' : 'Top scorer'
    }
    return 'Golden Boot'
  } else if (position === 2) {
    if (!tournament.awards.silver_boot) return
    if (tournament.tournament_type_id === 'WC') {
      if (tournament.year <= '1978') {
        return tournament.awards.silver_boot.length > 1 ? 'Runners-up' : 'Runner-up'
      } else if (tournament.year <= '2006') {
        return tournament.awards.silver_boot.length > 1 ? 'Silver Shoes' : 'Silver Shoe'
      }
      return 'Silver Boot'
    }
    return 'Silver Boot'
  } else {
    if (!tournament.awards.bronze_boot) return
    if (tournament.tournament_type_id === 'WC') {
      if (tournament.year <= '1978') {
        return 'Third-place'
      } else if (tournament.year <= '2006') {
        return tournament.awards.bronze_boot.length > 1 ? 'Bronze Shoes' : 'Bronze Shoe'
      }
      return 'Bronze Boot'
    }
    return 'Bronze Boot'
  }
}

const getGoldenBallLabel = (tournament) => {
  if (tournament.tournament_type_id === 'EURO') {
    return 'Player of the Tournament'
  } else if (tournament.tournament_type_id === 'AFCON') {
    return 'Man of the Competition'
  }
  return 'Golden Ball'
}

const getGoldenGloveLabel = (tournament) => {
  if (tournament.tournament_type_id === 'AFCON') {
    return 'Best Goalkeeper'
  }
  return 'Golden Glove'
}

const getPlayerClubNationName = (p, config) => {
  if (!p) return
  return (
    <React.Fragment>
      {config.team_type_id === 'CLUB' && (
        <React.Fragment>
          {!p.club2 && getClubLogoImg(p.club, config)}
          {p.club2 && (
            <React.Fragment>
              [{getClubLogoImg(p.club, config)}/{getClubLogoImg(p.club2, config)}]
            </React.Fragment>
          )}
          {getNationSmallFlagImg(p.team)}
        </React.Fragment>
      )}
      {config.team_type_id !== 'CLUB' && p.team && <img className="flag-sm flag-md " src={getFlagSrc(p.team)} alt={p.team} title={p.team} />}
      <span className="padding-top-xs">
        &nbsp;{p.player} {getGoldenBootDetails(p)}
      </span>
    </React.Fragment>
  )
}

const About = (props) => {
  const { tournament, tournamentType } = props
  const { id, hero_images, details, final_standings, statistics, awards, qualified, tournament_type_id, original_name } = tournament
  if (!details) return null
  const {
    host,
    team_count,
    confed_count,
    venue_count,
    city_count,
    final_host,
    start_date,
    end_date,
    start_league_date,
    end_league_date,
    start_final_date,
    end_final_date,
    start_relegation_date,
    end_relegation_date,
    start_qualifying_date,
    end_qualifying_date,
    start_competition_date,
    end_competition_date,
    final_team_count,
    final_venue_count,
    final_city_count,
    tournament_team_count,
    transfer_team_count,
    total_team_count,
    total_transfer_team_count,
    association_count,
  } = details
  const { fs1, fs2, fs3, fs4 } = findFinalStandings(tournament)
  const champions = fs1 ? fs1 : final_standings ? final_standings.champions : null
  const runners_up = fs2 ? fs2 : final_standings ? final_standings.runners_up : null
  const third_place = fs3 ? fs3 : final_standings ? final_standings.third_place : null
  const fourth_place = fs4 ? fs4 : final_standings ? final_standings.fourth_place : null
  // console.log('champions', champions)
  return (
    <React.Fragment>
      {hero_images && (
        <section id="hero" className="mt-3">
          <div className="hero-container">
            <div id="heroCarousel" className="carousel slide carousel-fade" data-ride="carousel">
              <ol className="carousel-indicators" id="hero-carousel-indicators"></ol>
              <div className="carousel-inner" role="listbox">
                {hero_images &&
                  hero_images.map((i, index) => (
                    <div
                      key={index}
                      className={`carousel-item${index === 0 ? ' active' : ''}`}
                      style={{
                        backgroundImage: `url('/assets/images/soccer/tournaments/${id}/${i.filename}')`,
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
              <a className="carousel-control-prev" href="#heroCarousel" role="button" data-slide="prev">
                <span className="carousel-control-prev-icon icofont-rounded-left" aria-hidden="true"></span>
                <span className="sr-only">Previous</span>
              </a>
              <a className="carousel-control-next" href="#heroCarousel" role="button" data-slide="next">
                <span className="carousel-control-next-icon icofont-rounded-right" aria-hidden="true"></span>
                <span className="sr-only">Next</span>
              </a>
            </div>
          </div>
        </section>
      )}
      <Row className="mt-3">
        <Col lg={{ size: 8, offset: 4 }} md={{ size: 9, offset: 3 }} sm={{ size: 10, offset: 2 }}>
          <h2 className="h2-ff5 mt-3">Tournament details</h2>
        </Col>
        <Col sm={{ size: 10, offset: 1 }}>
          {original_name && (
            <Row className="margin-top-xs">
              <Col lg={{ size: 3, offset: 3 }} md={{ size: 4, offset: 2 }} sm="5" className="font-weight-bold">
                Original Name
              </Col>
              <Col md="6" sm="7">
                {original_name}
              </Col>
            </Row>
          )}
          {host && (
            <Row className="margin-top-xs">
              <Col lg={{ size: 3, offset: 3 }} md={{ size: 4, offset: 2 }} sm="5" className="font-weight-bold">
                Host
              </Col>
              <Col md="6" sm="7">
                {host.map((h) => (
                  <Row className="no-margin-lr margin-bottom-xs" key={h}>
                    {getTeamFlagName(h, tournamentType)}
                  </Row>
                ))}
              </Col>
            </Row>
          )}
          {final_host && (
            <Row className="margin-top-xs">
              <Col lg={{ size: 3, offset: 3 }} md={{ size: 4, offset: 2 }} sm="5" className="font-weight-bold">
                Final Host
              </Col>
              <Col md="6" sm="7">
                {final_host.map((fh) => (
                  <Row className="no-margin-lr margin-bottom-xs" key={fh}>
                    {getTeamFlagName(fh, tournamentType)}
                  </Row>
                ))}
              </Col>
            </Row>
          )}
          {start_date && (
            <Row className="margin-top-xs">
              <Col lg={{ size: 3, offset: 3 }} md={{ size: 4, offset: 2 }} sm="5" className="font-weight-bold">
                Dates
              </Col>
              <Col md="6" sm="7">
                {start_date ? moment(start_date).format('MMMM D, YYYY') : ''} &mdash;&nbsp;
                {end_date ? moment(end_date).format('MMMM D, YYYY') : ''}
              </Col>
            </Row>
          )}
          {start_league_date && (
            <Row className="margin-top-xs">
              <Col lg={{ size: 3, offset: 3 }} md={{ size: 4, offset: 2 }} sm="5" className="font-weight-bold">
                League Phase
              </Col>
              <Col md="6" sm="7">
                {start_league_date ? moment(start_league_date).format('MMMM D, YYYY') : ''} &mdash;&nbsp;
                {end_league_date ? moment(end_league_date).format('MMMM D, YYYY') : ''}
              </Col>
            </Row>
          )}
          {start_final_date && (
            <Row className="margin-top-xs">
              <Col lg={{ size: 3, offset: 3 }} md={{ size: 4, offset: 2 }} sm="5" className="font-weight-bold">
                Nations League Finals
              </Col>
              <Col md="6" sm="7">
                {start_final_date ? moment(start_final_date).format('MMMM D, YYYY') : ''} &mdash;&nbsp;
                {end_final_date ? moment(end_final_date).format('MMMM D, YYYY') : ''}
              </Col>
            </Row>
          )}
          {start_relegation_date && (
            <Row className="margin-top-xs">
              <Col lg={{ size: 3, offset: 3 }} md={{ size: 4, offset: 2 }} sm="5" className="font-weight-bold">
                Relegation play-outs:
              </Col>
              <Col md="6" sm="7">
                {start_relegation_date ? moment(start_relegation_date).format('MMMM D, YYYY') : ''} &mdash;&nbsp;
                {end_relegation_date ? moment(end_relegation_date).format('MMMM D, YYYY') : ''}
              </Col>
            </Row>
          )}
          {start_qualifying_date && (
            <Row className="margin-top-xs">
              <Col lg={{ size: 3, offset: 3 }} md={{ size: 4, offset: 2 }} sm="5" className="font-weight-bold">
                Qualifying Dates:
              </Col>
              <Col md="6" sm="7">
                {start_qualifying_date ? moment(start_qualifying_date).format('MMMM D, YYYY') : ''} &mdash;&nbsp;
                {end_qualifying_date ? moment(end_qualifying_date).format('MMMM D, YYYY') : ''}
              </Col>
            </Row>
          )}
          {start_competition_date && (
            <Row className="margin-top-xs">
              <Col lg={{ size: 3, offset: 3 }} md={{ size: 4, offset: 2 }} sm="5" className="font-weight-bold">
                Competition Dates:
              </Col>
              <Col md="6" sm="7">
                {start_competition_date ? moment(start_competition_date).format('MMMM D, YYYY') : ''} &mdash;&nbsp;
                {end_competition_date ? moment(end_competition_date).format('MMMM D, YYYY') : ''}
              </Col>
            </Row>
          )}
          {team_count && (
            <Row className="margin-top-xs">
              <Col lg={{ size: 3, offset: 3 }} md={{ size: 4, offset: 2 }} sm="5" className="font-weight-bold">
                Teams
              </Col>
              <Col md="6" sm="7">
                {team_count}&nbsp;
                {confed_count && (
                  <React.Fragment>
                    (from {confed_count} confederation{confed_count !== 1 ? 's' : ''})
                  </React.Fragment>
                )}
              </Col>
            </Row>
          )}
          {tournament_team_count && (
            <Row className="margin-top-xs">
              <Col lg={{ size: 3, offset: 3 }} md={{ size: 4, offset: 2 }} sm="5" className="font-weight-bold">
                Competition Teams
              </Col>
              <Col md="6" sm="7">
                {tournament_team_count}&nbsp;
                {transfer_team_count && <React.Fragment>+ {transfer_team_count} (transferred from UCL)</React.Fragment>}
              </Col>
            </Row>
          )}
          {final_team_count && (
            <Row className="margin-top-xs">
              <Col lg={{ size: 3, offset: 3 }} md={{ size: 4, offset: 2 }} sm="5" className="font-weight-bold">
                Final Teams
              </Col>
              <Col md="6" sm="7">
                {final_team_count}&nbsp;
              </Col>
            </Row>
          )}
          {total_team_count && (
            <Row className="margin-top-xs">
              <Col lg={{ size: 3, offset: 3 }} md={{ size: 4, offset: 2 }} sm="5" className="font-weight-bold">
                Total Teams
              </Col>
              <Col md="6" sm="7">
                {total_team_count}&nbsp;
                {total_transfer_team_count && <React.Fragment>+ {total_transfer_team_count} (transferred from UCL)&nbsp;</React.Fragment>}
                {association_count && (
                  <React.Fragment>
                    (from {association_count} association{association_count !== 1 ? 's' : ''})
                  </React.Fragment>
                )}
              </Col>
            </Row>
          )}
          {venue_count && (
            <Row className="margin-top-xs">
              <Col lg={{ size: 3, offset: 3 }} md={{ size: 4, offset: 2 }} sm="5" className="font-weight-bold">
                Venues
              </Col>
              <Col md="6" sm="7">
                {venue_count} (in {city_count} host cit{city_count !== 1 ? 'ies' : 'y'})
              </Col>
            </Row>
          )}
          {final_venue_count && (
            <Row className="margin-top-xs">
              <Col lg={{ size: 3, offset: 3 }} md={{ size: 4, offset: 2 }} sm="5" className="font-weight-bold">
                Final Venues
              </Col>
              <Col md="6" sm="7">
                {final_venue_count} (in {final_city_count} host cit{final_city_count !== 1 ? 'ies' : 'y'})
              </Col>
            </Row>
          )}
        </Col>
        {champions && (
          <Col lg={{ size: 8, offset: 4 }} md={{ size: 9, offset: 3 }} sm={{ size: 10, offset: 2 }}>
            <h2 className="h2-ff5 mt-3">Final Standings</h2>
          </Col>
        )}
        <Col sm={{ size: 10, offset: 1 }}>
          {champions && (
            <Row className="margin-top-xs">
              <Col lg={{ size: 3, offset: 3 }} md={{ size: 4, offset: 2 }} sm="5" className="font-weight-bold">
                {tournament_type_id === 'MOFT' || tournament_type_id === 'WOFT' ? (
                  <React.Fragment>Gold medal</React.Fragment>
                ) : (
                  <React.Fragment>Champions</React.Fragment>
                )}
              </Col>
              <Col md="6" sm="7">
                {getTeamFlagName(champions, tournamentType)}
              </Col>
            </Row>
          )}
          {runners_up && (
            <Row className="margin-top-xs">
              <Col lg={{ size: 3, offset: 3 }} md={{ size: 4, offset: 2 }} sm="5" className="font-weight-bold">
                {tournament_type_id === 'MOFT' || tournament_type_id === 'WOFT' ? (
                  <React.Fragment>Silver medal</React.Fragment>
                ) : (
                  <React.Fragment>Runners-up</React.Fragment>
                )}
              </Col>
              <Col md="6" sm="7">
                {getTeamFlagName(runners_up, tournamentType)}
              </Col>
            </Row>
          )}
          {third_place && (
            <Row className="margin-top-xs">
              <Col lg={{ size: 3, offset: 3 }} md={{ size: 4, offset: 2 }} sm="5" className="font-weight-bold">
                {tournament_type_id === 'MOFT' || tournament_type_id === 'WOFT' ? (
                  <React.Fragment>Bronze medal</React.Fragment>
                ) : (
                  <React.Fragment>Third-place</React.Fragment>
                )}
              </Col>
              <Col md="6" sm="7">
                {typeof third_place === 'string' && <React.Fragment>{getTeamFlagName(third_place, tournamentType)}</React.Fragment>}
                {typeof third_place === 'object' && (
                  <React.Fragment>
                    {getTeamFlagName(third_place[0], tournamentType)}
                    <SharedBronzeTooltip target="sharedTooltip" notes={final_standings.third_place_text} />
                    <br></br>
                    {getTeamFlagName(third_place[1], tournamentType)}
                    <SharedBronzeTooltip target="sharedTooltip" notes={final_standings.third_place_text} />
                  </React.Fragment>
                )}
              </Col>
            </Row>
          )}
          {fourth_place && (
            <Row className="margin-top-xs">
              <Col lg={{ size: 3, offset: 3 }} md={{ size: 4, offset: 2 }} sm="5" className="font-weight-bold">
                Fourth-place
              </Col>
              <Col md="6" sm="7">
                {getTeamFlagName(fourth_place, tournamentType)}
              </Col>
            </Row>
          )}
        </Col>
        {statistics && (
          <React.Fragment>
            <Col lg={{ size: 8, offset: 4 }} md={{ size: 9, offset: 3 }} sm={{ size: 10, offset: 2 }}>
              <h2 className="h2-ff5 mt-3">Tournament Statistics</h2>
            </Col>
            <Col sm={{ size: 10, offset: 1 }}>
              <Row className="margin-top-xs">
                <Col lg={{ size: 3, offset: 3 }} md={{ size: 4, offset: 2 }} sm="5" className="font-weight-bold">
                  Matches played
                </Col>
                <Col md="6" sm="7">
                  {statistics.total_matches}
                </Col>
              </Row>
              <Row className="margin-top-xs">
                <Col lg={{ size: 3, offset: 3 }} md={{ size: 4, offset: 2 }} sm="5" className="font-weight-bold">
                  Goals scored
                </Col>
                <Col md="6" sm="7">
                  <NumberFormat value={statistics.total_goals} displayType={'text'} />
                  &nbsp;(
                  <NumberFormat value={(statistics.total_goals / statistics.total_matches).toFixed(2)} displayType={'text'} /> per match)
                </Col>
              </Row>
              {statistics.attendance && (
                <Row className="margin-top-xs">
                  <Col lg={{ size: 3, offset: 3 }} md={{ size: 4, offset: 2 }} sm="5" className="font-weight-bold">
                    Attendance
                  </Col>
                  <Col md="6" sm="7">
                    <NumberFormat value={statistics.attendance} displayType={'text'} thousandSeparator={true} />
                    &nbsp;(
                    <NumberFormat value={(statistics.attendance / statistics.total_matches).toFixed(0)} displayType={'text'} thousandSeparator={true} /> per
                    match)
                  </Col>
                </Row>
              )}
            </Col>
          </React.Fragment>
        )}
        {awards && (
          <React.Fragment>
            <Col lg={{ size: 8, offset: 4 }} md={{ size: 9, offset: 3 }} sm={{ size: 10, offset: 2 }}>
              <h2 className="h2-ff5 mt-3">Tournament Awards</h2>
            </Col>
            <Col sm={{ size: 10, offset: 1 }}>
              {awards.golden_boot && (
                <Row className="margin-top-xs">
                  <Col lg={{ size: 3, offset: 3 }} md={{ size: 4, offset: 2 }} sm="5" className="font-weight-bold">
                    {getTopScorerLabel(tournament, 1)}
                  </Col>
                  <Col md="6" sm="7">
                    {awards.golden_boot.map((p) => (
                      <Row className="no-margin-lr margin-bottom-xs display-block" key={p.player}>
                        {getPlayerClubNationName(p, tournamentType)}
                      </Row>
                    ))}
                  </Col>
                </Row>
              )}
              {awards.silver_boot && (
                <Row className="margin-top-xs">
                  <Col lg={{ size: 3, offset: 3 }} md={{ size: 4, offset: 2 }} sm="5" className="font-weight-bold">
                    {getTopScorerLabel(tournament, 2)}
                  </Col>
                  <Col md="6" sm="7">
                    {awards.silver_boot.map((p) => (
                      <Row className="no-margin-lr margin-bottom-xs display-block" key={p.player}>
                        {getPlayerClubNationName(p, tournamentType)}
                      </Row>
                    ))}
                  </Col>
                </Row>
              )}
              {awards.bronze_boot && (
                <Row className="margin-top-xs">
                  <Col lg={{ size: 3, offset: 3 }} md={{ size: 4, offset: 2 }} sm="5" className="font-weight-bold">
                    {getTopScorerLabel(tournament, 3)}
                  </Col>
                  <Col md="6" sm="7">
                    {awards.bronze_boot.map((p) => (
                      <Row className="no-margin-lr margin-bottom-xs display-block" key={p.player}>
                        {getPlayerClubNationName(p, tournamentType)}
                      </Row>
                    ))}
                  </Col>
                </Row>
              )}
              {(awards.golden_boot || awards.silver_boot || awards.bronze_boot) && (
                <Row className="margin-top-xs mb-3">
                  <Col lg={{ size: 3, offset: 3 }} md={{ size: 4, offset: 2 }} sm="5" className="font-weight-bold tournament-award"></Col>
                  <Col md="5" sm="7" className="tournament-award-receiver"></Col>
                </Row>
              )}
              {awards.golden_ball && (
                <React.Fragment>
                  {awards.golden_ball[0] && (
                    <Row className="margin-top-xs">
                      <Col lg={{ size: 3, offset: 3 }} md={{ size: 4, offset: 2 }} sm="5" className="font-weight-bold">
                        {getGoldenBallLabel(tournament)}
                      </Col>
                      <Col md="6" sm="7">
                        {getPlayerClubNationName(awards.golden_ball[0], tournamentType)}
                        {awards.golden_ball[0].rejected && (
                          <GoldenBallRejectedTooltip target="goldenBallTooltip" notes={awards.golden_ball[0].rejected_notes} />
                        )}
                      </Col>
                    </Row>
                  )}
                  {awards.golden_ball[1] && (
                    <Row className="margin-top-xs">
                      <Col lg={{ size: 3, offset: 3 }} md={{ size: 4, offset: 2 }} sm="5" className="font-weight-bold">
                        Silver Ball
                      </Col>
                      <Col md="6" sm="7">
                        {getPlayerClubNationName(awards.golden_ball[1], tournamentType)}
                      </Col>
                    </Row>
                  )}
                  {awards.golden_ball[2] && (
                    <Row className="margin-top-xs mb-3">
                      <Col lg={{ size: 3, offset: 3 }} md={{ size: 4, offset: 2 }} sm="5" className="font-weight-bold">
                        Bronze Ball
                      </Col>
                      <Col md="6" sm="7">
                        {getPlayerClubNationName(awards.golden_ball[2], tournamentType)}
                      </Col>
                    </Row>
                  )}
                  <Row className="margin-top-xs mb-3">
                    <Col lg={{ size: 3, offset: 3 }} md={{ size: 4, offset: 2 }} sm="5" className="font-weight-bold tournament-award"></Col>
                    <Col md="5" sm="7" className="tournament-award-receiver"></Col>
                  </Row>
                </React.Fragment>
              )}
              {awards.best_young_player && (
                <React.Fragment>
                  <Row className="margin-top-xs mb-3">
                    <Col lg={{ size: 3, offset: 3 }} md={{ size: 4, offset: 2 }} sm="5" className="font-weight-bold tournament-award">
                      Best Young Player
                    </Col>
                    <Col md="6" sm="7" className="tournament-award-receiver">
                      {getPlayerClubNationName(awards.best_young_player, tournamentType)}
                    </Col>
                  </Row>
                </React.Fragment>
              )}
              {awards.golden_glove && (
                <React.Fragment>
                  <Row className="margin-top-xs mb-3">
                    <Col lg={{ size: 3, offset: 3 }} md={{ size: 4, offset: 2 }} sm="5" className="font-weight-bold tournament-award">
                      {getGoldenGloveLabel(tournament)}
                    </Col>
                    <Col md="6" sm="7" className="tournament-award-receiver">
                      {awards.golden_glove.map((gg) => (
                        <Row className="no-margin-lr margin-bottom-xs display-block" key={gg.player}>
                          {getPlayerClubNationName(gg, tournamentType)}
                        </Row>
                      ))}
                    </Col>
                  </Row>
                </React.Fragment>
              )}
              {awards.best_defender && (
                <React.Fragment>
                  <Row className="margin-top-xs mb-3">
                    <Col lg={{ size: 3, offset: 3 }} md={{ size: 4, offset: 2 }} sm="5" className="font-weight-bold tournament-award">
                      Best Defender
                    </Col>
                    <Col md="6" sm="7" className="tournament-award-receiver">
                      {awards.best_defender.map((bd) => (
                        <Row className="no-margin-lr margin-bottom-xs display-block" key={bd.player}>
                          {getPlayerClubNationName(bd, tournamentType)}
                        </Row>
                      ))}
                    </Col>
                  </Row>
                </React.Fragment>
              )}
              {awards.best_midfielder && (
                <React.Fragment>
                  <Row className="margin-top-xs mb-3">
                    <Col lg={{ size: 3, offset: 3 }} md={{ size: 4, offset: 2 }} sm="5" className="font-weight-bold tournament-award">
                      Best Midfielder
                    </Col>
                    <Col md="6" sm="7" className="tournament-award-receiver">
                      {awards.best_midfielder.map((bm) => (
                        <Row className="no-margin-lr margin-bottom-xs display-block" key={bm.player}>
                          {getPlayerClubNationName(bm, tournamentType)}
                        </Row>
                      ))}
                    </Col>
                  </Row>
                </React.Fragment>
              )}
              {awards.best_forward && (
                <React.Fragment>
                  <Row className="margin-top-xs mb-3">
                    <Col lg={{ size: 3, offset: 3 }} md={{ size: 4, offset: 2 }} sm="5" className="font-weight-bold tournament-award">
                      Best Forward
                    </Col>
                    <Col md="6" sm="7" className="tournament-award-receiver">
                      {awards.best_forward.map((bf) => (
                        <Row className="no-margin-lr margin-bottom-xs display-block" key={bf.player}>
                          {getPlayerClubNationName(bf, tournamentType)}
                        </Row>
                      ))}
                    </Col>
                  </Row>
                </React.Fragment>
              )}
              {awards.fair_play_team && (
                <React.Fragment>
                  <Row className="margin-top-xs">
                    <Col lg={{ size: 3, offset: 3 }} md={{ size: 4, offset: 2 }} sm="5" className="font-weight-bold tournament-award">
                      Fair play
                    </Col>
                    <Col md="6" sm="7" className="tournament-award-receiver">
                      {awards.fair_play_team.map((t) => (
                        <Row className="no-margin-lr margin-bottom-xs display-block" key={t}>
                          {getTeamFlagName(t, tournamentType)}
                        </Row>
                      ))}
                    </Col>
                  </Row>
                </React.Fragment>
              )}
            </Col>
          </React.Fragment>
        )}
        {qualified && (
          <React.Fragment>
            <Col lg={{ size: 8, offset: 4 }} md={{ size: 9, offset: 3 }} sm={{ size: 10, offset: 2 }}>
              <h2 className="h2-ff5 mt-3">Qualified Teams</h2>
            </Col>
            <Col sm={{ size: 10, offset: 1 }}>
              <Qualified teams={qualified} />
            </Col>
          </React.Fragment>
        )}
      </Row>
    </React.Fragment>
  )
}

export default About
