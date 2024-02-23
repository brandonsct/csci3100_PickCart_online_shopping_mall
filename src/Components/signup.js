import React, { useEffect, useState } from "react";
import { Button, Checkbox, Form, Input, Typography, Radio } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "./navbar";
import { UserAddOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { useForm } from "antd/lib/form/Form";
import SuccessPage from "./Success";
const { Title } = Typography;

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const RegisterPage = () => {
  return (
    <>
      {/* <NavBar /> */}
      <div>
        <SignUp />
      </div>
    </>
  );
};
export const SignUp = () => {
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
  });
  const [formSubmit, setFormSubmit] = useState(false);
  const [userdata, setUserData] = useState();
  const passwordRegex = /^(?=.*[A-Z]).{4,}$/;
  const navigate = useNavigate();
  let role;
  try {
    role = JSON.parse(sessionStorage.getItem("role")).value;
  } catch (error) {
    console.log("error>>", error);
  }
  console.log("type>>", typeof role);
  console.log("role>>", role);
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  const setError = (cb, state) => {
    cb(state);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    console.log("submit");
    console.log("values>>", formData);
    if (formData.password !== formData.confirmPassword) return setError(setShowErr, true);
    else setError(setShowErr, false);
    if (!passwordRegex.test(formData.password)) return setError(setWrongPw, true);
    else setError(setWrongPw, false);
    if (usernames.includes(formData.username)) return setError(setUserNameUsed, true);
    else setError(setUserNameUsed, false);
    console.log("cp877", !passwordRegex.test(formData.password))
    if (showErr || userNameUsed || wrongPw) return;

    console.log("Success:", values);
    try {
      const postResult = await axios.post("http://localhost:8000/register", { formData });
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
    const getUserNames = () => {
      axios
        .get("http://localhost:8000/checkUsername")
        .then((res) => {
          setUsernames(res.data);
        })
        .catch((err) => console.log("err>>", err));
    };
    getUserNames();
  }, []);

  // if (role !== "admin") {
  //   return (
  //     <div style={{ width: "50%", margin: "auto" }}>
  //       <SuccessPage
  //         status="403"
  //         title="403"
  //         subTitle="Sorry, you are not authorized to access this page."
  //         path="/venue"
  //       />
  //     </div>
  //   );
  // }
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
            }}
            onFinish={handleSubmit}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            // disabled={true}
          >
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
