import React from 'react'
import GroupStage from './GroupStage'
import { getRoundRobinStage, getTournamentConfig } from './Helper'
import { Row, Col } from 'reactstrap'

const MultipleGroupStage = () => {
  return <div>Multiple Group Stage</div>
}

const getFormat = (rrStage) => {
  const { groups } = rrStage
  const groupCount = groups.length
  const teamCount = groups[0].teams ? groups[0].teams.length : 0
  return { groupCount, teamCount, totalCount: groupCount * teamCount }
}

const TournamentFormat = (props) => {
  const { format, config, tournamentType } = props
  return (
    format.teamCount !== 0 && (
      <Row className="mt-5 mb-5 text-left tournament-format">
        <Col xs="12">
          <p>
            <strong>Format:</strong> {format.totalCount} teams were divided into {format.groupCount} groups of {format.teamCount} teams. Each group played a
            round-robin schedule, and the top 2 teams advanced to the knockout stage.
          </p>
        </Col>
        <Col xs="9">
          <p className="no-margin-bottom">
            <strong>Tiebreakers:</strong>
          </p>
          <ul className="no-margin-bottom">
            <li>Points</li>
            <li>Goal difference</li>
            <li>Number of goals scored</li>
            <li>Points between the teams in question</li>
            <li>Goal difference between the teams in question</li>
            <li>Number of goals scored between the teams in question</li>
            <li>Fair play points: Yellow -1. Indirect Red -3. Direct Red -4. Yellow and Direct Red -5.</li>
            <li>Lot drawing</li>
          </ul>
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
