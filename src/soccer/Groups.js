import React from 'react'
import GroupStage from './GroupStage'
import { getRoundRobinStage, getTournamentConfig } from './Helper'
import { Row, Col } from 'reactstrap'

const MultipleGroupStage = () => {
  return <div>Multiple Group Stage</div>
}

const getFormat = (rrStage) => {
  const { groups } = rrStage
  const groupCount = groups ? groups.length : 0
  const teamCount = groups && groups[0] && groups[0].teams ? groups[0].teams.length : 0
  return { groupCount, teamCount, totalCount: groupCount * teamCount }
}

const TournamentFormat = (props) => {
  const { format, config, tournamentType } = props
  return (
    format.teamCount !== 0 && (
      <Row className="mt-5 mb-5 text-left tournament-format">
        <Col xs="9">
          <Row>
            <Col xs="12">
              <p>
                <strong>Points:</strong> {config.points_for_win} points/W - 1 points/D - 0 points/L
              </p>
            </Col>
            <Col xs="12">
              <p>
                <strong>Format:</strong> {format.totalCount} teams were divided into {format.groupCount} groups of {format.teamCount} teams. Each group played a
                round-robin schedule, and the top 2 teams advanced to the knockout stage.
              </p>
            </Col>
            <Col xs="12">
              <p className="no-margin-bottom">
                <strong>Tiebreakers:</strong>
              </p>
              <ul className="no-margin-bottom">
                {config.tiebreakers &&
                  config.tiebreakers.map((tb, index) => {
                    if (tb === 'team') {
                      return (
                        <React.Fragment key={index}>
                          <li>Points</li>
                          <li>Goal difference</li>
                          <li>Number of goals scored</li>
                        </React.Fragment>
                      )
                    } else if (tb === 'head2head') {
                      return (
                        <React.Fragment key={index}>
                          <li>Points between the teams in question</li>
                          <li>Goal difference between the teams in question</li>
                          <li>Number of goals scored between the teams in question</li>
                        </React.Fragment>
                      )
                    } else if (tb === 'fairplay') {
                      return <li key={index}>Fair play points: Yellow -1. Indirect Red -3. Direct Red -4. Yellow and Direct Red -5.</li>
                    } else if (tb === 'lot') {
                      return <li key={index}>Drawing lot</li>
                    } else {
                      return null
                    }
                  })}
              </ul>
            </Col>
          </Row>
        </Col>
        <Col xs="3">
          <img
            src={`/assets/images/${tournamentType.logo_path}/${config.details.mascot_filename}`}
            alt={`Mascot ${config.name}`}
            className="tournament-mascot"
          />
        </Col>
      </Row>
    )
  )
}

const Groups = (props) => {
  const { tournament, tournamentType } = props
  const { stages } = tournament
  const rrStages = getRoundRobinStage(stages)
  // console.log('rrStages', rrStages)
  const format = rrStages && rrStages.length > 0 ? getFormat(rrStages[0]) : null
  const config = getTournamentConfig(tournament)
  return (
    <React.Fragment>
      {format && <TournamentFormat format={format} config={config} tournamentType={tournamentType} />}
      {!format && <Row className="mt-5"></Row>}
      {rrStages && rrStages.length === 1 && <GroupStage config={config} stage={rrStages[0]} />}
      {rrStages && rrStages.length > 1 && <MultipleGroupStage />}
    </React.Fragment>
  )
}

export default Groups
