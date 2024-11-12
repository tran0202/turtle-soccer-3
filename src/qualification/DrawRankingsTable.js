import React from 'react'
import DrawRankingsHeader from './DrawRankingsHeader'
import DrawRankingsRow from './DrawRankingsRow'

class DrawRankingsTable extends React.Component {
    render() {
        const { state, stage } = this.props
        return (
            <React.Fragment>
                <DrawRankingsHeader />
                {stage.rankings && stage.rankings.map((r) => <DrawRankingsRow key={r.id} ranking={r} config={state.config} />)}
            </React.Fragment>
        )
    }
}

export default DrawRankingsTable
