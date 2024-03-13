import React, { useState } from "react";
import VerticalNav from "../Components/home/verticalNav";
import { Menu, Switch } from "antd";

import NavBar from "../Components/navbar";

const Home = () => {
  const [theme, setTheme] = useState("dark");
  const changeTheme = (value) => {
    setTheme(value ? "dark" : "light");
  };
  return (
    <div class="flex-col">
      <NavBar />
      <div>
        <VerticalNav themeColor={theme} class="" />
        <Switch
          checked={theme === "dark"}
          onChange={changeTheme}
          checkedChildren="Dark"
          unCheckedChildren="Light"
          class="absolute end-0"
        />
      </div>
    </div>
  );
};
export default Home;
