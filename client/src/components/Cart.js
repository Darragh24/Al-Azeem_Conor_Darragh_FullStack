import React, { Component } from "react";

import axios from "axios";

import { SERVER_HOST } from "../config/global_constants";

import "../css/Nav.css";

export default class Nav extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cart: [],
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
            console.log("Product response", this.state.product);
          }
        } else {
          console.log("Record not found");
        }
      });
  }

  render() {
    return (
      <div className="cart-container">
        {this.state.cart.map((item) => (
          <p>{item.productPrice}</p>
        ))}
      </div>
    );
  }
}
