import React from 'react'
import Rankings from './Rankings'

const GroupMdStandings = (props) => {
  const { config, stage } = props
  const { groups, show_match_year } = stage
  return <React.Fragment>{groups && groups.length === 1 && <Rankings rounds={[groups[0]]} config={{ ...config, show_match_year }} />}</React.Fragment>
}

export default GroupMdStandings
