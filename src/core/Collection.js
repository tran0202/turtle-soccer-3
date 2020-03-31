import React from "react";
import Firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import config from "./config";
import ReactJson from "react-json-view";
import {
  Container,
  Row,
  Col,
  Card,
  CardColumns,
  CardHeader,
  CardBody,
  CardSubtitle,
  Form,
  FormGroup,
  Label,
  Button
} from "reactstrap";

class Collection extends React.Component {
  constructor(props) {
    super(props);
    if (Firebase.apps.length === 0) {
      Firebase.initializeApp(config);
    }

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

  getData = () => {
    const { param } = this.props;
    const { name, staticData, setWindowObjects } = param;
    if (name) {
      Firebase.firestore()
        .collection(name)
        .get()
        .then(snapshot => {
          let tmp = [];
          snapshot.forEach(doc => {
            tmp.push({ id: doc.id, data: doc.data() });
          });
          this.setState({ docs: tmp, staticStore: staticData });
          setWindowObjects(this.state);
        })
        .catch(err => {
          console.log(`Error getting ${name} documents`, err);
        });
    }
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
      this.getData();
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
      this.getData();
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
    this.getData();
  }

  componentDidUpdate(prevProps, prevState) {
    // check on previous state, only write when it's different with the new state
    if (prevState.batchNumber !== this.state.batchNumber) {
      this.writeData();
    }
  }

  render() {
    const { docs, batchData } = this.state;
    // console.log('batchData', batchData)
    const { param } = this.props;
    const { name, displayCard } = param;
    return (
      <React.Fragment>
        <Container>
          <Row>
            <Col sm="12">
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
            <Col sm="12">
              <CardColumns>
                {docs.map(doc => (
                  <Card key={doc.id}>
                    <CardHeader>{doc.id}</CardHeader>
                    <CardBody>
                      {displayCard(doc)}
                      <Button
                        onClick={() => this.removeData(doc.id)}
                        className="btn btn-link text-white float-right mb-3"
                        color="danger"
                      >
                        Delete
                      </Button>
                    </CardBody>
                  </Card>
                ))}
              </CardColumns>
            </Col>
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
        </Container>
      </React.Fragment>
    );
  }
}

export default Collection;
