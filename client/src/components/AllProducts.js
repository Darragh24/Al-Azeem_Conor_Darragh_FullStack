import React, { Component } from "react";
import ProductBox from "./ProductBox";
import Nav from "./Nav";
import axios from "axios";
import { SERVER_HOST } from "../config/global_constants";
import { Link } from "react-router-dom";
import { ACCESS_LEVEL_ADMIN } from "../config/global_constants";
import "../css/AllProducts.css";
export default class AllProducts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products: [],
    };
  }

  componentDidMount() {
    axios.get(`${SERVER_HOST}/products`).then((res) => {
      if (res.data) {
        if (res.data.errorMessage) {
          console.log(res.data.errorMessage);
        } else {
          console.log("Records read");
          this.setState({ products: res.data });
        }
      } else {
        console.log("Record not found");
      }
    });
  }

  render() {
    console.log(this.state.products);
    return (
      <div className="main-container">
        <Nav />

        <div className="collection-container">
          {this.state.products.map((product) => (
            <ProductBox key={product._id} product={product} />
          ))}
        </div>
        {localStorage.accessLevel >= ACCESS_LEVEL_ADMIN ? (
          <Link className="blue-button" to={"/AddProduct"}>
            Add New Product
          </Link>
        ) : null}
      </div>
    );
  }
}
