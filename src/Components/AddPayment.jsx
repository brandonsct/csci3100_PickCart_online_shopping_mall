import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  Input,
  Typography,
  Col,
  Row,
  Img,
  DatePicker,
  Avatar,
  Divider,
  Tooltip,
} from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  UserOutlined,
  ClockCircleOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import { useForm } from "antd/lib/form/Form";

const { Title } = Typography;
const API_URL = process.env.REACT_APP_API_URL;

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
const AddPayment = ({user, onSuccess}) => {
  const [form] = useForm();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [showErr, setShowErr] = useState(false);
  const navigate = useNavigate();
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  const handleSubmit =  (value) => {
    let userTobeSent = user
    userTobeSent.payment = true
    

    axios
                .put(`${API_URL}/admin/user`, { formData: userTobeSent })
                .then((response) => {
                    if (response.status === 200) {
                        console.log("response>>", response)
                        
                        return onSuccess()
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
  };
  // useEffect(() => {
  //     form.setFieldsValue(userInit)
  //    }, [form, userInit])

  return (
    <>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Form
          name="basic"
          labelCol={{
            span: 24,
          }}
          wrapperCol={{
            span: 24,
          }}
          style={{
            width: "100%",
            alignContent: "center",
          }}
          // initialValues={
          //     userInit
          // }
          onFinish={handleSubmit}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            label="Please add your payment method"
            name="payment"
            // First Name Form.Item props
          >
            <Avatar.Group>
              <Avatar src="https://play-lh.googleusercontent.com/u18c1G3zGn92RIwU-NERrLBoLb2jcH_AeIjajZrjyK6ubm-D5t6ZLozIheQDhj6B5XDv" />
              <Avatar src="https://cdn-icons-png.flaticon.com/512/217/217425.png" />
              <Avatar src="https://cdn-icons-png.freepik.com/256/11378/11378340.png" />
              <Avatar
                style={{
                  backgroundColor: "#1677ff",
                }}
                icon={<CreditCardOutlined />}
              />
            </Avatar.Group>
          </Form.Item>

          <Form.Item
            labelCol={{
              span: 24,
            }}
            wrapperCol={{
              span: 24,
            }}
            label="Credit Card Number"
            name="creditcardnumber"
            // rules={[{ required: true, message: "PayMent is required" }]}
            // style={{ color: "red", textAlign: "left" }}
            // validateStatus={showErr ? "error" : "success"}
            // help={showErr ? "PayMent and password not match" : ""}
          >
            <Input
              placeholder={"XXXX-XXXX-XXXX-XXXX"}
              name="creditcardnumber"
              // onChange={handleChange}
              // status={!formData.password ? "error" : ""}
              // prefix={!formData.password ? <ClockCircleOutlined /> : null}
            />
          </Form.Item>

          <Form.Item
            labelCol={{
              span: 24,
            }}
            wrapperCol={{
              span: 24,
            }}
            label="Expiration"
            name="expiration"
            // rules={[{ required: true, message: "Expiration is required" }]}
            // style={{ color: "red", textAlign: "left" }}
            // validateStatus={showErr ? "error" : "success"}
            // help={showErr ? "Expiration and password not match" : ""}
          >
            <Row gutter={16}>
              <Col span={12}>
                <DatePicker picker="month" />
              </Col>

            {/*
                <Col span={12}>         
                    <DatePicker picker="year" />
                </Col>    
            */}
            </Row>
          </Form.Item>

          <Button onClick={handleSubmit} type="primary" htmlType="submit" style={{ width: "100%" }}>
            Save
          </Button>

        </Form>
      </div>
    </>
  );
};

export default AddPayment;
