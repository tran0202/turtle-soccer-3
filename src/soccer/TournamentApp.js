import React from 'react'
import TournamentTypeArray from '../data/TournamentType.json'
import TournamentArray from '../data/Tournament.json'
import TournamentFormatArray from '../data/TournamentFormat.json'
import Page from '../core/Page'
import Header from './Header'
import Matches from './Matches'
import Groups from './Groups'
import Standings from './Standings'
import { Container } from 'reactstrap'

class TournamentApp extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      tournament: null,
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

  getTournamentFormat = () => {
    const tf = TournamentFormatArray.find((tf) => tf.id === this.props.id)
    if (tf) {
      return tf
    } else {
      console.log('Tournament format error', tf)
      return null
    }
  }

  getTournament = () => {
    const t = TournamentArray.find((t) => t.id === this.props.id)
    if (t) {
      this.setState({ tournament: { ...t, stages: this.getTournamentFormat().stages } })
      this.getTournamentType(t.tournament_type_id)
    } else {
      console.log('Tournament error', t)
    }
  }

  getData = () => {
    this.getTournament()
  }

  componentDidMount() {
    this.getData()
  }

  componentDidUpdate() {
    document.title = `${this.state.tournament.name} - Turtle Soccer`
    window.tournamentStore = this.state
  }

  render() {
    const { tournament, tournamentType } = this.state
    const { page } = this.props
    return (
      <Page>
        <Container>
          {tournament && tournamentType && (
            <React.Fragment>
              <Header param={this.state} page={this.props.page} />
              {(page === 'home' || page === 'matches') && <Matches tournament={tournament} />}
              {page === 'groups' && <Groups tournament={tournament} tournamentType={tournamentType} />}
              {page === 'standings' && <Standings tournament={tournament} />}
            </React.Fragment>
          )}
        </Container>
      </Page>
    )
  }
}

export default TournamentApp
