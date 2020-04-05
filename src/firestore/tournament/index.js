import React from "react";
import { PrepData as AppData } from "./Tournament.PrepData";
import AdminPage from "../../core/AdminPage";
import Collection from "../../core/Collection";

class FSTournamentApp extends React.Component {
  constructor(props) {
    super(props);
    document.title = "Turtle Soccer - Tournament";
  }

  render() {
    const param = {
      name: "tournament",
      orderBy: ["tournament_type_id", "start_date"],
      staticData: AppData(),
      displayHeader: () => {
        return (
          <tr>
            <th>#</th>
            <th>id</th>
            <th>name</th>
            <th>tournament_type_id</th>
            <th>start_date</th>
            <th>end_date</th>
            <th>active</th>
            <th>third_place_ranking</th>
            <th>head_to_head_tiebreaker</th>
            <th>golden_goal_rule</th>
            <th>logo_filename</th>
            <th>points_for_win</th>
            <th>parent_tournament_id</th>
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
            <td>{doc.tournament_type_id}</td>
            <td>{doc.start_date}</td>
            <td>{doc.end_date}</td>
            <td>{doc.active ? "Y" : "N"}</td>
            <td>{doc.third_place_ranking ? "Y" : "N"}</td>
            <td>{doc.head_to_head_tiebreaker ? "Y" : "N"}</td>
            <td>{doc.golden_goal_rule ? "Y" : "N"}</td>
            <td>{doc.logo_filename}</td>
            <td>{doc.points_for_win}</td>
            <td>{doc.parent_tournament_id}</td>
            <td>{doc.time_stamp}</td>
          </React.Fragment>
        );
      },
      setWindowObjects: store => {
        window.tournamentStore = store;
      }
    };
    return (
      <AdminPage>
        <Collection param={param} />
      </AdminPage>
    );
  }
}

export default FSTournamentApp;
