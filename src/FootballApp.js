import React from 'react'
import Page from './core/Page'
import { Container, Row, Col } from 'reactstrap'

class FootballApp extends React.Component {
  constructor(props) {
    super(props)
    document.title = 'Turtle Football'
  }

  getFblTeam = (props) => {
    const { name, confer, div, imageSrc } = props
    return (
      <Col xl="2" lg="3" md="4" sm="6" className={`fblteam-item filter-${confer} filter-${div}`}>
        <div className="fblteam-wrap">
          <img src={`/assets/images/nfl_logos/${imageSrc}`} className="img-fluid" alt={name} />
          <div className="fblteam-info">
            <h4>{name}</h4>
            <p>{confer}</p>
            <div className="fblteam-links">
              <a href={`/assets/images/nfl_logos/${imageSrc}`} data-gall="fblteamGallery" className="venobox" title={name}>
                <i className="icofont-eye"></i>
              </a>
              <a href="/football" title="More Details">
                <i className="icofont-external-link"></i>
              </a>
            </div>
          </div>
        </div>
      </Col>
    )
  }

  render() {
    return (
      <Page>
        <Container>
          <h1 className="h1-ff5 text-center mt-3">Welcome to Turtle Football!</h1>
          <div className="text-center">
            <img src="/assets/images/slide/american-football-1493087_1920.jpg" className="w-100" alt="Turtle Football" />
          </div>

          <section id="fblteam" className="fblteam section-bg">
            <div className="container" data-aos="fade-up" data-aos-delay="100">
              <div className="section-title">
                <h2>Teams</h2>
                <Row>
                  <Col xl={{ size: 2, offset: 3 }} lg={{ size: 2, offset: 2 }} md={{ size: 3, offset: 1 }} sm="4" xs="4">
                    <img src="/assets/images/nfl_logos/NFL.svg" className="img-fluid" alt="" />
                  </Col>
                  <Col xl="4" lg="5" md="6" sm="8" xs="8" className="text-left">
                    <p>
                      The National Football League (NFL) is a professional American football league consisting of 32 teams, divided equally between the National
                      Football Conference (NFC) and the American Football Conference (AFC)
                    </p>
                  </Col>
                </Row>
              </div>

              <Row>
                <Col lg="12">
                  <ul id="fblteam-flters">
                    <li data-filter="*" className="filter-active col-3">
                      All
                    </li>
                    <li data-filter=".filter-AFC" className="col-3 offset-1">
                      AFC
                    </li>
                    <li data-filter=".filter-NFC" className="col-3 offset-1">
                      NFC
                    </li>
                    <li data-filter=".filter-AFC-East" className="col-2">
                      AFC East
                    </li>
                    <li data-filter=".filter-AFC-North" className="col-2 offset-1">
                      AFC North
                    </li>
                    <li data-filter=".filter-AFC-South" className="col-2 offset-1">
                      AFC South
                    </li>
                    <li data-filter=".filter-AFC-West" className="col-2 offset-1">
                      AFC West
                    </li>
                    <li data-filter=".filter-NFC-East" className="col-2">
                      NFC East
                    </li>
                    <li data-filter=".filter-NFC-North" className="col-2 offset-1">
                      NFC North
                    </li>
                    <li data-filter=".filter-NFC-South" className="col-2 offset-1">
                      NFC South
                    </li>
                    <li data-filter=".filter-NFC-West" className="col-2 offset-1">
                      NFC West
                    </li>
                  </ul>
                </Col>
              </Row>

              <Row className="fblteam-container">
                {this.getFblTeam({ name: 'Arizona Cardinals', confer: 'NFC', div: 'NFC-West', imageSrc: 'ARI.svg' })}
                {this.getFblTeam({ name: 'Atlanta Falcons', confer: 'NFC', div: 'NFC-South', imageSrc: 'ATL.svg' })}
                {this.getFblTeam({ name: 'Baltimore Ravens', confer: 'AFC', div: 'AFC-North', imageSrc: 'BAL.svg' })}
                {this.getFblTeam({ name: 'Buffalo Bills', confer: 'AFC', div: 'AFC-East', imageSrc: 'BUF.svg' })}
                {this.getFblTeam({ name: 'Carolina Panthers', confer: 'NFC', div: 'NFC-South', imageSrc: 'CAR.svg' })}
                {this.getFblTeam({ name: 'Chicago Bears', confer: 'NFC', div: 'NFC-North', imageSrc: 'CHI.svg' })}
                {this.getFblTeam({ name: 'Cincinnati Bengals', confer: 'AFC', div: 'AFC-North', imageSrc: 'CIN.svg' })}
                {this.getFblTeam({ name: 'Cleveland Browns', confer: 'AFC', div: 'AFC-North', imageSrc: 'CLE.svg' })}
                {this.getFblTeam({ name: 'Dallas Cowboys', confer: 'NFC', div: 'NFC-East', imageSrc: 'DAL.svg' })}
                {this.getFblTeam({ name: 'Denver Broncos', confer: 'AFC', div: 'AFC-West', imageSrc: 'DEN.svg' })}
                {this.getFblTeam({ name: 'Detroit Lions', confer: 'NFC', div: 'NFC-North', imageSrc: 'DET.svg' })}
                {this.getFblTeam({ name: 'Green Bay Packers', confer: 'NFC', div: 'NFC-North', imageSrc: 'GB.svg' })}
                {this.getFblTeam({ name: 'Houston Texans', confer: 'AFC', div: 'AFC-South', imageSrc: 'HOU.svg' })}
                {this.getFblTeam({ name: 'Indianapolis Colts', confer: 'AFC', div: 'AFC-South', imageSrc: 'IND.svg' })}
                {this.getFblTeam({ name: 'Jacksonville Jaguars', confer: 'AFC', div: 'AFC-South', imageSrc: 'JAX.svg' })}
                {this.getFblTeam({ name: 'Kansas City Chiefs', confer: 'AFC', div: 'AFC-West', imageSrc: 'KC.svg' })}
                {this.getFblTeam({ name: 'Los Angeles Rams', confer: 'NFC', div: 'NFC-West', imageSrc: 'LA.svg' })}
                {this.getFblTeam({ name: 'Los Angeles Chargers', confer: 'AFC', div: 'AFC-West', imageSrc: 'LAC.svg' })}
                {this.getFblTeam({ name: 'Miami Dolphins', confer: 'AFC', div: 'AFC-East', imageSrc: 'MIA.svg' })}
                {this.getFblTeam({ name: 'Minnesota Vikings', confer: 'NFC', div: 'NFC-North', imageSrc: 'MIN.svg' })}
                {this.getFblTeam({ name: 'New England Patriots', confer: 'AFC', div: 'AFC-East', imageSrc: 'NE.svg' })}
                {this.getFblTeam({ name: 'New Orleans Saints', confer: 'NFC', div: 'NFC-South', imageSrc: 'NO.svg' })}
                {this.getFblTeam({ name: 'New York Giants', confer: 'NFC', div: 'NFC-East', imageSrc: 'NYG.svg' })}
                {this.getFblTeam({ name: 'New York Jets', confer: 'AFC', div: 'AFC-East', imageSrc: 'NYJ.svg' })}
                {this.getFblTeam({ name: 'Oakland Raiders', confer: 'AFC', div: 'AFC-West', imageSrc: 'OAK.svg' })}
                {this.getFblTeam({ name: 'Philadelphia Eagles', confer: 'NFC', div: 'NFC-East', imageSrc: 'PHI.svg' })}
                {this.getFblTeam({ name: 'Pittsburgh Steelers', confer: 'AFC', div: 'AFC-North', imageSrc: 'PIT.svg' })}
                {this.getFblTeam({ name: 'Seattle Seahawks', confer: 'NFC', div: 'NFC-West', imageSrc: 'SEA.svg' })}
                {this.getFblTeam({ name: 'San Francisco 49ers', confer: 'NFC', div: 'NFC-West', imageSrc: 'SF.svg' })}
                {this.getFblTeam({ name: 'Tampa Bay Buccaneers', confer: 'NFC', div: 'NFC-South', imageSrc: 'TB.svg' })}
                {this.getFblTeam({ name: 'Tennessee Titans', confer: 'AFC', div: 'AFC-South', imageSrc: 'TEN.svg' })}
                {this.getFblTeam({ name: 'Washington Redskins', confer: 'NFC', div: 'NFC-East', imageSrc: 'WAS.svg' })}
              </Row>
            </div>
          </section>
        </Container>
      </Page>
    )
  }
}

export default FootballApp
