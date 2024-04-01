import React, { useState } from "react";
import axios from "axios";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Input,
  Layout,
  Menu,
  Image,
  Button,
  theme,
  Card,
  List,
  Row,
  Col,
} from "antd";
import { AppstoreOutlined } from "@ant-design/icons";

import Filter from "../Components/filter/Filter";

import appIconPhoto from "../asset/icon.png";
import { ReactComponent as LogoSidebar } from "../asset/icon/login_logo.svg";
import ricePhoto from "../asset/productInfo/rice.jpeg";

const API_URL = process.env.REACT_APP_API_URL;

// const productPhotoPath = "../asset/productInfo";
const data = [
  {
    title: "Title 1",
    // cardDetail: `${productPhotoPath}/rice.jpeg`,
  },
  {
    title: "Title 2",
    // cardDetail: `${productPhotoPath}/rice.jpeg`,
  },
  {
    title: "Title 3",
    // cardDetail: `${productPhotoPath}/rice.jpeg`,
  },
  {
    title: "Title 4",
    // cardDetail: `${productPhotoPath}/rice.jpeg`,
  },
  {
    title: "Title 5",
    // cardDetail: `${productPhotoPath}/rice.jpeg`,
  },
  {
    title: "Title 6",
    // cardDetail: `${productPhotoPath}/rice.jpeg`,
  },
  {
    title: "Title 1",
    // cardDetail: `${productPhotoPath}/rice.jpeg`,
  },
  {
    title: "Title 2",
    // cardDetail: `${productPhotoPath}/rice.jpeg`,
  },
  {
    title: "Title 3",
    // cardDetail: `${productPhotoPath}/rice.jpeg`,
  },
  {
    title: "Title 4",
    // cardDetail: `${productPhotoPath}/rice.jpeg`,
  },
  {
    title: "Title 5",
    // cardDetail: `${productPhotoPath}/rice.jpeg`,
  },
  {
    title: "Title 6",
    // cardDetail: `${productPhotoPath}/rice.jpeg`,
  },
  {
    title: "Title 1",
    // cardDetail: `${productPhotoPath}/rice.jpeg`,
  },
  {
    title: "Title 2",
    // cardDetail: `${productPhotoPath}/rice.jpeg`,
  },
  {
    title: "Title 3",
    // cardDetail: `${productPhotoPath}/rice.jpeg`,
  },
  {
    title: "Title 4",
    // cardDetail: `${productPhotoPath}/rice.jpeg`,
  },
  {
    title: "Title 5",
    // cardDetail: `${productPhotoPath}/rice.jpeg`,
  },
  {
    title: "Title 6",
    // cardDetail: `${productPhotoPath}/rice.jpeg`,
  },
];

const { Header, Sider, Content } = Layout;
const { Search } = Input;
const Home2 = ({ test }) => {
  console.log("test>>", test);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();
  const [openFilter, setOpenFilter] = useState("false");
  const logOut = () => {
    axios({
      method: "DELETE",
      url: `${API_URL}/logout`,
      withCredentials: true,
    })
      .then((res) => {
        if (res.status === 200) {
          console.log("Logged out");
          sessionStorage.clear();
          navigate("/login");
        }
      })

      .catch((err) => {
        return navigate("/login");
      });
  };

  const onSearch = (value, _e, info) => console.log(info?.source, value);

  return (
    <>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        ></Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflow: "scroll",
          }}
        >
          <div class="flex flex-row w-screen text-center items-center justify-around">
            <div class="flex items-center">
              <Image width={100} height={100} src={appIconPhoto} />
              <Search
                placeholder="input search text"
                onSearch={onSearch}
                style={{ width: 300, height: 100, "padding-top": "30px" }}
              />
            </div>
          </div>
          <div class="flex items-stretch w-full justify-center">
            <div class="justify-items-start grid border-2 border-gray-800 h-10 items-stretch w-full bg-red-100 rounded">
              <Button
                type="secondary"
                class=" pl-1 align text-black"
                ghost
                onClick={() => setOpenFilter(!openFilter)}
              >
                <AppstoreOutlined />
                Search box
              </Button>
            </div>
          </div>
          {openFilter && <Filter />}
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 4,
              lg: 4,
              xl: 6,
              xxl: 3,
            }}
            dataSource={data}
            renderItem={(item) => (
              <List.Item>
                <Card title={item.title}>
                  <Image
                    width={150}
                    height={150}
                    // src={`${item.cardDetail}`}
                    src={ricePhoto}
                  />
                  <Button>Add to Cart</Button>
                </Card>
              </List.Item>
            )}
            style={{ "margin-top": "20px" }}
          />
        </Content>
      </Layout>
    </>
  );
};
export default Home2;
