import React from 'react'
import 'firebase/auth'
import 'firebase/firestore'
import { InitFirebase, GetDocument } from '../firestore/Helper'
import { getRoundRobinStage } from '../core/Utilities'
import Page from '../core/Page'
import Header from './Header'
import Filter from './Filter'
import { Container, Row, Col } from 'reactstrap'

class TournamentApp extends React.Component {
  constructor(props) {
    super(props)
    document.title = 'Turtle Soccer - Tournament'
    InitFirebase()

    this.state = {
      doc: null,
      tournamentType: null,
    }
  }

  getLogoSrc = () => {
    const { doc } = this.state
    if (doc) {
      GetDocument({
        coll: 'tournament_type',
        id: doc.tournament_type_id,
        callback: (props) => {
          this.setState({ tournamentType: props })
          window.tournamentStore = this.state
        },
      })
    }
  }

  getTournament = (props) => {
    this.setState({ doc: { ...props, schedule: JSON.parse(props.format) } })
    this.getLogoSrc()
  }

  getData = () => {
    GetDocument({
      coll: 'tournament',
      id: 'WC2018',
      callback: this.getTournament,
    })
  }

  componentDidMount() {
    this.getData()
  }

  getAllMatches = () => {
    return <div>All Matches</div>
  }

  render() {
    const { doc, tournamentType } = this.state
    return (
      <Page>
        <Container className="match">
          {doc && tournamentType && (
            <React.Fragment>
              <Header param={this.state} />
              <Filter param={this.state} />
              {/* {doc.schedule.stages.map((stage) => (
                <React.Fragment key={stage.name}>
                  <Row className="mt-5">
                    <Col>
                      <h2 className="h2-ff1">{stage.name}</h2>
                    </Col>
                  </Row>
                </React.Fragment>
              ))} */}
              <Row className="match-container"></Row>
            </React.Fragment>
          )}
        </Container>
      </Page>
    )
  }
}

export default TournamentApp
