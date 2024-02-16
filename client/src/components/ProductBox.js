import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ACCESS_LEVEL_ADMIN, SERVER_HOST } from "../config/global_constants";

import "../css/ProductBox.css";

export default class ProductBox extends Component {
  componentDidMount() {
    this.props.product.photos.map((photo) => {
      return axios
        .get(`${SERVER_HOST}/products/photo/${photo.filename}`)
        .then((res) => {
          if (res.data) {
            if (res.data.errorMessage) {
              console.log(res.data.errorMessage);
            } else {
              document.getElementById(
                photo._id
              ).src = `data:;base64,${res.data.image}`;
            }
          } else {
            console.log("Record not found");
          }
        });
    });
  }

  render() {
    return (
      <div className="box-container">
        <Link to={"/ProductPage/" + this.props.product._id}>
          {this.props.product.photos.map((photo, index) => (
            <img
              key={photo._id}
              id={photo._id}
              className={`image-${index}`}
              alt=""
            />
          ))}
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
