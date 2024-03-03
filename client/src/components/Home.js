import React, { Component } from "react";
import Nav from "./Nav";
import Footer from "./Footer";
import Marquee from "./Marquee";

export default class Home extends Component {
  render() {
    return (
      <div className="main-container">
        <Nav />
        <Marquee />
        <div className="home-container">
          <h1>Welcome to BrandName</h1>
        </div>
        <Footer />
      </div>
    );
  }
}
