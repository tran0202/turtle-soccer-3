import React from "react"

import Firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"
import config from "./config"
import logo from "./logo.svg"
import "./App.css"
import AppData from "./App.Data"
import ReactJson from 'react-json-view'
import { Button, Card, CardText } from "reactstrap"

class App extends React.Component {
  constructor(props) {
    super(props)
    Firebase.initializeApp(config)

    this.state = {
      docs: [],
      batchNumber: 0,
      batchData: null,
      staticStore: null
    }
  }

  findUploadBatch = batchNumber => {
    if (this.state.staticStore) {
      const batches = this.state.staticStore.batches
      const batchIndex = batches.findIndex(batch => {
        return parseInt(batch.number, 10) === batchNumber
      })
      const batch = batches[batchIndex]
      return batch
    }
  }

  getUserData = () => {
    Firebase.firestore()
      .collection("sport")
      .get()
      .then(snapshot => {
        let tmp = []
        snapshot.forEach(doc => {
          tmp.push({ id: doc.id, data: doc.data() })
        })
        this.setState({ docs: tmp, staticStore: AppData })
        window.sportStore = this.state
        window.sportDataStore = AppData
      })
      .catch(err => {
        console.log("Error getting documents", err)
      })
  }

  writeUserData = () => {
    const batch = this.findUploadBatch(this.state.batchNumber)
    if (batch) {
      batch.rows.map(row => {
        const ts = Firebase.firestore.Timestamp.now()
          .toDate()
          .toLocaleString()
        Firebase.firestore()
          .collection("sport")
          .doc(row.id)
          .set({ ...row.data, timestamp: ts })
        return true
      })
      this.getUserData()
      this.setState({ batchNumber: 0 })
    }
  }

  showUploadBatch = event => {
    event.preventDefault()
    const batchInput = parseInt(this.refs.batch.value, 10)
    if (this.refs.batch.value && batchInput > 0) {
      const batch = this.findUploadBatch(batchInput)
      this.setState({ batchData: batch })
    }
    else {
      this.setState({ batchData: null })
    }
  }

  componentDidMount() {
    this.getUserData()
  }

  componentDidUpdate(prevProps, prevState) {
    // check on previous state
    // only write when it's different with the new state
    if (prevState.batchNumber !== this.state.batchNumber) {
      this.writeUserData()
    }
  }

  handleSubmit = event => {
    event.preventDefault()
    const batchInput = parseInt(this.refs.batch.value, 10)
    const { docs } = this.state
    if (this.refs.batch.value && batchInput > 0) {
      this.setState({ docs, batchNumber: batchInput })
    }
  }

  render() {
    const { docs, batchData } = this.state
    // console.log('batchData', batchData)
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>Which sport are you interested in?</p>
          {docs.map(doc => (
            <p key={doc.id}>
              {doc.id} => {doc.data.name} {doc.data.route} {doc.data.timestamp}
            </p>
          ))}
        </header>
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <h1>Add new sport below</h1>
            </div>
            <div className="col-sm-6">
              <form onSubmit={this.handleSubmit}>
                <div className="form-row">
                  <input type="hidden" ref="id" />
                  <div className="form-group col-md-6">
                    <label>Batch </label>
                    <input
                      type="text"
                      ref="batch"
                      className="form-control"
                      placeholder="Batch number"
                      onChange={this.showUploadBatch}
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="btn btn-primary"
                  color="primary"
                >
                  Add
                </Button>
              </form>
            </div>
            <div className="col-sm-6">
              <label>To be added </label>
              <Card body className="text-left">
                <CardText>
                  { batchData && <ReactJson src={batchData}/>}
                </CardText>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // render() {
  //   const { developers } = this.state;
  //   return(
  //     <div className="container">
  //       <div className="row">
  //         <div className='col-xl-12'>
  //           <h1>Firebase Development Team</h1>
  //         </div>
  //       </div>
  //       <div className='row'>
  //         <div className='col-xl-12'>
  //         {
  //           developers
  //           .map(developer =>
  //             <div key={developer.uid} className="card float-left" style={{width: '18rem', marginRight: '1rem'}}>
  //               <div className="card-body">
  //                 <h5 className="card-title">{ developer.name }</h5>
  //                 <p className="card-text">{ developer.role }</p>
  //                 <button onClick={ () => this.removeData(developer) } className="btn btn-link">Delete</button>
  //                 <button onClick={ () => this.updateData(developer) } className="btn btn-link">Edit</button>
  //               </div>
  //             </div>
  //             )
  //         }
  //         </div>
  //       </div>
  //       <div className='row'>
  //         <div className='col-xl-12'>
  //           <h1>Add new team member here</h1>
  //           <form onSubmit={ this.handleSubmit }>
  //             <div className="form-row">
  //               <input type='hidden' ref='uid' />
  //               <div className="form-group col-md-6">
  //                 <label>Name</label>
  //                 <input type="text" ref='name' className="form-control" placeholder="Name" />
  //               </div>
  //               <div className="form-group col-md-6">
  //                 <label>Role</label>
  //                 <input type="text" ref='role' className="form-control" placeholder="Role" />
  //               </div>
  //             </div>
  //             <button type="submit" className="btn btn-primary">Save</button>
  //           </form>
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }

  // removeData = (developer) => {
  //   const { developers } = this.state;
  //   const newState = developers.filter(data => {
  //     return data.uid !== developer.uid;
  //   });
  //   this.setState({ developers: newState });
  // }

  // updateData = (developer) => {
  //   this.refs.uid.value = developer.uid;
  //   this.refs.name.value = developer.name;
  //   this.refs.role.value = developer.role;
  // }
}

export default App
