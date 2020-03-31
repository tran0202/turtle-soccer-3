import React from "react";
import AppData from "./Group.Data";
import AdminPage from "../core/AdminPage";
import Collection from "../core/Collection";
import { CardText, CardTitle } from "reactstrap";

class FSGroupApp extends React.Component {
  constructor(props){
    super(props);
    document.title = "Turtle Soccer - Group";
  }

  render() {
    const param = {
      name: "group",
      staticData: AppData,
      displayCard: doc => {
        return (
          <React.Fragment>
            <CardTitle>{doc.data.name}</CardTitle>
            <CardText>
              {doc.data.long_name}
              <br></br>
              {doc.data.group_type_id}
              <br></br>
              {doc.data.group_logo}
              <br></br>
              {doc.data.time_stamp}
            </CardText>
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
