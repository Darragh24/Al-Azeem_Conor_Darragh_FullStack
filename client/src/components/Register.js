import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import axios from "axios";
import Nav from "./Nav";
import Marquee from "./Marquee";
import LinkInClass from "../components/LinkInClass";

import { SERVER_HOST } from "../config/global_constants";

export default class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      selectedFile: null,
      isRegistered: false,
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleFileChange = (e) => {
    this.setState({ selectedFile: e.target.files[0] });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    let formData = new FormData();
    formData.append("profilePhoto", this.state.selectedFile);

    axios
      .post(
        `${SERVER_HOST}/users/register/${this.state.name}/${this.state.email}/${this.state.password}`,
        formData,
        { headers: { "Content-type": "multipart/form-data" } }
      )
      .then((res) => {
        console.log("User registered and logged in");

        localStorage._id = res.data._id;
        localStorage.name = res.data.name;
        localStorage.accessLevel = res.data.accessLevel;
        localStorage.profilePhoto = res.data.profilePhoto;
        localStorage.token = res.data.token;

        this.setState({ isRegistered: true });
      })
      .catch((err) => {
        this.setState({ wasSubmittedAtLeastOnce: true });
      });
  };

  render() {
    let errorMessage = "";
    if (this.state.wasSubmittedAtLeastOnce) {
      errorMessage = (
        <div className="error">
          Error: All fields must be filled in
          <br />
        </div>
      );
    }
    return (
      <div className="main-container">
        <Nav />
        <Marquee />
        <form
          className="form-container"
          noValidate={true}
          id="loginOrRegistrationForm"
          onSubmit={this.handleSubmit}
        >
          {this.state.isRegistered ? <Redirect to="/AllProducts" /> : null}
          <h2 className="register-h2">Create an account</h2>
          <h4 className="login-h4">
            Already have an account?
            <Link className="create-account-button" to={"/Login"}>
              Sign in
            </Link>
          </h4>{" "}
          {errorMessage}
          <input
            className="register-input"
            name="name"
            type="text"
            placeholder="Name"
            autoComplete="name"
            value={this.state.name}
            onChange={this.handleChange}
            ref={(input) => {
              this.inputToFocus = input;
            }}
          />
          <input
            className="register-input"
            name="email"
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={this.state.email}
            onChange={this.handleChange}
          />
          <input
            className="register-input"
            name="password"
            type="password"
            placeholder="Password"
            autoComplete="password"
            title="Password)"
            value={this.state.password}
            onChange={this.handleChange}
          />
          <input
            className="register-input"
            name="confirmPassword"
            type="password"
            placeholder="Confirm password"
            autoComplete="confirmPassword"
            value={this.state.confirmPassword}
            onChange={this.handleChange}
          />
          <input type="file" onChange={this.handleFileChange} />
          <div className="register-confirmation-buttons-container">
            <LinkInClass
              value="Register"
              className="form-register-button"
              onClick={this.handleSubmit}
            />
            <Link className="form-register-cancel-button" to={"/AllProducts"}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    );
  }
}
