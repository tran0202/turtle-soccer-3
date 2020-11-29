import React from 'react'
import GroupStage from './GroupStage'
import { getRoundRobinStage, getTournamentConfig } from './Helper'
import { Row, Col } from 'reactstrap'

const MultipleGroupStage = () => {
  return <div>Multiple Group Stage</div>
}

const getFormat = (rrStage) => {
  const { groups, advancement } = rrStage
  const groupCount = groups ? groups.length : 0
  const teamCount = groups && groups[0] && groups[0].teams ? groups[0].teams.length : 0
  return { groupCount, teamCount, totalCount: groupCount * teamCount, advancement }
}

const TournamentFormat = (props) => {
  const { config, tournamentType } = props
  return (
    config.teamCount !== 0 && (
      <Row className="mt-3 mb-3 text-left tournament-format">
        <Col xs="9">
          <Row>
            <Col xs="12">
              <p>
                <strong>Points:</strong> {config.points_for_win} points/W - 1 points/D - 0 points/L
              </p>
            </Col>
            <Col xs="12">
              <p>
                <strong>Format:</strong> {config.totalCount} teams are divided into {config.groupCount} groups of {config.teamCount} teams. Each group plays a
                round-robin schedule. The {config.advancement && config.advancement.teams ? config.advancement.teams.text : 'top 2 teams'} advance to the&nbsp;
                {config.advancement ? config.advancement.next_round : 'knockout stage'}. {config.advancement ? config.advancement.extra : ''}
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
                          <li>Overall goal difference</li>
                          <li>Overall goals scored</li>
                        </React.Fragment>
                      )
                    } else if (tb === 'head2head') {
                      return (
                        <React.Fragment key={index}>
                          <li>Points in matches between tied teams</li>
                          <li>Goal difference in matches between tied teams</li>
                          <li>Goals scored in matches between tied teams</li>
                        </React.Fragment>
                      )
                    } else if (tb === 'awaygoals') {
                      return (
                        <li key={index}>
                          Away goals scored in matches between tied teams (if the tie is only between two teams in home-and-away league format)
                        </li>
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
  const config = { ...getTournamentConfig(tournament), ...format }
  return (
    <React.Fragment>
      {format && <TournamentFormat config={config} tournamentType={tournamentType} />}
      {!format && <Row className="mt-3"></Row>}
      {rrStages && rrStages.length === 1 && <GroupStage config={config} stage={rrStages[0]} />}
      {rrStages && rrStages.length > 1 && <MultipleGroupStage />}
    </React.Fragment>
  )
}

export default Groups
