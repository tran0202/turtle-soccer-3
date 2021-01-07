import TournamentArray from '../data/soccer/tournament/Tournament.json'
import t_WC from '../data/soccer/tournament/t_WC.json'
import t_EURO from '../data/soccer/tournament/t_EURO.json'
import t_MOFT from '../data/soccer/tournament/t_MOFT.json'

import td_WC_1930 from '../data/soccer/tournamentData/WC/td_WC_1930.json'
import td_WC_1934 from '../data/soccer/tournamentData/WC/td_WC_1934.json'
import td_WC_1938 from '../data/soccer/tournamentData/WC/td_WC_1938.json'
import td_WC_1950 from '../data/soccer/tournamentData/WC/td_WC_1950.json'
import td_WC_1954 from '../data/soccer/tournamentData/WC/td_WC_1954.json'
import td_WC_1958 from '../data/soccer/tournamentData/WC/td_WC_1958.json'
import td_WC_1962 from '../data/soccer/tournamentData/WC/td_WC_1962.json'
import td_WC_1966 from '../data/soccer/tournamentData/WC/td_WC_1966.json'
import td_WC_1970 from '../data/soccer/tournamentData/WC/td_WC_1970.json'
import td_WC_1974 from '../data/soccer/tournamentData/WC/td_WC_1974.json'
import td_WC_1978 from '../data/soccer/tournamentData/WC/td_WC_1978.json'
import td_WC_1982 from '../data/soccer/tournamentData/WC/td_WC_1982.json'
import td_WC_1986 from '../data/soccer/tournamentData/WC/td_WC_1986.json'
import td_WC_1990 from '../data/soccer/tournamentData/WC/td_WC_1990.json'
import td_WC_1994 from '../data/soccer/tournamentData/WC/td_WC_1994.json'
import td_WC_1998 from '../data/soccer/tournamentData/WC/td_WC_1998.json'
import td_WC_2002 from '../data/soccer/tournamentData/WC/td_WC_2002.json'
import td_WC_2006 from '../data/soccer/tournamentData/WC/td_WC_2006.json'
import td_WC_2010 from '../data/soccer/tournamentData/WC/td_WC_2010.json'
import td_WC_2014 from '../data/soccer/tournamentData/WC/td_WC_2014.json'
import td_WC_2018 from '../data/soccer/tournamentData/WC/td_WC_2018.json'

import td_EURO_1960 from '../data/soccer/tournamentData/EURO/td_EURO_1960.json'
import td_EURO_1964 from '../data/soccer/tournamentData/EURO/td_EURO_1964.json'
import td_EURO_1968 from '../data/soccer/tournamentData/EURO/td_EURO_1968.json'
import td_EURO_1972 from '../data/soccer/tournamentData/EURO/td_EURO_1972.json'
import td_EURO_1976 from '../data/soccer/tournamentData/EURO/td_EURO_1976.json'
import td_EURO_1980 from '../data/soccer/tournamentData/EURO/td_EURO_1980.json'
import td_EURO_1984 from '../data/soccer/tournamentData/EURO/td_EURO_1984.json'
import td_EURO_1988 from '../data/soccer/tournamentData/EURO/td_EURO_1988.json'
import td_EURO_1992 from '../data/soccer/tournamentData/EURO/td_EURO_1992.json'
import td_EURO_1996 from '../data/soccer/tournamentData/EURO/td_EURO_1996.json'
import td_EURO_2000 from '../data/soccer/tournamentData/EURO/td_EURO_2000.json'
import td_EURO_2004 from '../data/soccer/tournamentData/EURO/td_EURO_2004.json'
import td_EURO_2008 from '../data/soccer/tournamentData/EURO/td_EURO_2008.json'
import td_EURO_2012 from '../data/soccer/tournamentData/EURO/td_EURO_2012.json'
import td_EURO_2016 from '../data/soccer/tournamentData/EURO/td_EURO_2016.json'

import QualificationTournamentWCArray from '../data/soccer/QualificationTournamentWC.json'
import qtd_WC_2022 from '../data/soccer/qualTournamentData/qtd_WC_2022.json'

export const getCurrentTournament = () => {
  return { tournament: 'MOFT2016', qualificationTournament: 'WC2022_CONMEBOL' }
}

export const getTournamentArray = () => {
  return TournamentArray.concat(t_WC, t_EURO, t_MOFT)
}

export const getTournamentDataArray = () => {
  return [].concat(getTournamentDataWC(), getTournamentDataEURO(), getTournamentDataMOFT())
}

export const getTournamentDataMOFT = () => {
  // return [].concat(
  //   [td_MOFT_2016]
  // )
  return []
}

export const getQualificationTournamentArray = () => {
  return QualificationTournamentWCArray
}

export const getQualificationTournamentDataArray = () => {
  return [].concat(qtd_WC_2022)
}

export const getTournamentDataWC = () => {
  return [].concat(
    [td_WC_1930],
    [td_WC_1934],
    [td_WC_1938],
    [td_WC_1950],
    [td_WC_1954],
    [td_WC_1958],
    [td_WC_1962],
    [td_WC_1966],
    [td_WC_1970],
    [td_WC_1974],
    [td_WC_1978],
    [td_WC_1982],
    [td_WC_1986],
    [td_WC_1990],
    [td_WC_1994],
    [td_WC_1998],
    [td_WC_2002],
    [td_WC_2006],
    [td_WC_2010],
    [td_WC_2014],
    [td_WC_2018],
  )
}

export const getTournamentDataEURO = () => {
  return [].concat(
    [td_EURO_1960],
    [td_EURO_1964],
    [td_EURO_1968],
    [td_EURO_1972],
    [td_EURO_1976],
    [td_EURO_1980],
    [td_EURO_1984],
    [td_EURO_1988],
    [td_EURO_1992],
    [td_EURO_1996],
    [td_EURO_2000],
    [td_EURO_2004],
    [td_EURO_2008],
    [td_EURO_2012],
    [td_EURO_2016],
  )
}
