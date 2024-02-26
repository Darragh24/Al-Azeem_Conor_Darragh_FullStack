import React, { Component } from "react";
import Nav from "./Nav";
import Footer from "./Footer";

export default class Home extends Component {
  render() {
    return (
      <div className="main-container">
        <Nav />
        <div className="home-container">
          <h1>Welcome to BrandName</h1>
        </div>
        <Footer />
      </div>
    );
  }
}
