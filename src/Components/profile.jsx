import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Typography,
  Radio,
  DatePicker,
  Row,
  Col,
  Card,
  Avatar,
  Layout,
  Modal,
} from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useForm } from "antd/lib/form/Form";
import SuccessPage from "./Success";
import UserDetails from "./profiledetails";
import AddPayment from "./AddPayment";
const { Header, Content, Footer, Sider } = Layout;
const API_URL = process.env.REACT_APP_API_URL;
const { Title } = Typography;
const { Meta } = Card;

const Profile = () => {
  // const [username, setUsername] = useState("")

  const username = JSON.parse(sessionStorage.getItem("username"))?.value;
  // setUsername(value)
  const storedData = Object.keys(sessionStorage).reduce((data, key) => {
    try {
      if (key === "username") {
        data["name"] = JSON.parse(sessionStorage.getItem("username"))?.value;
      } else {
        data[key] = JSON.parse(sessionStorage.getItem(key));
      }
    } catch (error) {
      console.log(`Error retrieving ${key} from session storage:`, error);
      data[key] = null;
    }
    return data;
  }, {});
  console.log("storedData>>", storedData);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const showPaymentModal = () => {
    setIsPaymentModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handlePaymentOk = () => {
    setIsPaymentModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handlePaymentCancel = () => {
    setIsPaymentModalOpen(false);
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
          alignItems: "center",
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
            <EditOutlined key="edit" onClick={showModal} />,
            <PlusOutlined key="plus" onClick={showPaymentModal} />,
          ]}
        >
          <Meta
            avatar={
              <Avatar src="https://gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50" />
            }
            title={username}
            description=" John Doe"
          />
          <Modal
            title="Edit Profile"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            width={300}
          >
            <UserDetails user={{ storedData }} />
          </Modal>
          <Modal
            title="Add Payment Method"
            open={isPaymentModalOpen}
            onOk={handlePaymentOk}
            onCancel={handlePaymentCancel}
            width={300}
          >
            <AddPayment />
          </Modal>
        </Card>
      </Content>
    </Layout>
  );
};

export default Profile;
