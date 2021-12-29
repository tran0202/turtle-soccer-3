import React from 'react'
import { PrepData as AppData } from './Campaign.PrepData'
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
      staticData: AppData(),
      displayHeader: () => {
        return (
          <tr>
            <th>#</th>
            <th>id</th>
            <th>name</th>
            <th>description</th>
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
            <td>{doc.description}</td>
            <td>{doc.order}</td>
            <td>{doc.time_stamp}</td>
          </React.Fragment>
        )
      },
      setWindowObjects: (store) => {
        window.campaignStore = store
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
