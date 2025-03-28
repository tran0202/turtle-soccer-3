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
    const tableRank = config.last_round_rank || config.inter_confederation_playoff ? team.entrant_pos : team.conf_rank
    return (
        <Row className="no-gutters ranking-tbl team-row padding-tb-xs text-start">
            <Col>
                <div className="col-12">
                    <div className={`box-sm`}>
                        <Row className="no-gutters">
                            <Col className="col-box-5"></Col>
                            <Col className="col-box-10">{tableRank}</Col>
                            <Col className="col-box-82">
                                {getTeamFlagName(team)} ({team.rank})
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
        const { stage, config } = this.props
        const { entrants } = stage
        const new_config = {
            ...config,
            last_round_rank: stage.type.includes('_lastroundrank'),
            inter_confederation_playoff: stage.inter_confederation_playoff,
        }
        return (
            <React.Fragment>
                <EntrantsHeader />
                {entrants && entrants.map((t) => <EntrantsRow key={t.id} team={t} config={new_config} />)}
            </React.Fragment>
        )
    }
}

export default EntrantsTable
