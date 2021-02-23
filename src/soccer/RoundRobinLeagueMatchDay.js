import React from 'react'
import { Row, Col } from 'reactstrap'
import moment from 'moment'
import { DisplayMatch } from './Helper'

const getLeagueClassname = (name) => {
  let fontClassName
  switch (name) {
    case 'League A':
      fontClassName = 'unl-league-A'
      break
    case 'League B':
      fontClassName = 'unl-league-B'
      break
    case 'League C':
      fontClassName = 'unl-league-C'
      break
    case 'League D':
      fontClassName = 'unl-league-D'
      break
    default:
      fontClassName = 'unl-league-A'
  }
  return fontClassName
}

const createMatchArray = (matches) => {
  if (!matches) return
  const matchArray = []
  matches.forEach((m) => {
    const _date = matchArray.find((ma) => ma.date === m.date)
    if (_date === undefined) {
      matchArray.push({ date: m.date, matches: [m] })
    } else {
      _date.matches.push(m)
    }
  })
  matchArray.forEach((dateMatchArray) => {
    dateMatchArray.matches.forEach((m) => {
      if (!dateMatchArray.leagues) {
        dateMatchArray.leagues = []
      }
      const _league = dateMatchArray.leagues.find((l) => l.name === m.league_name)
      if (_league === undefined) {
        dateMatchArray.leagues.push({ name: m.league_name, matches: [m] })
      } else {
        _league.matches = _league.matches.concat(m)
      }
    })
  })
  // console.log('matchArray', matchArray)
  return matchArray
}

const RoundRobinLeagueMatchDay = (props) => {
  const { matchday, config } = props
  const { show_match_year } = config
  const { matches } = matchday
  const matchArray = createMatchArray(matches)
  return (
    <React.Fragment>
      {matchArray &&
        matchArray.map((dateMatchArray) => (
          <Row key={dateMatchArray.date}>
            <Col sm="12" className="h4-ff3 border-bottom-gray2 margin-top-md">
              {show_match_year ? moment(dateMatchArray.date).format('dddd, MMMM D, YYYY') : moment(dateMatchArray.date).format('dddd, MMMM D')}
            </Col>
            {dateMatchArray.leagues &&
              dateMatchArray.leagues.map((l) => (
                <React.Fragment key={l.name}>
                  <Col sm="12" className={`${getLeagueClassname(l.name)} h5-ff3 margin-top-md`}>
                    {l.name}
                  </Col>
                  <React.Fragment>{l.matches && l.matches.map((m, index) => <DisplayMatch m={m} config={config} key={index} />)}</React.Fragment>
                </React.Fragment>
              ))}
          </Row>
        ))}
    </React.Fragment>
  )
}

export default RoundRobinLeagueMatchDay
