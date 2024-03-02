import React, { Component } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { SERVER_HOST } from "../config/global_constants";
import { SANDBOX_CLIENT_ID } from "../config/global_constants";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import PayPalMessage from "./PayPalMessage";

export default class BuyProduct extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirectToPayPalMessage: false,
      payPalMessageType: null,
      payPalOrderID: null,
    };
  }

  componentDidMount() {
    axios
      .get(`${SERVER_HOST}/users/${localStorage._id}`, {
        headers: { authorization: localStorage.token },
      })
      .then((res) => {
        if (res.data) {
          if (res.data.errorMessage) {
            console.log(res.data.errorMessage);
          } else {
            this.setState({ user: res.data });
          }
        } else {
          console.log("Record not found");
        }
      });
  }

  createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [{ amount: { value: this.props.price } }],
    });
  };

  onApprove = (paymentData) => {
    let salesData = new FormData();

    if (this.props.productInfos) {
      const productInfosArray = [];
      this.props.productInfos.forEach((info) => {
        productInfosArray.push({
          productId: info.productId,
          productName: info.productName,
          quantity: info.quantity,
          productPrice: info.productPrice,
        });
      });
      salesData.append("productInfos", JSON.stringify(productInfosArray)); //Explain this
    }
    axios
      .post(
        `${SERVER_HOST}/sales/${paymentData.orderID}/${localStorage._id}/${this.props.price}/${this.state.user.name}/${this.state.user.email}`,
        salesData,
        {
          headers: {
            authorization: localStorage.token,
            "Content-type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        this.setState({
          payPalMessageType: PayPalMessage.messageType.SUCCESS,
          payPalOrderID: paymentData.orderID,
          redirectToPayPalMessage: true,
        });
      })
      .catch((errorData) => {
        this.setState({
          payPalMessageType: PayPalMessage.messageType.ERROR,
          redirectToPayPalMessage: true,
        });
      });

    axios
      .delete(`${SERVER_HOST}/cart/${localStorage._id}`, {
        headers: { authorization: localStorage.token },
      })
      .then((res) => {
        console.log("Cart emptied");
      })
      .catch((err) => {});
  };

  onError = (errorData) => {
    this.setState({
      payPalMessageType: PayPalMessage.messageType.ERROR,
      redirectToPayPalMessage: true,
    });
  };

  onCancel = (cancelData) => {
    // The user pressed the Paypal checkout popup window cancel button or closed the Paypal checkout popup window
    this.setState({
      payPalMessageType: PayPalMessage.messageType.CANCEL,
      redirectToPayPalMessage: true,
    });
  };

  render() {
    return (
      <div>
        {this.state.redirectToPayPalMessage ? (
          <Redirect
            to={`/PayPalMessage/${this.state.payPalMessageType}/${this.state.payPalOrderID}`}
          />
        ) : null}

        <PayPalScriptProvider
          options={{ currency: "EUR", "client-id": SANDBOX_CLIENT_ID }}
        >
          <PayPalButtons
            style={{ layout: "horizontal" }}
            createOrder={this.createOrder}
            onApprove={this.onApprove}
            onError={this.onError}
            onCancel={this.onCancel}
          />
        </PayPalScriptProvider>
      </div>
    );
  }
}
