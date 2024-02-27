import React, { Component } from "react";
import Nav from "./Nav";
import axios from "axios";
import { Link } from "react-router-dom";
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
          <div className="user-table-container">
            <tbody className="user-table">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Access Level</th>
                <th>Sale History</th>
                <th>Actions</th>
              </tr>
              <tr>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.accessLevel}</td>

                <td>
                  <Link
                    className="history-button"
                    to={"/SalesHistory/" + user._id}
                  >
                    View History
                  </Link>
                </td>
                <td>
                  <Link
                    className="history-button"
                    to={"/DeleteUser/" + user._id}
                  >
                    Edit
                  </Link>
                  <Link
                    className="history-button"
                    to={"/DeleteUser/" + user._id}
                  >
                    Delete
                  </Link>
                </td>
              </tr>
            </tbody>
          </div>
        ))}
      </div>
    );
  }
}
