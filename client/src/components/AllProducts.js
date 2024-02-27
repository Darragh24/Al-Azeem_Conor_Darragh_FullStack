import React, { Component } from "react";
import ProductBox from "./ProductBox";
import Nav from "./Nav";
import axios from "axios";
import Footer from "./Footer";
import { SERVER_HOST } from "../config/global_constants";
import { Link } from "react-router-dom";
import { ACCESS_LEVEL_ADMIN } from "../config/global_constants";
import "../css/AllProducts.css";
export default class AllProducts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products: [],
      originalProducts: [],
    };
  }

  componentDidMount() {
    axios.get(`${SERVER_HOST}/products`).then((res) => {
      if (res.data) {
        if (res.data.errorMessage) {
          console.log(res.data.errorMessage);
        } else {
          this.setState({ products: res.data, originalProducts: res.data });
        }
      } else {
        console.log("Record not found");
      }
    });
  }

  handleSearchChange = (e) => {
    const search = e.target.value.toLowerCase();
    const originalProducts = this.state.originalProducts;

    const selectedProducts = originalProducts.filter((product) =>
      product.name.toLowerCase().includes(search)
    );

    this.setState({ products: selectedProducts });
  };

  handleSortChange = (e) => {
    const products = this.state.products;
    let selectedProducts;

    if (e.target.value === "alphabet-asc") {
      selectedProducts = products.slice().sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
    } else if (e.target.value === "alphabet-dsc") {
      selectedProducts = products.slice().sort((a, b) => {
        return b.name.localeCompare(a.name);
      });
    } else if (e.target.value === "price-asc") {
      selectedProducts = products.slice().sort((a, b) => {
        return a.price - b.price;
      });
    } else if (e.target.value === "price-dsc") {
      selectedProducts = products.slice().sort((a, b) => {
        return b.price - a.price;
      });
    } else {
      return this.setState({ products: this.state.originalProducts });
    }

    this.setState({ products: selectedProducts });
  };

  handleStockChange = (e) => {
    const { originalProducts } = this.state;
    let filteredProducts;
    if (e.target.value === "available") {
      filteredProducts = originalProducts.filter(
        (product) => product.stock > 0
      );
    } else if (e.target.value === "unavailable") {
      filteredProducts = originalProducts.filter(
        (product) => product.stock <= 0
      );
    } else {
      return this.setState({ products: this.state.originalProducts });
    }

    this.setState({ products: filteredProducts });
  };

  render() {
    return (
      <div className="main-container">
        <Nav />
        <div className="heading-container">
          <h1 className="heading-h1">Products</h1>
        </div>
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

          {localStorage.accessLevel >= ACCESS_LEVEL_ADMIN ? (
            <Link className="blue-button" to={"/AddProduct"}>
              Add New Product
            </Link>
          ) : null}
        </div>
        <div className="collection-container">
          {this.state.products.map((product) => (
            <div className="product-box-container">
              <ProductBox key={product._id} product={product} />
            </div>
          ))}
        </div>
        <Footer />
      </div>
    );
  }
}
