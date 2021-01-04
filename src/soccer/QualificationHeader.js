import React from 'react'
import { getTournamentTitleFont } from './Helper'
import { Row, Col, Nav, NavItem, NavLink } from 'reactstrap'
import moment from 'moment'

const hasAnyGroups = (qTournament) => {
  if (!qTournament.stages) return false
  const rrStage = qTournament.stages.find((s) => s.type === 'roundrobin')
  if (!rrStage) return false
  return rrStage.groups && rrStage.groups.length > 0
}

const hasMdGroups = (qTournament) => {
  if (!qTournament.stages) return false
  const rrmdStage = qTournament.stages.find((s) => s.type === 'roundrobinmatchday')
  if (!rrmdStage) return false
  return rrmdStage.groups ? rrmdStage.groups.length : 0
}

const PageLinks = (props) => {
  const { query, qTournament } = props
  const { id, cid, qPage } = query

  return (
    <Nav className="justify-content-center">
      <NavItem>
        <NavLink disabled={qPage === 'about'} href={`/soccer/tournament/${id}/qualification/${cid}`}>
          About
        </NavLink>
      </NavItem>
      {qTournament.stages && (
        <NavItem>
          <NavLink disabled={qPage === 'matches'} href={`/soccer/tournament/${id}/qualification/${cid}/matches`}>
            Matches
          </NavLink>
        </NavItem>
      )}
      {(hasAnyGroups(qTournament) || hasMdGroups(qTournament) > 1) && (
        <NavItem>
          <NavLink disabled={qPage === 'groups'} href={`/soccer/tournament/${id}/qualification/${cid}/groups`}>
            Groups
          </NavLink>
        </NavItem>
      )}
      {hasMdGroups(qTournament) === 1 && (
        <NavItem>
          <NavLink disabled={qPage === 'standings'} href={`/soccer/tournament/${id}/qualification/${cid}/standings`}>
            Standings
          </NavLink>
        </NavItem>
      )}
    </Nav>
  )
}

class QualificationHeader extends React.Component {
  render() {
    const { qTournament, query, tournamentType } = this.props
    const { cid } = query
    const logoSrc = `/assets/images/logos/${cid}.png`
    // console.log('qTournamnent', qTournament)
    return (
      <React.Fragment>
        {qTournament && (
          <Row className="mt-3 text-center">
            <Col lg="2" md="2" sm="3" className="mt-3 mb-2">
              <img src={logoSrc} alt={cid} title={cid} className="img-fluid" />
            </Col>
            <Col lg="10" md="9" sm="9">
              <h1
                className={`text-center mt-3 mb-2 ${getTournamentTitleFont(tournamentType)}`}
                style={{ color: qTournament.details ? qTournament.details.color : '#000' }}
              >
                {qTournament.name}
              </h1>
              {qTournament.details && qTournament.details.start_date && moment(qTournament.details.start_date).format('MMMM D, YYYY')} &mdash;&nbsp;
              {qTournament.details && qTournament.details.end_date && moment(qTournament.details.end_date).format('MMMM D, YYYY')}
              <PageLinks query={query} qTournament={qTournament} />
            </Col>
          </Row>
        )}
      </React.Fragment>
    )
  }
}

export default QualificationHeader
