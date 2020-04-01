import React from "react";
import AppData from "./Group.Data";
import AdminPage from "../core/AdminPage";
import Collection from "../core/Collection";

class FSGroupApp extends React.Component {
  constructor(props) {
    super(props);
    document.title = "Turtle Soccer - Group";
  }

  render() {
    const param = {
      name: "group",
      orderBy: ["group_type_id", "name"],
      staticData: AppData,
      displayHeader: () => {
        return (
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Long_name</th>
              <th>Group_type_id</th>
              <th>Group_logo</th>
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
            <td>{doc.data.long_name}</td>
            <td>{doc.data.group_type_id}</td>
            <td>{doc.data.group_logo}</td>
            <td>{doc.data.time_stamp}</td>
          </React.Fragment>
        );
      },
      setWindowObjects: store => {
        window.groupStore = store;
      }
    };
    return (
      <AdminPage>
        <Collection param={param} />
      </AdminPage>
    );
  }
}

export default FSGroupApp;
