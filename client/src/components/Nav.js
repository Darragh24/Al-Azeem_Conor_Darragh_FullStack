import React, { Component } from "react";
import { Link } from "react-router-dom";
import Logout from "./Logout";
import { ACCESS_LEVEL_GUEST } from "../config/global_constants";

import "../css/Nav.css";

export default class Nav extends Component {
  /*constructor(props) {
    super(props);
  }

  componentDidMount() {}*/

  render() {
    return (
      <div className="nav-container">
        Brand
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
          <div className="logout-container">
            {localStorage.profilePhoto !== "null" ? (
              <img
                className="profile-pic"
                id="profilePhoto"
                src={`data:;base64,${localStorage.profilePhoto}`}
                alt=""
              />
            ) : null}
            <Logout />
            <Link className="button" to={`/Cart/${localStorage._id}`}>
              <i className="fa fa-shopping-cart" />
            </Link>
          </div>
        ) : (
          <div>
            <Link className="button" to={`/Cart/${localStorage._id}`}>
              <i className="fa fa-shopping-cart" />
            </Link>
            <Link className="login-button" to={"/Login"}>
              Login
            </Link>
            <Link className="register-button" to={"/Register"}>
              Register
            </Link>{" "}
          </div>
        )}
      </div>
    );
  }
}
