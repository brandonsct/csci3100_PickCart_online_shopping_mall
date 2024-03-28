import logo from "./logo.svg";
import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserLogin from "./page/UserLogin.jsx";
import NoMatch from "./page/noMatch.jsx";
import RegisterPage from "./Components/signup.jsx";

import Main from "./page/Main.jsx";
import Home2 from "./page/Home2.jsx";
import Profile from "./Components/profile.jsx";
import OrderHistory from "./page/Orderhistory.jsx";
import OrderStatus from "./page/OrderStatus.jsx";
import Cart from "./page/Cart.jsx";
import UserCRUD from "./page/UserCRUD.jsx";
import ProductCRUD from "./page/ProductCRUD.jsx";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<Main Page_component={<Home2 />} />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/profile"
            element={<Main Page_component={<Profile />} />}
          />
          <Route
            path="/orderHistory"
            element={<Main Page_component={<OrderHistory />} />}
          />
          <Route
            path="/orderStatus"
            element={<Main Page_component={<OrderStatus />} />}
          />
          <Route
            path="/productCRUD"
            element={<Main Page_component={<ProductCRUD />} />}
          />
          <Route
            path="/userCRUD"
            element={<Main Page_component={<UserCRUD />} />}
          />
          <Route path="/cart" element={<Main Page_component={<Cart />} />} />
          <Route path="*" element={<NoMatch />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
