import React from 'react'
import { Row, Col, Nav, NavItem, NavLink } from 'reactstrap'
import moment from 'moment'

const HeaderLinks = (props) => {
  const { page } = props
  return (
    <Nav className="justify-content-center">
      <NavItem>
        <NavLink disabled={page === 'home' || page === 'matches'} href="/soccer/tournament/WC2018/matches">
          Matches
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink disabled={page === 'groups'} href="/soccer/tournament/WC2018/groups">
          Groups
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink disabled={page === 'standings'} href="/soccer/tournament/WC2018/standings">
          Final standings
        </NavLink>
      </NavItem>
    </Nav>
  )
}

class Header extends React.Component {
  render() {
    const { param } = this.props
    const { tournament, tournamentType } = param
    return (
      <Row className="mt-3 text-center">
        <Col lg={{ size: 2, offset: 2 }} md={{ size: 2, offset: 1 }} sm="3" className="mt-3 mb-2">
          <img src={`/assets/images/${tournamentType.logo_path}/${tournament.logo_filename}`} alt={tournament.name} />
        </Col>
        <Col lg="7" md="9" sm="9">
          <h1 className="h1-ff5 text-center mt-3 mb-2 tournament-title" style={{ color: tournament.color }}>
            {tournament.name}
          </h1>
          {moment(tournament.start_date).format('MMMM D, YYYY')} - {moment(tournament.end_date).format('MMMM D, YYYY')}
          <HeaderLinks page={this.props.page} />
        </Col>
      </Row>
    )
  }
}

export default Header
