import React, { useState } from "react";
import {
  Button,
  Form,
  Input,
  Typography,
  Col,
  Row,
  Space,
  Tabs
} from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "./navbar";

import { UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useForm } from "antd/lib/form/Form";
import {ReactComponent as LoginLogoSVG} from '../asset/icon/login_logo.svg'

const { Title } = Typography;
const API_URL = process.env.REACT_APP_API_URL;

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
        url: `${API_URL}/login`,
      })
        .then(async (res) => {
          console.log("res>>", res);
          if (res.status == 200) {
            console.log("res.data>>", res.data);
            setSessionStorageWithExpiration(
              "username",
              res.data.user.username,
              120
            );
            setSessionStorageWithExpiration("role", res.data.user.role, 120);
            setSessionStorageWithExpiration(
              "lastUpdatedTime",
              res.data.timestamp,
              120
            );
            //expire after 2 hrs
            navigate("/home");
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

      <div
        style={{ display: "flex", justifyContent: "center"}}
      >
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
          initialValues={{
            remember: true,
          }}
          onFinish={handleSubmit}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            labelCol={{
              span: 24,
            }}
            wrapperCol={{
              span: 24,
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
              placeholder={
                !formData.username ? "username is required" : "input username"
              }
              name="username"
              onChange={handleChange}
              status={!formData.username ? "error" : ""}
              prefix={!formData.username ? <ClockCircleOutlined /> : null}
            />
          </Form.Item>

          <Form.Item
            labelCol={{
              span: 24,
            }}
            wrapperCol={{
              span: 24,
            }}
            label="password"
            name="password"
            rules={[{ required: true, message: "Password is required" }]}
            style={{ color: "red", textAlign: "left" }}
            validateStatus={showErr ? "error" : "success"}
            help={showErr ? "username and password not match" : ""}
          >
            <Input.Password
              placeholder={
                !formData.password ? "password is required" : "input password"
              }
              name="password"
              onChange={handleChange}
              status={!formData.password ? "error" : ""}
              prefix={!formData.password ? <ClockCircleOutlined /> : null}
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" style={{width: '100%'}}>
            Sign In
        </Button>
        <a>Forgot password?</a>
        </Form>
      </div>
    </>
  );
};
export default Login;
