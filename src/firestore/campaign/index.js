import React from 'react'
import { AppData } from './Campaign.Data'
import AdminPage from '../AdminPage'
import Collection from '../Collection'

class FSCampaignApp extends React.Component {
  constructor(props) {
    super(props)
    document.title = 'Turtle Soccer - Campaign'
  }

  render() {
    const param = {
      name: 'campaign',
      // orderBy: ['name'],
      staticData: AppData,
      displayHeader: () => {
        return (
          <tr>
            <th>#</th>
            <th>id</th>
            <th>name</th>
            <th>description</th>
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
            <td>{doc.description}</td>
            <td>{doc.time_stamp}</td>
          </React.Fragment>
        )
      },
      setWindowObjects: (store) => {
        window.CampaignStore = store
      },
    }
    return (
      <AdminPage>
        <Collection param={param} />
      </AdminPage>
    )
  }
}

export default FSCampaignApp
