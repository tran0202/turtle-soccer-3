import React from "react";
import AppData from "./App.Data";
import Page from "./core/Page";
import Collection from "./core/Collection";
import { CardText, CardTitle } from "reactstrap";

class App extends React.Component {
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
      <Page>
        <Collection param={param} />
      </Page>
    );
  }
}

export default App;
