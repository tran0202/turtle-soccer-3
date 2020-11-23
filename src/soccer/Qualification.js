import React from 'react'
import Intro from './Intro'
import { qualificationConfedIds } from './Helper'
import QualificationHeader from './QualificationHeader'
import { Nav, NavItem, NavLink, Row } from 'reactstrap'

const ConfederationLinks = (props) => {
  const { query } = props
  const { id, cid } = query
  return (
    <Nav className="justify-content-center qualification-confed-links">
      {qualificationConfedIds().map((confed) => {
        const _confed = confed !== 'QUALIFIED' ? confed : ''
        return (
          <NavItem key={confed}>
            <NavLink disabled={confed === cid} href={`/soccer/tournament/${id}/qualification/${_confed}`}>
              {confed === 'QUALIFIED' ? '**' : ''}
              {confed}
              {confed === 'QUALIFIED' ? '**' : ''}
            </NavLink>
          </NavItem>
        )
      })}
    </Nav>
  )
}

const Qualification = (props) => {
  const { tournament, tournamentType, query } = props
  const { cid, qPage } = query
  const { qualification } = tournament
  const qualificationTournament = qualification.tournaments[cid]
  console.log('qualificationTournament', qualificationTournament)

  return (
    <React.Fragment>
      <Row className="mt-1"></Row>
      {qualification.length > 0 && (
        <React.Fragment>
          <ConfederationLinks query={query} />
          {cid !== 'QUALIFIED' && <QualificationHeader qTournament={qualificationTournament} tournamentType={tournamentType} query={query} />}
          {qPage === 'intro' && qualificationTournament && <Intro tournament={qualificationTournament} />}
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default Qualification
