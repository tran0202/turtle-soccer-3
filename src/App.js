import React from 'react'
import Page from './core/Page'
import { Container } from 'reactstrap'

class App extends React.Component {
    constructor(props) {
        super(props)
        document.title = 'Turtle Soccer'
    }

    render() {
        return (
            <Page>
                <Container>
                    <div id="hero" class="carousel slide carousel-fade" data-bs-ride="carousel">
                        <div class="carousel-indicators">
                            <button
                                type="button"
                                data-bs-target="#hero"
                                data-bs-slide-to="0"
                                className="active"
                                aria-current="true"
                                aria-label="Slide 1"
                            ></button>
                            <button type="button" data-bs-target="#hero" data-bs-slide-to="1" aria-label="Slide 2"></button>
                            <button type="button" data-bs-target="#hero" data-bs-slide-to="2" aria-label="Slide 3"></button>
                        </div>
                        <div class="carousel-inner">
                            <div
                                className="carousel-item active"
                                style={{
                                    backgroundImage: "url('/images/slide/5Y3W3OAVMMZF2YS23KVNUEEFGU.webp')",
                                    backgroundSize: 'contain',
                                    backgroundColor: '#b3b2b2',
                                }}
                            >
                                <div className="carousel-container">
                                    <div className="carousel-content container">
                                        <h2 className="animated fadeInDown h2-ff8">
                                            Welcome to <span>Turtle Soccer</span>
                                        </h2>
                                        <p className="animated fadeInUp">It's known as football for the rest of the world. In America, we call it Soccer!</p>
                                        <a href="/imagine" className="btn-get-started animated fadeInUp scrollto">
                                            Imagine
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="carousel-item"
                                style={{
                                    backgroundImage: "url('/images/slide/eaf8e81e8a2b64d30b58ef5172451b8266946e3fb5d49.webp')",
                                    backgroundSize: 'contain',
                                    backgroundColor: '#b3b2b2',
                                }}
                            >
                                <div className="carousel-container">
                                    <div className="carousel-content container">
                                        <h2 className="animated fadeInDown h2-ff8">
                                            Welcome to <span>Turtle Soccer</span>
                                        </h2>
                                        <p className="animated fadeInUp">
                                            Magnam dolores commodi suscipit. Necessitatibus eius consequatur ex aliquid fuga eum quidem. Sit sint consectetur
                                            velit. Quisquam quos quisquam cupiditate. Et nemo qui impedit suscipit alias ea.
                                        </p>
                                        <a href="/rankings" className="btn-get-started animated fadeInUp scrollto">
                                            World Rankings
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="carousel-item"
                                style={{
                                    backgroundImage: "url('/images/slide/Copa America Argentina AFP.jpg')",
                                    backgroundSize: 'contain',
                                    backgroundColor: '#b3b2b2',
                                }}
                            >
                                <div className="carousel-container">
                                    <div className="carousel-content container">
                                        <h2 className="animated fadeInDown h2-ff8">
                                            Welcome to <span>Turtle Soccer</span>
                                        </h2>
                                        <p className="animated fadeInUp">
                                            Ut velit est quam dolor ad a aliquid qui aliquid. Sequi ea ut et est quaerat sequi nihil ut aliquam. Occaecati alias
                                            dolorem mollitia ut. Similique ea voluptatem. Esse doloremque accusamus repellendus deleniti vel. Minus et tempore
                                            modi architecto.
                                        </p>
                                        <a href="/organization" className="btn-get-started animated fadeInUp scrollto">
                                            Organization
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button className="carousel-control-prev" type="button" data-bs-target="#hero" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon icofont-rounded-left" aria-hidden="true"></span>
                            <span class="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#hero" data-bs-slide="next">
                            <span class="carousel-control-next-icon icofont-rounded-right" aria-hidden="true"></span>
                            <span class="visually-hidden">Next</span>
                        </button>
                    </div>
                </Container>
            </Page>
        )
    }
}

export default App
