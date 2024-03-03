import React, { Component } from "react";
import axios from "axios";
import Nav from "./Nav";
import Marquee from "./Marquee";
import { SERVER_HOST } from "../config/global_constants";
import "../css/Account.css";
export default class Account extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: [],
    };
  }

  componentDidMount() {
    axios
      .get(`${SERVER_HOST}/users/${localStorage._id}`, {
        headers: { authorization: localStorage.token },
      })
      .then((res) => {
        if (res.data) {
          if (res.data.errorMessage) {
            console.log(res.data.errorMessage);
          } else {
            this.setState({ user: res.data });
            console.log("Succesful Request");
          }
        } else {
          console.log("Record not found");
        }
      });
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    console.log("User", this.state.user);
    return (
      <div className="main-container">
        <Nav />
        <Marquee />
        <div className="account-container">
          <h1 className="account-h1">Your Account</h1>

          {localStorage.profilePhoto !== "null" ? (
            <img
              className="account-profile-pic"
              id="profilePhoto"
              src={`data:;base64,${localStorage.profilePhoto}`}
              alt=""
            />
          ) : (
            <img
              className="account-profile-pic"
              src="https://via.placeholder.com/250"
              alt=""
            />
          )}

          <h4>Username: {this.state.user.name}</h4>
          <h4>Email: {this.state.user.email}</h4>
          <h4>Access Level: {this.state.user.accessLevel}</h4>
        </div>
      </div>
    );
  }
}
