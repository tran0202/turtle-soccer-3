import React from 'react'
import { Row, Col } from 'reactstrap'
import { getTeamFlagName } from '../core/TeamHelper'

const DrawSeedingHeader = (props) => {
    const { name } = props
    return (
        <React.Fragment>
            <Row className="no-gutters ranking-tbl-header team-row padding-tb-sm text-start">
                <Col className="col-box-5"></Col>
                <Col className="col-box-75">Pot {name}</Col>
            </Row>
            <Row className="no-gutters ranking-tbl-header-light team-row padding-tb-xs text-start">
                <Col className="col-box-5"></Col>
                <Col className="col-box-14">No.</Col>
                <Col className="col-box-75">Team (World Rank)</Col>
            </Row>
        </React.Fragment>
    )
}

const DrawSeedingRow = (props) => {
    const { ranking, config } = props
    return (
        <Row className="no-gutters ranking-tbl team-row padding-tb-xs text-start">
            <Col>
                <div className="col-12">
                    <div className={`box-sm ${ranking.draw_striped ? 'ltblue-striped' : ''}`}>
                        <Row className="no-gutters">
                            <Col className="col-box-5"></Col>
                            <Col className="col-box-14">{ranking.draw_seed}</Col>
                            <Col className="col-box-75">
                                {getTeamFlagName(ranking, config)} ({ranking.rank})
                            </Col>
                        </Row>
                    </div>
                </div>
            </Col>
        </Row>
    )
}

class DrawSeedingTable extends React.Component {
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
                                    <DrawSeedingHeader name={col.name} />
                                    {col.rankings && col.rankings.map((r) => <DrawSeedingRow key={r.id} ranking={r} config={state.config} />)}
                                </Col>
                            ))}
                        </Row>
                    ))}
            </React.Fragment>
        )
    }
}

export default DrawSeedingTable
