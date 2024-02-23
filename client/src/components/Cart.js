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

  handleQuantityChange = (e) => {
    const index = e.target.getAttribute("index");
    const cartObject = {
      userId: localStorage._id,
      productId: this.state.cart[index].productId,
      quantity: parseInt(e.target.value),
    };
    axios
      .put(`${SERVER_HOST}/cart/${localStorage._id}`, cartObject, {
        headers: { authorization: localStorage.token },
      })
      .then((res) => {
        if (res.data) {
          if (res.data.errorMessage) {
            console.log(res.data.errorMessage);
          } else {
            const updatedCart = [...this.state.cart]; // Create a copy of the cart array
            updatedCart[index] = res.data; // Update the specific item in the copied array
            this.setState({ cart: updatedCart }); // Set the state with the new array
            console.log(`Record updated`);
          }
        } else {
          console.log(`Record not updated`);
        }
      });
    let subTotal = 0;
    this.state.cart.forEach((cartItem) => {
      subTotal += cartItem.quantity * cartItem.productPrice;
    });
    this.setState({ subTotal: subTotal });
  };

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
                  <button
                    className="quantity-btn"
                    value={1}
                    index={index}
                    onClick={this.handleQuantityChange}
                  >
                    +
                  </button>
                  <span className="item-quantity-text">
                    {this.state.cart[index].quantity}
                  </span>
                  <button
                    className="quantity-btn"
                    value={-1}
                    index={index}
                    onClick={this.handleQuantityChange}
                  >
                    -
                  </button>
                </div>
              </div>
              <div className="subtotal-container">
                <span>
                  $
                  {(
                    this.state.cart[index].productPrice *
                    this.state.cart[index].quantity
                  ).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
          <div className="subtotal-container">
            <span className="subtotal-text">Subtotal:</span>
            <span className="subtotal-num">
              ${this.state.subTotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    );
  }
}
