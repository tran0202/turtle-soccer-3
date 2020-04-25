import React from 'react'
import GroupPlay from './GroupPlay'

const GroupStage = (props) => {
  const { config, stage } = props
  const { groups } = stage
  return (
    <React.Fragment>
      {groups.map((g) => (
        <GroupPlay group={g} config={config} key={g.name} />
      ))}
    </React.Fragment>
  )
}

export default GroupStage
