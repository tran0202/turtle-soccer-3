import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Page.css";
import logo from "../assets/logo.svg";

class Page extends React.Component {
    render() {
        return (
            <div className="Page">
                <header className="Page-header">
                    <img src={logo} className="Page-logo" alt="logo" />
                </header>
                {this.props.children}
            </div>
        )
    }
}

export default Page;
