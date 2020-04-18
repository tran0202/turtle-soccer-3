import React from 'react'
import { PrepData as AppData } from './Team.PrepData'
import AdminPage from '../AdminPage'
import Collection from '../Collection'

class FSTeamApp extends React.Component {
  constructor(props) {
    super(props)
    document.title = 'Turtle Soccer - Team'
  }

  render() {
    const param = {
      name: 'team',
      orderBy: ['name'],
      staticData: AppData(),
      displayHeader: () => {
        return (
          <tr>
            <th>#</th>
            <th>id</th>
            <th>name</th>
            <th>team_type_id</th>
            <th>nation_id</th>
            <th>parent_team_id</th>
            <th>club_code</th>
            <th>official_name</th>
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
            <td>{doc.team_type_id}</td>
            <td>{doc.nation_id}</td>
            <td>{doc.parent_team_id}</td>
            <td>{doc.club_code}</td>
            <td>{doc.official_name}</td>
            <td>{doc.time_stamp}</td>
          </React.Fragment>
        )
      },
      setWindowObjects: (store) => {
        window.teamStore = store
      },
    }
    return (
      <AdminPage>
        <Collection param={param} />
      </AdminPage>
    )
  }
}

export default FSTeamApp
