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
  const teamCount = groups[0].teams.length
  return { groupCount, teamCount, totalCount: groupCount * teamCount }
}

const TournamentFormat = (props) => {
  const { format } = props
  return (
    <Row className="mt-5 mb-5 text-left">
      <Col xs="12" className="tournament-format">
        <p>
          <strong>Format:</strong> {format.totalCount} teams were divided into {format.groupCount} groups of {format.teamCount} teams. Each group played a
          round-robin schedule, and the top 2 teams advanced to the knockout stage.
        </p>
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
    </Row>
  )
}

const Groups = (props) => {
  const { tournament } = props
  const { stages } = tournament
  const rrStages = getRoundRobinStage(stages)
  // console.log('rrStages', rrStages)
  const format = rrStages.length > 0 ? getFormat(rrStages[0]) : null
  return (
    <React.Fragment>
      {format && <TournamentFormat format={format} />}
      {!format && <Row className="mt-3"></Row>}
      {rrStages.length === 1 && <GroupStage config={getTournamentConfig(tournament)} stage={rrStages[0]} />}
      {rrStages.length > 1 && <MultipleGroupStage />}
    </React.Fragment>
  )
}

export default Groups
