import React, { Component } from "react";
import "../css/Nav.css";
export default class Marquee extends Component {
  render() {
    return (
      <div className="marquee-container">
        <marquee width="100%" direction="left" height="100px" scrollamount="10">
          20% OFF + Free Shipping
        </marquee>
      </div>
    );
  }
}
