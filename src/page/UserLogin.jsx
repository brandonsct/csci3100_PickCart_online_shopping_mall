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


import { UserOutlined, ClockCircleOutlined, LoginOutlined } from '@ant-design/icons';
import { ReactComponent as LoginLogoSVG } from '../asset/icon/login_logo.svg'
import Login from '../Components/login'
import Register from '../Components/signup'

const { Title } = Typography;
const API_URL = process.env.REACT_APP_API_URL;

const UserLogin = () => {
    const items = [
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
    const SubTitle = ()=>{
        return (
        <Title level={5} style={{ textAlign: 'center', fontSize: '14px', color: "lightgrey" }}>
                PickCart is the best online shopping platform
              </Title>
        )
    }

    return (
        <>
        <div style={{ backgroundColor: '#F0F2F5', minHeight: '100vh' }}>
          <Row justify="center" align="middle">
            <Col span={12}>
              <Title level={2} style={{ textAlign: 'center', fontSize: '30px' }}>
                <Space>
                  <LoginLogoSVG />
                  PickCart
                </Space>
                <SubTitle/>
              </Title>
              
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Card
                  style={{
                    width: '50',
                    backgroundColor: 'white'
                  }}
                  extra={<a href="#">Forget Username?</a>}
                  tabList={items}
                ></Card>
              </div>
            </Col>
          </Row>
        </div>
      </>
    )
}

export default UserLogin