import React from "react";
import "firebase/auth";
import "firebase/firestore";
import { InitFirebase, GetCollection, Join } from "./core/Helper";
import Page from "./core/Page";

class App extends React.Component {
  constructor(props) {
    super(props);
    document.title = "Turtle Soccer";
    InitFirebase();

    this.state = {
      docs: []
    };
  }

  getTournamentType = props => {
    this.setState({ docs: props });
    window.tournamentTypeStore = this.state;
  };

  getTournament = props => {
    const tournamentType = this.state;
    const tournament = { docs: props };
    const result = Join(tournament, "tournament_type_id", tournamentType);
    this.setState(result);
    window.tournamentStore = this.state;
    // console.log("this.state", this.state);
  };

  getData = () => {
    GetCollection({
      name: "tournament_type",
      callback: this.getTournamentType
    });
    GetCollection({
      name: "tournament",
      orderBy: ["tournament_type_id", "start_date"],
      where: { left: "tournament_type_id", op: ">", right: "" },
      callback: this.getTournament
    });
  };

  componentDidMount() {
    this.getData();
  }

  render() {
    return (
      <Page>
        <h1 className="text-center">Welcome to Turtle Soccer!</h1>
        <h2 className="text-center">Tournaments around the World</h2>
      </Page>
    );
  }
}

export default App;
