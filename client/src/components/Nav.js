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
            T4A
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
          <div className="right-side-nav-container">
            <Link className="nav-atc-button" to={`/Cart/${localStorage._id}`}>
              <i className="fa fa-shopping-cart" />
            </Link>

            {localStorage.profilePhoto !== "null" ? (
              <img
                className="profile-pic"
                id="profilePhoto"
                src={`data:;base64,${localStorage.profilePhoto}`}
                alt=""
              />
            ) : (
              <img
                className="profile-pic"
                src="https://via.placeholder.com/250"
                alt=""
              />
            )}

            <div className="logout-container">
              <Logout />
              <Link className="button" to={`/Account/${localStorage._id}`}>
                <i className="fa fa-user" />
                View Account
              </Link>
            </div>
          </div>
        ) : (
          <div className="login-container">
            <Link className="login-button" to={"/Login"}>
              <i className="fa fa-user"></i>
            </Link>
            <Link className="nav-atc-button" to={`/Cart/${localStorage._id}`}>
              <i className="fa fa-shopping-cart" />
            </Link>
          </div>
        )}
      </div>
    );
  }
}
