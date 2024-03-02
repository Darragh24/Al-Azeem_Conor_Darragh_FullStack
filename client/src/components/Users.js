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
              onChange={this.handleStockChange}
            >
              <option key="all" value="all">
                All
              </option>
              <option key="available" value="available">
                In Stock
              </option>
              <option key="unavailable" value="unavailable">
                Out of Stock
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
              <option key="price-asc" value="price-asc">
                Price, low to high
              </option>
              <option key="price-dsc" value="price-dsc">
                Price , high to low
              </option>
            </select>
          </div>
        </div>
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
              <td className={`data-${index}`}>{user.name}</td>
              <td className={`data-${index}`}>{user.email}</td>
              <td className={`data-${index}`}>{user.accessLevel}</td>

              <td className={`data-${index}`}>
                <Link
                  className="history-button"
                  to={"/SalesHistory/" + user._id}
                >
                  View History
                </Link>
              </td>
              <td className={`data-${index}`}>
                <Link className="history-button" to={"/DeleteUser/" + user._id}>
                  Edit
                </Link>
                <Link className="history-button" to={"/DeleteUser/" + user._id}>
                  Delete
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </div>
    );
  }
}
