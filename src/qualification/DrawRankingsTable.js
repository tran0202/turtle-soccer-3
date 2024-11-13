import React from 'react'
import { Row, Col } from 'reactstrap'
import DrawRankingsHeader from './DrawRankingsHeader'
import DrawRankingsRow from './DrawRankingsRow'

class DrawRankingsTable extends React.Component {
    render() {
        const { state, stage } = this.props
        const { drawPotRows } = stage
        return (
            <React.Fragment>
                {drawPotRows &&
                    drawPotRows.map((dpr, index) => (
                        <Row key={index} className="no-gutters ranking-tbl-header team-row padding-tb-md text-start">
                            {dpr.map((col) => (
                                <Col key={col.name}>
                                    <DrawRankingsHeader name={col.name} />
                                    {col.rankings && col.rankings.map((r) => <DrawRankingsRow key={r.id} ranking={r} config={state.config} />)}
                                </Col>
                            ))}
                        </Row>
                    ))}
            </React.Fragment>
        )
    }
}

export default DrawRankingsTable
