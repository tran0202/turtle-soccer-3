import React from 'react'
import { getRandomMensTeamArray } from '../core/TeamHelper'
import Header from './Header'
import Rows from './Rows'

class Table extends React.Component {
    constructor(props) {
        super(props)

        this.state = { allRankings: [], rankings: [], config: { team_type_id: 'MNT' } }
    }

    getData = () => {
        const allRankings = getRandomMensTeamArray()
        this.setState({ allRankings, rankings: allRankings })
    }

    setData = (rankings) => {
        this.setState({ rankings })
    }

    componentDidMount() {
        this.getData()
    }

    componentDidUpdate() {
        window.rankingsStore = this.state
    }
    render() {
        return (
            <React.Fragment>
                <Header state={this.state} func={this.setData} />
                <Rows state={this.state} />
            </React.Fragment>
        )
    }
}

export default Table
