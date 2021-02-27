import React from 'react'
import { getShortTeamName, getFlagSrc, getNationSmallFlagImg, getClubLogoImg, SharedBronzeTooltip, SemifinalistsTooltip } from './Helper'
import { Row, Col } from 'reactstrap'

const isOlympicTournaments = (id) => {
  return id === 'MOFT' || id === 'WOFT'
}

const ResultHead = (props) => {
  const { config } = props
  const championLabel = !isOlympicTournaments(config.id) ? 'Champions' : 'Gold'
  const runnerupLabel = !isOlympicTournaments(config.id) ? 'Runners-up' : 'Silver'
  const thirdPlaceLabel = !isOlympicTournaments(config.id) ? 'Third-place' : 'Bronze'
  return (
    <Row className="ranking-tbl team-header-row padding-tb-md text-center gray-striped">
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
      {config.no_third_place && (
        <Col className="text-center score-no-padding-right col-4">
          Semi-finalists
          <SemifinalistsTooltip target="semifinalistsTooltip" />
        </Col>
      )}
    </Row>
  )
}

const ResultCell = (id, config) => {
  if (!id) return
  return (
    <React.Fragment>
      {config.team_type_id === 'CLUB' && getClubLogoImg(id, config)}
      {config.team_type_id === 'CLUB' && getNationSmallFlagImg(id, config)}
      {config.team_type_id !== 'CLUB' && <img className="flag-sm flag-md " src={getFlagSrc(id)} alt={id} title={id} />}
      <br></br>
      {getShortTeamName(id)}
    </React.Fragment>
  )
}

const ResultRow = (props) => {
  const { row, config, count } = props
  // console.log('config', config)
  return (
    <React.Fragment>
      {row.era && (
        <Row className="ranking-tbl team-header-row padding-tb-md text-center gray-striped">
          <Col>{row.era}</Col>
        </Row>
      )}
      {config.showHeader && <ResultHead config={config} />}
      <Row className={`ranking-tbl team-row padding-tb-md text-center${count % 2 !== 0 ? ' ltblue-striped' : ''}`}>
        <Col className="col-1">{count}</Col>
        <Col className="score-no-padding-right col-2">
          {!row.short_name && (
            <React.Fragment>
              {row.details && row.details.logo_filename && (
                <a href={`/soccer/tournament/${row.id}`}>
                  <img src={`/assets/images/${config.logo_path}/${row.details.logo_filename}`} alt={row.name} title={row.name} className="tournament-logo" />
                </a>
              )}
            </React.Fragment>
          )}
          {row.short_name && (
            <React.Fragment>
              {row.details && row.details.logo_filename && (
                <React.Fragment>
                  <a href={`/soccer/tournament/${row.id}`}>
                    <img
                      src={`/assets/images/${config.logo_path}/${row.details.logo_filename}`}
                      alt={row.name}
                      title={row.name}
                      className="tournament-logo-sm"
                    />
                  </a>
                  <p className="ranking-tbl-sm">{row.short_name}</p>
                </React.Fragment>
              )}
            </React.Fragment>
          )}
        </Col>
        <Col className="text-center score-no-padding-right col-2">{row.final_standings && ResultCell(row.final_standings.champions, config)}</Col>
        <Col className="text-center score-no-padding-right col-2">{row.final_standings && ResultCell(row.final_standings.runners_up, config)}</Col>
        {!row.no_third_place && (
          <React.Fragment>
            <Col className="text-center score-no-padding-right col-2">
              {row.final_standings && (
                <React.Fragment>
                  {typeof row.final_standings.third_place === 'string' && ResultCell(row.final_standings.third_place, config)}
                  {typeof row.final_standings.third_place === 'object' && (
                    <React.Fragment>
                      {ResultCell(row.final_standings.third_place[0], config)}
                      <SharedBronzeTooltip target="sharedTooltip" notes={row.final_standings.third_place_text} />
                      {ResultCell(row.final_standings.third_place[1], config)}
                      <SharedBronzeTooltip target="sharedTooltip" notes={row.final_standings.third_place_text} />
                    </React.Fragment>
                  )}
                </React.Fragment>
              )}
            </Col>
            <Col className="text-center score-no-padding-right col-2">{row.final_standings && ResultCell(row.final_standings.fourth_place, config)}</Col>
          </React.Fragment>
        )}
        {row.no_third_place && (
          <Col className="text-center score-no-padding-right col-4">
            {row.final_standings && (
              <Row>
                <Col className="col-6">{ResultCell(row.final_standings.semi_finalist1, config)}</Col>
                <Col className="col-6">{ResultCell(row.final_standings.semi_finalist2, config)}</Col>
              </Row>
            )}
          </Col>
        )}
      </Row>
    </React.Fragment>
  )
}

const ResultTable = (props) => {
  const { tournaments, config } = props
  if (!tournaments || tournaments.length === 0) return
  let showHeader = true
  let previousStatus = null
  return (
    <React.Fragment>
      {tournaments.length > 0 && (
        <Row className="box-xl mb-5">
          <Col>
            <Row className="mt-4"></Row>
            {tournaments.map((t, index) => {
              showHeader = t.no_third_place !== previousStatus ? true : false
              previousStatus = t.no_third_place
              return (
                <ResultRow
                  row={t}
                  config={{ ...config, showHeader, no_third_place: t.no_third_place }}
                  count={tournaments.length - index}
                  key={t.id}
                ></ResultRow>
              )
            })}
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
      {tournamentType && <ResultTable tournaments={tournaments} config={tournamentType} />}
    </React.Fragment>
  )
}

export default CompetitionAbout
