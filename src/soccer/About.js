import React from 'react'
import Qualified from './Qualified'
import { getFlagSrc, getTeamName, isWinner, SharedBronzeTooltip, GoldenBallRejectedTooltip } from './Helper'
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

const About = (props) => {
  const { tournament } = props
  const { id, hero_images, details, final_standings, statistics, awards, qualified, tournament_type_id, original_name } = tournament
  if (!details) return null
  const { host, team_count, confed_count, venue_count, city_count } = details
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
                    {h && <img className="flag-sm flag-md" src={getFlagSrc(h)} alt={h} title={h} />}
                    <span className="padding-top-xs">&nbsp;{getTeamName(h)}</span>
                  </Row>
                ))}
              </Col>
            </Row>
          )}
          <Row className="margin-top-xs">
            <Col lg={{ size: 3, offset: 3 }} md={{ size: 4, offset: 2 }} sm="5" className="font-weight-bold">
              Dates
            </Col>
            <Col md="6" sm="7">
              {details.start_date ? moment(details.start_date).format('MMMM D, YYYY') : ''} &mdash;&nbsp;
              {details.end_date ? moment(details.end_date).format('MMMM D, YYYY') : ''}
            </Col>
          </Row>
          {team_count && (
            <Row className="margin-top-xs">
              <Col lg={{ size: 3, offset: 3 }} md={{ size: 4, offset: 2 }} sm="5" className="font-weight-bold">
                Teams
              </Col>
              <Col md="6" sm="7">
                {team_count}{' '}
                {confed_count && (
                  <React.Fragment>
                    (from {confed_count} confederation{confed_count !== 1 ? 's' : ''})
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
                <img className="flag-sm flag-md" src={getFlagSrc(champions)} alt={champions} title={champions} />
                <span className="padding-top-xs">&nbsp;{getTeamName(champions)}</span>
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
                <img className="flag-sm flag-md" src={getFlagSrc(runners_up)} alt={runners_up} title={runners_up} />
                <span className="padding-top-xs">&nbsp;{getTeamName(runners_up)}</span>
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
                {typeof third_place === 'string' && (
                  <React.Fragment>
                    <img className="flag-sm flag-md" src={getFlagSrc(third_place)} alt={third_place} title={third_place} />
                    <span className="padding-top-xs">&nbsp;{getTeamName(third_place)}</span>
                  </React.Fragment>
                )}
                {typeof third_place === 'object' && (
                  <React.Fragment>
                    <img className="flag-sm flag-md" src={getFlagSrc(third_place[0])} alt={third_place[0]} title={third_place[0]} />
                    <span className="padding-top-xs">&nbsp;{getTeamName(third_place[0])}</span>
                    <SharedBronzeTooltip target="sharedTooltip" notes={final_standings.third_place_text} />
                    <br></br>
                    <img className="flag-sm flag-md" src={getFlagSrc(third_place[1])} alt={third_place[1]} title={third_place[1]} />
                    <span className="padding-top-xs">&nbsp;{getTeamName(third_place[1])}</span>
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
                <img className="flag-sm flag-md" src={getFlagSrc(fourth_place)} alt={fourth_place} title={fourth_place} />
                <span className="padding-top-xs">&nbsp;{getTeamName(fourth_place)}</span>
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
                      <Row className="no-margin-lr margin-bottom-xs" key={p.player}>
                        {p.team && <img className="flag-sm flag-md" src={getFlagSrc(p.team)} alt={p.team} title={p.team} />}
                        <span className="padding-top-xs">
                          &nbsp;{p.player} {getGoldenBootDetails(p)}
                        </span>
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
                      <Row className="no-margin-lr margin-bottom-xs" key={p.player}>
                        {p.team && <img className="flag-sm flag-md" src={getFlagSrc(p.team)} alt={p.team} title={p.team} />}
                        <span className="padding-top-xs">
                          &nbsp;{p.player} {getGoldenBootDetails(p)}
                        </span>
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
                      <Row className="no-margin-lr margin-bottom-xs" key={p.player}>
                        {p.team && <img className="flag-sm flag-md" src={getFlagSrc(p.team)} alt={p.team} title={p.team} />}
                        <span className="padding-top-xs">
                          &nbsp;{p.player} {getGoldenBootDetails(p)}
                        </span>
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
                        {awards.golden_ball[0].team && (
                          <img
                            className="flag-sm flag-md"
                            src={getFlagSrc(awards.golden_ball[0].team)}
                            alt={awards.golden_ball[0].team}
                            title={awards.golden_ball[0].team}
                          />
                        )}
                        <span className="padding-top-xs">&nbsp;{awards.golden_ball[0].player}</span>
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
                        {awards.golden_ball[1].team && (
                          <img
                            className="flag-sm flag-md"
                            src={getFlagSrc(awards.golden_ball[1].team)}
                            alt={awards.golden_ball[1].team}
                            title={awards.golden_ball[1].team}
                          />
                        )}
                        <span className="padding-top-xs">&nbsp;{awards.golden_ball[1].player}</span>
                      </Col>
                    </Row>
                  )}
                  {awards.golden_ball[2] && (
                    <Row className="margin-top-xs mb-3">
                      <Col lg={{ size: 3, offset: 3 }} md={{ size: 4, offset: 2 }} sm="5" className="font-weight-bold">
                        Bronze Ball
                      </Col>
                      <Col md="6" sm="7">
                        {awards.golden_ball[2].team && (
                          <img
                            className="flag-sm flag-md"
                            src={getFlagSrc(awards.golden_ball[2].team)}
                            alt={awards.golden_ball[2].team}
                            title={awards.golden_ball[2].team}
                          />
                        )}
                        <span className="padding-top-xs">&nbsp;{awards.golden_ball[2].player}</span>
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
                      {awards.best_young_player.team && (
                        <img
                          className="flag-sm flag-md"
                          src={getFlagSrc(awards.best_young_player.team)}
                          alt={awards.best_young_player.team}
                          title={awards.best_young_player.team}
                        />
                      )}
                      <span className="padding-top-xs">&nbsp;{awards.best_young_player.player}</span>
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
                      {awards.golden_glove.team && (
                        <img
                          className="flag-sm flag-md"
                          src={getFlagSrc(awards.golden_glove.team)}
                          alt={awards.golden_glove.team}
                          title={awards.golden_glove.team}
                        />
                      )}
                      <span className="padding-top-xs">&nbsp;{awards.golden_glove.player}</span>
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
                        <Row className="no-margin-lr margin-bottom-xs" key={t}>
                          {t && <img className="flag-sm flag-md" src={getFlagSrc(t)} alt={t} title={t} />}
                          <span className="padding-top-xs">&nbsp;{getTeamName(t)}</span>
                        </Row>
                      ))}
                    </Col>
                  </Row>
                </React.Fragment>
              )}
              {awards.top_scorer && (
                <React.Fragment>
                  <Row className="margin-top-xs">
                    <Col lg={{ size: 3, offset: 3 }} md={{ size: 4, offset: 2 }} sm="5" className="font-weight-bold tournament-award">
                      Top Scorer{awards.top_scorer.length > 1 ? 's' : ''}
                    </Col>
                    <Col md="6" sm="7" className="tournament-award-receiver">
                      {awards.top_scorer.map((ts) => (
                        <Row className="no-margin-lr margin-bottom-xs" key={ts.player}>
                          {ts.team && <img className="flag-sm flag-md" src={getFlagSrc(ts.team)} alt={ts.team} title={ts.team} />}
                          <span className="padding-top-xs">
                            &nbsp;{ts.player} {getGoldenBootDetails(ts)}
                          </span>
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
