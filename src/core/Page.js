import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "boxicons/css/boxicons.min.css"
import "../assets/stylesheets/common.css";
import "../assets/stylesheets/Page.css";
import "../assets/stylesheets/Soccer.css";
import turtleLogo from "../assets/images/LogoMakr_1aN4h4.png";
import { Container, Row, Col } from "reactstrap";

class Page extends React.Component {
  render() {
    return (
      <React.Fragment>
        <header id="header">
          <Container>
            <Row>
              <Col>
                <div className="logo float-left">
                  <a href="/">
                    <img
                      src={turtleLogo}
                      alt="Turtle Soccer"
                      className="img-fluid"
                    />
                  </a>
                </div>
              </Col>
              <Col>
                <nav className="nav-menu float-right d-none d-lg-block mt-5">
                  <ul>
                    <li>
                      <a href="/">Home</a>
                    </li>
                    <li>
                      <a href="/soccer">Soccer</a>
                    </li>
                    <li>
                      <a href="/football">Football</a>
                    </li>
                    <li>
                      <a href="/tennis">Tennis</a>
                    </li>
                  </ul>
                </nav>
              </Col>
            </Row>
          </Container>
        </header>

        <div className="container">{this.props.children}</div>

        <button className="back-to-top">
          <i className="icofont-simple-up"></i>
        </button>

        <footer id="footer">
          <div className="container mt-5 mb-3">
            <div className="copyright">
              &copy; Copyright <span className="font-bold">Turtle Soccer</span>.
              All Rights Reserved.
            </div>
          </div>
        </footer>
      </React.Fragment>
    );
  }
}

export default Page;
