import React, { Component } from "react";

import axios from "axios";

import { SERVER_HOST } from "../config/global_constants";

import "../css/Nav.css";
import Nav from "./Nav";

export default class Cart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cart: [],
      products: [],
    };
  }

  componentDidMount() {
    axios
      .get(`${SERVER_HOST}/cart/${this.props.match.params.id}`, {
        headers: { authorization: localStorage.token },
      })
      .then((res) => {
        if (res.data) {
          if (res.data.errorMessage) {
            console.log(res.data.errorMessage);
          } else {
            this.setState({ cart: res.data });
            console.log("Succesful Request");
          }
        } else {
          console.log("Record not found");
        }
      });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.cart !== prevState.cart) {
      this.state.cart.forEach((cartItem) => {
        axios
          .get(`${SERVER_HOST}/products/${cartItem.productId}`, {
            headers: { authorization: localStorage.token },
          })
          .then((res) => {
            if (res.data) {
              if (res.data.errorMessage) {
                console.log(res.data.errorMessage);
              } else {
                this.setState((prevState) => ({
                  products: [...prevState.products, res.data], // Adding the new data to existing products
                }));
              }
            } else {
              console.log("Record not found");
            }
          });
      });
    }
    if (this.state.products !== prevState.products) {
      this.state.products.forEach((product) => {
        product.photos.map((photo) => {
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
                  console.log("image success");
                }
              } else {
                console.log("Record not found");
              }
            });
        });
      });
    }
  }

  render() {
    return (
      <div className="main-container">
        <Nav />
        <div className="cart-container">
          {this.state.cart.map((item) => (
            <p>{item.productPrice}</p>
          ))}
          {this.state.products.map((product) => (
            <div>
              <p>{product.name}</p>
              {product.photos &&
                product.photos.length > 0 &&
                product.photos.map((photo, index) => (
                  <img
                    className={`main-image-${index}`}
                    key={photo._id}
                    id={photo._id}
                    alt=""
                  />
                ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
