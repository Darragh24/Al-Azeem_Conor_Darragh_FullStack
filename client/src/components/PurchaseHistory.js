import React, { Component } from "react";
import Nav from "./Nav";
import axios from "axios";
import { SERVER_HOST } from "../config/global_constants";
export default class PurchaseHistory extends Component {
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

        {this.state.sales.map((sale) => (
          <div className="sales-table-container">
            <tbody className="sales-table">
              <tr>
                <th>Product Id</th>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Product Price</th>
                <th>Subtotal</th>
              </tr>

              {sale.productInfos.map((productInfo) => (
                <tr>
                  <td>{productInfo.productId}</td>
                  <td>{productInfo.productName}</td>
                  <td>{productInfo.quantity}</td>
                  <td>${productInfo.productPrice * productInfo.quantity}</td>
                  <td>----</td>
                </tr>
              ))}
              <tr>
                <td>----</td>
                <td>----</td>
                <td>----</td>
                <td>----</td>
                <td>${sale.price}</td>
              </tr>
            </tbody>
          </div>
        ))}
      </div>
    );
  }
}
