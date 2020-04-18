import React from 'react'
import { AppData } from './Group.Data'
import AdminPage from './AdminPage'
import Collection from './Collection'

class FSGroupApp extends React.Component {
  constructor(props) {
    super(props)
    document.title = 'Turtle Soccer - Group'
  }

  render() {
    const param = {
      name: 'group',
      orderBy: ['group_type_id', 'name'],
      staticData: AppData,
      displayHeader: () => {
        return (
          <tr>
            <th>#</th>
            <th>id</th>
            <th>name</th>
            <th>long_name</th>
            <th>group_type_id</th>
            <th>group_logo</th>
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
            <td>{doc.long_name}</td>
            <td>{doc.group_type_id}</td>
            <td>{doc.group_logo}</td>
            <td>{doc.time_stamp}</td>
          </React.Fragment>
        )
      },
      setWindowObjects: (store) => {
        window.groupStore = store
      },
    }
    return (
      <AdminPage>
        <Collection param={param} />
      </AdminPage>
    )
  }
}

export default FSGroupApp
