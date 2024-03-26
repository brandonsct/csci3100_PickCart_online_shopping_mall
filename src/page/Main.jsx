import React, { useState } from "react";
import axios from "axios";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
    LogoutOutlined
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { Input, Layout, Menu, Image, Button, theme, Card, List, Row, Col } from "antd";
import { AppstoreOutlined } from "@ant-design/icons";
import appIcon from "../asset/icon.png";
import { ReactComponent as LogoSidebar } from "../asset/icon/login_logo.svg"

const API_URL = process.env.REACT_APP_API_URL;


const { Header, Sider, Content } = Layout;

const Main = ({ Page_component }) => {
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
    const items = [
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
            onClick: logOut
        },
    ]
    const childProps = {
        collapsed: collapsed,
        setCollapsed: setCollapsed,
    };

    return (
        <div class="" id="bottomPage">
            <Layout style={{ height: "100vh" }}>
                <Sider trigger={null} collapsible collapsed={collapsed} >
                    <Row gutter={16}>
                        <Col span={8}>
                            <div className="demo-logo-vertical" style={{ margin: 10 }}>
                                <LogoSidebar />
                            </div>
                        </Col>
                        {!collapsed ? <Col span={16}>
                            <div style={{ fontFamily: "Times New Roman", fontSize: 24, color: "white", marginTop: 20 }}>
                                PickCart
                            </div>
                        </Col>
                            : ""
                        }
                    </Row>
                    <Menu
                        theme="dark"
                        mode="inline"
                        defaultSelectedKeys={["1"]}
                        items={items}
                    />
                    <div style={{
                        position: 'absolute',
                        bottom: 0,
                        zIndex: 1,
                        transition: 'all 0.2s',
                    }}>
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                fontSize: "16px",
                                width: 64,
                                height: 64,
                                color: "white"
                            }}
                        />
                    </div>
                </Sider>

                {Page_component}
            </Layout>
        </div>
    );
};
export default Main;
