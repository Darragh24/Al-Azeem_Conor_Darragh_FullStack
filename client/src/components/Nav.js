import React, { Component } from "react";
import { Link } from "react-router-dom";
import Logout from "./Logout";
import {
  ACCESS_LEVEL_GUEST,
  ACCESS_LEVEL_ADMIN,
} from "../config/global_constants";

import "../css/Nav.css";

export default class Nav extends Component {
  render() {
    return (
      <div className="nav-container">
        <p className="brand-name-p">
          <Link className="brand-button" to={"/Home"}>
            Brand
          </Link>
        </p>
        <div className="link-container">
          <Link className="button" to={"/Home"}>
            Home
          </Link>
          <Link className="button" to={"/AllProducts"}>
            Shop
          </Link>
          <Link className="button" to={"/AllProducts"}>
            About
          </Link>
          {localStorage.accessLevel >= ACCESS_LEVEL_ADMIN ? (
            <Link className="button" to={"/Users"}>
              Users
            </Link>
          ) : null}
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
          <div className="login-container">
            <Link className="login-button" to={"/Login"}>
              <i class="fa fa-user"></i>
            </Link>
            <Link className="button" to={`/Cart/${localStorage._id}`}>
              <i className="fa fa-shopping-cart" />
            </Link>
          </div>
        )}
      </div>
    );
  }
}
