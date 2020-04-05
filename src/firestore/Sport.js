import React from "react";
import { AppData } from "./Sport.Data";
import AdminPage from "../core/AdminPage";
import Collection from "../core/Collection";

class FSSportApp extends React.Component {
  constructor(props) {
    super(props);
    document.title = "Turtle Soccer - Sport";
  }

  render() {
    const param = {
      name: "sport",
      orderBy: ["name"],
      staticData: AppData,
      displayHeader: () => {
        return (
          <tr>
            <th>#</th>
            <th>id</th>
            <th>name</th>
            <th>route</th>
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
            <td>{doc.route}</td>
            <td>{doc.time_stamp}</td>
          </React.Fragment>
        );
      },
      setWindowObjects: store => {
        window.sportStore = store;
      }
    };
    return (
      <AdminPage>
        <Collection param={param} />
      </AdminPage>
    );
  }
}

export default FSSportApp;
