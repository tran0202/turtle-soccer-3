import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../assets/stylesheets/AdminPage.css'
import logo from '../assets/images/logo.svg'
import firebaseLogo from '../assets/images/Firebase_Logo.svg.png'

class AdminPage extends React.Component {
  render() {
    return (
      <div className="AdminPage">
        <header className="AdminPage-header mb-5">
          <img src={logo} className="AdminPage-logo" alt="logo" />
          <img src={firebaseLogo} width="250px" alt="Firebase logo" />
        </header>
        {this.props.children}
      </div>
    )
  }
}

export default AdminPage
