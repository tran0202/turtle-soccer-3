import React from 'react'
import { Row, Col } from 'reactstrap'
import { getTeamFlagName } from '../core/TeamHelper'

const SeedingHeader = (props) => {
    const { name } = props
    return (
        <React.Fragment>
            <Row className="no-gutters ranking-tbl-header team-row padding-tb-sm text-start">
                <Col className="col-box-5"></Col>
                <Col className="col-box-82">Pot {name}</Col>
            </Row>
            <Row className="no-gutters ranking-tbl-header-light team-row padding-tb-xs text-start">
                <Col className="col-box-5"></Col>
                <Col className="col-box-10">No.</Col>
                <Col className="col-box-82">Team (World Rank)</Col>
            </Row>
        </React.Fragment>
    )
}

const SeedingRow = (props) => {
    const { ranking } = props
    return (
        <Row className="no-gutters ranking-tbl team-row padding-tb-xs text-start">
            <Col>
                <div className="col-12">
                    <div className={`box-sm ${ranking.draw_striped ? 'ltblue-striped' : ''}`}>
                        <Row className="no-gutters">
                            <Col className="col-box-5"></Col>
                            <Col className="col-box-10">{ranking.draw_seed}</Col>
                            <Col className="col-box-82">
                                {getTeamFlagName(ranking)} ({ranking.rank})
                            </Col>
                        </Row>
                    </div>
                </div>
            </Col>
        </Row>
    )
}

class SeedingTable extends React.Component {
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
                                    <SeedingHeader name={col.name} />
                                    {col.rankings && col.rankings.map((r) => <SeedingRow key={r.id} ranking={r} config={state.config} />)}
                                </Col>
                            ))}
                        </Row>
                    ))}
            </React.Fragment>
        )
    }
}

export default SeedingTable
