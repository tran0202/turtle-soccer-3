import React from 'react'
import { getShortTeamName, getFlagSrc, SharedBronzeTooltip } from './Helper'
import { Row, Col } from 'reactstrap'

const getThirdPlaceMatchTournament = (tournaments) => {
  return tournaments.filter((t) => !t.no_third_place)
}

const getNoThirdPlaceMatchTournament = (tournaments) => {
  return tournaments.filter((t) => t.no_third_place)
}

const ResultHead = (props) => {
  const { config } = props
  // console.log('config', config)
  const championLabel = config.id !== 'MOFT' && config.id !== 'WOFT' ? 'Champions' : 'Gold'
  const runnerupLabel = config.id !== 'MOFT' && config.id !== 'WOFT' ? 'Runners-up' : 'Silver'
  const thirdPlaceLabel = config.id !== 'MOFT' && config.id !== 'WOFT' ? 'Third-place' : 'Bronze'
  return (
    <Row className="ranking-tbl team-row padding-tb-md text-center">
      <Col className="col-1">No.</Col>
      <Col className="score-no-padding-right col-2">Edition</Col>
      <Col className="text-center score-no-padding-right col-2">{championLabel}</Col>
      <Col className="text-center score-no-padding-right col-2">{runnerupLabel}</Col>
      {!config.no_third_place && (
        <React.Fragment>
          <Col className="text-center score-no-padding-right col-2">{thirdPlaceLabel}</Col>
          <Col className="text-center score-no-padding-right col-2">Fourth-place</Col>
        </React.Fragment>
      )}
      {config.no_third_place && <Col className="text-center score-no-padding-right col-4">Semi-finalists</Col>}
    </Row>
  )
}

const ResultRow = (props) => {
  const { row, config, count } = props
  // console.log('row.final_standings.third_place.length', typeof row.final_standings.third_place)
  return (
    <Row className="ranking-tbl team-row padding-tb-md text-center">
      <Col className="col-1">{count + 1}</Col>
      <Col className="score-no-padding-right col-2">
        {row.details && row.details.logo_filename && (
          <a href={`/soccer/tournament/${row.id}`}>
            <img src={`/assets/images/${config.logo_path}/${row.details.logo_filename}`} alt={row.name} title={row.name} className="tournament-logo" />
          </a>
        )}
      </Col>
      <Col className="text-center score-no-padding-right col-2">
        {row.final_standings && (
          <React.Fragment>
            {row.final_standings.champions && (
              <img
                className="flag-sm flag-md "
                src={getFlagSrc(row.final_standings.champions)}
                alt={row.final_standings.champions}
                title={row.final_standings.champions}
              />
            )}
            <br></br>
            {getShortTeamName(row.final_standings.champions)}
          </React.Fragment>
        )}
      </Col>
      <Col className="text-center score-no-padding-right col-2">
        {row.final_standings && (
          <React.Fragment>
            {row.final_standings.runners_up && (
              <img
                className="flag-sm flag-md"
                src={getFlagSrc(row.final_standings.runners_up)}
                alt={row.final_standings.runners_up}
                title={row.final_standings.runners_up}
              />
            )}
            <br></br>
            {getShortTeamName(row.final_standings.runners_up)}
          </React.Fragment>
        )}
      </Col>
      {!config.no_third_place && (
        <React.Fragment>
          <Col className="text-center score-no-padding-right col-2">
            {row.final_standings && (
              <React.Fragment>
                {typeof row.final_standings.third_place === 'string' && (
                  <React.Fragment>
                    <img
                      className="flag-sm flag-md"
                      src={getFlagSrc(row.final_standings.third_place)}
                      alt={row.final_standings.third_place}
                      title={row.final_standings.third_place}
                    />
                    <br></br>
                    {getShortTeamName(row.final_standings.third_place)}
                  </React.Fragment>
                )}
                {typeof row.final_standings.third_place === 'object' && (
                  <React.Fragment>
                    <img
                      className="flag-sm flag-md"
                      src={getFlagSrc(row.final_standings.third_place[0])}
                      alt={row.final_standings.third_place[0]}
                      title={row.final_standings.third_place[0]}
                    />
                    <br></br>
                    {getShortTeamName(row.final_standings.third_place[0])}
                    <SharedBronzeTooltip target="sharedTooltip" notes="Tied 2–2 at the end of extra time." />
                    <img
                      className="flag-sm flag-md"
                      src={getFlagSrc(row.final_standings.third_place[1])}
                      alt={row.final_standings.third_place[1]}
                      title={row.final_standings.third_place[1]}
                    />
                    <br></br>
                    {getShortTeamName(row.final_standings.third_place[1])}
                    <SharedBronzeTooltip target="sharedTooltip" notes="Tied 2–2 at the end of extra time." />
                  </React.Fragment>
                )}
              </React.Fragment>
            )}
          </Col>
          <Col className="text-center score-no-padding-right col-2">
            {row.final_standings && (
              <React.Fragment>
                {row.final_standings.fourth_place && (
                  <React.Fragment>
                    <img
                      className="flag-sm flag-md"
                      src={getFlagSrc(row.final_standings.fourth_place)}
                      alt={row.final_standings.fourth_place}
                      title={row.final_standings.fourth_place}
                    />
                    <br></br>
                    {getShortTeamName(row.final_standings.fourth_place)}
                  </React.Fragment>
                )}
              </React.Fragment>
            )}
          </Col>
        </React.Fragment>
      )}
      {config.no_third_place && (
        <Col className="text-center score-no-padding-right col-4">
          {row.final_standings && (
            <Row>
              <Col className="col-6">
                {row.final_standings.semi_finalist1 && (
                  <img
                    className="flag-sm flag-md"
                    src={getFlagSrc(row.final_standings.semi_finalist1)}
                    alt={row.final_standings.semi_finalist1}
                    title={row.final_standings.semi_finalist1}
                  />
                )}
                <br></br>
                {getShortTeamName(row.final_standings.semi_finalist1)}
              </Col>
              <Col className="col-6">
                {row.final_standings.semi_finalist2 && (
                  <img
                    className="flag-sm flag-md"
                    src={getFlagSrc(row.final_standings.semi_finalist2)}
                    alt={row.final_standings.semi_finalist2}
                    title={row.final_standings.semi_finalist2}
                  />
                )}
                <br></br>
                {getShortTeamName(row.final_standings.semi_finalist2)}
              </Col>
            </Row>
          )}
        </Col>
      )}
    </Row>
  )
}

const ResultTable = (props) => {
  const { tournaments, config } = props
  const tournamentArray = config.no_third_place ? getNoThirdPlaceMatchTournament(tournaments) : getThirdPlaceMatchTournament(tournaments)
  const startingIndex = config.starting_index ? config.starting_index : 0
  return (
    <React.Fragment>
      {tournamentArray.length > 0 && (
        <Row className="box-xl mb-5">
          <Col>
            <Row className="mt-4"></Row>
            <ResultHead config={config} />
            {tournamentArray.map((t, index) => (
              <ResultRow row={t} config={config} count={index + startingIndex} key={t.id}></ResultRow>
            ))}
          </Col>
        </Row>
      )}
    </React.Fragment>
  )
}

const CompetitionAbout = (props) => {
  const { tournaments, tournamentType } = props
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
              alt={`Trophy ${tournamentType.name}`}
              title={`Trophy ${tournamentType.name}`}
              className="tournament-mascot"
            />
          )}
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="h2-ff1 margin-tb-md">Results</div>
        </Col>
      </Row>
      {tournamentType && <ResultTable tournaments={tournaments} config={{ ...tournamentType, no_third_place: true }} />}
      {tournamentType && (
        <ResultTable tournaments={tournaments} config={{ ...tournamentType, starting_index: getNoThirdPlaceMatchTournament(tournaments).length }} />
      )}
    </React.Fragment>
  )
}

export default CompetitionAbout
