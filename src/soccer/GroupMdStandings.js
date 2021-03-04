import React from 'react'
import Rankings from './Rankings'
import GroupPlay from './GroupPlay'

const GroupMdStandings = (props) => {
  const { config, stage } = props
  // console.log('config', config)
  const { groups, show_match_year } = stage
  return (
    <React.Fragment>
      {groups && groups.length === 1 && <Rankings rounds={[groups[0]]} config={{ ...config, show_match_year }} />}
      {groups && groups.length > 1 && groups.map((g) => <GroupPlay group={g} config={config} key={g.name} />)}
    </React.Fragment>
  )
}

export default GroupMdStandings
