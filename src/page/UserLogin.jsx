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
    Tabs
} from "antd";


import { UserOutlined, ClockCircleOutlined, LoginOutlined, GoogleOutlined, GitlabOutlined, FacebookOutlined } from '@ant-design/icons';
import { ReactComponent as LoginLogoSVG } from '../asset/icon/login_logo.svg'
import Login from '../Components/login'
import Register from '../Components/signup'

const { Title } = Typography;
const API_URL = process.env.REACT_APP_API_URL;

const UserLogin = ({ admin }) => {
    console.log("admin>>", admin)
    const itemsForUser = [
        {
            key: '1',
            label: 'Login',
            children: <Login />,
            icon: <LoginOutlined />
        },
        {
            key: '2',
            label: 'SignUp',
            children: <Register />,
            icon: <UserOutlined />
        },
    ]
    const itemsForAdmin = [
        {
            key: '1',
            label: 'Login',
            children: <Login />,
            icon: <LoginOutlined />
        }
    ]

    return (
        <>
            <div style={{ backgroundColor: '#F0F2F5', minHeight: '120vh' }}>
                <Row justify="center" align="middle">
                    <Col span={12}>
                        <Title level={2} style={{ textAlign: 'center', fontSize: '30px' }}>
                            <Space>
                                <LoginLogoSVG />
                                PickCart
                            </Space>
                            <Title level={5} style={{ textAlign: 'center', fontSize: '14px', color: "lightgrey" }}>
                                {admin ? "Admin Management System" : "PickCart is the best online shopping platform" }
                            </Title>
                        </Title>

                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Card
                                style={{
                                    width: '50',
                                    backgroundColor: 'white'
                                }}
                                extra={admin ?
                                <a href="/login">Login As User</a>
                                : 
                                <a href="/admin/login">Login As Admin</a>
                            }
                                tabList={admin ?
                                    itemsForAdmin : 
                                    itemsForUser
                                }
                                actions={admin ? [
                                    <FacebookOutlined />,
                                    <GitlabOutlined />,
                                    <GoogleOutlined />
                                ] : ""
                                }
                            />
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default UserLogin