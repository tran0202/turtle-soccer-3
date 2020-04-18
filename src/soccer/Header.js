import React from 'react'
import 'firebase/auth'
import 'firebase/firestore'
import { Row, Col } from 'reactstrap'
import moment from 'moment'

class Header extends React.Component {
  render() {
    const { param } = this.props
    const { doc, tournamentType } = param
    return (
      <Row className="text-center">
        <Col lg={{ size: 1, offset: 2 }} md={{ size: 2, offset: 1 }} sm="3" className="mt-3 mb-3">
          <img src={`/assets/images/${tournamentType.logo_path}/${doc.logo_filename}`} alt={doc.name} />
        </Col>
        <Col lg="7" md="8" sm="9">
          <h1 className="h1-ff5 text-center mt-3 mb-3 tournament-title" style={{ color: doc.color }}>
            {doc.name}
          </h1>
          {moment(doc.start_date).format('MMMM D, YYYY')} - {moment(doc.end_date).format('MMMM D, YYYY')}
        </Col>
      </Row>
    )
  }
}

export default Header
