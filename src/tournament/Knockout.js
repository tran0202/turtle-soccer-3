import React from 'react'
import Brackets from '../components/Brackets'
import MatchesKnockout from '../components/MatchesKnockout'

class Knockout extends React.Component {
    render() {
        const { stage, config } = this.props
        // const { groups, advancements } = stage
        return (
            <React.Fragment>
                <Brackets stage={stage} config={config} />
                <MatchesKnockout stage={stage} config={config} />
            </React.Fragment>
        )
    }
}

export default Knockout
