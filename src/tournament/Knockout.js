import React from 'react'
import Path from '../components/Path'

class Knockout extends React.Component {
    render() {
        const { stage, config, isImagine } = this.props
        return (
            <React.Fragment>
                {stage.paths &&
                    stage.paths.map((p) => {
                        return <Path key={p.name} stage={p} config={{ ...config, multi_path: true }} isImagine={isImagine} />
                    })}
                {stage.rounds && <Path stage={stage} config={config} isImagine={isImagine} />}
            </React.Fragment>
        )
    }
}

export default Knockout
