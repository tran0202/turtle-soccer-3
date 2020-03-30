import React from "react";
import Page from "./core/Page";

class TennisApp extends React.Component {
  constructor(props){
    super(props);
    document.title = "Turtle Tennis";
  }

  render() {
    return (
      <Page>
        <h1 className="text-center">Welcome to Turtle Tennis!</h1>
      </Page>
    );
  }
}

export default TennisApp;
