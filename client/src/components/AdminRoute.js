import React from "react";
import { Route, Redirect } from "react-router-dom";

import { ACCESS_LEVEL_NORMAL_USER } from "../config/global_constants";

const AdminRoute = ({ component: Component, exact, path, ...rest }) => (
  <Route
    exact={exact}
    path={path}
    render={(props) =>
      localStorage.accessLevel > ACCESS_LEVEL_NORMAL_USER ? (
        <Component {...props} {...rest} />
      ) : (
        <Redirect to="/DisplayAllCars" />
      )
    }
  />
);

export default AdminRoute;
