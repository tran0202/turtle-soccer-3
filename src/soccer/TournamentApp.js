import React from 'react'
import TournamentTypeArray from '../data/TournamentType.json'
import TournamentDataCurrent from '../data/soccer/TournamentDataCurrent.json'
import QualificationTournamentDataCurrent from '../data/soccer/QualificationTournamentDataCurrent.json'
import Page from '../core/Page'
import Header from './Header'
import Intro from './About'
import Matches from './Matches'
import Groups from './Groups'
import FinalStandings from './FinalStandings'
import Qualification from './Qualification'
import { getTournamentArray, getTournamentDataArray, getQualificationTournamentArray, getQualificationTournamentDataArray } from './Helper'
import { Container } from 'reactstrap'

class TournamentApp extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      tournament: null,
      tournamentType: null,
      currentTournament: 'WC2022',
      currentQualificationTournament: 'WC2022_CONMEBOL',
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

  getQualificationTournamentData = () => {
    const qtd = getQualificationTournamentDataArray().find((qtd) => qtd.id === `${this.props.query.id}_${this.props.query.cid}`)
    if (qtd) {
      return qtd
    } else if (`${this.props.query.id}_${this.props.query.cid}` === this.state.currentQualificationTournament) {
      return QualificationTournamentDataCurrent
    } else {
      console.log('Qualification Tournament format error', qtd)
      return {}
    }
  }

  getQualificationTournament = () => {
    const qta = getQualificationTournamentArray().filter((qt) => qt.tournament_id === this.props.query.id)
    let confed_names = []
    qta.forEach((qt) => {
      confed_names.push(qt.confederation_id)
    })
    const qt = getQualificationTournamentArray().find((qt) => qt.tournament_id === this.props.query.id && qt.confederation_id === this.props.query.cid)
    const existed = qt ? true : false
    // console.log('qt', { ...qt, length: qta.length })
    return { existed, ...qt, stages: this.getQualificationTournamentData().stages, confed_length: qta.length, confed_names }
  }

  getTournamentData = () => {
    const tf = getTournamentDataArray().find((tf) => tf.id === this.props.query.id)
    if (tf) {
      return tf
    } else if (this.props.query.id === this.state.currentTournament) {
      return TournamentDataCurrent
    } else {
      console.log('Tournament format error', tf)
      return {}
    }
  }

  getTournament = () => {
    const t = getTournamentArray().find((t) => t.id === this.props.query.id)
    if (t) {
      this.setState({
        tournament: {
          ...t,
          stages: this.getTournamentData().stages,
          qualification: { ...this.getQualificationTournament() },
        },
      })
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
    const { query } = this.props
    const { page } = query
    return (
      <Page>
        <Container>
          {tournament && tournamentType && (
            <React.Fragment>
              <Header state={this.state} query={query} />
              {page === 'about' && <Intro tournament={tournament} />}
              {page === 'matches' && <Matches tournament={tournament} />}
              {page === 'groups' && <Groups tournament={tournament} tournamentType={tournamentType} />}
              {page === 'finalstandings' && <FinalStandings tournament={tournament} />}
              {page === 'qualification' && <Qualification tournament={tournament} tournamentType={tournamentType} query={query} />}
            </React.Fragment>
          )}
        </Container>
      </Page>
    )
  }
}

export default TournamentApp
