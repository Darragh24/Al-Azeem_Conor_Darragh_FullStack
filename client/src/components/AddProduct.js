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
      price: "",
      stock: "",
      selectedFiles: null,
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

  handleFileChange = (e) => {
    this.setState({ selectedFiles: e.target.files });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    let formData = new FormData();

    formData.append("name", this.state.name);
    formData.append("price", this.state.price);
    formData.append("stock", this.state.stock);

    if (this.state.selectedFiles) {
      for (let i = 0; i < this.state.selectedFiles.length; i++) {
        formData.append("productPhotos", this.state.selectedFiles[i]);
      }
    }

    axios
      .post(`${SERVER_HOST}/products`, formData, {
        headers: {
          authorization: localStorage.token,
          "Content-type": "multipart/form-data",
        },
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
  };

  validateName() {
    const pattern = /^[A-Za-z]+$/;
    return pattern.test(String(this.state.name));
  }

  validatePrice() {
    const price = parseInt(this.state.price);
    return price >= 1 && price <= 1000;
  }
  validateStock() {
    const stock = parseInt(this.state.stock);
    return stock >= 1 && stock <= 1000;
  }

  validate() {
    return {
      name: this.validateName(),
      price: this.validatePrice(),
      stock: this.validateStock(),
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

        <label className="form-label">Name</label>
        <input
          ref={(input) => {
            this.inputToFocus = input;
          }}
          type="text"
          name="name"
          value={this.state.name}
          onChange={this.handleChange}
        />

        <label className="form-label">Price</label>
        <input
          type="text"
          name="price"
          value={this.state.price}
          onChange={this.handleChange}
        />
        <label className="form-label">Stock</label>
        <input
          type="text"
          name="stock"
          value={this.state.stock}
          onChange={this.handleChange}
        />

        <label htmlFor="photos">Photos</label>
        <input
          type="file"
          multiple
          onChange={this.handleFileChange}
          style={{
            border: "1px solid #ced4da",
            borderRadius: ".25rem",
            padding: ".375rem .75rem",
          }}
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
