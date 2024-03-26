import logo from "./logo.svg";
import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserLogin from "./page/UserLogin.jsx";
import NoMatch from "./page/noMatch.jsx";
import RegisterPage from "./Components/signup.jsx";
import Home from "./page/Home1.jsx";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
        <Route path="/admin/login" element={<UserLogin admin={true}/>} />
          <Route path="/login" element={<UserLogin admin={false}/>} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/home" element={<Home />} />

          <Route path="*" element={<NoMatch />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
