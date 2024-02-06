import React, { Component } from "react";
import { Link } from "react-router-dom";
import Logout from "./Logout";
import { ACCESS_LEVEL_GUEST } from "../config/global_constants";

import "../css/nav.css";
export default class Nav extends Component {
  /*constructor(props) {
    super(props);
  }

  componentDidMount() {}*/

  render() {
    return (
      <div className="nav-container">
        Brand Name
        <div className="link-container">
          <Link className="button" to={"/Home"}>
            Home
          </Link>
          <Link className="button" to={"/AllProducts"}>
            All Products
          </Link>
          <Link className="button" to={"/AllProducts"}>
            About
          </Link>
        </div>
        {localStorage.accessLevel > ACCESS_LEVEL_GUEST ? (
          <div className="logout">
            <Logout />
          </div>
        ) : (
          <div>
            <Link className="green-button" to={"/Login"}>
              Login
            </Link>
            <Link className="blue-button" to={"/Register"}>
              Register
            </Link>{" "}
          </div>
        )}
      </div>
    );
  }
}
