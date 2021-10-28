import React from 'react'
import { AppData } from './Competition.Data'
import AdminPage from './AdminPage'
import Collection from './Collection'

class FSCompetitionApp extends React.Component {
  constructor(props) {
    super(props)
    document.title = 'Turtle Soccer - Competition'
  }

  render() {
    const param = {
      name: 'competition',
      // orderBy: ["confederation_id", "order"],
      staticData: AppData,
      displayHeader: () => {
        return (
          <tr>
            <th>#</th>
            <th>id</th>
            <th>name</th>
            <th>color</th>
            <th>confederation_id</th>
            <th>team_type_id</th>
            <th>logo_path</th>
            <th>trophy_filename</th>
            <th>order</th>
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
            <td>{doc.color}</td>
            <td>{doc.confederation_id}</td>
            <td>{doc.team_type_id}</td>
            <td>{doc.logo_path}</td>
            <td>{doc.trophy_filename}</td>
            <td>{doc.order}</td>
            <td>{doc.time_stamp}</td>
          </React.Fragment>
        )
      },
      setWindowObjects: (store) => {
        window.tournamentTypeStore = store
      },
    }
    return (
      <AdminPage>
        <Collection param={param} />
      </AdminPage>
    )
  }
}

export default FSCompetitionApp
