import React, { Component } from "react";
import { Link } from "react-router-dom";
import Logout from "./Logout";
import {
  ACCESS_LEVEL_GUEST,
  ACCESS_LEVEL_ADMIN,
  ACCESS_LEVEL_NORMAL_USER,
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
          {localStorage.accessLevel >= ACCESS_LEVEL_ADMIN ? (
            <Link className="button" to={"/Users"}>
              Users
            </Link>
          ) : null}

          {localStorage.accessLevel == ACCESS_LEVEL_NORMAL_USER ? (
            <Link
              className="button"
              to={`/PurchaseHistory/${localStorage._id}`}
            >
              Purchase History
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
              <i className="fa fa-user"></i>
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
