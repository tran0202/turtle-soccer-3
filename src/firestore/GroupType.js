import React from "react";
import { AppData } from "./GroupType.Data";
import AdminPage from "../core/AdminPage";
import Collection from "../core/Collection";

class FSGroupTypeApp extends React.Component {
  constructor(props) {
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
          <tr>
            <th>#</th>
            <th>id</th>
            <th>name</th>
            <th>description</th>
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
            <td>{doc.description}</td>
            <td>{doc.time_stamp}</td>
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
