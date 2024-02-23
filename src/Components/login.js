import React, { useState } from "react";
import { Button, Checkbox, Form, Input, Typography, Col, Row, Space } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "./navbar";
import "bootstrap/dist/css/bootstrap.css";
import ClockCircleOutlined from "@ant-design/icons/ClockCircleOutlined";
import { useForm } from "antd/lib/form/Form";

const { Title } = Typography;

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
function setSessionStorageWithExpiration(key, value, expirationTimeInMinutes) {
  const expirationMs = expirationTimeInMinutes * 60 * 1000; // Convert minutes to milliseconds
  const now = new Date().getTime();
  const expirationTime = now + expirationMs;

  const item = {
    value: value,
    expirationTime: expirationTime,
  };

  sessionStorage.setItem(key, JSON.stringify(item));
}
const Login = () => {
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
  const handleSubmit = async (event) => {
    console.log("formData>>", formData);
    try {
      axios({
        method: "POST",
        data: {
          username: formData.username,
          password: formData.password,
        },
        withCredentials: true,
        url: "http://localhost:8000/login",
      })
        .then(async (res) => {
          console.log("res>>", res);
          if (res.status == 200) {
            console.log("res.data>>", res.data);
            setSessionStorageWithExpiration("username", res.data.user.username, 120);
            setSessionStorageWithExpiration("role", res.data.user.role, 120);
            setSessionStorageWithExpiration("lastUpdatedTime", res.data.timestamp, 120);
            //expire after 2 hrs
            navigate("/venue");
          }
        })
        .catch((err) => {
          console.log("reset");
          form.resetFields();
          setShowErr(true);
        });
    } catch (error) {
      console.log("error>>", error);
    }
  };
  return (
    <>
      <NavBar />
      <div style={{ display: "flex", justifyContent: "center", marginTop: 100 }}>
        <Form
          name="basic"
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 12,
          }}
          style={{
            width: "50%",
            alignContent: "center",
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={handleSubmit}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 12,
            }}
            label="username"
            name="username"
            rules={[{ required: true, message: "Username is required" }]}
            style={{ color: "red", textAlign: "left" }}
            hasFeedback
            validateStatus={showErr ? "error" : "success"}
            help={showErr ? "username and password not match" : ""}
          >
            <Input
              type="string"
              placeholder={!formData.username ? "username is required" : "input username"}
              name="username"
              onChange={handleChange}
              status={!formData.username ? "error" : ""}
              prefix={!formData.username ? <ClockCircleOutlined /> : null}
            />
          </Form.Item>

          <Form.Item
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 12,
            }}
            label="password"
            name="password"
            rules={[{ required: true, message: "Password is required" }]}
            style={{ color: "red", textAlign: "left" }}
            validateStatus={showErr ? "error" : "success"}
            help={showErr ? "username and password not match" : ""}
          >
            <Input.Password
              placeholder={!formData.password ? "password is required" : "input password"}
              name="password"
              onChange={handleChange}
              status={!formData.password ? "error" : ""}
              prefix={!formData.password ? <ClockCircleOutlined /> : null}
            />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </Form>
      </div>
    </>
  );
};
export default Login;
