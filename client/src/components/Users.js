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
      originalUsers: [],
    };
  }

  componentDidMount() {
    axios
      .get(`${SERVER_HOST}/users`)
      .then((res) => {
        this.setState({ users: res.data, originalUsers: res.data });
      })
      .catch((err) => {});
  }

  handleSearchChange = (e) => {
    const originalUsers = this.state.originalUsers;

    const selectedUsers = originalUsers.filter((user) => {
      return user.name.toLowerCase().includes(e.target.value.toLowerCase());
    });

    this.setState({ users: selectedUsers });
  };
  handleSortChange = (e) => {
    let selectedUsers;

    if (e.target.value === "alphabet-asc") {
      selectedUsers = [...this.state.originalUsers].sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
    } else if (e.target.value === "alphabet-dsc") {
      selectedUsers = [...this.state.originalUsers].sort((a, b) => {
        return b.name.localeCompare(a.name);
      });
    } else {
      return this.setState({ users: this.state.originalUsers });
    }

    this.setState({ users: selectedUsers });
  };

  handleFilterChange = (e) => {
    let filteredUsers;

    if (e.target.value === "2") {
      filteredUsers = this.state.originalUsers.filter(
        (user) => user.accessLevel === 2
      );
    } else if (e.target.value === "1") {
      filteredUsers = this.state.originalUsers.filter(
        (user) => user.accessLevel === 1
      );
    } else {
      return this.setState({ users: this.state.originalUsers });
    }

    this.setState({ users: filteredUsers });
  };

  render() {
    return (
      <div className="main-container">
        <Nav />

        <div className="tool-buttons-container">
          <div className="search-box-container">
            <input
              className="search-box"
              placeholder="Search by name"
              value={this.state.search}
              onChange={this.handleSearchChange}
            />
          </div>
          <div className="filter-container">
            <label>Filter </label>
            <select
              name="price"
              className="dropdown1"
              onChange={this.handleFilterChange}
            >
              <option key="all" value="all">
                All
              </option>
              <option key="admin" value={2}>
                Admin
              </option>
              <option key="normal-user" value={1}>
                Normal User
              </option>
            </select>
          </div>
          <div className="sort-dropdown-container">
            <label>Sort By : </label>
            <select
              name="price"
              className="dropdown1"
              onChange={this.handleSortChange}
            >
              <option key="default" value="default">
                Default
              </option>
              <option key="alphabet-asc" value="alphabet-asc">
                Alphabetically, A-Z
              </option>
              <option key="alphabet-dsc" value="alphabet-dsc">
                Alphabetically, Z-A
              </option>
            </select>
          </div>
        </div>
        <div className="table-container">
          <tbody className="user-table">
            <tr className="row-header">
              <th>Name</th>
              <th>Email</th>
              <th>Access Level</th>
              <th>Sale History</th>
              <th>Actions</th>
            </tr>
            {this.state.users.map((user, index) => (
              <tr className={`row-${index}`}>
                <td data-cell="name">{user.name}</td>
                <td data-cell="email">{user.email}</td>
                <td data-cell="accessLevel">{user.accessLevel}</td>

                <td data-cell="salesHistory">
                  <Link
                    className="history-button"
                    to={"/SalesHistory/" + user._id}
                  >
                    View History
                  </Link>
                </td>
                <td data-cell="actions">
                  <div className="actions-container">
                    <Link className="del-button" to={"/DeleteUser/" + user._id}>
                      Delete
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </div>
      </div>
    );
  }
}
