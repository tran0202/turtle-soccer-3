import React from 'react'
import { getTournamentConfig, getRoundRobinStages } from './Helper'
import { Row, Col, Nav, NavItem, NavLink } from 'reactstrap'
import moment from 'moment'

const HeaderLinks = (props) => {
  const { tournament, tournamentType, query } = props
  const { page } = query
  const { id, active, qualification, stages } = tournament
  return (
    <Nav className="justify-content-center">
      {qualification.confed_length > 0 && active && (
        <NavItem>
          <NavLink disabled={page === 'qualification'} href={`/soccer/tournament/${id}/qualification`}>
            Qualification
          </NavLink>
        </NavItem>
      )}
      {stages && (
        <React.Fragment>
          <NavItem>
            <NavLink disabled={page === 'matches'} href={`/soccer/tournament/${id}/matches`}>
              Matches
            </NavLink>
          </NavItem>
          {getRoundRobinStages(stages).length > 0 && (
            <NavItem>
              <NavLink disabled={page === 'groups'} href={`/soccer/tournament/${id}/groups`}>
                Groups
              </NavLink>
            </NavItem>
          )}
          <NavItem>
            <NavLink disabled={page === 'finalstandings'} href={`/soccer/tournament/${id}/finalstandings`}>
              Final standings
            </NavLink>
          </NavItem>
        </React.Fragment>
      )}
      {qualification.confed_length > 0 && !active && (
        <NavItem>
          <NavLink disabled={page === 'qualification'} href={`/soccer/tournament/${id}/qualification`}>
            Qualification
          </NavLink>
        </NavItem>
      )}
      <NavItem>
        <NavLink href={`/soccer/competition/${tournamentType.id}`}>More {tournamentType.name}</NavLink>
      </NavItem>
    </Nav>
  )
}

class Header extends React.Component {
  render() {
    const { state, query } = this.props
    const { tournament, tournamentType } = state
    const { details } = getTournamentConfig(tournament)
    return (
      <Row className="mt-3 text-center">
        <Col lg={{ size: 2, offset: 2 }} md={{ size: 2, offset: 1 }} sm="3" className="mt-3 mb-2">
          <a href={`/soccer/tournament/${tournament.id}`}>
            <img className="card-img-top-height-100" src={`/assets/images/${tournamentType.logo_path}/${details.logo_filename}`} alt={tournament.name} />
          </a>
        </Col>
        <Col lg="7" md="9" sm="9">
          <h1 className="h1-ff5 text-center mt-3 mb-2 tournament-title" style={{ color: details.color }}>
            {tournament.name}
          </h1>
          {moment(details.start_date).format('MMMM D, YYYY')} &mdash; {moment(details.end_date).format('MMMM D, YYYY')}
          <HeaderLinks tournament={tournament} tournamentType={tournamentType} query={query} />
        </Col>
      </Row>
    )
  }
}

export default Header
