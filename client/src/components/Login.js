import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import axios from "axios";
import Nav from "./Nav";
import LinkInClass from "../components/LinkInClass";
import { SERVER_HOST } from "../config/global_constants";
import "../css/Form.css";
export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      isLoggedIn: false,
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = (e) => {
    axios
      .post(
        `${SERVER_HOST}/users/login/${this.state.email}/${this.state.password}`
      )
      .then((res) => {
        if (res.data) {
          if (res.data.errorMessage) {
            console.log(res.data.errorMessage);
          } // user successfully logged in
          else {
            console.log("User logged in");
            console.log(res.data);
            localStorage._id = res.data._id;
            localStorage.name = res.data.name;
            localStorage.accessLevel = res.data.accessLevel;
            localStorage.profilePhoto = res.data.profilePhoto;
            localStorage.token = res.data.token;

            this.setState({ isLoggedIn: true });
          }
        } else {
          console.log("Login failed");
        }
      });
  };

  render() {
    return (
      <div className="main-container">
        <Nav />
        <form className="form-container" noValidate={true}>
          <h2 className="login-h2">Login</h2>

          <h4 className="login-h4">
            don't have an account?
            <Link className="create-account-button" to={"/Register"}>
              Create One
            </Link>
          </h4>
          {this.state.isLoggedIn ? <Redirect to="/AllProducts" /> : null}

          <input
            className="login-input"
            type="email"
            name="email"
            placeholder="Email"
            autoComplete="email"
            value={this.state.email}
            onChange={this.handleChange}
          />

          <input
            className="login-input"
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="password"
            value={this.state.password}
            onChange={this.handleChange}
          />
          <div className="confirmation-buttons-container">
            <LinkInClass
              value="Login"
              className="form-login-button"
              onClick={this.handleSubmit}
            />
            <Link className="form-cancel-button" to={"/AllProducts"}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    );
  }
}
