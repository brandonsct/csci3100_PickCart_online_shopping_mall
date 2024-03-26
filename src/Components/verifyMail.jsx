import React, { useEffect, useState } from "react";
import { Button, Form, Input } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import { useForm } from "antd/lib/form/Form";
const API_URL = process.env.REACT_APP_API_URL;

const VerifyPage = ({ sendVerifyToParent }) => {
  const [form] = useForm();
  const [emailPassed, setEmailPassed] = useState(false);
  const [emailUsed, setEmailUsed] = useState(false);
  const [otpinValid, setOtpinValid] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
  });
  const [emailValid, setEmailValid] = useState(true)
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const sendEmail = async () => {
    try {
      const postResult = await axios.post(`${API_URL}/sendemail`, { formData });
      console.log("postResult>>", postResult);
      if (postResult.status === 200) {
        console.log("email send");
      }
    } catch (error) {
      console.log("error>>", error);
    }
  };

  const getEmail = () => {
    console.log("formData>>", formData);
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = (email) => {
        return emailPattern.test(email);
    };
    if (isEmailValid(formData.email)) {
        console.log('Email is valid');
        setEmailValid(true)
      } else {
        return setEmailValid(false);
      }
    axios
      .post(`${API_URL}/checkemail`, { formData })
      .then((res) => {
        if (res.data === true) {
          setEmailUsed(res.data);
          return form.resetFields();
        } else {
          setEmailUsed(res.data);
          sendEmail();
          return setEmailPassed(true);
        }
      })
      .catch((err) => console.log("err>>", err));
  };

  const handleSubmit = async (values) => {
    try {
      const postResult = await axios.post(`${API_URL}/checkotp`, { formData });
      console.log("postResult>>", postResult);
      if (postResult && postResult?.status === 200) {
        if (postResult.data === false) return setOtpinValid(true);
        else sendVerifyToParent({ verified: true, email: values.email });
      }
    } catch (error) {
      console.log("error>>", error);
    }
  };
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Form
        form={form}
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
          label="email"
          name="email"
          rules={[{ required: true, message: "email is required" }]}
          style={{ color: "red", textAlign: "left" }}
          hasFeedback
          validateStatus={ emailUsed || !emailValid? "error": ""}
          help={!emailValid ? "Email is Invalid": ""}
        >
          <Input
            type="string"
            name="email"
            placeholder={
              emailUsed ? "email is in used" : "please enter your email"
            }
            onChange={handleChange}
            status={emailUsed ? "error" : ""}
            prefix={emailUsed ? <ClockCircleOutlined /> : null}
            disabled={emailPassed}
          />
        </Form.Item>
        {!emailPassed && (
          <Button
            type="primary"
            onClick={getEmail}
            disabled={!formData.email ? true : false}
          >
            Verify
          </Button>
        )}
        {emailPassed && (
          <Form.Item
            labelCol={{
              span: 24,
            }}
            wrapperCol={{
              span: 24,
            }}
            label="otp"
            name="otp"
            rules={[{ required: true, message: "otp is required" }]}
            style={{ color: "red", textAlign: "left" }}
          >
            <Input
              type="number"
              name="otp"
              placeholder={
                otpinValid ? "otp is inValid" : "please enter your otp"
              }
              onChange={handleChange}
              status={otpinValid ? "error" : ""}
              prefix={otpinValid ? <ClockCircleOutlined /> : null}
            />
          </Form.Item>
        )}
        {emailPassed && (
          <Button
            type="primary"
            htmlType="submit"
            disabled={!formData.otp ? true : false}
          >
            VerifyOtp
          </Button>
        )}
      </Form>
    </div>
  );
};

export default VerifyPage;
