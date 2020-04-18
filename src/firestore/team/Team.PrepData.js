import { ConcatData } from '../Helper'
import { AppData as AppData1 } from './Team.Data.1'
import { AppData as AppData2 } from './Team.Data.2'
import { AppData as AppData3 } from './Team.Data.3'
import { AppData as AppData4 } from './Team.Data.4'

export const PrepData = () => {
  let data = ConcatData({ data1: AppData1, data2: AppData2 })
  data = ConcatData({ data1: data, data2: AppData3 })
  data = ConcatData({ data1: data, data2: AppData4 })
  return data
}
