import React from "react";
import AppData from "./TournamentType.Data";
import AdminPage from "../core/AdminPage";
import Collection from "../core/Collection";

class FSTournamentTypeApp extends React.Component {
  constructor(props) {
    super(props);
    document.title = "Turtle Soccer - Tournament Type";
  }

  render() {
    const param = {
      name: "tournament_type",
      orderBy: ["confederation_id", "team_type_id"],
      staticData: AppData,
      displayHeader: () => {
        return (
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Team_type_id</th>
              <th>Sport_id</th>
              <th>Confederation_id</th>
              <th>Time</th>
              <th>Delete</th>
            </tr>
          </thead>
        );
      },
      displayRow: doc => {
        return (
          <React.Fragment>
            <th scope="row">{doc.id}</th>
            <td>{doc.data.name}</td>
            <td>{doc.data.team_type_id}</td>
            <td>{doc.data.sport_id}</td>
            <td>{doc.data.confederation_id}</td>
            <td>{doc.data.time_stamp}</td>
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
