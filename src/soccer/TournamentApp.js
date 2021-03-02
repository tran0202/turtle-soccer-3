import React from 'react'
import TournamentTypeArray from '../data/TournamentType.json'
import TournamentDataCurrent from '../data/soccer/tournamentData/TournamentDataCurrent.json'
import QualificationTournamentDataCurrent from '../data/soccer/qualTournamentData/QualificationTournamentDataCurrent.json'
import Page from '../core/Page'
import { Style } from '../core/Utilities'
import Header from './Header'
import About from './About'
import Matches from './Matches'
import Groups from './Groups'
import FinalStandings from './FinalStandings'
import Qualification from './Qualification'
import {
  getCurrentTournament,
  getTournamentArray,
  getTournamentDataArray,
  getQualificationTournamentArray,
  getQualificationTournamentDataArray,
} from './DataHelper'
import { Container } from 'reactstrap'

class TournamentApp extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      tournament: null,
      tournamentType: null,
    }
  }
  getSortedTournamentArray = (tournament_type_id) => {
    const ta = getTournamentArray().filter((t) => t.tournament_type_id === tournament_type_id)
    ta.sort((a, b) => {
      return a > b ? 1 : -1
    })
    return ta
  }

  getPreviousTournament = (tournament_type_id, current_id) => {
    const ta = this.getSortedTournamentArray(tournament_type_id)
    const current_tournament_index = ta.findIndex((t) => t.id === current_id)
    return current_tournament_index !== -1 && current_tournament_index !== 0
      ? { id: ta[current_tournament_index - 1].id, year: ta[current_tournament_index - 1].year }
      : null
  }

  getNextTournament = (tournament_type_id, current_id) => {
    const ta = this.getSortedTournamentArray(tournament_type_id)
    const current_tournament_index = ta.findIndex((t) => t.id === current_id)
    // console.log('current_tournament_index', current_tournament_index)
    return current_tournament_index !== -1 && current_tournament_index !== ta.length - 1
      ? { id: ta[current_tournament_index + 1].id, year: ta[current_tournament_index + 1].year }
      : null
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
    } else if (`${this.props.query.id}_${this.props.query.cid}` === getCurrentTournament().qualificationTournament) {
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
    return { existed, ...qt, stages: this.getQualificationTournamentData().stages, confed_length: qta.length, confed_names }
  }

  getTournamentData = () => {
    const tf = getTournamentDataArray().find((tf) => tf.id === this.props.query.id)
    if (tf) {
      return tf
    } else if (this.props.query.id === getCurrentTournament().tournament) {
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
          previous_tournament: this.getPreviousTournament(t.tournament_type_id, this.props.query.id),
          next_tournament: this.getNextTournament(t.tournament_type_id, this.props.query.id),
          stages: this.getTournamentData().stages,
          leagues: this.getTournamentData().leagues,
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
        <Style tournamentType={tournamentType} />
        <Container>
          {tournament && tournamentType && (
            <React.Fragment>
              <Header state={this.state} query={query} />
              {page === 'about' && <About tournament={tournament} tournamentType={tournamentType} />}
              {page === 'matches' && <Matches tournament={tournament} tournamentType={tournamentType} />}
              {page === 'groups' && <Groups tournament={tournament} tournamentType={tournamentType} />}
              {page === 'finalstandings' && <FinalStandings tournament={tournament} tournamentType={tournamentType} />}
              {page === 'qualification' && <Qualification tournament={tournament} tournamentType={tournamentType} query={query} />}
            </React.Fragment>
          )}
        </Container>
      </Page>
    )
  }
}

export default TournamentApp
