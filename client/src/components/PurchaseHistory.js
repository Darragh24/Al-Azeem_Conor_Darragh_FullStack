import React, { Component } from "react";
import Nav from "./Nav";
import Footer from "./Footer";
import Marquee from "./Marquee";
import axios from "axios";
import { SERVER_HOST } from "../config/global_constants";
export default class PurchaseHistory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sales: [],
      originalSales: [],
    };
  }

  componentDidMount() {
    axios
      .get(`${SERVER_HOST}/sales/${this.props.match.params.id}`)
      .then((res) => {
        this.setState({ sales: res.data, originalSales: res.data });
      })
      .catch((err) => {});
  }

  handleSearchChange = (e) => {
    const search = e.target.value.toLowerCase();
    const originalSales = this.state.originalSales;

    const selectedSales = originalSales.filter((sale) =>
      sale.productInfos.some((product) =>
        product.productName.toLowerCase().includes(search)
      )
    );
    this.setState({ sales: selectedSales });
  };

  handleSortChange = (e) => {
    const sales = this.state.sales;
    let selectedSales;

    if (e.target.value === "price-asc") {
      selectedSales = sales.slice().sort((a, b) => {
        return a.price - b.price;
      });
    } else if (e.target.value === "price-dsc") {
      selectedSales = sales.slice().sort((a, b) => {
        return b.price - a.price;
      });
    } else {
      return this.setState({ sales: this.state.originalSales });
    }

    this.setState({ sales: selectedSales });
  };

  handleFilterChange = (e) => {
    let filteredSales;
    if (e.target.value === "oldest") {
      filteredSales = [...this.state.originalSales];
      filteredSales.reverse();
    } else {
      filteredSales = [...this.state.originalSales];
    }

    this.setState({ sales: filteredSales });
  };

  render() {
    return (
      <div className="main-container">
        <Nav />
        <Marquee />
        <div className="tool-buttons-container">
          <div className="search-box-container">
            <input
              className="search-box"
              placeholder="Search by Product-Name"
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
              <option key="newest" value="newest">
                Purchase Date: Newest to Oldest
              </option>
              <option key="oldest" value="oldest">
                Purchase Date: Oldest to Newest
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
              <option key="price-asc" value="price-asc">
                Subtotal, low to high
              </option>
              <option key="price-dsc" value="price-dsc">
                Subtotal , high to low
              </option>
            </select>
          </div>
        </div>

        {this.state.sales.map((sale, index) => (
          <div className="sales-table-container">
            <tbody className="sales-table">
              <h1>Order #{index + 1}</h1>
              <h3>Paypal Payment ID : {sale.paypalPaymentID}</h3>
              <h3>Subtotal : ${sale.price}</h3>

              <tr>
                <th>Product Id</th>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Product Price</th>
              </tr>
              {sale.productInfos.map((productInfo) => (
                <tr>
                  <td data-cell="productId">{productInfo.productId}</td>
                  <td data-cell="product-name">{productInfo.productName}</td>
                  <td data-cell="quantity">{productInfo.quantity}</td>
                  <td data-cell="product-price">
                    ${productInfo.productPrice * productInfo.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </div>
        ))}
        <Footer />
      </div>
    );
  }
}
