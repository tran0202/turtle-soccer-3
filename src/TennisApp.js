import React from "react";
import Page from "./core/Page";

class TennisApp extends React.Component {
  constructor(props) {
    super(props);
    document.title = "Turtle Tennis";
  }

  render() {
    return (
      <Page>
        <h1 className="h1-ff5 text-center mt-3">Welcome to Turtle Tennis!</h1>
        <div className="text-center">
          <img
            src="/assets/images/slide/athletes-1866487_1920.jpg"
            style={{ maxWidth: "900px", height: "auto" }}
            alt="Turtle Tennis"
          />
        </div>
      </Page>
    );
  }
}

export default TennisApp;
