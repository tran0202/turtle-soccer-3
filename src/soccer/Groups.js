import React from 'react'
import GroupStage from './GroupStage'
import { getRoundRobinStage, getTournamentConfig } from './Helper'
import { Row } from 'reactstrap'

const MultipleGroupStage = () => {
  return <div>Multiple Group Stage</div>
}

const Groups = (props) => {
  const { tournament } = props
  const { stages } = tournament
  const rrStages = getRoundRobinStage(stages)
  // console.log('rrStages', rrStages)
  return (
    <React.Fragment>
      <Row className="mt-3"></Row>
      {rrStages.length === 1 && <GroupStage config={getTournamentConfig(tournament)} stage={rrStages[0]} />}
      {rrStages.length > 1 && <MultipleGroupStage />}
    </React.Fragment>
  )
}

export default Groups
