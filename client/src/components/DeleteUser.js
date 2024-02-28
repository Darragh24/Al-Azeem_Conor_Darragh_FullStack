import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

import { SERVER_HOST } from "../config/global_constants";

export default class DeleteProduct extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirectToDisplayAllUsers: false,
    };
  }

  componentDidMount() {
    axios
      .delete(`${SERVER_HOST}/users/${this.props.match.params.id}`, {
        headers: { authorization: localStorage.token },
      })
      .then((res) => {
        if (res.data) {
          if (res.data.errorMessage) {
            console.log(res.data.errorMessage);
          } // success
          else {
            console.log("User deleted");
          }
          this.setState({ redirectToDisplayAllUsers: true });
        } else {
          console.log("User not deleted");
        }
      });
  }

  render() {
    return (
      <div>
        {this.state.redirectToDisplayAllUsers ? <Redirect to="/Users" /> : null}
      </div>
    );
  }
}
