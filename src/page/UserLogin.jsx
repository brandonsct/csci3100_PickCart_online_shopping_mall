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
import { useNavigate } from "react-router-dom";


import { UserOutlined, ClockCircleOutlined, LoginOutlined, GoogleOutlined, GitlabOutlined, FacebookOutlined } from '@ant-design/icons';
import { ReactComponent as LoginLogoSVG } from '../asset/icon/login_logo.svg'
import Login from '../Components/login'
import Register from '../Components/signup'

const { Title } = Typography;
const API_URL = process.env.REACT_APP_API_URL;

const UserLogin = ({ admin }) => {
    console.log("admin>>", admin)
    const navigate = useNavigate();
    const [hidephoto, setHidePhoto] = useState(false)
    const colSpan = hidephoto ? 24 : 8;
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
    const handleAdminClick = (e)=>{
        e.preventDefault();
        setHidePhoto(false)
        navigate("/login")
    }
    const handleUserClick = (e)=>{
        e.preventDefault();
        setHidePhoto(true)
        navigate("/admin/login")
    }

    return (
        <>
            <div style={{ backgroundColor: '#F0F2F5', minHeight: '120vh' }}>
                <Row justify="center" align="middle">
                    <Col span={24}>
                        <Title level={2} style={{ textAlign: 'center', fontSize: '30px' }}>
                            <Space>
                                <LoginLogoSVG />
                                PickCart
                            </Space>
                            <Title level={5} style={{ textAlign: 'center', fontSize: '14px', color: "lightgrey" }}>
                                {admin ? "Admin Management System" : "PickCart is the best online shopping platform"}
                            </Title>
                        </Title>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                        <Row >
                            {!hidephoto && <Col span={16}>
                                {/* Photo component */}
                                <img src="https://t3.ftcdn.net/jpg/02/41/43/18/360_F_241431868_8DFQpCcmpEPVG0UvopdztOAd4a6Rqsoo.jpg" 
                                width={"50%"} height={"auto"} alt="Photo"style={{width: "100%", height: "100%", objectFit: "cover" }} 
                                />
                            </Col>}
                            <Col span={colSpan}>
                                <Card
                                    style={{
                                        width: '100%',
                                        backgroundColor: 'white',
                                        borderRadius: 0
                                    }}
                                    extra={admin ?
                                        <a onClick={handleAdminClick}>Login As User</a>
                                        :
                                        <a onClick={handleUserClick}>Login As Admin</a>
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
                            </Col>
                        </Row>
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default UserLogin