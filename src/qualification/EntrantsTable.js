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
                            <Col className="col-box-10">{team.conf_rank}</Col>
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
        const { entrants } = stage
        return (
            <React.Fragment>
                <EntrantsHeader />
                {entrants && entrants.map((t) => <EntrantsRow key={t.id} team={t} config={state.config} />)}
            </React.Fragment>
        )
    }
}

export default EntrantsTable
