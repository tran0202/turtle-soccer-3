import React from "react";
import AppData from "./GroupType.Data";
import AdminPage from "../core/AdminPage";
import Collection from "../core/Collection";
import { CardText, CardTitle } from "reactstrap";

class FSGroupTypeApp extends React.Component {
  constructor(props){
    super(props);
    document.title = "Turtle Soccer - Group Type";
  }

  render() {
    const param = {
      name: "group_type",
      staticData: AppData,
      displayCard: doc => {
        return (
          <React.Fragment>
            <CardTitle>{doc.data.name}</CardTitle>
            <CardText>
              {doc.data.description}
              <br></br>
              {doc.data.timestamp}
            </CardText>
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
