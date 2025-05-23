import React from 'react'
import { getTournamentTitleFont } from '../core/Helper'
import { Row, Col, Nav, NavItem, NavLink } from 'reactstrap'
import moment from 'moment'

const HeaderLinks = (props) => {
    const { tournament, config } = props
    const { competition } = config
    const { previous_tournament, next_tournament } = tournament
    return (
        <Nav className="justify-content-center">
            {previous_tournament && previous_tournament.year && (
                <NavItem>
                    <NavLink href={`/tournament/${previous_tournament.id}`}>
                        <i className="icofont-long-arrow-left"></i>
                        {previous_tournament.year}
                    </NavLink>
                </NavItem>
            )}
            <NavItem>
                <NavLink href={`/competition/${competition.id}`}>More {competition.name}</NavLink>
            </NavItem>
            {next_tournament && next_tournament.year && (
                <NavItem>
                    <NavLink href={`/tournament/${next_tournament.id}`}>
                        {next_tournament.year}
                        <i className="icofont-long-arrow-right"></i>
                    </NavLink>
                </NavItem>
            )}
        </Nav>
    )
}

class Header extends React.Component {
    render() {
        const { tournament, config } = this.props
        const { name, details, competition } = config
        const {
            logo_filename,
            color,
            start_date,
            end_date,
            start_league_date,
            end_league_date,
            start_final_date,
            end_final_date,
            start_relegation_date,
            end_relegation_date,
            start_qualifying_date,
            end_qualifying_date,
            start_competition_date,
            end_competition_date,
        } = details
        return (
            <Row className="mt-3 text-center">
                <Col lg={{ size: 3 }} md={{ size: 3 }} sm="3" className="mt-3 mb-2 text-end">
                    <a href={`/tournament/${tournament.id}`}>
                        <img className="tournament-top-height-100" src={`/images/${competition.logo_path}/${logo_filename}`} alt={name} title={name} />
                    </a>
                </Col>
                <Col lg="9" md="9" sm="9">
                    <h1 className={`text-center mt-3 mb-2 ${getTournamentTitleFont(competition)}`} style={{ color: color }}>
                        {name}
                    </h1>
                    {start_date && (
                        <React.Fragment>
                            {moment(start_date).format('MMMM D, YYYY')} &mdash; {moment(end_date).format('MMMM D, YYYY')}
                        </React.Fragment>
                    )}
                    {start_league_date && (
                        <React.Fragment>
                            <b>League:</b> {moment(start_league_date).format('MMMM D, YYYY')} &mdash; {moment(end_league_date).format('MMMM D, YYYY')}
                        </React.Fragment>
                    )}
                    {start_final_date && (
                        <React.Fragment>
                            &nbsp;&nbsp;<i className="icofont-football-alt"></i>&nbsp;&nbsp;
                            <b>Finals:</b> {moment(start_final_date).format('MMMM D, YYYY')} &mdash; {moment(end_final_date).format('MMMM D, YYYY')}
                        </React.Fragment>
                    )}
                    {start_relegation_date && (
                        <React.Fragment>
                            <br />
                            &nbsp;&nbsp;<i className="icofont-football-alt"></i>&nbsp;&nbsp;
                            <b>Relegation Play-outs:</b> {moment(start_relegation_date).format('MMMM D, YYYY')} &mdash;{' '}
                            {moment(end_relegation_date).format('MMMM D, YYYY')}
                        </React.Fragment>
                    )}
                    {start_qualifying_date && (
                        <React.Fragment>
                            <b>Qualifying:</b> {moment(start_qualifying_date).format('MMMM D, YYYY')} &mdash;{' '}
                            {moment(end_qualifying_date).format('MMMM D, YYYY')}
                            &nbsp;&nbsp;<i className="icofont-football-alt"></i>&nbsp;&nbsp;
                        </React.Fragment>
                    )}
                    {start_competition_date && (
                        <React.Fragment>
                            <b>Competition:</b> {moment(start_competition_date).format('MMMM D, YYYY')} &mdash;{' '}
                            {moment(end_competition_date).format('MMMM D, YYYY')}
                        </React.Fragment>
                    )}
                    <HeaderLinks tournament={tournament} config={config} />
                </Col>
            </Row>
        )
    }
}

export default Header
