import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Nav extends Component {
  /*constructor(props) {
    super(props);
  }*/

  render() {
    return (
      <div className="nav-container">
        This is the footer
        <ul>
          <Link className="button" to={"/Home"}>
            Contact Us
          </Link>
          <Link className="button" to={"/AllProducts"}>
            Terms Of Service
          </Link>
          <Link className="button" to={"/AllProducts"}>
            Shipping Policy
          </Link>
        </ul>
      </div>
    );
  }
}
