import React, { Component } from "react";
import Nav from "./Nav";
import axios from "axios";
import { SERVER_HOST } from "../config/global_constants";
export default class Users extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sales: [],
    };
  }

  componentDidMount() {
    axios
      .get(`${SERVER_HOST}/sales/${this.props.match.params.id}`)
      .then((res) => {
        if (res.data) {
          if (res.data.errorMessage) {
            console.log(res.data.errorMessage);
          } else {
            this.setState({ sales: res.data });
            console.log("Sales", this.state.sales);
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
        {this.state.sales.map((sale) => (
          <div className="sales-table-container">
            <tbody className="sales-table">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Price</th>
              </tr>
              <tr>
                <td>{sale.customerName}</td>
                <td>{sale.customerEmail}</td>
                <td>{sale.price}</td>
              </tr>
            </tbody>
          </div>
        ))}
      </div>
    );
  }
}
