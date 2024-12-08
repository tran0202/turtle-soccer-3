import React from 'react'
import { Row, Col } from 'reactstrap'
import { getTeamFlagName } from '../core/TeamHelper'

const EntrantsHeader = () => {
    return (
        <React.Fragment>
            <Row className="no-gutters ranking-tbl-header-light team-row padding-tb-xs text-start">
                <Col className="col-box-5"></Col>
                <Col className="col-box-10">No.</Col>
                <Col className="col-box-82">Team (World Rank)</Col>
            </Row>
        </React.Fragment>
    )
}

const EntrantsRow = (props) => {
    const { team, config } = props
    return (
        <Row className="no-gutters ranking-tbl team-row padding-tb-xs text-start">
            <Col>
                <div className="col-12">
                    <div className={`box-sm`}>
                        <Row className="no-gutters">
                            <Col className="col-box-5"></Col>
                            <Col className="col-box-10">{team.draw_seed}</Col>
                            <Col className="col-box-82">
                                {getTeamFlagName(team, config)} ({team.rank})
                            </Col>
                        </Row>
                    </div>
                </div>
            </Col>
        </Row>
    )
}

class EntrantsTable extends React.Component {
    render() {
        const { state, stage } = this.props
        const { groups } = stage
        return (
            <React.Fragment>
                <EntrantsHeader />
                {groups && groups[0].teams.map((t) => <EntrantsRow key={t.id} team={t} config={state.config} />)}
            </React.Fragment>
        )
    }
}

export default EntrantsTable
