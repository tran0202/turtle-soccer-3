import React from "react";
import Page from "./core/Page";

class TennisApp extends React.Component {
  constructor(props) {
    super(props);
    document.title = "Turtle Tennis";
  }

  render() {
    return (
      <Page>
        <h1 className="h1-ff5 text-center mt-3">Welcome to Turtle Tennis!</h1>
        <div className="text-center">
          <img
            src="/assets/images/slide/athletes-1866487_1920.jpg"
            className="w-100"
            alt="Turtle Tennis"
          />
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
                    <img
                      src="/assets/images/tennis/Novak_Djokovic_Wimbledon_2017.jpg"
                      className="img-fluid"
                      alt=""
                    />
                  </div>
                  <div className="player-info">
                    <h4>Novak Djokovic</h4>
                    <span>Serbia</span>
                  </div>
                </div>
              </div>

              <div
                className="col-xl-3 col-lg-4 col-md-6"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <div className="player">
                  <div className="pic">
                    <img
                      src="/assets/images/tennis/Kenin_RG19_(7)_(48199245357).jpg"
                      className="img-fluid"
                      alt=""
                    />
                  </div>
                  <div className="player-info">
                    <h4>Sofia Kenin</h4>
                    <span>USA</span>
                  </div>
                </div>
              </div>

              <div
                className="col-xl-3 col-lg-4 col-md-6"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <div className="player">
                  <div className="pic">
                    <img
                      src="/assets/images/tennis/Paris-FR-75-Roland_Garros-2_juin_2014-Nadal-23.jpg"
                      className="img-fluid"
                      alt=""
                    />
                  </div>
                  <div className="player-info">
                    <h4>Rafael Nadal</h4>
                    <span>Spain</span>
                  </div>
                </div>
              </div>

              <div
                className="col-xl-3 col-lg-4 col-md-6"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <div className="player">
                  <div className="pic">
                    <img
                      src="/assets/images/tennis/Barty_RG18_(17)_(42929532332).jpg"
                      className="img-fluid"
                      alt=""
                    />
                  </div>
                  <div className="player-info">
                    <h4>Ashleigh Barty</h4>
                    <span>Australia</span>
                  </div>
                </div>
              </div>

              <div className="col-xl-3 col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="400">
                <div className="player">
                  <div className="pic">
                    <img
                      src="/assets/images/tennis/Novak_Djokovic_(26858222505).jpg"
                      className="img-fluid"
                      alt=""
                    />
                  </div>
                  <div className="player-info">
                    <h4>Novak Djokovic</h4>
                    <span>Serbia</span>
                  </div>
                </div>
              </div>

              <div
                className="col-xl-3 col-lg-4 col-md-6"
                data-aos="fade-up"
                data-aos-delay="500"
              >
                <div className="player">
                  <div className="pic">
                    <img
                      src="/assets/images/tennis/Halep_RG18_(25)_(42929445712).jpg"
                      className="img-fluid"
                      alt=""
                    />
                  </div>
                  <div className="player-info">
                    <h4>Simona Halep</h4>
                    <span>Romania</span>
                  </div>
                </div>
              </div>

              <div
                className="col-xl-3 col-lg-4 col-md-6"
                data-aos="fade-up"
                data-aos-delay="600"
              >
                <div className="player">
                  <div className="pic">
                    <img
                      src="/assets/images/tennis/Rafael_Nadal_(12054444625).jpg"
                      className="img-fluid"
                      alt=""
                    />
                  </div>
                  <div className="player-info">
                    <h4>Rafael Nadal</h4>
                    <span>Spain</span>
                  </div>
                </div>
              </div>

              <div
                className="col-xl-3 col-lg-4 col-md-6"
                data-aos="fade-up"
                data-aos-delay="700"
              >
                <div className="player">
                  <div className="pic">
                    <img
                      src="/assets/images/tennis/Bianca_Andreescu_(1)_(cropped).jpeg"
                      className="img-fluid"
                      alt=""
                    />
                  </div>
                  <div className="player-info">
                    <h4>Bianca Andreescu</h4>
                    <span>Canada</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Page>
    );
  }
}

export default TennisApp;
