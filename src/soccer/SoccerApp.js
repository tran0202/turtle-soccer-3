import React, { useState } from 'react'
import 'firebase/auth'
import 'firebase/firestore'
import ConfederationIds from '../data/ConfederationId.json'
import TournamentTypeArray from '../data/TournamentType.json'
import TournamentArray from '../data/Tournament.json'
import Page from '../core/Page'
import { Container, TabContent, TabPane, Nav, NavItem, NavLink, Row, Col, ListGroup, ListGroupItem } from 'reactstrap'
import classnames from 'classnames'

const GetTabs = (props) => {
  const { store } = props
  const { tournamentTypeArrayByConfed, tournamentArrayByType } = store
  const [activeTab, setActiveTab] = useState('FIFA')

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab)
  }

  return (
    <React.Fragment>
      <Nav tabs>
        {ConfederationIds.map((confed) => {
          const logoSrc = `/assets/images/logos/${confed}.png`
          return (
            <NavItem key={confed} className="confed-tab">
              <NavLink
                className={classnames({ active: activeTab === confed })}
                onClick={() => {
                  toggle(confed)
                }}
              >
                <img src={logoSrc} alt={confed} style={{ height: '35px' }} className="img-fluid" />
              </NavLink>
            </NavItem>
          )
        })}
      </Nav>
      <TabContent className="mt-3" activeTab={activeTab}>
        {ConfederationIds.map((confed) => (
          <TabPane key={confed} tabId={confed}>
            <Row>
              <Col sm="12">
                <ListGroup flush>
                  {tournamentTypeArrayByConfed[confed] && (
                    <React.Fragment>
                      {tournamentTypeArrayByConfed[confed].map((tt) => (
                        <ListGroupItem key={tt.id}>
                          <h2 className="h2-ff1">{tt.name}</h2>
                          {tournamentArrayByType[tt.id] && (
                            <section className="tournaments section-bg">
                              <div className="container">
                                <div className="row">
                                  {tournamentArrayByType[tt.id].map((t) => (
                                    <div key={t.id} className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-6 text-center" data-aos="fade-up">
                                      <div className="tournament-box">
                                        <img
                                          src={`/assets/images/${tt.logo_path}/${t.logo_filename}`}
                                          alt={t.name}
                                          className="card-img-top-height-100 mx-auto"
                                        />
                                        <p className="text-center font-bold mt-3">{t.name}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </section>
                          )}
                        </ListGroupItem>
                      ))}
                    </React.Fragment>
                  )}
                </ListGroup>
              </Col>
            </Row>
          </TabPane>
        ))}
      </TabContent>
    </React.Fragment>
  )
}

class SoccerApp extends React.Component {
  constructor(props) {
    super(props)
    document.title = 'Turtle Soccer'

    this.state = {
      tournamentArrayByType: [],
      tournamentTypeArrayByConfed: [],
    }
  }

  getTournamentTypeArrayByConfed = () => {
    let tta = []
    ConfederationIds.forEach((confed) => {
      tta[confed] = []
    })
    TournamentTypeArray.forEach((tt) => {
      if (tt.sport_id === 'SOC') {
        tta[tt.confederation_id].push(tt)
      }
    })
    this.setState({ tournamentTypeArrayByConfed: tta })
  }

  getTournamentArrayByType = () => {
    let result = []
    let tmp = []
    TournamentTypeArray.forEach((tt) => {
      tmp[tt.id] = []
      result[tt.id] = []
    })
    TournamentArray.forEach((doc) => {
      if (doc.tournament_type_id !== '') {
        tmp[doc.tournament_type_id].push(doc)
      }
    })
    TournamentTypeArray.forEach((tt) => {
      tmp[tt.id].forEach((t) => {
        result[tt.id].push(t)
      })
    })
    this.setState({ tournamentArrayByType: result })
  }

  getData = () => {
    this.getTournamentTypeArrayByConfed()
    this.getTournamentArrayByType()
  }

  componentDidMount() {
    this.getData()
  }

  componentDidUpdate() {
    window.tournamentStore = this.state
    // console.log('this.state', this.state)
  }

  render() {
    return (
      <Page>
        <Container>
          <h1 className="h1-ff5 text-center mt-3 mb-5">Tournaments around the World</h1>
          <GetTabs store={this.state} />
        </Container>
      </Page>
    )
  }
}

export default SoccerApp
