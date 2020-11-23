import React from 'react'
import TournamentTypeArray from '../data/TournamentType.json'
import TournamentArray from '../data/Tournament.json'
import TournamentFormatArray from '../data/TournamentFormat.json'
import QualificationTournamentArray from '../data/QualificationTournament.json'
import TournamentFormatCurrent from '../data/TournamentFormatCurrent.json'
import Page from '../core/Page'
import Header from './Header'
import Intro from './Intro'
import Matches from './Matches'
import Groups from './Groups'
import Standings from './Standings'
import Qualification from './Qualification'
import { Container } from 'reactstrap'

class TournamentApp extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      tournament: null,
      tournamentType: null,
      currentTournament: 'WC2022',
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
    const tf = TournamentFormatArray.find((tf) => tf.id === this.props.query.id)
    if (tf) {
      return tf
    } else if (this.props.query.id === this.state.currentTournament) {
      return TournamentFormatCurrent
    } else {
      console.log('Tournament format error', tf)
      return { stages: [] }
    }
  }

  getTournament = () => {
    // console.log('this.props.query.id', this.props.query.id)
    const t = TournamentArray.find((t) => t.id === this.props.query.id)
    if (t) {
      this.setState({ tournament: { ...t, stages: this.getTournamentFormat().stages, qualification: this.getQualificationTournamentArrayByConfed() } })
      this.getTournamentType(t.tournament_type_id)
    } else {
      console.log('Tournament error', t)
    }
  }

  getQualificationTournamentArrayByConfed = () => {
    const qta = QualificationTournamentArray.filter((qt) => qt.tournament_id === this.props.query.id)
    let qtabc = []
    qta.forEach((qt) => {
      qtabc[qt.confederation_id] = qt
    })
    return { tournaments: qtabc, length: qta.length }
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
    const { query } = this.props
    const { page } = query
    return (
      <Page>
        <Container>
          {tournament && tournamentType && (
            <React.Fragment>
              <Header state={this.state} query={query} />
              {page === 'intro' && <Intro tournament={tournament} />}
              {page === 'matches' && <Matches tournament={tournament} />}
              {page === 'groups' && <Groups tournament={tournament} tournamentType={tournamentType} />}
              {page === 'standings' && <Standings tournament={tournament} />}
              {page === 'qualification' && <Qualification tournament={tournament} tournamentType={tournamentType} query={query} />}
            </React.Fragment>
          )}
        </Container>
      </Page>
    )
  }
}

export default TournamentApp
