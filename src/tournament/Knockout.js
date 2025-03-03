import React from 'react'
import { Row, Col } from 'reactstrap'
import Brackets from '../components/Brackets'
import MatchesKnockout from '../components/MatchesKnockout'

const Path = (props) => {
    const { path, config, isImagine } = props
    return (
        <React.Fragment>
            {config.multi_path && (
                <Row>
                    <Col sm="12" className="h2-ff6 border-bottom-double-gray3 margin-top-md">
                        {path.name}
                    </Col>
                </Row>
            )}
            <Brackets stage={path} config={config} isImagine={isImagine} />
            <MatchesKnockout stage={path} config={config} isImagine={isImagine} />
        </React.Fragment>
    )
}

class Knockout extends React.Component {
    render() {
        const { stage, config, isImagine } = this.props
        return (
            <React.Fragment>
                {stage.paths &&
                    stage.paths.map((p) => {
                        return <Path key={p.name} path={p} config={{ ...config, multi_path: true }} isImagine={isImagine} />
                    })}
                {stage.rounds && <Path path={stage} config={config} isImagine={isImagine} />}
            </React.Fragment>
        )
    }
}

export default Knockout
