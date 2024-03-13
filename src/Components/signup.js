import React, { useEffect, useState } from "react";
import { Button, Checkbox, Form, Input, Typography, Radio } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "./navbar";
import { UserAddOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { useForm } from "antd/lib/form/Form";
import SuccessPage from "./Success";
import VerifyMailPage from "./verifyMail"
const API_URL = process.env.REACT_APP_API_URL;
const { Title } = Typography;

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};



const RegisterPage = () => {
  const [isVerified, setIsVerified] = useState(false)
  const handleDataFromChild = (data) => {
    setIsVerified(data)
  }
  console.log("isVerified>>", isVerified)
  return (
    <>
      {/* <NavBar /> */}
      {isVerified ? (
        <div>
          <SignUp email={isVerified.email}/>
        </div>) :
        <VerifyMailPage sendVerifyToParent={handleDataFromChild} />
      }
    </>
  );
};
export const SignUp = ({email}) => {
  const [form] = useForm();
  const [showErr, setShowErr] = useState(false);
  const [userNameUsed, setUserNameUsed] = useState(false);
  const [usernames, setUsernames] = useState([]);
  const [wrongPw, setWrongPw] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    role: "",
    email: email
  });
  const [formSubmit, setFormSubmit] = useState(false);
  const [userdata, setUserData] = useState();
  const passwordRegex = /^(?=.*[A-Z]).{4,}$/;
  const navigate = useNavigate();
  console.log("getEmail>>", email)
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  const setError = (cb, state) => {
    cb(state);
    form.resetFields();
  };
  const getUserNames = () => {
    axios
      .post(`${API_URL}/checkusername`, {formData})
      .then((res) => {
       if (res.data === true) setUserNameUsed(true)
       else setUserNameUsed(false)
      console.log("userNameUsed>>", userNameUsed)
      })
      .catch((err) => console.log("err>>", err));
  };

  const handleSubmit = async (values) => {
    getUserNames();
    console.log("submit");
    console.log("values>>", formData);
    if (formData.password !== formData.confirmPassword) return setError(setShowErr, true);
    else setError(setShowErr, false);
    if (!passwordRegex.test(formData.password)) return setError(setWrongPw, true);
    else setError(setWrongPw, false);
    if (userNameUsed) return setError(setUserNameUsed, true);
    else setError(setUserNameUsed, false);
    console.log("cp877", !passwordRegex.test(formData.password))
    if (showErr || userNameUsed || wrongPw) return;

    console.log("Success:", values);
    try {
      const postResult = await axios.post(`${API_URL}/register`, { formData });
      console.log("postResult>>", postResult);
      if (postResult.status === 200) {
        setUserData(postResult.data);
        return setFormSubmit(true);
      }
    } catch (error) {
      console.log("error>>", error);
    }
  };
  useEffect(() => {
    
  }, []);

  return (
    <>
      {!formSubmit ? (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 100 }}>
          <Form
            form={form}
            name="basic"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            style={{
              width: "50%",
              alignContent: "center",
            }}
            initialValues={{
              remember: true,
              ['email']: email
            }}
            onFinish={handleSubmit}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          // disabled={true}
          > <Form.Item
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            label="email"
            name="email"
            rules={[{ required: true, message: "email is required" }]}
            style={{ color: "red", textAlign: "left" }}
            disabled={true}
          >
              <Input
                type="string"
                name="email"
                disabled={true}
              />
            </Form.Item>
            <Form.Item
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              label="username"
              name="username"
              rules={[{ required: true, message: "Username is required" }]}
              style={{ color: "red", textAlign: "left" }}
            >
              <Input
                type="string"
                name="username"
                placeholder={userNameUsed ? "user exists" : "input username"}
                onChange={handleChange}
                status={userNameUsed ? "error" : ""}
                prefix={userNameUsed ? <ClockCircleOutlined /> : null}
              />
            </Form.Item>
            <Form.Item
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              label="password"
              name="password"
              tooltip="Password must have at least 4 characters and one uppercase letter"
              rules={[{ required: true, message: "Password is required" }]}
              style={{ color: "red", textAlign: "left" }}
            >
              <Input.Password
                placeholder={wrongPw ? "password not strong enough" : "input password"}
                name="password"
                onChange={handleChange}
                status={wrongPw ? "error" : ""}
                prefix={wrongPw ? <ClockCircleOutlined /> : null}
              />
            </Form.Item>
            <Form.Item
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              label="Confirm password"
              name="confirmPassword"
              rules={[{ required: true, message: "Password is required" }]}
              style={{ color: "red", textAlign: "left" }}
            >
              <Input.Password
                placeholder={showErr ? "password not match" : "confirm password"}
                name="confirmPassword"
                onChange={handleChange}
                status={showErr ? "error" : ""}
                prefix={showErr ? <ClockCircleOutlined /> : null}
              />
            </Form.Item>
            <Form.Item
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              label="User Role"
              name="role"
              style={{ textAlign: "left" }}
            >
              <Radio.Group name="role" onChange={handleChange} defaultValue={"user"}>
                <Radio.Button value="user">User</Radio.Button>
                <Radio.Button value="admin">Admin</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              disabled={!formData.username || !formData.password || !formData.confirmPassword ? true : false}
            >
              Register
            </Button>
          </Form>
        </div>
      ) : (
        <SuccessPage
          status={"success"}
          path={"/venue"}
          title={`Successfully create ${userdata.role}: ${userdata.username}`}
          subTitle={"Thank you for signing up."}
        />
      )}
    </>
  );
};
export default RegisterPage;
