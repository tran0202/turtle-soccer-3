import React from 'react'
import QualificationRankingsHeader from './QualificationRankingsHeader'
import QualificationRankingsRow from './QualificationRankingsRow'

class QualificationRankingsTable extends React.Component {
    render() {
        const { state } = this.props
        const confRankings = state.confRankings.find((c) => c.id === 'AFC')
        return (
            <React.Fragment>
                <QualificationRankingsHeader />
                {confRankings && confRankings.teams.map((r) => <QualificationRankingsRow key={r.id} ranking={r} config={state.config} />)}
            </React.Fragment>
        )
    }
}

export default QualificationRankingsTable
