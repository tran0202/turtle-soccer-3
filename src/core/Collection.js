import React from "react";
import Firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { InitFirebase, GetCollection } from "./Helper";
import ReactJson from "react-json-view";
import {
  Container,
  Row,
  Col,
  Card,
  CardSubtitle,
  Form,
  FormGroup,
  Label,
  Button,
  Table
} from "reactstrap";

class Collection extends React.Component {
  constructor(props) {
    super(props);
    InitFirebase();

    this.state = {
      docs: [],
      batchNumber: 0,
      batchData: null,
      staticStore: null
    };
  }

  findUploadBatch = batchNumber => {
    if (this.state.staticStore) {
      const { batches } = this.state.staticStore;
      const batchIndex = batches.findIndex(batch => {
        return parseInt(batch.number) === batchNumber;
      });
      return batches[batchIndex];
    }
  };

  getData = props => {
    const { param } = this.props;
    const { staticData, setWindowObjects } = param;
    this.setState({ docs: props, staticStore: staticData });
    setWindowObjects(this.state);
  };

  writeData = () => {
    const { param } = this.props;
    const { name } = param;
    const batch = this.findUploadBatch(this.state.batchNumber);
    if (batch) {
      batch.rows.map(row => {
        const ts = Firebase.firestore.Timestamp.now()
          .toDate()
          .toLocaleString();
        Firebase.firestore()
          .collection(name)
          .doc(row.id)
          .set({ ...row.data, time_stamp: ts });
        return true;
      });
      GetCollection({ name, callback: this.getData });
      this.setState({ batchNumber: 0 });
    }
  };

  removeData = id => {
    const { docs } = this.state;
    const { param } = this.props;
    const { name } = param;
    if (name) {
      Firebase.firestore()
        .collection(name)
        .doc(id)
        .delete();
      const newState = docs.filter(doc => {
        return doc.id !== id;
      });
      GetCollection({ name, callback: this.getData });
      this.setState({ docs: newState });
    }
  };

  showUploadBatch = event => {
    event.preventDefault();
    if (this.refs.batch.value && parseInt(this.refs.batch.value) > 0) {
      const batch = this.findUploadBatch(parseInt(this.refs.batch.value));
      this.setState({ batchData: batch });
    } else {
      this.setState({ batchData: null });
    }
  };

  handleSubmit = event => {
    event.preventDefault();
    const { docs } = this.state;
    if (this.refs.batch.value && parseInt(this.refs.batch.value) > 0) {
      this.setState({ docs, batchNumber: parseInt(this.refs.batch.value) });
    }
  };

  componentDidMount() {
    const { param } = this.props;
    const { name, orderBy, where } = param;
    GetCollection({ name, orderBy, where, callback: this.getData });
  }

  componentDidUpdate(prevProps, prevState) {
    // check on previous state, only write when it's different with the new state
    if (prevState.batchNumber !== this.state.batchNumber) {
      this.writeData();
    }
  }

  displayTable = () => {
    const { docs } = this.state;
    const { param } = this.props;
    const { displayHeader, displayRow } = param;
    return (
      <Table striped borderless hover size="sm">
        <thead>{displayHeader()}</thead>
        <tbody>
          {docs.map((doc, index) => (
            <React.Fragment key={doc.id}>
              {index !== 0 && index % 10 === 0 && displayHeader()}
              <tr>
                <td>{index + 1}</td>
                {displayRow(doc)}
                <td>
                  <Button
                    onClick={() => this.removeData(doc.id)}
                    className="btn btn-link text-white"
                    color="danger"
                    size="sm"
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </Table>
    );
  };

  render() {
    const { batchData } = this.state;
    // console.log('batchData', batchData)
    const { param } = this.props;
    const { name } = param;
    return (
      <React.Fragment>
        <Container>
          <Row className="mb-5">
            <Col sm="12">
              <a href="/">Turtle Soccer</a> |{" "}
              <a href="/admin">Firestore Admin Home</a>
            </Col>
          </Row>
          <Row>
            <Col sm="12">
              <h1>
                Collection <span className="font-italic">{name}</span>
              </h1>
            </Col>
          </Row>
          <Row>
            <Col sm="12">{this.displayTable()}</Col>
          </Row>
        </Container>
        <Container className="mt-5 mb-5">
          <Row>
            <Col sm="12">
              <h1>
                Add/Update <span className="font-italic">{name}</span>
              </h1>
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
          <Row className="mt-5">
            <Col sm="12">
              <a href="/admin">Firestore Admin Home</a>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

export default Collection;
