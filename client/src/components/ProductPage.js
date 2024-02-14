import React, { Component } from "react";
import axios from "axios";
import { SERVER_HOST } from "../config/global_constants";
import Nav from "./Nav";
import "../css/ProductPage.css";

export default class ProductBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      product: [],
    };
  }

  handleClick = (e) => {
    // Toggle the active class only for the clicked button
    e.target.classList.toggle("active");

    // Get the next sibling of the clicked button
    var content = e.target.nextElementSibling;

    // Toggle the max-height style for the content
    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  };

  componentDidMount() {
    axios
      .get(`${SERVER_HOST}/products/${this.props.match.params.id}`, {
        headers: { authorization: localStorage.token },
      })
      .then((res) => {
        if (res.data) {
          if (res.data.errorMessage) {
            console.log(res.data.errorMessage);
          } else {
            this.setState({ product: res.data });
          }
        } else {
          console.log("Record not found");
        }
      });
  }

  render() {
    return (
      <div className="main-container">
        <Nav />

        <div className="content-container">
          <div className="left-container">
            <img src="https://placehold.co/400x400" alt="" />
          </div>
          <div className="right-container">
            <div className="title-container">
              <h1>{this.state.product.name}</h1>
            </div>
            <div className="description-container">
              <p>This is the product description</p>

              <h3>Quantity</h3>
              <input type="text" name="quantity" />
              <div className="pill-container">
                <button className="pill-button">XL</button>
                <button className="pill-button">L</button>
                <button className="pill-button">M</button>
                <button className="pill-button">S</button>
                <button className="pill-button">XS</button>
              </div>
              <button className="collapsible" onClick={this.handleClick}>
                Open Section 1
              </button>
              <div class="content">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
              <button class="collapsible" onClick={this.handleClick}>
                Open Section 2
              </button>
              <div class="content">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
              <button class="collapsible" onClick={this.handleClick}>
                Open Section 3
              </button>
              <div class="content">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
