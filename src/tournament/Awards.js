import React from 'react'
import { Row, Col } from 'reactstrap'
// import moment from 'moment'
import { getTeamFlagId, getTeamName } from '../core/TeamHelper'

const TournamentDetails = (props) => {
    const { config } = props
    return (
        <React.Fragment>
            <ul className="no-margin-bottom text-start">
                <li>
                    Hosted by{' '}
                    {config.details.host.map((h, index) => {
                        return (
                            <React.Fragment key={index}>
                                {index !== 0 && index < config.details.host.length - 1 ? ', ' : ''}
                                {index !== 0 && index === config.details.host.length - 1 ? ' and ' : ''}
                                {getTeamName(h, config.competition)} {getTeamFlagId(h, config.competition)}
                            </React.Fragment>
                        )
                    })}
                </li>
            </ul>
        </React.Fragment>
    )
}

const HeroCarousel = (props) => {
    const { images, id } = props
    return (
        <React.Fragment>
            {images && (
                <div id="hero-md" className="carousel slide carousel-fade" data-bs-ride="carousel">
                    <div className="carousel-indicators carousel-indicators-md">
                        {images.map((i, index) => (
                            <button
                                key={index}
                                type="button"
                                data-bs-target="#hero-md"
                                data-bs-slide-to={index}
                                className={`${index === 0 ? 'active' : ''}`}
                                aria-current="true"
                                aria-label={`Slide ${index + 1}`}
                            >
                                <div className="carousel-container">
                                    <div className="carousel-content container">
                                        <h2 className="animated fadeInDown h2-ff8">{i.name}</h2>
                                        <p className="animated fadeInUp">{i.text}</p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                    <div className="carousel-inner">
                        {images.map((i, index) => (
                            <div
                                key={index}
                                className={`carousel-item${index === 0 ? ' carousel-item-md active' : ' carousel-item-md'}`}
                                style={{
                                    backgroundImage: `url('/images/tournaments/${id}/${i.filename}')`,
                                }}
                            >
                                <div className="carousel-container">
                                    <div className="carousel-content container">
                                        <h2 className="animated fadeInDown h2-ff8">{i.name}</h2>
                                        <p className="animated fadeInUp">{i.text}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#hero-md" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon icofont-rounded-left" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#hero-md" data-bs-slide="next">
                        <span className="carousel-control-next-icon icofont-rounded-right" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            )}
        </React.Fragment>
    )
}

class Awards extends React.Component {
    render() {
        const { tournament, config } = this.props
        const { hero_images, id } = config
        return (
            <React.Fragment>
                <Row className="mt-4 mb-4">
                    <Col>
                        <HeroCarousel images={hero_images} id={id} />
                    </Col>
                    <Col className="competition-box">
                        <TournamentDetails tournament={tournament} config={config} />
                    </Col>
                </Row>
            </React.Fragment>
        )
    }
}

export default Awards
