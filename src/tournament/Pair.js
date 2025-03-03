import React from 'react'
import { Row, Col } from 'reactstrap'
import PairSummary from '../components/PairSummary'
import MatchesPair from '../components/MatchesPair'

class Pair extends React.Component {
    render() {
        const { stage, config } = this.props
        return (
            <React.Fragment>
                {stage.rounds &&
                    stage.rounds.map((r) => {
                        return (
                            <React.Fragment key={r.name}>
                                <Row>
                                    <Col className="mt-3 round-box">
                                        <Row>
                                            <Col>
                                                <div className="h2-ff1">{r.name}</div>
                                            </Col>
                                        </Row>
                                        {r.round_type !== 'pair1legged' && (
                                            <React.Fragment>
                                                <PairSummary round={r} config={config} />
                                                <Row className="border-bottom-gray4 margin-left-sm margin-top-md" />
                                            </React.Fragment>
                                        )}
                                        <MatchesPair stage={r} config={config} />
                                    </Col>
                                </Row>
                            </React.Fragment>
                        )
                    })}
            </React.Fragment>
        )
    }
}

export default Pair
