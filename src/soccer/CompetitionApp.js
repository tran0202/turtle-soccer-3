import React from 'react'
import TournamentTypeArray from '../data/TournamentType.json'
import TournamentDataCurrent from '../data/soccer/TournamentDataCurrent.json'
import Page from '../core/Page'
import CompetitionAbout from './CompetitionAbout'
import AlltimeStandings from './AlltimeStandings'
import { getTournamentArray, getTournamentDataArray, getCurrentTournament } from './Helper'
import { Row, Col, Nav, NavItem, NavLink, Container } from 'reactstrap'

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
          All-time Standings
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

  getTournamentData = (id) => {
    const tf = getTournamentDataArray().find((tf) => tf.id === id)
    if (tf) {
      return tf
    } else if (id === getCurrentTournament().tournament) {
      return TournamentDataCurrent
    } else {
      console.log('Tournament format error', tf)
      return {}
    }
  }

  getCompetition = () => {
    const ta = getTournamentArray().filter((t) => t.tournament_type_id === this.props.query.id)
    if (ta) {
      ta.forEach((t) => {
        t.stages = this.getTournamentData(t.id).stages
      })
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
          {page === 'alltimestandings' && <AlltimeStandings tournaments={tournaments} />}
        </Container>
      </Page>
    )
  }
}

export default CompetitionApp
