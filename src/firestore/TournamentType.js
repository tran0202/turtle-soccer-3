import React from "react";
import AppData from "./TournamentType.Data";
import AdminPage from "../core/AdminPage";
import Collection from "../core/Collection";
import { CardText, CardTitle } from "reactstrap";

class FSTournamentTypeApp extends React.Component {
  constructor(props){
    super(props);
    document.title = "Turtle Soccer - Tournament Type";
  }

  render() {
    const param = {
      name: "tournament_type",
      staticData: AppData,
      displayCard: doc => {
        return (
          <React.Fragment>
            <CardTitle>{doc.data.name}</CardTitle>
            <CardText>
              {doc.data.team_type_id}
              <br></br>
              {doc.data.sport_id}
              <br></br>
              {doc.data.confederation_id}
              <br></br>
              {doc.data.time_stamp}
            </CardText>
          </React.Fragment>
        );
      },
      setWindowObjects: store => {
        window.tournamentTypeStore = store;
      }
    };
    return (
      <AdminPage>
        <Collection param={param} />
      </AdminPage>
    );
  }
}

export default FSTournamentTypeApp;
