import React from 'react'
import { DisplaySchedule, getMatchArrayByDate } from './Helper'

const KnockoutSingle = (props) => {
  const { round, config } = props
  const matchArray = getMatchArrayByDate(round, true)
  // console.log('stage', stage)
  return (
    <React.Fragment>
      <DisplaySchedule round={{ name: round.name, ...matchArray }} config={{ ...config, hideDateGroup: true, showMatchYear: true }} />
    </React.Fragment>
  )
}

export default KnockoutSingle
