import React, { useState } from "react";
import VerticalNav from "../Components/home/verticalNav";
import { Input, Menu, Switch, Image } from "antd";
import appIcon from "../asset/icon.png";
import NavBar from "../Components/navbar";
import { AppstoreOutlined } from "@ant-design/icons";
const { Search } = Input;

const onSearch = (value, _e, info) => console.log(info?.source, value);
const Home = () => {
  const [theme, setTheme] = useState("dark");
  const changeTheme = (value) => {
    setTheme(value ? "dark" : "light");
  };
  return (
    <div class="flex-col">
      <NavBar />
      <div>
        <div class="flex flex-row w-screen text-center items-center justify-around">
          <div class="flex items-center">
            <Image width={100} height={100} src={appIcon} />
            <Search
              placeholder="input search text"
              onSearch={onSearch}
              style={{ width: 300, height: 100, "padding-top": "30px" }}
            />
          </div>
        </div>
        <div class="flex items-stretch w-screen justify-center">
          <div class="flex border-2 border-gray-800 w-3/4 h-10 bg-red-100 rounded items-center">
            <div class=" pl-1">
              <AppstoreOutlined />
              Search box
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
