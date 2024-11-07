import React from 'react'
import { Row, Col } from 'reactstrap'
import QualifiedHeader from './QualifiedHeader'
import QualifiedRow from './QualifiedRow'

class QualifiedTable extends React.Component {
    render() {
        const { state } = this.props
        const { qualifiedTeams, config } = state
        return (
            <React.Fragment>
                <Row className="mt-5 box-xl">
                    <Col xs={{ size: 10, offset: 1 }}>
                        <QualifiedHeader />
                        {qualifiedTeams.map((r, index) => {
                            r.rank = index + 1
                            return <QualifiedRow key={r.id} rank={index} row={r} config={config} />
                        })}
                    </Col>
                </Row>
            </React.Fragment>
        )
    }
}

export default QualifiedTable
