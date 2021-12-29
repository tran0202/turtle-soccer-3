import React from 'react'
import { AppData } from './Confederation.Data'
import AdminPage from './AdminPage'
import Collection from './Collection'

class FSConfederationApp extends React.Component {
  constructor(props) {
    super(props)
    document.title = 'Turtle Soccer - Confederation'
  }

  render() {
    const param = {
      name: 'confederation',
      orderBy: ['name'],
      staticData: AppData,
      displayHeader: () => {
        return (
          <tr>
            <th>#</th>
            <th>id</th>
            <th>name</th>
            <th>logo_filename</th>
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
            <td>{doc.logo_filename}</td>
            <td>{doc.time_stamp}</td>
          </React.Fragment>
        )
      },
      setWindowObjects: (store) => {
        window.confederationStore = store
      },
    }
    return (
      <AdminPage>
        <Collection param={param} />
      </AdminPage>
    )
  }
}

export default FSConfederationApp
