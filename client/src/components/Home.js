import React, { Component } from "react";
import Nav from "./Nav";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import Marquee from "./Marquee";
import Image from "../config/images/image.png"; //Image Credit  https://www.boohooman.com/ie?gclsrc=aw.ds&gad_source=1&gclid=CjwKCAiA3JCvBhA8EiwA4kujZuHPXEROAn7HVMObKQy2FsjRuX7xfmuXRcH3iBGz6TGdYcVgv-i15xoCDx0QAvD_BwE&gclsrc=aw.ds
import "../css/Home.css";
export default class Home extends Component {
  render() {
    return (
      <div className="main-container">
        <Nav />
        <Marquee />
        <div className="home-container">
          <h1 className="home-h1">WELCOME TO TSHIRTS4ALL</h1>

          <div class="image-container">
            <img className="home-img" src={Image} alt="" />
            <Link className="image-button" to={"/AllProducts"}>
              Shop Now!
            </Link>
          </div>
        </div>
        <Footer className="home-footer" />
      </div>
    );
  }
}
