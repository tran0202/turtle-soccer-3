import React from 'react'
import { Container, Row, Col } from 'reactstrap'
import Page from './core/Page'
import Table from './ranking/Table'

class QualificationApp extends React.Component {
    constructor(props) {
        super(props)
        document.title = 'Qualification - Turtle Soccer'
    }

    render() {
        return (
            <Page>
                <Container>
                    <h1 className="h1-ff5 text-center mt-3 mb-3">World Cup 2026 Qualification</h1>
                    <Row className="mt-3 mb-3 text-start rankings-page-box">
                        <Col sm="12" md="12">
                            <section className="rankings section-bg">
                                <div className="container">
                                    <Table />
                                </div>
                            </section>
                        </Col>
                    </Row>
                </Container>
            </Page>
        )
    }
}

export default QualificationApp
