import React, { Component } from "react";
import Nav from "./Nav";
import axios from "axios";
import { SERVER_HOST } from "../config/global_constants";
export default class Users extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
    };
  }

  componentDidMount() {
    axios.get(`${SERVER_HOST}/users`).then((res) => {
      if (res.data) {
        if (res.data.errorMessage) {
          console.log(res.data.errorMessage);
        } else {
          this.setState({ users: res.data });
        }
      } else {
        console.log("Record not found");
      }
    });
  }

  render() {
    return (
      <div className="main-container">
        <Nav />
        {this.state.users.map((user) => (
          <div>
            <p>{user._id}</p>
            <p>{user.name}</p>
            <p>{user.email}</p>
            <p>{user.password}</p>
          </div>
        ))}
      </div>
    );
  }
}
