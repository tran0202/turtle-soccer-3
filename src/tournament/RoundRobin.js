import React from 'react'
// import { getTournamentTitleFont } from '../core/Helper'
import { Row, Col } from 'reactstrap'
import GroupRankingsTable from '../imagine/GroupRankingsTable'
import MatchesGroup from '../imagine/MatchesGroup'
import PartialAdvancement from '../imagine/PartialAdvancement'

class RoundRobin extends React.Component {
    render() {
        const { stage, config } = this.props
        const { groups, advancements } = stage
        return (
            <React.Fragment>
                <Row className="text-start padding-top-md padding-left-sm">
                    <Col sm="6">
                        {advancements && advancements.advanced_notes && (
                            <Row>
                                <Col className="advanced-striped">{advancements.advanced_notes}</Col>
                            </Row>
                        )}
                        {advancements && advancements.wild_card_notes && (
                            <Row>
                                <Col className="wild-card-striped">{advancements.wild_card_notes}</Col>
                            </Row>
                        )}
                        {advancements && advancements.transferred_notes && (
                            <Row>
                                <Col className="transferred-striped">{advancements.transferred_notes}</Col>
                            </Row>
                        )}
                        {advancements && advancements.relegated_notes && (
                            <Row>
                                <Col className="relegated-striped">{advancements.relegated_notes}</Col>
                            </Row>
                        )}
                    </Col>
                </Row>
                {groups &&
                    groups.map((g) => {
                        return (
                            <Row key={g.name} className="mt-5 box-xl">
                                <Col xs={{ size: 10, offset: 1 }}>
                                    <Row className="no-gutters group-header padding-tb-sm text-start">
                                        <Col className="col-box-5"></Col>
                                        <Col className="col-box-75">{g.name}</Col>
                                    </Row>
                                    <GroupRankingsTable group={g} config={config} />
                                    <MatchesGroup group={g} config={config} />
                                </Col>
                            </Row>
                        )
                    })}
                {stage.partial_advancement && (
                    <React.Fragment>
                        <PartialAdvancement stage={stage} config={config} />
                    </React.Fragment>
                )}
            </React.Fragment>
        )
    }
}

export default RoundRobin
