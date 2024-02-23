import logo from "./logo.svg";
import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SingleLocation from "./Components/SingleLocation.jsx";
import Locations from "./Components/Locations.jsx";
import Login from "./Components/login.js";
import NoMatch from "./Components/NoMatch.jsx";
import Invites from "./Components/Invites.jsx";
import RegisterPage from "./Components/signup.js";
import User from "./Components/user.jsx";
import Event from "./Components/Event.jsx";
import FavouriteVenue from "./Components/FavouriteVenue.jsx";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/venue" element={<Locations />} />
          <Route path="/venue/:venueId" element={<SingleLocation />} />
          <Route path="/invites" element={<Invites />} />
          <Route path="/venue/fav" element={<FavouriteVenue />} />
          <Route path="/admin/user" element={<User />} />
          <Route path="/admin/event" element={<Event />} />
          <Route path="*" element={<NoMatch />} />z
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
