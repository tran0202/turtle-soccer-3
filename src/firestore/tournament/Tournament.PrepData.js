import { ConcatData } from '../Helper'
import { AppData as AppData1 } from './Tournament.Data.1'
import { AppData as AppData2 } from './Tournament.Data.2'
import { AppData as AppData3 } from './Tournament.Data.3'
import { AppData as AppData4 } from './Tournament.Data.4'

export const PrepData = () => {
  let data = ConcatData({ data1: AppData1, data2: AppData2 })
  data = ConcatData({ data1: data, data2: AppData3 })
  data = ConcatData({ data1: data, data2: AppData4 })
  // let json = []
  // data.batches.forEach((batch, index) => {
  //   if (index <= 11) {
  //     batch.rows.forEach((r) => {
  //       json.push({ id: r.id, ...r.data })
  //     })
  //   }
  // })
  // console.log('json', JSON.stringify(json))
  return data
}
