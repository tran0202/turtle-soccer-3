import React from 'react'
import { PrepData as AppData } from './Nation.PrepData'
import AdminPage from '../../core/AdminPage'
import Collection from '../../core/Collection'

class FSNationApp extends React.Component {
  constructor(props) {
    super(props)
    document.title = 'Turtle Soccer - Nation'
  }

  render() {
    const param = {
      name: 'nation',
      orderBy: ['name'],
      staticData: AppData(),
      displayHeader: () => {
        return (
          <tr>
            <th>#</th>
            <th>id</th>
            <th>name</th>
            <th>official_name</th>
            <th>parent_nation_id</th>
            <th>nation_type_id</th>
            <th>flag_filename</th>
            <th>code</th>
            <th>start_date</th>
            <th>end_date</th>
            <th>time_stamp</th>
            <th>delete</th>
          </tr>
        )
      },
      displayRow: (doc) => {
        return (
          <React.Fragment>
            <th scope="row">{doc.id}</th>
            <td>{doc.name}</td>
            <td>{doc.official_name}</td>
            <td>{doc.parent_nation_id}</td>
            <td>{doc.nation_type_id}</td>
            <td>
              {doc.flag_filename} <img src={`/assets/images/flags/${doc.flag_filename}`} style={{ height: '20px' }} alt={doc.name} />
            </td>
            <td>{doc.code}</td>
            <td>{doc.start_date}</td>
            <td>{doc.end_date}</td>
            <td>{doc.time_stamp}</td>
          </React.Fragment>
        )
      },
      setWindowObjects: (store) => {
        window.nationStore = store
      },
    }
    return (
      <AdminPage>
        <Collection param={param} />
      </AdminPage>
    )
  }
}

export default FSNationApp
