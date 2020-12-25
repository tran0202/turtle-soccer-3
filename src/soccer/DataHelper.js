import TournamentArray from '../data/soccer/Tournament.json'
import TournamentWCArray from '../data/soccer/TournamentWC.json'
import td_WC_1930 from '../data/soccer/tournamentData/td_WC_1930.json'
import td_WC_1934 from '../data/soccer/tournamentData/td_WC_1934.json'
import td_WC_1938 from '../data/soccer/tournamentData/td_WC_1938.json'
import td_WC_1950 from '../data/soccer/tournamentData/td_WC_1950.json'
import td_WC_1954 from '../data/soccer/tournamentData/td_WC_1954.json'
import td_WC_1958 from '../data/soccer/tournamentData/td_WC_1958.json'
import td_WC_1962 from '../data/soccer/tournamentData/td_WC_1962.json'
import td_WC_1966 from '../data/soccer/tournamentData/td_WC_1966.json'
import td_WC_1970 from '../data/soccer/tournamentData/td_WC_1970.json'
import td_WC_1974 from '../data/soccer/tournamentData/td_WC_1974.json'
import td_WC_1978 from '../data/soccer/tournamentData/td_WC_1978.json'
import td_WC_1982 from '../data/soccer/tournamentData/td_WC_1982.json'
import td_WC_1986 from '../data/soccer/tournamentData/td_WC_1986.json'
import td_WC_1990 from '../data/soccer/tournamentData/td_WC_1990.json'
import td_WC_1994 from '../data/soccer/tournamentData/td_WC_1994.json'
import td_WC_1998 from '../data/soccer/tournamentData/td_WC_1998.json'
import td_WC_2002 from '../data/soccer/tournamentData/td_WC_2002.json'
import td_WC_2006 from '../data/soccer/tournamentData/td_WC_2006.json'
import td_WC_2010 from '../data/soccer/tournamentData/td_WC_2010.json'
import td_WC_2014 from '../data/soccer/tournamentData/td_WC_2014.json'
import td_WC_2018 from '../data/soccer/tournamentData/td_WC_2018.json'
import QualificationTournamentWCArray from '../data/soccer/QualificationTournamentWC.json'
import qtd_WC_2022 from '../data/soccer/qualTournamentData/qtd_WC_2022.json'

export const getCurrentTournament = () => {
  return { tournament: 'WC2022', qualificationTournament: 'WC2022_CONMEBOL' }
}

export const getTournamentArray = () => {
  return TournamentArray.concat(TournamentWCArray)
}

export const getTournamentDataArray = () => {
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

export const getQualificationTournamentArray = () => {
  return QualificationTournamentWCArray
}

export const getQualificationTournamentDataArray = () => {
  return [].concat(qtd_WC_2022)
}
