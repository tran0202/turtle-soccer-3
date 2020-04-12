import React, { useState } from "react";
import "firebase/auth";
import "firebase/firestore";
import { InitFirebase, GetCollection, Join } from "./core/Helper";
import Page from "./core/Page";
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Row,
  Col,
  ListGroup,
  ListGroupItem
} from "reactstrap";
import classnames from "classnames";
import { ConfederationIds } from "./core/Constants";

const GetTabs = props => {
  const { store } = props;
  const { tournamentTypeArrayByConfed, tournamentArrayByType } = store;
  const [activeTab, setActiveTab] = useState("FIFA");

  const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
    <React.Fragment>
      <Nav tabs>
        {ConfederationIds.map(confed => {
          const logoSrc = `/assets/images/logos/${confed}.png`;
          return (
            <NavItem key={confed} className="confed-tab">
              <NavLink
                className={classnames({ active: activeTab === confed })}
                onClick={() => {
                  toggle(confed);
                }}
              >
                <img src={logoSrc} alt={confed} style={{height: '35px'}} className="img-fluid" />
              </NavLink>
            </NavItem>
          );
        })}
      </Nav>
      <TabContent className="mt-3" activeTab={activeTab}>
        {ConfederationIds.map(confed => (
          <TabPane key={confed} tabId={confed}>
            <Row>
              <Col sm="12">
                <ListGroup flush>
                  {tournamentTypeArrayByConfed[confed] && (
                    <React.Fragment>
                      {tournamentTypeArrayByConfed[confed].map(tt => (
                        <ListGroupItem key={tt.id}>
                          <h2 className="h2-ff1">{tt.name}</h2>
                          {tournamentArrayByType[tt.id] && (
                            <section className="tournaments section-bg">
                              <div className="container">
                                <div className="row">
                                {tournamentArrayByType[tt.id].map(t => (
                                  <div key={t.id} className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-6 text-center" data-aos="fade-up">
                                    <div className="tournament-box">
                                      <img src={`/assets/images/${t.logo_path}/${t.logo_filename}`} alt={t.name} className="card-img-top-height-100 mx-auto"/>
                                      <p className="text-center font-bold mt-3">{t.name}</p>
                                    </div>
                                  </div>
                                ))}
                                </div>
                              </div>
                            </section>
                          )}
                        </ListGroupItem>
                      ))}
                    </React.Fragment>
                  )}
                </ListGroup>
              </Col>
            </Row>
          </TabPane>
        ))}
      </TabContent>
    </React.Fragment>
  );
};

class SoccerApp extends React.Component {
  constructor(props) {
    super(props);
    document.title = "Turtle Soccer";
    InitFirebase();

    this.state = {
      docs: [],
      tournamentArrayByType: [],
      tournamentTypeArray: [],
      tournamentTypeArrayByConfed: []
    };
  }

  getTournamentType = props => {
    this.setState({ docs: props, tournamentTypeArray: props });
    this.getTournamentTypeArrayByConfed();
  };

  getTournament = props => {
    const tournamentType = this.state;
    const tournament = { docs: props };
    const tmp = Join(tournament, "tournament_type_id", tournamentType);
    const newState = tmp.docs.filter(t => {
      return t.confederation_id !== "";
    });
    this.setState({ docs: newState });
    const tabt = this.getTournamentArrayByType();
    this.setState({ tournamentArrayByType: tabt });
    // console.log("this.state", this.state);
    window.tournamentStore = this.state;
  };

  getData = () => {
    GetCollection({
      name: "tournament_type",
      orderBy: ["confederation_id", "order"],
      where: { left: "sport_id", op: "==", right: "SOC" },
      callback: this.getTournamentType
    });
    GetCollection({
      name: "tournament",
      orderBy: ["tournament_type_id", { field: "start_date", desc: true }],
      where: { left: "tournament_type_id", op: ">", right: "" },
      callback: this.getTournament
    });
  };

  getTournamentTypeArrayByConfed = () => {
    const { tournamentTypeArray, tournamentTypeArrayByConfed } = this.state;
    ConfederationIds.forEach(confed => {
      tournamentTypeArrayByConfed[confed] = [];
    });
    tournamentTypeArray.forEach(tt => {
      tournamentTypeArrayByConfed[tt.confederation_id].push(tt);
    });
  };

  getTournamentArrayByType = () => {
    const { docs, tournamentArrayByType, tournamentTypeArray } = this.state;
    let tmp = [];
    tournamentTypeArray.forEach(tt => {
      tmp[tt.id] = [];
      tournamentArrayByType[tt.id] = [];
    });
    docs.forEach(doc => {
      tmp[doc.tournament_type_id].push(doc);
    });
    tournamentTypeArray.forEach(tt => {
      tmp[tt.id].forEach((t) => {
        tournamentArrayByType[tt.id].push(t);
      });
    });
    return tournamentArrayByType;
  };

  componentDidMount() {
    this.getData();
  }

  render() {
    return (
      <Page>
        <h1 className="h1-ff5 text-center mt-3 mb-5">Tournaments around the World</h1>       
        <GetTabs store={this.state} />
      </Page>
    );
  }
}

export default SoccerApp;
