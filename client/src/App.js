import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.css";
import "./css/App.css";
import "./css/main.css";

import AllProducts from "./components/AllProducts";
import EditProduct from "./components/EditProduct";
import AddProduct from "./components/AddProduct";
import DeleteProduct from "./components/DeleteProduct";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Register from "./components/Register";
import Home from "./components/Home";
import LoggedInRoute from "./components/LoggedInRoute";
import AdminRoute from "./components/AdminRoute";

import { ACCESS_LEVEL_GUEST } from "./config/global_constants";

if (typeof localStorage.accessLevel === "undefined") {
  localStorage.name = "GUEST";
  localStorage.accessLevel = ACCESS_LEVEL_GUEST;
  localStorage.token = null;
}

export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/Home" component={Home} />
          <Route exact path="/AllProducts" component={AllProducts} />
          <Route exact path="/Login" component={Login} />
          <Route exact path="/Register" component={Register} />
          <LoggedInRoute exact path="/Logout" component={Logout} />
          <AdminRoute exact path="/AddProduct" component={AddProduct} />
          <AdminRoute exact path="/EditProduct/:id" component={EditProduct} />
          <AdminRoute
            exact
            path="/DeleteProduct/:id"
            component={DeleteProduct}
          />

          <Route path="*" component={AllProducts} />
        </Switch>
      </BrowserRouter>
    );
  }
}
