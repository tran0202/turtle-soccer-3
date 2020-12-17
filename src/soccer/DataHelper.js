import TournamentArray from '../data/soccer/Tournament.json'
import TournamentWCArray from '../data/soccer/TournamentWC.json'
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
  return { tournament: 'WC1986', qualificationTournament: 'WC2022_CONMEBOL' }
}

export const getTournamentArray = () => {
  return TournamentArray.concat(TournamentWCArray)
}

export const getTournamentDataArray = () => {
  return [].concat([td_WC_2018], [td_WC_2014], [td_WC_2010], [td_WC_2006], [td_WC_2002], [td_WC_1998], [td_WC_1994], [td_WC_1990])
}

export const getQualificationTournamentArray = () => {
  return QualificationTournamentWCArray
}

export const getQualificationTournamentDataArray = () => {
  return [].concat(qtd_WC_2022)
}
