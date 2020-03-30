import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Page.css";
import logo from "../assets/logo.svg";
import firebaseLogo from "../assets/Firebase_Logo.svg.png";

class AdminPage extends React.Component {
    render() {
        return (
            <div className="Page">
                <header className="AdminPage-header mb-5">
                    <img src={logo} className="Page-logo" alt="logo" />
                    <img src={firebaseLogo} width="250px" alt="Firebase logo" />
                </header>
                {this.props.children}
            </div>
        )
    }
}

export default AdminPage;
