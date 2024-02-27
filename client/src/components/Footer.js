import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../css/Footer.css";
import { ACCESS_LEVEL_GUEST } from "../config/global_constants";
export default class Nav extends Component {
  render() {
    return (
      <div className="footer-container">
        {!localStorage.accessLevel <= ACCESS_LEVEL_GUEST ? (
          <div className="contact-form-container">
            <h1 className="contact-form-h1">Subscribe to our Emails</h1>
            <h4 className="contact-form-h2">
              We will email you about new products & discounts
            </h4>
            <div className="contact-form-input-container">
              <input
                type="text"
                className="contact-form-input"
                placeholder="Email"
              ></input>
              <button type="submit">
                <i className="fa fa-arrow-right" />
              </button>
            </div>
          </div>
        ) : null}

        <div className="footer-link-container">
          <div className="info-container">
            <h2>Check us Out!</h2>
            <Link className="help-button" to={"/"}>
              About Us
            </Link>
          </div>
          <div className="help-container">
            <h2>Need Help?</h2>
            <Link className="help-button" to={"/"}>
              Contact Us
            </Link>
            <Link className="help-button" to={"/"}>
              Terms Of Service
            </Link>
            <Link className="help-button" to={"/"}>
              Shipping Policy
            </Link>
          </div>
          <div className="brand-container">
            <h2>BrandName</h2>

            <p className="mission">We sell the best t-shirts in the world</p>
            <p className="our-email">info@brandName.com </p>
            <p className="our-number">Call Us: (012) 345-6789</p>
          </div>
        </div>
      </div>
    );
  }
}
