import React, { useEffect, useState } from "react";
import { Button, Checkbox, Form, Input, Typography, Radio, DatePicker, Row, Col, Card, Avatar, Layout, Modal } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { EditOutlined, EllipsisOutlined, SettingOutlined, PlusOutlined } from '@ant-design/icons';
import { useForm } from "antd/lib/form/Form";
import SuccessPage from "./Success";
import UserDetails from "./profiledetails"
const { Header, Content, Footer, Sider } = Layout;
const API_URL = process.env.REACT_APP_API_URL;
const { Title } = Typography;
const { Meta } = Card;


const Profile = () => {
    let username
    try {
        username = JSON.parse(sessionStorage.getItem("username"))?.value;
    } catch (error) {
        console.log("username not find>>", error);
    }
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
      setIsModalOpen(true);
    };
    const handleOk = () => {
      setIsModalOpen(false);
    };
    const handleCancel = () => {
      setIsModalOpen(false);
    };

    return (
        <Layout>
            <Content
                className="site-layout-background"
                style={{
                    padding: 24,
                    margin: 0,
                    minHeight: 280,
                    // backgroundColor: "black",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <Card
                    hoverable
                    style={{
                        width: 300,
                    }}
                    cover={
                        <img
                            alt="example"
                            src="https://img.freepik.com/free-photo/black-friday-elements-assortment_23-2149074075.jpg"
                        />
                    }
                    actions={[
                        <SettingOutlined key="setting" />,
                        <EditOutlined key="edit" onClick={showModal}/>,
                        <PlusOutlined key="plus" />,
                    ]}
                >
                    <Meta
                        avatar={<Avatar src="https://gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50" />}
                        title={username}
                        description=" John Doe"
                    />
                    <Modal title="Edit Profile" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} width={300}>
                     <UserDetails/>
                     </Modal>
                </Card>
            </Content>
        </Layout>
    )

}

export default Profile