import React from 'react'
import Intro from './Intro'
import QualificationHeader from './QualificationHeader'
import Matches from './Matches'
import Groups from './Groups'
import { Nav, NavItem, NavLink, Row } from 'reactstrap'

const ConfederationLinks = (props) => {
  const { query, confed_names } = props
  const { id, cid } = query
  return (
    <Nav className="justify-content-center qualification-confed-links">
      {confed_names.map((confed) => {
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
  // console.log('qualification', qualification)

  return (
    <React.Fragment>
      <Row className="mt-1"></Row>
      {qualification.confed_length > 0 && (
        <React.Fragment>
          <ConfederationLinks query={query} confed_names={qualification.confed_names} />
          {qualification.existed && (
            <React.Fragment>
              {cid !== 'QUALIFIED' && <QualificationHeader qTournament={qualification} query={query} />}
              {qPage === 'intro' && <Intro tournament={qualification} />}
              {qPage === 'matches' && <Matches tournament={qualification} />}
              {qPage === 'groups' && <Groups tournament={qualification} tournamentType={tournamentType} />}
            </React.Fragment>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default Qualification
