import React from 'react'
import TournamentTypeArray from '../data/TournamentType.json'
import Page from '../core/Page'
import { getTournamentArray } from './Helper'
import { Row, Col, Nav, NavItem, NavLink, Container } from 'reactstrap'
import CompetitionAbout from './CompetitionAbout'

const CompHeaderLinks = (props) => {
  const { query } = props
  const { page, id } = query
  return (
    <Nav className="justify-content-center">
      <NavItem>
        <NavLink disabled={page === 'about'} href={`/soccer/competition/${id}`}>
          About
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink disabled={page === 'alltimestandings'} href={`/soccer/competition/${id}/alltimestandings`}>
          All-time standings
        </NavLink>
      </NavItem>
    </Nav>
  )
}

class CompetitionApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tournaments: null,
      tournamentType: null,
    }
  }

  getTournamentType = (tournament_type_id) => {
    const tt = TournamentTypeArray.find((tt) => tt.id === tournament_type_id)
    if (tt) {
      this.setState({ tournamentType: tt })
    } else {
      console.log('Tournament type error', tt)
    }
  }

  getCompetition = () => {
    const ta = getTournamentArray().filter((t) => t.tournament_type_id === this.props.query.id)
    if (ta) {
      this.setState({
        tournaments: ta,
      })
      this.getTournamentType(this.props.query.id)
    } else {
      console.log('Competition error', ta)
    }
  }

  getData = () => {
    this.getCompetition()
  }

  componentDidMount() {
    this.getData()
  }

  componentDidUpdate() {
    document.title = this.state.tournamentType ? `${this.state.tournamentType.name} - Turtle Soccer` : 'Turtle Soccer'
    window.competitionStore = this.state
  }

  render() {
    const { tournaments, tournamentType } = this.state
    const { query } = this.props
    const { page } = query
    return (
      <Page>
        <Container>
          <Row className="mt-3 text-center">
            <Col>
              <h1 className="h1-ff5 text-center mt-3 mb-2 tournament-title">{tournamentType ? tournamentType.name : ''}</h1>
              <CompHeaderLinks query={query} />
            </Col>
          </Row>
          {page === 'about' && <CompetitionAbout tournaments={tournaments} tournamentType={tournamentType} />}
        </Container>
      </Page>
    )
  }
}

export default CompetitionApp
