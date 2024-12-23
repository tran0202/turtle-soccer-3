import React from 'react'
// import { getTournamentTitleFont } from '../core/Helper'
// import { Row, Col, Nav, NavItem, NavLink } from 'reactstrap'
// import moment from 'moment'

class Awards extends React.Component {
    render() {
        const { config } = this.props
        const { hero_images, id } = config
        return (
            <React.Fragment>
                {hero_images && (
                    <div id="hero-md" class="carousel slide carousel-fade" data-bs-ride="carousel">
                        <div class="carousel-indicators carousel-indicators-md">
                            {hero_images.map((i, index) => (
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
                        <div class="carousel-inner">
                            {hero_images.map((i, index) => (
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
                            <span class="carousel-control-prev-icon icofont-rounded-left" aria-hidden="true"></span>
                            <span class="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next carousel-control-next-md" type="button" data-bs-target="#hero-md" data-bs-slide="next">
                            <span class="carousel-control-next-icon icofont-rounded-right" aria-hidden="true"></span>
                            <span class="visually-hidden">Next</span>
                        </button>
                    </div>
                )}
            </React.Fragment>
        )
    }
}

export default Awards
