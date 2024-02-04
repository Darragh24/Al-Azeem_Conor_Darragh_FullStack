import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import axios from "axios";
import LinkInClass from "./LinkInClass";
import { SERVER_HOST } from "../config/global_constants";
import { ACCESS_LEVEL_ADMIN } from "../config/global_constants";

export default class AddProduct extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      colour: "",
      price: "",
      size: "",
      redirectToDisplayAllProducts:
        localStorage.accessLevel < ACCESS_LEVEL_ADMIN,
    };
  }

  componentDidMount() {
    this.inputToFocus.focus();
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
        colour: this.state.colour,
        price: this.state.price,
        size: this.state.size,
        wasSubmittedAtLeastOnce: false,
      };

      axios
        .post(`${SERVER_HOST}/products`, productObject, {
          headers: { authorization: localStorage.token },
        })
        .then((res) => {
          if (res.data) {
            if (res.data.errorMessage) {
              console.log(res.data.errorMessage);
            } else {
              console.log("Record added");
              this.setState({ redirectToDisplayAllProducts: true });
            }
          } else {
            console.log("Record not added");
          }
        });
    }
  };

  validateName() {
    const pattern = /^[A-Za-z]+$/;
    return pattern.test(String(this.state.name));
  }

  validateColour() {
    const pattern = /^[A-Za-z]+$/;
    return pattern.test(String(this.state.colour));
  }

  validatePrice() {
    const price = parseInt(this.state.price);
    return price >= 1 && price <= 1000;
  }

  validateSize() {
    const size = String(this.state.size);

    return (
      size === "XL" ||
      size === "L" ||
      size === "M" ||
      size === "S" ||
      size === "XS"
    );
  }

  validate() {
    return {
      name: this.validateName(),
      colour: this.validateColour(),
      price: this.validatePrice(),
      size: this.validateSize(),
    };
  }

  render() {
    let errorMessage = "";
    if (this.state.wasSubmittedAtLeastOnce) {
      errorMessage = (
        <div className="error">
          Product Details are invalid
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

        <label htmlFor="colour">Colour</label>
        <input
          type="text"
          name="colour"
          value={this.state.colour}
          onChange={this.handleChange}
        />

        <label htmlFor="price">Price</label>
        <input
          type="text"
          name="price"
          value={this.state.price}
          onChange={this.handleChange}
        />

        <label htmlFor="size">Size</label>
        <input
          type="text"
          name="size"
          value={this.state.size}
          onChange={this.handleChange}
        />

        <LinkInClass
          value="Add"
          className="green-button"
          onClick={this.handleSubmit}
        />

        <Link className="red-button" to={"/AllProducts"}>
          Cancel
        </Link>
      </div>
    );
  }
}
