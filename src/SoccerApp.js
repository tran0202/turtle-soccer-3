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
  ListGroupItem,
  Card,
  CardImg,
  CardText,
  CardDeck,
  CardBody
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
                <img src={logoSrc} alt={confed} height="35" />
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
                            <React.Fragment>
                              {tournamentArrayByType[tt.id].map(
                                (row, index) => (
                                  <CardDeck key={index} className="mt-3">
                                    {row.map(t => (
                                      <Card
                                        key={t.id}
                                        style={{
                                          marginLeft: "10px",
                                          marginRight: "10px",
                                          paddingTop: "10px"
                                        }}
                                      >
                                        <CardImg
                                          top
                                          src={`/assets/images/${t.logo_path}/${t.logo_filename}`}
                                          alt={t.name}
                                          className="card-img-top-height-100 mx-auto"
                                        />
                                        <CardBody>
                                          <CardText className="text-center font-bold">
                                            {t.name}
                                          </CardText>
                                        </CardBody>
                                      </Card>
                                    ))}
                                  </CardDeck>
                                )
                              )}
                            </React.Fragment>
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
    const count = 6;
    const { docs, tournamentArrayByType, tournamentTypeArray } = this.state;
    let tmp = [];
    tournamentTypeArray.forEach(tt => {
      tmp[tt.id] = [];
      tournamentArrayByType[tt.id] = [];
    });
    docs.forEach(doc => {
      tmp[doc.tournament_type_id].push(doc);
    });
    let tmp2 = [];
    tournamentTypeArray.forEach(tt => {
      // console.log("tmp[tt]", tt.id, tmp[tt.id].length);
      tmp2 = [];
      let tmp3 = [];
      tmp[tt.id].forEach((t, index) => {
        if (index % count === 0) {
          tmp3 = [];
          tmp3.push(t);
        } else {
          tmp3.push(t);
        }
        if (index % count === count - 1 || index === tmp[tt.id].length - 1) {
          tmp2.push(tmp3);
        }
      });
      tournamentArrayByType[tt.id] = tmp2;
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
