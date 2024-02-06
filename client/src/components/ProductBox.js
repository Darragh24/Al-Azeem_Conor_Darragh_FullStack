import React, { Component } from "react";
import { Link } from "react-router-dom";
import { ACCESS_LEVEL_ADMIN } from "../config/global_constants";

export default class ProductBox extends Component {
  render() {
    return (
      <div className="box-container">
        <p>{this.props.product.name}</p>
        <p>{this.props.product.colour}</p>
        <p>{this.props.product.price}</p>
        <p>{this.props.product.size}</p>

        {localStorage.accessLevel >= ACCESS_LEVEL_ADMIN ? (
          <div>
            <Link
              className="green-button"
              to={"/EditProduct/" + this.props.product._id}
            >
              Edit
            </Link>
            <Link
              className="red-button"
              to={"/DeleteProduct/" + this.props.product._id}
            >
              Delete
            </Link>
          </div>
        ) : null}
      </div>
    );
  }
}
