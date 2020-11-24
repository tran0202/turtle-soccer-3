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
  const { tournament, query } = props
  const { cid, qPage } = query
  const { qualification } = tournament
  // console.log('qualification', qualification)

  return (
    <React.Fragment>
      <Row className="mt-1"></Row>
      {qualification.confed_count > 0 && (
        <React.Fragment>
          <ConfederationLinks query={query} />
          {qualification.existed && (
            <React.Fragment>
              {cid !== 'QUALIFIED' && <QualificationHeader qTournament={qualification} query={query} />}
              {qPage === 'intro' && <Intro tournament={qualification} />}
            </React.Fragment>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default Qualification
