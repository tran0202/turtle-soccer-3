import React from 'react'
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
                            <React.Fragment>
                                <PairSummary key={r.name} round={r} config={config} />
                                <MatchesPair stage={r} config={config} />
                            </React.Fragment>
                        )
                    })}
            </React.Fragment>
        )
    }
}

export default Pair
