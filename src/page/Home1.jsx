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

import appIcon from "../asset/icon.png";
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
/**
 * Home1 component represents the home page of the shopping mall application.
 * It displays a sidebar with navigation options, a search bar, and a list of items.
 *
 * @returns {JSX.Element} The rendered Home1 component.
 */
const Home1 = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();
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
    <div class="" id="bottomPage">
      <Layout style={{ height: "100vh" }}>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <Row gutter={16}>
            <Col span={8}>
              <div className="demo-logo-vertical" style={{ margin: 10 }}>
                <LogoSidebar />
              </div>
            </Col>
            {!collapsed ? (
              <Col span={16}>
                <div
                  style={{
                    fontFamily: "Times New Roman",
                    fontSize: 24,
                    color: "white",
                    marginTop: 20,
                  }}
                >
                  Pick Cart
                </div>
              </Col>
            ) : (
              ""
            )}
          </Row>
          <div className="demo-logo-vertical" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["1"]}
            items={[
              {
                key: "1",
                icon: <UserOutlined />,
                label: "nav 1",
              },
              {
                key: "2",
                icon: <VideoCameraOutlined />,
                label: "nav 2",
              },
              {
                key: "3",
                icon: <UploadOutlined />,
                label: "nav 3",
              },
              {
                key: "4",
                icon: <UploadOutlined />,
                label: "nav 3",
              },
              {
                key: "5",
                icon: <LogoutOutlined />,
                label: "logout",
                onClick: logOut,
              },
            ]}
          />
        </Sider>
        <Layout>
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
            }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
          </Header>
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
                <Image width={100} height={100} src={appIcon} />
                <Search
                  placeholder="input search text"
                  onSearch={onSearch}
                  style={{ width: 300, height: 100, "padding-top": "30px" }}
                />
              </div>
            </div>
            <div class="flex items-stretch w-full justify-center">
              <div class="justify-items-start grid border-2 border-gray-800 h-10 items-stretch w-full bg-red-100 rounded">
                <div class=" pl-1 align">
                  <AppstoreOutlined />
                  Search box
                </div>
              </div>
            </div>
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
                  </Card>
                </List.Item>
              )}
              style={{ "margin-top": "20px" }}
            />
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};
export default Home1;
