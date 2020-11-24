import React from 'react'
import { Row, Col, Nav, NavItem, NavLink } from 'reactstrap'
import moment from 'moment'

const PageLinks = (props) => {
  const { query } = props
  const { id, cid, qPage } = query

  return (
    <Nav className="justify-content-center">
      <NavItem>
        <NavLink disabled={qPage === 'intro'} href={`/soccer/tournament/${id}/qualification/${cid}`}>
          Introduction
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink disabled={qPage === 'matches'} href={`/soccer/tournament/${id}/qualification/${cid}/matches`}>
          Matches
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink disabled={qPage === 'groups'} href={`/soccer/tournament/${id}/qualification/${cid}/groups`}>
          Groups
        </NavLink>
      </NavItem>
    </Nav>
  )
}

class QualificationHeader extends React.Component {
  render() {
    const { qTournament, query } = this.props
    const { cid } = query
    const logoSrc = `/assets/images/logos/${cid}.png`
    // console.log('qTournamnent', qTournament)
    return (
      <React.Fragment>
        {qTournament && (
          <Row className="mt-3 text-center">
            <Col lg="2" md="2" sm="3" className="mt-3 mb-2">
              <img src={logoSrc} alt={cid} className="img-fluid" />
            </Col>
            <Col lg="10" md="9" sm="9">
              <h1 className="h1-ff5 text-center mt-3 mb-2 tournament-title" style={{ color: qTournament.details.color }}>
                {qTournament.name}
              </h1>
              {moment(qTournament.details.start_date).format('MMMM D, YYYY')} - {moment(qTournament.details.end_date).format('MMMM D, YYYY')}
              <PageLinks query={query} />
            </Col>
          </Row>
        )}
      </React.Fragment>
    )
  }
}

export default QualificationHeader
