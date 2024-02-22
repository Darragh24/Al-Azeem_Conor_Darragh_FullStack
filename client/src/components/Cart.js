import React, { Component } from "react";

import axios from "axios";

import { SERVER_HOST } from "../config/global_constants";

import "../css/Cart.css";
import Nav from "./Nav";

export default class Cart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cart: [],
      products: [],
      subTotal: 0,
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
      let subTotal = 0;
      this.state.cart.forEach((cartItem) => {
        subTotal += cartItem.quantity * cartItem.productPrice;

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
        this.setState({ subTotal: subTotal });
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
          {this.state.products.map((product, index) => (
            <div className="cart-product-info-container">
              <div className="product-photo-container">
                {product.photos &&
                  product.photos.length > 0 &&
                  product.photos.map((photo, index) => (
                    <img
                      className={`cart-main-image-${index}`}
                      key={photo._id}
                      id={photo._id}
                      alt=""
                    />
                  ))}
              </div>
              <div className="product-name-container">
                <span>{product.name}</span>{" "}
                <div className="quantity-container">
                  <button className="quantity-btn">+</button>
                  <span className="item-quantity-text">
                    {this.state.cart[index].quantity}
                  </span>
                  <button className="quantity-btn">-</button>
                </div>
              </div>
              <div className="subtotal-container">
                <span>${this.state.subTotal.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
