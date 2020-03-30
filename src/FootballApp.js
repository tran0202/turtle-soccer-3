import React from "react";
import Page from "./core/Page";

class FootballApp extends React.Component {
  constructor(props){
    super(props);
    document.title = "Turtle Football";
  }

  render() {
    return (
      <Page>
        <h1 className="text-center">Welcome to Turtle Football!</h1>
      </Page>
    );
  }
}

export default FootballApp;
