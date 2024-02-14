import React, { Component } from "react";
import { Link } from "react-router-dom";
import { ACCESS_LEVEL_ADMIN } from "../config/global_constants";

import "../css/ProductBox.css";

export default class ProductBox extends Component {
  render() {
    return (
      <div className="box-container">
        <Link to={"/ProductPage/" + this.props.product._id}>
          <img src="https://placehold.co/200x200" alt="" />
        </Link>

        <div className="info-button-container">
          <div className="box-info-container">
            <p>{this.props.product.name}</p>
            <p>€{this.props.product.price}</p>
          </div>
          {localStorage.accessLevel >= ACCESS_LEVEL_ADMIN ? (
            <div className="box-button-container">
              <Link
                className="edit-button"
                to={"/EditProduct/" + this.props.product._id}
              >
                <i className="fa fa-pencil" />
              </Link>
              <Link
                className="del-button"
                to={"/DeleteProduct/" + this.props.product._id}
              >
                <i className="fa fa-trash-o" />
              </Link>
            </div>
          ) : null}
          <Link className="atc-button" to={"//"}>
            <p>
              +<i className="fa fa-shopping-cart" />
            </p>
          </Link>
        </div>
      </div>
    );
  }
}
