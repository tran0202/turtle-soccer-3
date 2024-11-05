import React from 'react'
import Header from './Header'
import Rows from './Rows'

class Table extends React.Component {
    render() {
        const { state, func } = this.props
        return (
            <React.Fragment>
                <Header state={state} func={func} />
                <Rows state={state} />
            </React.Fragment>
        )
    }
}

export default Table
