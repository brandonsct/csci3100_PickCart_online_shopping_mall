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

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/admin/login" element={<UserLogin admin={true} />} />
          <Route path="/login" element={<UserLogin admin={false} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/home" element={<Main Page_component={<Home2 />} />} />
          <Route
            path="/profile"
            element={<Main Page_component={<Profile />} />}
          />

          <Route path="*" element={<NoMatch />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
