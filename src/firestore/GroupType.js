import React from "react";
import AppData from "./GroupType.Data";
import AdminPage from "../core/AdminPage";
import Collection from "../core/Collection";

class FSGroupTypeApp extends React.Component {
  constructor(props){
    super(props);
    document.title = "Turtle Soccer - Group Type";
  }

  render() {
    const param = {
      name: "group_type",
      orderBy: ["name"],
      staticData: AppData,
      displayHeader: () => {
        return (
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
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
            <td>{doc.data.description}</td>
            <td>{doc.data.time_stamp}</td>
          </React.Fragment>
        );
      },
      setWindowObjects: store => {
        window.groupTypeStore = store;
      }
    };
    return (
      <AdminPage>
        <Collection param={param} />
      </AdminPage>
    );
  }
}

export default FSGroupTypeApp;
