import React from 'react'
import RankingsHeader from './RankingsHeader'
import RankingsRow from './RankingsRow'

class RankingsTable extends React.Component {
    render() {
        const { state, func } = this.props
        const { rankings, config } = state
        return (
            <React.Fragment>
                <RankingsHeader state={state} func={func} />
                {rankings.map((r) => (
                    <RankingsRow key={r.id} ranking={r} config={config} />
                ))}
            </React.Fragment>
        )
    }
}

export default RankingsTable
