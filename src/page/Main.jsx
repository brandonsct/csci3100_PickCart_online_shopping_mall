import React, { useState, useEffect } from "react";
import { cloneElement } from "react";
import axios from "axios";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  LogoutOutlined,
  HomeOutlined,
  HistoryOutlined,
  AimOutlined,
  LoginOutlined,
  AppstoreAddOutlined,
  ExpandOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Modal,
  Layout,
  Menu,
  Image,
  Button,
  theme,
  Card,
  Avatar,
  Row,
  Col,
} from "antd";
import { ReactComponent as LogoSidebar } from "../asset/icon/login_logo.svg";
import UserLogin from "./UserLogin";

const API_URL = process.env.REACT_APP_API_URL;

const { Header, Sider, Content } = Layout;

const Main = ({ Page_component }) => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [logIn, setLogin] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [userRole, setUserRole] = useState("user")
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const [userDetails, setUserDetails] = useState([])

  const getUserDetails = (username)=>{
    axios.post(`${API_URL}/getuser`, {username})
    .then((resp)=>{
        if (resp.status ===200) return setUserDetails(resp.data)
        else return console.log("resp>>>fail>>", resp)
    })
    .catch((error)=>{
        console.log("err>>", error)
    })
  }
  console.log("userDetails>>", userDetails)

  const isLogin = () => {
    let role, username;
    try {
      role = JSON.parse(sessionStorage.getItem("role"))?.value;
      username = JSON.parse(sessionStorage.getItem("username"))?.value;
      if (
        username === null ||
        username === undefined ||
        role === null ||
        role === undefined
      ) {
        setLogin(false);
        setUserRole("")
      } else {
        setUserRole(role)
        setLogin(true);
        getUserDetails(username)
      }
    } catch (error) {
      console.log("error>>", error);
    }
  };
  const handleCompClick = (path) => {
    if (!logIn) {
      return setIsModalOpen(true);
    } else {
      return navigate(path);
    }
  };

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
          setLogin(false);
          setUserRole("")
          navigate("/home")
        }
      })

      .catch((err) => {
        return navigate("/login");
      });
  };

  useEffect(() => {
    isLogin();
  }, [logIn, handleCancel]);

  return (
    <div class="" id="bottomPage">
      <Layout style={{ height: "100vh", overflow: "hidden" }}>
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
                  PickCart
                </div>
              </Col>
            ) : (
              ""
            )}
          </Row>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["1"]}
            selectedKeys={selectedKeys}
            onClick={(e) => setSelectedKeys([e.key])}
            items={[
              {
                key: "1",
                icon: <HomeOutlined />,
                label: "Home",
                onClick: () => navigate("/home"),
              },
              logIn && {
                key: "2",
                icon: <UserOutlined />,
                label: "User Profile",
                onClick: () => handleCompClick("/profile"),
              },
              logIn && {
                key: "3",
                icon: <HistoryOutlined />,
                label: "Order History",
                onClick: () => handleCompClick("/orderHistory"),
              },
              logIn && {
                key: "4",
                icon: <AimOutlined />,
                label: "Order Status",
                onClick: () => handleCompClick("/orderStatus"),
              },
              {
                key: "5",
                icon: <ShoppingCartOutlined />,
                label: "Cart",
                onClick: () => handleCompClick("/cart"),
              },
              userRole === "admin" && {
                key: "6",
                icon: <ExpandOutlined />,
                label: "Admin Actions",
                children: [
                  logIn && {
                    key: "7",
                    icon: <UserOutlined />,
                    label: "user CRUD",
                    onClick: () => handleCompClick("/userCRUD"),
                  },
                  logIn && {
                    key: "8",
                    icon: <AppstoreAddOutlined />,
                    label: "product CRUD",
                    onClick: () => handleCompClick("/productCRUD"),
                  },
                ],
              },
              logIn && {
                key: "9",
                icon: <LogoutOutlined />,
                label: "logout",
                onClick: logOut,
              },
            ]}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              zIndex: 1,
              transition: "all 0.2s",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {logIn ? (
              <Button
                onClick={() => handleCompClick("/profile")}
                style={{ backgroundColor: "transparent", border: "none" }}
              >
                <Avatar
                  size="small"
                  src={userDetails.avatar}
                />
              </Button>
            ) : (
              <Button
                size="small"
                icon={<LoginOutlined />}
                onClick={() => handleCompClick("profile")}
              />
            )}
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
                color: "white",
                marginTop: "8px",
              }}
            />
          </div>
        </Sider>
        <Modal
          title="Wellcome!! You are not signed in"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          width="150vh"
          height="1000vh"
          footer={[
            <Button key="back" onClick={handleCancel}>
              Stay Sign Out
            </Button>,
          ]}
        >
          <div style={{ maxHeight: "1000px", overflow: "auto" }}>
            <UserLogin openfromlink={false} onSuccess={handleCancel} />
          </div>
        </Modal>
        {React.cloneElement(Page_component, { test: "test" })}
      </Layout>
    </div>
  );
};
export default Main;
