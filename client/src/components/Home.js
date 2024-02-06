import React, { Component } from "react";
import Nav from "./Nav";

export default class Home extends Component {
  /*constructor(props) {
    super(props);
  }*/

  render() {
    return (
      <div className="main-container">
        <Nav />
        <div className="home-container">
          <h1>This is the home page</h1>
        </div>
      </div>
    );
  }
}
