import logo from "./logo.svg";
import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/login.js";
import NoMatch from "./Components/NoMatch.jsx";
import RegisterPage from "./Components/signup.js";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<NoMatch />} />z
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
