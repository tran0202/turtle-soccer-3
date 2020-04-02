import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Page.css";
import turtleLogo from "../assets/LogoMakr_1aN4h4.png";

class Page extends React.Component {
    render() {
        return (
            <div className="Page">
                <header className="Page-header">
                    <img src={turtleLogo} alt="Turtle logo" />
                </header>
                {this.props.children}
            </div>
        )
    }
}

export default Page;
