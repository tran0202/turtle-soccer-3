import React from 'react'
import { Row, Col } from 'reactstrap'
import Brackets from './Brackets'
import MatchesKnockout from './MatchesKnockout'

class Path extends React.Component {
    render() {
        const { stage, config, isImagine } = this.props
        return (
            <React.Fragment>
                {config.multi_path && (
                    <Row>
                        <Col sm="12" className="h2-ff6 border-bottom-double-gray3 margin-top-md">
                            {stage.name}
                        </Col>
                    </Row>
                )}
                <Brackets stage={stage} config={config} isImagine={isImagine} />
                <MatchesKnockout stage={stage} config={config} isImagine={isImagine} />
            </React.Fragment>
        )
    }
}

export default Path
