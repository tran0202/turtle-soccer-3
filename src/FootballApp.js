import React from "react";
import Page from "./core/Page";

class FootballApp extends React.Component {
  constructor(props) {
    super(props);
    document.title = "Turtle Football";
  }

  render() {
    return (
      <Page>
        <h1 className="h1-ff5 text-center mt-3">Welcome to Turtle Football!</h1>
        <div className="text-center">
          <img
            src="/assets/images/slide/american-football-1493087_1920.jpg"
            style={{ maxWidth: "900px", height: "auto" }}
            alt="Turtle Football"
          />
        </div>
      </Page>
    );
  }
}

export default FootballApp;
