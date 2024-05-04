//This code is for providing the different tabs for user and admin loogin

import React, { useState } from "react";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Card,
  Typography,
  Col,
  Row,
  Space,
  Tabs,
} from "antd";
import { useNavigate } from "react-router-dom";

import {
  UserOutlined,
  ClockCircleOutlined,
  LoginOutlined,
  GoogleOutlined,
  GitlabOutlined,
  FacebookOutlined,
} from "@ant-design/icons";
import { ReactComponent as LoginLogoSVG } from "../asset/icon/login_logo.svg";
import Login from "../Components/login";
import Register from "../Components/signup";

const { Title } = Typography;
const API_URL = process.env.REACT_APP_API_URL;

/**
 * UserLogin component for handling user login and admin login.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.openfromlink - Flag indicating if the component is opened from a link.
 * @param {Function} props.onSuccess - Callback function to be called on successful login.
 * @returns {JSX.Element} The rendered UserLogin component.
 */
const UserLogin = ({ openfromlink, onSuccess }) => {
  const [admin, setAdmin] = useState(false);
  const navigate = useNavigate();
  const [hidephoto, setHidePhoto] = useState(false);
  const colSpan = hidephoto ? 24 : 8;
  const itemsForUser = [
    {
      key: "1",
      label: "Login",
      children: <Login onSuccess={onSuccess} />,
      icon: <LoginOutlined />,
    },
    {
      key: "2",
      label: "SignUp",
      children: <Register onSuccess={onSuccess} />,
      icon: <UserOutlined />,
    },
  ];
  const itemsForAdmin = [
    {
      key: "1",
      label: "Login",
      children: <Login onSuccess={onSuccess} />,
      icon: <LoginOutlined />,
    },
  ];
  //tabs for admin and user login
  const handleAdminClick = (e) => {
    e.preventDefault();
    setHidePhoto(false);
    setAdmin(false);
  };
  const handleUserClick = (e) => {
    e.preventDefault();
    setHidePhoto(true);
    setAdmin(true);
  };

  return (
    //condtional rendering
    <>
      {openfromlink ? (
        <div style={{ backgroundColor: "#F0F2F5", height: "100vh" }}>
          <Row justify="center" align="middle">
            <Col span={24}>
              <Title
                level={2}
                style={{ textAlign: "center", fontSize: "30px" }}
              >
                <Space>
                  <LoginLogoSVG />
                  PickCart
                </Space>
                <Title
                  level={5}
                  style={{
                    textAlign: "center",
                    fontSize: "14px",
                    color: "lightgrey",
                  }}
                >
                  {admin
                    ? "Admin Management System"
                    : "PickCart is the best online shopping platform"}
                </Title>
              </Title>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Row>
                  {!hidephoto && (
                    <Col span={16}>
                      {/* Photo component */}
                      <img
                        src="https://t3.ftcdn.net/jpg/02/41/43/18/360_F_241431868_8DFQpCcmpEPVG0UvopdztOAd4a6Rqsoo.jpg"
                        width={"50%"}
                        height={"auto"}
                        alt="Photo"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Col>
                  )}
                  <Col span={colSpan}>
                    <Card
                      style={{
                        width: "100%",
                        backgroundColor: "white",
                        borderRadius: 0,
                      }}
                      extra={
                        admin ? (
                          <a onClick={handleAdminClick}>Login As User</a>
                        ) : (
                          <a onClick={handleUserClick}>Login As Admin</a>
                        )
                      }
                      tabList={admin ? itemsForAdmin : itemsForUser}
                      actions={
                        admin
                          ? [
                              <FacebookOutlined />,
                              <GitlabOutlined />,
                              <GoogleOutlined />,
                            ]
                          : ""
                      }
                    />
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </div>
      ) : (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Row>
            {!hidephoto && (
              <Col span={16}>
                {/* Photo component */}
                <img
                  src="https://t3.ftcdn.net/jpg/02/41/43/18/360_F_241431868_8DFQpCcmpEPVG0UvopdztOAd4a6Rqsoo.jpg"
                  width={"50%"}
                  height={"auto"}
                  alt="Photo"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Col>
            )}
            <Col span={colSpan}>
              <Card
                style={{
                  width: "100%",
                  backgroundColor: "white",
                  borderRadius: 0,
                  height: "75vh",
                }}
                extra={
                  admin ? (
                    <a onClick={handleAdminClick}>Login As User</a>
                  ) : (
                    <a onClick={handleUserClick}>Login As Admin</a>
                  )
                }
                tabList={admin ? itemsForAdmin : itemsForUser}
                actions={
                  admin
                    ? [
                        <FacebookOutlined />,
                        <GitlabOutlined />,
                        <GoogleOutlined />,
                      ]
                    : ""
                }
              />
            </Col>
          </Row>
        </div>
      )}
    </>
  );
};

UserLogin.defaultProps = {
  openfromlink: true,
};

export default UserLogin;
