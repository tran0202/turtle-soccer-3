import React from "react";
import AppData from "./Sport.Data";
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
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Route</th>
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
            <td>{doc.data.route}</td>
            <td>{doc.data.time_stamp}</td>
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
