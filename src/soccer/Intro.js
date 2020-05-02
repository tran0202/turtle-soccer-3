import React from 'react'
import { getFlagSrc, getTeamName } from './Helper'
import { Row, Col } from 'reactstrap'
import moment from 'moment'
import NumberFormat from 'react-number-format'

const Intro = (props) => {
  const { tournament } = props
  const { id, hero_images, details, final_positions, statistics, awards } = tournament
  return (
    <React.Fragment>
      <section id="hero" className="mt-5">
        <div className="hero-container">
          <div id="heroCarousel" className="carousel slide carousel-fade" data-ride="carousel">
            <ol className="carousel-indicators" id="hero-carousel-indicators"></ol>
            <div className="carousel-inner" role="listbox">
              {hero_images.map((i, index) => (
                <div
                  key={index}
                  className={`carousel-item${index === 0 ? ' active' : ''}`}
                  style={{
                    backgroundImage: `url('/assets/images/soccer/${id}/${i.filename}')`,
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
      <Row className="mt-3">
        <Col lg={{ size: 8, offset: 4 }} md={{ size: 9, offset: 3 }} sm={{ size: 10, offset: 2 }}>
          <h2 className="h2-ff5 mt-3">Tournament details</h2>
        </Col>
        <Col sm={{ size: 10, offset: 1 }}>
          <Row className="margin-top-xs">
            <Col lg={{ size: 3, offset: 4 }} md={{ size: 4, offset: 3 }} sm="5" className="font-weight-bold">
              Host
            </Col>
            <Col md="5" sm="7">
              {getTeamName(details.host)}
            </Col>
          </Row>
          <Row className="margin-top-xs">
            <Col lg={{ size: 3, offset: 4 }} md={{ size: 4, offset: 3 }} sm={{ size: 5, offset: 0 }} className="font-weight-bold">
              Dates
            </Col>
            <Col md="5" sm="7">
              {moment(details.start_date).format('MMMM D, YYYY')} - {moment(details.end_date).format('MMMM D, YYYY')}
            </Col>
          </Row>
          <Row className="margin-top-xs">
            <Col lg={{ size: 3, offset: 4 }} md={{ size: 4, offset: 3 }} sm="5" className="font-weight-bold">
              Teams
            </Col>
            <Col md="5" sm="7">
              {details.team_count}
            </Col>
          </Row>
          <Row className="margin-top-xs">
            <Col lg={{ size: 3, offset: 4 }} md={{ size: 4, offset: 3 }} sm="5" className="font-weight-bold">
              Venues
            </Col>
            <Col md="5" sm="7">
              {details.venue_count}
            </Col>
          </Row>
        </Col>
        <Col lg={{ size: 8, offset: 4 }} md={{ size: 9, offset: 3 }} sm={{ size: 10, offset: 2 }}>
          <h2 className="h2-ff5 mt-3">Final Positions</h2>
        </Col>
        <Col sm={{ size: 10, offset: 1 }}>
          <Row className="margin-top-xs">
            <Col lg={{ size: 3, offset: 4 }} md={{ size: 4, offset: 3 }} sm="5" className="font-weight-bold">
              Champions
            </Col>
            <Col md="5" sm="7">
              <img className="flag-sm flag-md" src={getFlagSrc(final_positions.champions)} alt={final_positions.champions} />
              &nbsp;{getTeamName(final_positions.champions)}
            </Col>
          </Row>
          <Row className="margin-top-xs">
            <Col lg={{ size: 3, offset: 4 }} md={{ size: 4, offset: 3 }} sm="5" className="font-weight-bold">
              Runners-up
            </Col>
            <Col md="5" sm="7">
              <img className="flag-sm flag-md" src={getFlagSrc(final_positions.runners_up)} alt={final_positions.runners_up} />
              &nbsp;{getTeamName(final_positions.runners_up)}
            </Col>
          </Row>
          <Row className="margin-top-xs">
            <Col lg={{ size: 3, offset: 4 }} md={{ size: 4, offset: 3 }} sm="5" className="font-weight-bold">
              Third place
            </Col>
            <Col md="5" sm="7">
              <img className="flag-sm flag-md" src={getFlagSrc(final_positions.third_place)} alt={final_positions.third_place} />
              &nbsp;{getTeamName(final_positions.third_place)}
            </Col>
          </Row>
          <Row className="margin-top-xs">
            <Col lg={{ size: 3, offset: 4 }} md={{ size: 4, offset: 3 }} sm="5" className="font-weight-bold">
              Fourth place
            </Col>
            <Col md="5" sm="7">
              <img className="flag-sm flag-md" src={getFlagSrc(final_positions.fourth_place)} alt={final_positions.fourth_place} />
              &nbsp;{getTeamName(final_positions.fourth_place)}
            </Col>
          </Row>
        </Col>
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
          <Row className="margin-top-xs">
            <Col lg={{ size: 3, offset: 4 }} md={{ size: 4, offset: 3 }} sm="5" className="font-weight-bold">
              Golden Boot
            </Col>
            <Col md="5" sm="7">
              <img className="flag-sm flag-md" src={getFlagSrc(awards.golden_boot.team)} alt={awards.golden_boot.team} />
              &nbsp;{awards.golden_boot.player}
            </Col>
          </Row>
          <Row className="margin-top-xs">
            <Col lg={{ size: 3, offset: 4 }} md={{ size: 4, offset: 3 }} sm="5" className="font-weight-bold">
              Golden Ball
            </Col>
            <Col md="5" sm="7">
              <img className="flag-sm flag-md" src={getFlagSrc(awards.golden_ball.team)} alt={awards.golden_ball.team} />
              &nbsp;{awards.golden_ball.player}
            </Col>
          </Row>
          <Row className="margin-top-xs">
            <Col lg={{ size: 3, offset: 4 }} md={{ size: 4, offset: 3 }} sm="5" className="font-weight-bold">
              Best Young Player
            </Col>
            <Col md="5" sm="7">
              <img className="flag-sm flag-md" src={getFlagSrc(awards.best_young_player.team)} alt={awards.best_young_player.team} />
              &nbsp;{awards.best_young_player.player}
            </Col>
          </Row>
          <Row className="margin-top-xs">
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
      </Row>
    </React.Fragment>
  )
}

export default Intro
