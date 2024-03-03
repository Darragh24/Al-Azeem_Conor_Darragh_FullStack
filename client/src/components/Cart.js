import React, { Component } from "react";
import axios from "axios";
import { SERVER_HOST } from "../config/global_constants";
import "../css/Cart.css";
import Nav from "./Nav";
import Marquee from "./Marquee";
import BuyProduct from "./BuyProduct";

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
          } else if (res.data.deleteMessage) {
            this.setState({ cart: res.data.cart });
          } else {
            this.setState({ cart: res.data });
            console.log("Succesful Request");
          }
        } else {
          console.log("Record not found");
        }
      });
  }

  getProductInfo() {
    let productInfos = [];

    this.state.cart.forEach((cartItem) => {
      const foundProduct = this.state.products.find(
        (product) => product._id === cartItem.productId
      );

      if (foundProduct) {
        productInfos.push({
          productId: cartItem.productId,
          productName: foundProduct.name,
          quantity: cartItem.quantity,
          productPrice: cartItem.productPrice,
        });
      }
    });
    return productInfos;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.cart !== prevState.cart) {
      let subTotal = 0;
      this.state.cart.map((cartItem) => {
        subTotal += cartItem.quantity * cartItem.productPrice;
        axios
          .get(`${SERVER_HOST}/products/${cartItem.productId}`, {
            headers: { authorization: localStorage.token },
          })
          .then((res) => {
            const productExists = this.state.products.some(
              (product) => product._id === res.data._id
            );
            if (!productExists) {
              this.setState((prevState) => ({
                products: [...prevState.products, res.data],
              }));
            }
          })
          .catch((err) => {
            //
          });
        this.getProductInfo();
        return this.setState({ subTotal: subTotal });
      });
    }

    if (this.state.products !== prevState.products) {
      this.state.products.map((product) => {
        return product.photos.map((photo) => {
          return axios
            .get(`${SERVER_HOST}/products/photo/${photo.filename}`)
            .then((res) => {
              document.getElementById(
                photo._id
              ).src = `data:;base64,${res.data.image}`;
            })
            .catch((err) => {});
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
        if (res.data.deleteMessage) {
          this.setState({ cart: res.data.cart });
          let subTotal = 0;
          this.state.cart.forEach((cartItem) => {
            subTotal += cartItem.quantity * cartItem.productPrice;
          });
          this.setState({ subTotal: subTotal });
        } else {
          const updatedCart = [...this.state.cart];
          updatedCart[index] = res.data;
          this.setState({ cart: updatedCart });
          let subTotal = 0;
          let updatedProducts;
          this.state.cart.forEach((cartItem) => {
            subTotal += cartItem.quantity * cartItem.productPrice;
            updatedProducts = this.state.products.filter(
              (product) => product._id !== cartItem.productId
            );
          });
          this.setState({ products: updatedProducts });
          this.setState({ subTotal: subTotal });
          console.log(`Cart updated`);
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
        <Marquee />
        <div className="cart-container">
          <h2 className="cart-h2">Your Cart</h2>
          {this.state.cart.length > 0 && this.state.products ? (
            this.state.cart.map((cartItem, index) => {
              const foundProduct = this.state.products.find(
                (product) => product._id === cartItem.productId
              );
              if (foundProduct) {
                return (
                  <div className="cart-product-info-container">
                    <div className="product-photo-container">
                      {foundProduct.photos.map((photo, photoIndex) => (
                        <img
                          className={`cart-main-image-${photoIndex}`}
                          key={photo._id}
                          id={photo._id}
                          alt=""
                        />
                      ))}
                    </div>
                    <div className="product-name-container">
                      <span>{foundProduct.name}</span>

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
                    <div className="product-price-container">
                      <span>
                        $
                        {this.state.cart[index] &&
                        this.state.cart[index].productPrice
                          ? (
                              this.state.cart[index].productPrice *
                              this.state.cart[index].quantity
                            ).toFixed(2)
                          : ""}
                      </span>
                    </div>
                  </div>
                );
              } else return <p>Couldn't load products</p>;
            })
          ) : (
            <p>No items in cart</p>
          )}
          {this.state.cart.length > 0 ? (
            <div>
              <div className="subtotal-container">
                <span className="subtotal-text">Subtotal:</span>
                <span className="subtotal-num">
                  ${this.state.subTotal.toFixed(2)}
                </span>
              </div>
              <div className="paypal-button">
                <BuyProduct
                  price={this.state.subTotal}
                  productInfos={this.getProductInfo()}
                  quantity={this.state.quantity}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}
