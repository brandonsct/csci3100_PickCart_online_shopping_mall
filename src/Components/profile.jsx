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
  const [userDetails, setUserDetails] = useState([])

  const username = JSON.parse(sessionStorage.getItem("username"))?.value;
  const getUserDetails = ()=>{
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

  useEffect(()=>{
    getUserDetails()
  }, [isModalOpen]) 

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
              <Avatar src={`${userDetails.avatar}`} />
            }
            title={username}
            description={`${userDetails.firstname} ${userDetails.lastname}`}
          />
          <Modal
            title="Edit Profile"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            width={300}
            footer={null}
          >
            <UserDetails user={userDetails} onSuccess={handleCancel}/>
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
