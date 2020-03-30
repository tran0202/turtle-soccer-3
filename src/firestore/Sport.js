import React from "react";
import AppData from "./Sport.Data";
import AdminPage from "../core/AdminPage";
import Collection from "../core/Collection";
import { CardText, CardTitle } from "reactstrap";

class FSSportApp extends React.Component {
  constructor(props){
    super(props);
    document.title = "Turtle Soccer - Sport";
  }

  render() {
    const param = {
      name: "sport",
      staticData: AppData,
      displayCard: doc => {
        return (
          <React.Fragment>
            <CardTitle>{doc.data.name}</CardTitle>
            <CardText>
              {doc.data.route}
              <br></br>
              {doc.data.timestamp}
            </CardText>
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
