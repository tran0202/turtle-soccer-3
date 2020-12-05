import React from 'react'
// import GroupPlay from './GroupPlay'
import Rankings from './Rankings'
import { calculateGroupRankings, collectMatchdayRankings } from './RankingsHelper'

const collectMdMatches = (group) => {
  let matches = []
  group.matchdays &&
    group.matchdays.forEach((md) => {
      md.matches &&
        md.matches.forEach((m) => {
          matches.push(m)
        })
    })
  group.matches = matches
}

const GroupMdStandings = (props) => {
  const { config, stage } = props
  const { groups, show_match_year } = stage
  groups &&
    groups.forEach((group) => {
      collectMdMatches(group)
      calculateGroupRankings(group, config)
      const matchDay = group.matches ? Math.ceil(group.matches.length / (group.teams.length / 2)) : 0
      collectMatchdayRankings(group, matchDay)
    })
  console.log('groups[0]', groups[0])
  return (
    <React.Fragment>
      {groups && groups.length === 1 && <Rankings rounds={[groups[0]]} config={{ ...config, show_match_year }} />}
      {/* {groups && groups.length > 1 && groups.map((g) => <GroupPlay group={g} config={{ ...config, show_match_year }} key={g.name} />)} */}
    </React.Fragment>
  )
}

export default GroupMdStandings
