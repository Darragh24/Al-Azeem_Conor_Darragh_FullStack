import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import axios from "axios";
import "../css/Form.css";
import LinkInClass from "./LinkInClass";
import Nav from "./Nav";

import { SERVER_HOST } from "../config/global_constants";

export default class EditProduct extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: ``,
      price: ``,
      stock: "",
      photos: "",
      selectedFiles: null,
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
              stock: res.data.stock,
              photos: res.data.photos,
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

  handleFileChange = (e) => {
    this.setState({ selectedFiles: e.target.files });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    this.setState({ wasSubmittedAtLeastOnce: true });

    const formInputsState = this.validate();

    if (Object.keys(formInputsState).every((index) => formInputsState[index])) {
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
        .put(
          `${SERVER_HOST}/products/${this.props.match.params.id}`,
          formData,
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
          Product Details are incorrect
          <br />
        </div>
      );
    }
    return (
      <div className="main-container">
        <Nav />
        <div className="form-container">
          <h2 className="product-form-h2">Edit Product</h2>
          {this.state.redirectToDisplayAllProducts ? (
            <Redirect to="/AllProducts" />
          ) : null}

          {errorMessage}
          <div className="input-label-conatiner">
            <label className="edit-label">Product Name :</label>
            <input
              ref={(input) => {
                this.inputToFocus = input;
              }}
              type="text"
              name="name"
              className="edit-form-input"
              value={this.state.name}
              onChange={this.handleChange}
              placeholder="Product-Name"
            />
          </div>
          <div className="input-label-conatiner">
            <label className="edit-label">Price :</label>
            <input
              type="text"
              name="price"
              className="edit-form-input"
              value={this.state.price}
              onChange={this.handleChange}
              placeholder="Price"
            />
          </div>

          <div className="input-label-conatiner">
            <label className="edit-label">Product Stock :</label>
            <input
              type="text"
              name="stock"
              className="edit-form-input"
              value={this.state.stock}
              onChange={this.handleChange}
              placeholder="Stock-Quantity"
            />
          </div>
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
              value="Edit"
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
