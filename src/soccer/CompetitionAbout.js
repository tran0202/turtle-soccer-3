import React from 'react'
import { getTeamName, getFlagSrc } from './Helper'
import { Row, Col } from 'reactstrap'

const ResultHead = () => {
  return (
    <Row className="ranking-tbl team-row padding-tb-md text-center">
      <Col className="col-1">No.</Col>
      <Col className="score-no-padding-right col-2">Edition</Col>
      <Col className="text-center score-no-padding-right col-2">Champion</Col>
      <Col className="text-center score-no-padding-right col-2">Runner-up</Col>
      <Col className="text-center score-no-padding-right col-2">Third-place</Col>
      <Col className="text-center score-no-padding-right col-2">Fourth-place</Col>
    </Row>
  )
}

const ResultRow = (props) => {
  const { row, tt, count } = props
  return (
    <Row className="ranking-tbl team-row padding-tb-md text-center">
      <Col className="col-1">{count + 1}</Col>
      <Col className="score-no-padding-right col-2">
        {row.details && row.details.logo_filename && (
          <a href={`/soccer/tournament/${row.id}`}>
            <img src={`/assets/images/${tt.logo_path}/${row.details.logo_filename}`} alt={`Mascot ${row.name}`} className="tournament-logo" />
          </a>
        )}
      </Col>
      <Col className="text-center score-no-padding-right col-2">
        {row.final_standings && (
          <React.Fragment>
            {row.final_standings.champions && (
              <img className="flag-sm flag-md " src={getFlagSrc(row.final_standings.champions)} alt={row.final_standings.champions} />
            )}
            <br></br>
            {getTeamName(row.final_standings.champions)}
          </React.Fragment>
        )}
      </Col>
      <Col className="text-center score-no-padding-right col-2">
        {row.final_standings && (
          <React.Fragment>
            {row.final_standings.runners_up && (
              <img className="flag-sm flag-md" src={getFlagSrc(row.final_standings.runners_up)} alt={row.final_standings.runners_up} />
            )}
            <br></br>
            {getTeamName(row.final_standings.runners_up)}
          </React.Fragment>
        )}
      </Col>
      <Col className="text-center score-no-padding-right col-2">
        {row.final_standings && (
          <React.Fragment>
            {row.final_standings.third_place && (
              <img className="flag-sm flag-md" src={getFlagSrc(row.final_standings.third_place)} alt={row.final_standings.third_place} />
            )}
            <br></br>
            {getTeamName(row.final_standings.third_place)}
          </React.Fragment>
        )}
      </Col>
      <Col className="text-center score-no-padding-right col-2">
        {row.final_standings && (
          <React.Fragment>
            {row.final_standings.fourth_place && (
              <img className="flag-sm flag-md" src={getFlagSrc(row.final_standings.fourth_place)} alt={row.final_standings.fourth_place} />
            )}
            <br></br>
            {getTeamName(row.final_standings.fourth_place)}
          </React.Fragment>
        )}
      </Col>
    </Row>
  )
}

const CompetitionAbout = (props) => {
  const { tournaments, tournamentType } = props
  // console.log('qTournamnent', qTournament)
  return (
    <React.Fragment>
      <Row className="mt-3 mb-3 text-left tournament-format">
        <Col xs="9">
          <Row>
            <Col xs="12">{tournamentType && tournamentType.description && tournamentType.description.map((d) => <p key={d}>{d}</p>)}</Col>
          </Row>
        </Col>
        <Col xs="3">
          {tournamentType && tournamentType.trophy_filename && (
            <img
              src={`/assets/images/${tournamentType.logo_path}/${tournamentType.trophy_filename}`}
              alt={`Mascot ${tournamentType.name}`}
              className="tournament-mascot"
            />
          )}
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="h2-ff1 margin-top-md">Results</div>
        </Col>
      </Row>
      <Row className="box-xl mb-5">
        <Col>
          <Row className="mt-4"></Row>
          <ResultHead />
          {tournamentType && tournaments.map((t, index) => <ResultRow row={t} tt={tournamentType} count={index} key={t.id}></ResultRow>)}
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default CompetitionAbout
