import React from "react";
import { AppData } from "./TournamentType.Data";
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
          <tr>
            <th>#</th>
            <th>id</th>
            <th>name</th>
            <th>confederation_id</th>
            <th>team_type_id</th>
            <th>logo_path</th>
            <th>sport_id</th>
            <th>time_stamp</th>
            <th>delete</th>
          </tr>
        );
      },
      displayRow: doc => {
        return (
          <React.Fragment>
            <th scope="row">{doc.id}</th>
            <td>{doc.name}</td>
            <td>{doc.confederation_id}</td>
            <td>{doc.team_type_id}</td>
            <td>{doc.logo_path}</td>
            <td>{doc.sport_id}</td>
            <td>{doc.time_stamp}</td>
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
