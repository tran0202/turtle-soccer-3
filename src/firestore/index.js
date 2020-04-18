import React from 'react'
import AdminPage from './AdminPage'
import { Container, Row, Col, ListGroup, ListGroupItem } from 'reactstrap'

class FSApp extends React.Component {
  constructor(props) {
    super(props)
    document.title = 'Turtle Soccer - Admin'
  }

  render() {
    return (
      <AdminPage>
        <h1 className="text-center">Welcome to Firestore Admin</h1>
        <Container>
          <Row>
            <Col sm="6">
              <h3 className="container mt-5">Collections</h3>
            </Col>
          </Row>
          <Row>
            <Col sm="6">
              <ListGroup>
                <ListGroupItem>
                  <a href="/admin/sport">sport</a>
                </ListGroupItem>
                <ListGroupItem>
                  <a href="/admin/group_type">group_type</a>
                </ListGroupItem>
                <ListGroupItem>
                  <a href="/admin/group">group</a>
                </ListGroupItem>
                <ListGroupItem>
                  <a href="/admin/tournament_type">tournament_type</a>
                </ListGroupItem>
                <ListGroupItem>
                  <a href="/admin/tournament">tournament</a>
                </ListGroupItem>
                <ListGroupItem>
                  <a href="/admin/nation">nation</a>
                </ListGroupItem>
                <ListGroupItem>
                  <a href="/admin/team">team</a>
                </ListGroupItem>
              </ListGroup>
            </Col>
          </Row>
        </Container>
      </AdminPage>
    )
  }
}

export default FSApp
