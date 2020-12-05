import React from 'react'
import { DisplaySchedule, getMatchArrayByDate } from './Helper'

const collectMdMatches = (stage) => {
  const { groups } = stage
  let all_matches = []
  let tmp = []
  let mdMatches = []
  let matchdays = []
  groups &&
    groups.forEach((g) => {
      g &&
        g.matchdays &&
        g.matchdays.forEach((md) => {
          if (md) {
            if (!matchdays.find((_md) => _md.name === md.name)) {
              matchdays.push(md.name)
            }
            md.matches &&
              md.matches.forEach((m) => {
                if (m) {
                  m.group = g.name
                  m.matchday = md.name
                  all_matches.push(m)
                }
              })
          }
        })
    })
  all_matches.forEach((m) => {
    if (!tmp[m.matchday]) {
      tmp[m.matchday] = []
    }
    tmp[m.matchday].push(m)
  })
  matchdays.forEach((md) => {
    if (tmp[md]) {
      mdMatches[md] = { matches: tmp[md] }
    }
  })
  // console.log('mdMatches', mdMatches)
  return { matchdays, mdMatches }
}

const RoundRobinMatchDay = (props) => {
  const { stage } = props
  const { matchdays, mdMatches } = collectMdMatches(stage)
  return (
    <React.Fragment>
      {matchdays.map((md) => {
        return <DisplaySchedule round={{ name: md, ...getMatchArrayByDate(mdMatches[md], true) }} config={{ showMatchYear: stage.show_match_year }} key={md} />
      })}
    </React.Fragment>
  )
}

export default RoundRobinMatchDay
