import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import axios from "axios";
import "../css/Form.css";
import LinkInClass from "./LinkInClass";
import { SERVER_HOST } from "../config/global_constants";
import { ACCESS_LEVEL_ADMIN } from "../config/global_constants";
import Nav from "./Nav";
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
        this.setState({ redirectToDisplayAllProducts: true });
      })
      .catch((err) => {
        this.setState({ wasSubmittedAtLeastOnce: true });
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
      <div className="main-container">
        <Nav />

        <div className="form-container">
          <h2 className="product-form-h2">Add Product</h2>
          {this.state.redirectToDisplayAllProducts ? (
            <Redirect to="/AllProducts" />
          ) : null}
          {errorMessage}
          <input
            ref={(input) => {
              this.inputToFocus = input;
            }}
            type="text"
            name="name"
            className="product-form-input"
            value={this.state.name}
            onChange={this.handleChange}
            placeholder="Product-Name"
          />
          <input
            type="text"
            name="price"
            className="product-form-input"
            value={this.state.price}
            onChange={this.handleChange}
            placeholder="Price"
          />
          <input
            type="text"
            name="stock"
            className="product-form-input"
            value={this.state.stock}
            onChange={this.handleChange}
            placeholder="Stock-Quantity"
          />
          <div className="photo-upload-container">
            <input
              type="file"
              id="fileInput"
              className="file-input"
              multiple
              onChange={this.handleFileChange}
              style={{
                border: "1px solid #ced4da",
                borderRadius: ".25rem",
                padding: ".375rem .75rem",
              }}
            />
          </div>

          <div className="add-cancel-container">
            <LinkInClass
              value="Add"
              className="add-button"
              onClick={this.handleSubmit}
            />

            <Link className="cancel-button" to={"/AllProducts"}>
              Cancel
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
