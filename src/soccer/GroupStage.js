import React from 'react'
import GroupPlay from './GroupPlay'

const GroupStage = (props) => {
  const { stage } = props
  const { groups } = stage
  return (
    <React.Fragment>
      {groups.map((g) => (
        <GroupPlay group={g} key={g.name} />
      ))}
    </React.Fragment>
  )
}

export default GroupStage
