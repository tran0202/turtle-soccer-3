import React from 'react'
import { getFlagSrc, getTeamName, isWinner } from './Helper'
import { Row, Col } from 'reactstrap'
import moment from 'moment'
import NumberFormat from 'react-number-format'

const findFinalStandings = (tournament) => {
  if (!tournament.stages) {
    return {}
  }
  const koStage = tournament.stages.find((s) => s.type === 'knockout')
  // console.log('koStage', tournament.stages)
  if (koStage && koStage.rounds) {
    const final = koStage.rounds.find((r) => r.name === 'Final')
    const third_place_game = koStage.rounds.find((r) => r.name === 'Third place')
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

const Intro = (props) => {
  const { tournament } = props
  const { id, hero_images, details, final_standings, statistics, awards } = tournament
  const { host, team_count, venue_count } = details
  const { fs1, fs2, fs3, fs4 } = findFinalStandings(tournament)
  const champions = fs1 ? fs1 : final_standings ? final_standings.champions : null
  const runners_up = fs2 ? fs2 : final_standings ? final_standings.runners_up : null
  const third_place = fs3 ? fs3 : final_standings ? final_standings.third_place : null
  const fourth_place = fs4 ? fs4 : final_standings ? final_standings.fourth_place : null
  return (
    <React.Fragment>
      <Row className="mt-5"></Row>
      {hero_images && (
        <section id="hero" className="mt-5">
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
          {host && (
            <Row className="margin-top-xs">
              <Col lg={{ size: 3, offset: 4 }} md={{ size: 4, offset: 3 }} sm="5" className="font-weight-bold">
                Host
              </Col>
              <Col md="5" sm="7">
                <img className="flag-sm flag-md" src={getFlagSrc(host)} alt={host} />
                &nbsp;{getTeamName(host)}
              </Col>
            </Row>
          )}
          <Row className="margin-top-xs">
            <Col lg={{ size: 3, offset: 4 }} md={{ size: 4, offset: 3 }} sm={{ size: 5, offset: 0 }} className="font-weight-bold">
              Dates
            </Col>
            <Col md="5" sm="7">
              {moment(details.start_date).format('MMMM D, YYYY')} - {moment(details.end_date).format('MMMM D, YYYY')}
            </Col>
          </Row>
          {team_count && (
            <Row className="margin-top-xs">
              <Col lg={{ size: 3, offset: 4 }} md={{ size: 4, offset: 3 }} sm="5" className="font-weight-bold">
                Teams
              </Col>
              <Col md="5" sm="7">
                {team_count}
              </Col>
            </Row>
          )}
          {team_count && (
            <Row className="margin-top-xs">
              <Col lg={{ size: 3, offset: 4 }} md={{ size: 4, offset: 3 }} sm="5" className="font-weight-bold">
                Venues
              </Col>
              <Col md="5" sm="7">
                {venue_count}
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
              <Col lg={{ size: 3, offset: 4 }} md={{ size: 4, offset: 3 }} sm="5" className="font-weight-bold">
                Champions
              </Col>
              <Col md="5" sm="7">
                <img className="flag-sm flag-md" src={getFlagSrc(champions)} alt={champions} />
                &nbsp;{getTeamName(champions)}
              </Col>
            </Row>
          )}
          {runners_up && (
            <Row className="margin-top-xs">
              <Col lg={{ size: 3, offset: 4 }} md={{ size: 4, offset: 3 }} sm="5" className="font-weight-bold">
                Runners-up
              </Col>
              <Col md="5" sm="7">
                <img className="flag-sm flag-md" src={getFlagSrc(runners_up)} alt={runners_up} />
                &nbsp;{getTeamName(runners_up)}
              </Col>
            </Row>
          )}
          {third_place && (
            <Row className="margin-top-xs">
              <Col lg={{ size: 3, offset: 4 }} md={{ size: 4, offset: 3 }} sm="5" className="font-weight-bold">
                Third place
              </Col>
              <Col md="5" sm="7">
                <img className="flag-sm flag-md" src={getFlagSrc(third_place)} alt={third_place} />
                &nbsp;{getTeamName(third_place)}
              </Col>
            </Row>
          )}
          {fourth_place && (
            <Row className="margin-top-xs">
              <Col lg={{ size: 3, offset: 4 }} md={{ size: 4, offset: 3 }} sm="5" className="font-weight-bold">
                Fourth place
              </Col>
              <Col md="5" sm="7">
                <img className="flag-sm flag-md" src={getFlagSrc(fourth_place)} alt={fourth_place} />
                &nbsp;{getTeamName(fourth_place)}
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
                <Col lg={{ size: 3, offset: 4 }} md={{ size: 4, offset: 3 }} sm="5" className="font-weight-bold">
                  Matches played
                </Col>
                <Col md="5" sm="7">
                  {statistics.total_matches}
                </Col>
              </Row>
              <Row className="margin-top-xs">
                <Col lg={{ size: 3, offset: 4 }} md={{ size: 4, offset: 3 }} sm="5" className="font-weight-bold">
                  Goals scored
                </Col>
                <Col md="5" sm="7">
                  {statistics.total_goals}
                </Col>
              </Row>
              <Row className="margin-top-xs">
                <Col lg={{ size: 3, offset: 4 }} md={{ size: 4, offset: 3 }} sm="5" className="font-weight-bold">
                  Attendance
                </Col>
                <Col md="5" sm="7">
                  <NumberFormat value={statistics.attendance} displayType={'text'} thousandSeparator={true} />
                </Col>
              </Row>
            </Col>
          </React.Fragment>
        )}
        {awards && (
          <React.Fragment>
            <Col lg={{ size: 8, offset: 4 }} md={{ size: 9, offset: 3 }} sm={{ size: 10, offset: 2 }}>
              <h2 className="h2-ff5 mt-3">Tournament Awards</h2>
            </Col>
            <Col sm={{ size: 10, offset: 1 }}>
              <Row className="margin-top-xs">
                <Col lg={{ size: 3, offset: 4 }} md={{ size: 4, offset: 3 }} sm="5" className="font-weight-bold">
                  Golden Boot
                </Col>
                <Col md="5" sm="7">
                  <img className="flag-sm flag-md" src={getFlagSrc(awards.golden_boot[0].team)} alt={awards.golden_boot[0].team} />
                  &nbsp;{awards.golden_boot[0].player}
                </Col>
              </Row>
              <Row className="margin-top-xs">
                <Col lg={{ size: 3, offset: 4 }} md={{ size: 4, offset: 3 }} sm="5" className="font-weight-bold">
                  Silver Boot
                </Col>
                <Col md="5" sm="7">
                  <img className="flag-sm flag-md" src={getFlagSrc(awards.golden_boot[1].team)} alt={awards.golden_boot[1].team} />
                  &nbsp;{awards.golden_boot[1].player}
                </Col>
              </Row>
              <Row className="margin-top-xs mb-3">
                <Col lg={{ size: 3, offset: 4 }} md={{ size: 4, offset: 3 }} sm="5" className="font-weight-bold">
                  Bronze Boot
                </Col>
                <Col md="5" sm="7">
                  <img className="flag-sm flag-md" src={getFlagSrc(awards.golden_boot[2].team)} alt={awards.golden_boot[2].team} />
                  &nbsp;{awards.golden_boot[2].player}
                </Col>
              </Row>
              <Row className="margin-top-xs">
                <Col lg={{ size: 3, offset: 4 }} md={{ size: 4, offset: 3 }} sm="5" className="font-weight-bold">
                  Golden Ball
                </Col>
                <Col md="5" sm="7">
                  <img className="flag-sm flag-md" src={getFlagSrc(awards.golden_ball[0].team)} alt={awards.golden_ball[0].team} />
                  &nbsp;{awards.golden_ball[0].player}
                </Col>
              </Row>
              <Row className="margin-top-xs">
                <Col lg={{ size: 3, offset: 4 }} md={{ size: 4, offset: 3 }} sm="5" className="font-weight-bold">
                  Silver Ball
                </Col>
                <Col md="5" sm="7">
                  <img className="flag-sm flag-md" src={getFlagSrc(awards.golden_ball[1].team)} alt={awards.golden_ball[1].team} />
                  &nbsp;{awards.golden_ball[1].player}
                </Col>
              </Row>
              <Row className="margin-top-xs mb-3">
                <Col lg={{ size: 3, offset: 4 }} md={{ size: 4, offset: 3 }} sm="5" className="font-weight-bold">
                  Bronze Ball
                </Col>
                <Col md="5" sm="7">
                  <img className="flag-sm flag-md" src={getFlagSrc(awards.golden_ball[2].team)} alt={awards.golden_ball[2].team} />
                  &nbsp;{awards.golden_ball[2].player}
                </Col>
              </Row>
              <Row className="margin-top-xs mb-3">
                <Col lg={{ size: 3, offset: 4 }} md={{ size: 4, offset: 3 }} sm="5" className="font-weight-bold">
                  Best Young Player
                </Col>
                <Col md="5" sm="7">
                  <img className="flag-sm flag-md" src={getFlagSrc(awards.best_young_player.team)} alt={awards.best_young_player.team} />
                  &nbsp;{awards.best_young_player.player}
                </Col>
              </Row>
              <Row className="margin-top-xs mb-3">
                <Col lg={{ size: 3, offset: 4 }} md={{ size: 4, offset: 3 }} sm="5" className="font-weight-bold">
                  Golden Glove
                </Col>
                <Col md="5" sm="7">
                  <img className="flag-sm flag-md" src={getFlagSrc(awards.golden_glove.team)} alt={awards.golden_glove.team} />
                  &nbsp;{awards.golden_glove.player}
                </Col>
              </Row>
              <Row className="margin-top-xs">
                <Col lg={{ size: 3, offset: 4 }} md={{ size: 4, offset: 3 }} sm="5" className="font-weight-bold">
                  Fair play
                </Col>
                <Col md="5" sm="7">
                  <img className="flag-sm flag-md" src={getFlagSrc(awards.fair_play_team)} alt={awards.fair_play_team} />
                  &nbsp;{getTeamName(awards.fair_play_team)}
                </Col>
              </Row>
            </Col>
          </React.Fragment>
        )}
      </Row>
    </React.Fragment>
  )
}

export default Intro
