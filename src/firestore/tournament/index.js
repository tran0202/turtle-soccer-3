import React from 'react'
import { PrepData as AppData } from './Tournament.PrepData'
import AdminPage from '../AdminPage'
import Collection from '../Collection'

class FSTournamentApp extends React.Component {
  constructor(props) {
    super(props)
    document.title = 'Turtle Soccer - Tournament'
  }

  render() {
    const param = {
      name: 'tournament',
      // orderBy: ['competition_id', 'start_date'],
      orderBy: ['competition_id'],
      staticData: AppData(),
      displayHeader: () => {
        return (
          <tr>
            <th>#</th>
            <th>id</th>
            <th>year</th>
            <th>name</th>
            <th>competition_id</th>
            <th>golden_goal_rule</th>
            <th>points_for_win</th>
            <th>logo_filename</th>
            <th>start_date</th>
            <th>end_date</th>
            <th>active</th>
            <th>color</th>
            <th>time_stamp</th>
            <th>delete</th>
          </tr>
        )
      },
      displayRow: (doc) => {
        return (
          <React.Fragment>
            <th scope="row">{doc.id}</th>
            <td>{doc.year}</td>
            <td>{doc.name}</td>
            <td>{doc.competition_id}</td>
            <td>{doc.golden_goal_rule ? 'Y' : 'N'}</td>
            <td>{doc.points_for_win}</td>
            <td>{doc.details ? doc.details.logo_filename : ''}</td>
            <td>{doc.details ? doc.details.start_date : ''}</td>
            <td>{doc.details ? doc.details.end_date : ''}</td>
            <td>{doc.active ? 'Y' : 'N'}</td>
            <td style={{ backgroundColor: doc.color, color: '#fff' }}>{doc.color}</td>
            <td>{doc.time_stamp}</td>
          </React.Fragment>
        )
      },
      setWindowObjects: (store) => {
        window.tournamentStore = store
      },
    }
    return (
      <AdminPage>
        <Collection param={param} />
      </AdminPage>
    )
  }
}

export default FSTournamentApp
