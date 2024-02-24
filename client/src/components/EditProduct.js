import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import axios from "axios";

import LinkInClass from "./LinkInClass";

import { SERVER_HOST } from "../config/global_constants";

export default class EditProduct extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: ``,
      price: ``,
      redirectToDisplayAllProducts: false,
    };
  }

  componentDidMount() {
    this.inputToFocus.focus();

    axios
      .get(`${SERVER_HOST}/products/${this.props.match.params.id}`, {
        headers: { authorization: localStorage.token },
      })
      .then((res) => {
        if (res.data) {
          if (res.data.errorMessage) {
            console.log(res.data.errorMessage);
          } else {
            this.setState({
              name: res.data.name,
              price: res.data.price,
            });
          }
        } else {
          console.log(`Record not found`);
        }
      });
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    this.setState({ wasSubmittedAtLeastOnce: true });

    const formInputsState = this.validate();

    if (Object.keys(formInputsState).every((index) => formInputsState[index])) {
      const productObject = {
        name: this.state.name,
        price: this.state.price,
      };

      axios
        .put(
          `${SERVER_HOST}/products/${this.props.match.params.id}`,
          productObject,
          {
            headers: { authorization: localStorage.token },
          }
        )
        .then((res) => {
          if (res.data) {
            if (res.data.errorMessage) {
              console.log(res.data.errorMessage);
            } else {
              console.log(`Record updated`);
              this.setState({ redirectToDisplayAllProducts: true });
            }
          } else {
            console.log(`Record not updated`);
          }
        });
    }
  };

  validateName() {
    const pattern = /^[A-Za-z]+$/;
    return pattern.test(String(this.state.name));
  }

  validatePrice() {
    const price = parseInt(this.state.price);
    return price >= 1 && price <= 1000;
  }

  validate() {
    return {
      name: this.validateName(),

      price: this.validatePrice(),
    };
  }

  render() {
    let errorMessage = "";
    if (this.state.wasSubmittedAtLeastOnce) {
      errorMessage = (
        <div className="error">
          Product Details are incorrect
          <br />
        </div>
      );
    }
    return (
      <div className="form-container">
        {this.state.redirectToDisplayAllProducts ? (
          <Redirect to="/AllProducts" />
        ) : null}

        {errorMessage}

        <label htmlFor="name">Name</label>
        <input
          ref={(input) => {
            this.inputToFocus = input;
          }}
          type="text"
          name="name"
          value={this.state.name}
          onChange={this.handleChange}
        />

        <label htmlFor="price">Price</label>
        <input
          type="text"
          name="price"
          value={this.state.price}
          onChange={this.handleChange}
        />

        <LinkInClass
          value="Edit"
          className="blue-button"
          onClick={this.handleSubmit}
        />

        <Link className="red-button" to={"/AllProducts"}>
          Cancel
        </Link>
      </div>
    );
  }
}
