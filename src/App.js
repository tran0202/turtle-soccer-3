import React from "react";

import Firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import config from "./config";
import logo from "./logo.svg";
import "./App.css";
import AppData from "./App.Data";
import ReactJson from "react-json-view";
import {
  Container,
  Row,
  Col,
  Card,
  CardGroup,
  CardHeader,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle,
  Form,
  FormGroup,
  Label,
  Button
} from "reactstrap";

class App extends React.Component {
  constructor(props) {
    super(props);
    Firebase.initializeApp(config);

    this.state = {
      docs: [],
      batchNumber: 0,
      batchData: null,
      staticStore: null
    };
  }

  findUploadBatch = batchNumber => {
    if (this.state.staticStore) {
      const batches = this.state.staticStore.batches;
      const batchIndex = batches.findIndex(batch => {
        return parseInt(batch.number, 10) === batchNumber;
      });
      const batch = batches[batchIndex];
      return batch;
    }
  };

  getUserData = () => {
    Firebase.firestore()
      .collection("sport")
      .get()
      .then(snapshot => {
        let tmp = [];
        snapshot.forEach(doc => {
          tmp.push({ id: doc.id, data: doc.data() });
        });
        this.setState({ docs: tmp, staticStore: AppData });
        window.sportStore = this.state;
        window.sportStaticStore = AppData;
      })
      .catch(err => {
        console.log("Error getting documents", err);
      });
  };

  writeUserData = () => {
    const batch = this.findUploadBatch(this.state.batchNumber);
    if (batch) {
      batch.rows.map(row => {
        const ts = Firebase.firestore.Timestamp.now()
          .toDate()
          .toLocaleString();
        Firebase.firestore()
          .collection("sport")
          .doc(row.id)
          .set({ ...row.data, timestamp: ts });
        return true;
      });
      this.getUserData();
      this.setState({ batchNumber: 0 });
    }
  };

  showUploadBatch = event => {
    event.preventDefault();
    const batchInput = parseInt(this.refs.batch.value, 10);
    if (this.refs.batch.value && batchInput > 0) {
      const batch = this.findUploadBatch(batchInput);
      this.setState({ batchData: batch });
    } else {
      this.setState({ batchData: null });
    }
  };

  componentDidMount() {
    this.getUserData();
  }

  componentDidUpdate(prevProps, prevState) {
    // check on previous state
    // only write when it's different with the new state
    if (prevState.batchNumber !== this.state.batchNumber) {
      this.writeUserData();
    }
  }

  handleSubmit = event => {
    event.preventDefault();
    const batchInput = parseInt(this.refs.batch.value, 10);
    const { docs } = this.state;
    if (this.refs.batch.value && batchInput > 0) {
      this.setState({ docs, batchNumber: batchInput });
    }
  };

  removeData = id => {
    const { docs } = this.state;
    Firebase.firestore()
      .collection("sport")
      .doc(id)
      .delete();
    const newState = docs.filter(doc => {
      return doc.id !== id;
    });
    this.setState({ docs: newState });
  };

  render() {
    const { docs, batchData } = this.state;
    // console.log('batchData', batchData)
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <Container>
          <Row>
            <Col sm="12">
              <h1>Which sport are you interested in?</h1>
            </Col>
          </Row>
          <Row>
            <Col sm="12">
              <CardGroup>
                {docs.map(doc => (
                  <Card key={doc.id} className="text-left">
                    <CardHeader>{doc.id}</CardHeader>
                    <CardBody>
                      <CardTitle>{doc.data.name}</CardTitle>
                      <CardText>
                        {doc.data.route}
                        <br></br>
                        {doc.data.timestamp}
                      </CardText>
                      <Button
                        onClick={() => this.removeData(doc.id)}
                        className="btn btn-link text-white float-right"
                        color="danger"
                      >
                        Delete
                      </Button>
                    </CardBody>
                  </Card>
                ))}
              </CardGroup>
            </Col>
          </Row>
        </Container>
        <Container className="mt-5">
          <Row>
            <Col sm="12">
              <h1>Add/Update sport</h1>
            </Col>
          </Row>
          <Row>
            <Col sm="3">
              <Form onSubmit={this.handleSubmit}>
                <FormGroup row>
                  <Label for="batchNumber" sm={3}>
                    Batch
                  </Label>
                  <Col sm={9}>
                    <input
                      type="text"
                      ref="batch"
                      className="form-control"
                      placeholder="Batch#"
                      onChange={this.showUploadBatch}
                    />
                  </Col>
                </FormGroup>
                <FormGroup check row>
                  <Col sm={{ size: 9, offset: 3 }}>
                    <Button
                      type="submit"
                      className="btn btn-primary"
                      color="primary"
                    >
                      Add
                    </Button>
                  </Col>
                </FormGroup>
              </Form>
            </Col>
            <Col sm="9">
              <Card body className="text-left">
                <CardSubtitle className="mb-3">To be added...</CardSubtitle>
                {batchData && <ReactJson src={batchData} />}
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
