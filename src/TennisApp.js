import React from 'react'
import Page from './core/Page'
import { Container } from 'reactstrap'

class TennisApp extends React.Component {
  constructor(props) {
    super(props)
    document.title = 'Turtle Tennis'
  }

  render() {
    return (
      <Page>
        <Container>
          <h1 className="h1-ff5 text-center mt-3">Welcome to Turtle Tennis!</h1>
          <div className="text-center">
            <img src="/assets/images/slide/athletes-1866487_1920.jpg" className="w-100" alt="Turtle Tennis" />
          </div>
          <section id="champ" className="champ">
            <div className="container">
              <div className="section-title">
                <h2>Champions</h2>
                <p>Australia Open - French Open - Wimbledon - US Open</p>
              </div>

              <div className="row">
                <div className="col-xl-3 col-lg-4 col-md-6" data-aos="fade-up">
                  <div className="player">
                    <div className="pic">
                      <img src="/assets/images/tennis/Novak_Djokovic_Wimbledon_2017.jpg" className="img-fluid" alt="" />
                    </div>
                    <div className="player-info">
                      <h4>
                        Novak Djokovic <img src="/assets/images/flags/Serbia.png" style={{ height: '15px' }} alt="Serbia" />
                      </h4>
                      <span>Australia Open 2020</span>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
                  <div className="player">
                    <div className="pic">
                      <img src="/assets/images/tennis/Kenin_RG19_(7)_(48199245357).jpg" className="img-fluid" alt="" />
                    </div>
                    <div className="player-info">
                      <h4>
                        Sofia Kenin <img src="/assets/images/flags/USA.png" style={{ height: '15px' }} alt="USA" />
                      </h4>
                      <span>Australia Open 2020</span>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="200">
                  <div className="player">
                    <div className="pic">
                      <img src="/assets/images/tennis/Paris-FR-75-Roland_Garros-2_juin_2014-Nadal-23.jpg" className="img-fluid" alt="" />
                    </div>
                    <div className="player-info">
                      <h4>
                        Rafael Nadal <img src="/assets/images/flags/Spain.png" style={{ height: '15px' }} alt="Spain" />
                      </h4>
                      <span>French Open 2019</span>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="300">
                  <div className="player">
                    <div className="pic">
                      <img src="/assets/images/tennis/Barty_RG18_(17)_(42929532332).jpg" className="img-fluid" alt="" />
                    </div>
                    <div className="player-info">
                      <h4>
                        Ashleigh Barty <img src="/assets/images/flags/Australia.png" style={{ height: '15px' }} alt="Australia" />
                      </h4>
                      <span>French Open 2019</span>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="400">
                  <div className="player">
                    <div className="pic">
                      <img src="/assets/images/tennis/Novak_Djokovic_(26858222505).jpg" className="img-fluid" alt="" />
                    </div>
                    <div className="player-info">
                      <h4>
                        Novak Djokovic <img src="/assets/images/flags/Serbia.png" style={{ height: '15px' }} alt="Serbia" />
                      </h4>
                      <span>Wimbledon 2019</span>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="500">
                  <div className="player">
                    <div className="pic">
                      <img src="/assets/images/tennis/Halep_RG18_(25)_(42929445712).jpg" className="img-fluid" alt="" />
                    </div>
                    <div className="player-info">
                      <h4>
                        Simona Halep <img src="/assets/images/flags/Romania.png" style={{ height: '15px' }} alt="Romania" />
                      </h4>
                      <span>Wimbledon 2019</span>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="600">
                  <div className="player">
                    <div className="pic">
                      <img src="/assets/images/tennis/Rafael_Nadal_(12054444625).jpg" className="img-fluid" alt="" />
                    </div>
                    <div className="player-info">
                      <h4>
                        Rafael Nadal <img src="/assets/images/flags/Spain.png" style={{ height: '15px' }} alt="Spain" />
                      </h4>
                      <span>US Open 2019</span>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="700">
                  <div className="player">
                    <div className="pic">
                      <img src="/assets/images/tennis/Bianca_Andreescu_(1)_(cropped).jpeg" className="img-fluid" alt="" />
                    </div>
                    <div className="player-info">
                      <h4>
                        Bianca Andreescu <img src="/assets/images/flags/Canada.png" style={{ height: '15px' }} alt="Canada" />
                      </h4>
                      <span>US Open 2019</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Container>
      </Page>
    )
  }
}

export default TennisApp
