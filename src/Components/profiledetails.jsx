import React, { useState, useEffect } from "react";
import {
    Button,
    Form,
    Input,
    Typography,
    Col,
    Row,
    Avatar,
    DatePicker,
} from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { UserOutlined, ClockCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { useForm } from "antd/lib/form/Form";
import dayjs from 'dayjs';
import { FormProvider } from "antd/es/form/context";

const API_URL = process.env.REACT_APP_API_URL;

const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
};
const UserDetails = ({ user, onSuccess }) => {
    const [form] = useForm();
    const [userInit, setUserInit] = useState({
        id: user.id,
        username: user.username,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        birthday: dayjs(user.birthday),
        avatar: user.avatar,
    })
    const [formData, setFormData] = useState({
        id: userInit.id,
        username: userInit.username,
        email: userInit.email,
        avatar: "",
        firstname: userInit.firstname,
        lastname: userInit.lastname,
        birthday: userInit.birthday
    });
    const [userNameUsed, setUserNameUsed] = useState(false);

    console.log("userInit>>", userInit)
    const [showErr, setShowErr] = useState(false);
    const navigate = useNavigate();
    const getUserNames = async () => {
        try {
            const res = await axios.post(`${API_URL}/checkusername`, { formData });
            console.log("res.dataUsern>>", res.data);
            if (res.data === true) {
                if (formData.username === userInit.username) {
                    return setUserNameUsed(false)
                }
                setUserNameUsed(res.data);
                return true;
            } else {
                setUserNameUsed(res.data);
                return false;
            }
        } catch (err) {
            console.log("err>>", err);
        }
    };
    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };
    const handleAvatar = (link) => {
        setFormData({ ...formData, ["avatar"]: link });
    };
    const handleDateChange = (dates, dateStrings) => {
        console.log(`data>> ${dates}>>dateStrings>>${dateStrings}`);
        setFormData({ ...formData, birthday: dateStrings });
      };
    const updateUser = async () => {
        let used = await getUserNames()
        if (used) return
        if (formData.avatar === "" ||  formData.avatar === undefined || formData.avatar === null) {
            formData.avatar = "https://api.dicebear.com/7.x/miniavs/svg?seed=1"
        }
        else {
            console.log("Formdata>>", formData)
            axios
                .put(`${API_URL}/admin/user`, { formData })
                .then((response) => {
                    if (response.status === 200) {
                        console.log("response>>", response)
                        return onSuccess()
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }

    };
    useEffect(() => {
        form.setFieldsValue(userInit)
    }, [form, userInit])

    useEffect(() => {
        getUserNames();
    }, [userNameUsed]);

    return (
        <>

            <div
                style={{ display: "flex", justifyContent: "center" }}
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
                    initialValues={
                        userInit
                    }
                    onFinish={updateUser}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    layout="vertical"
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="First Name"
                                name="firstname"
                            >
                                <Input
                                    name="firstname"
                                    placeholder="First Name"
                                    onChange={handleChange}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Last Name"
                                name="lastname"
                            >
                                <Input
                                    name="lastname"
                                    placeholder="Last Name"
                                    onChange={handleChange}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        labelCol={{
                            span: 24,
                        }}
                        wrapperCol={{
                            span: 24,
                        }}
                        label="Choose avatar"
                        name="avatar"
                    >
                        <Avatar.Group
                            maxCount={6}
                            maxStyle={{
                                color: '#f56a00',
                                backgroundColor: 'grey',
                            }}
                        >
                            <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" onClick={() => handleAvatar("https://api.dicebear.com/7.x/miniavs/svg?seed=1")} />
                            <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=2" onClick={() => handleAvatar("https://api.dicebear.com/7.x/miniavs/svg?seed=2")} />
                            <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=3" onClick={() => handleAvatar("https://api.dicebear.com/7.x/miniavs/svg?seed=3")} />
                            <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=4" onClick={() => handleAvatar("https://api.dicebear.com/7.x/miniavs/svg?seed=4")} />
                            <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=5" onClick={() => handleAvatar("https://api.dicebear.com/7.x/miniavs/svg?seed=5")} />

                        </Avatar.Group>
                    </Form.Item>
                    <Form.Item
                        labelCol={{
                            span: 24,
                        }}
                        wrapperCol={{
                            span: 24,
                        }}
                        label="Username"
                        name="username"
                        rules={[{ message: "username is required" }]}
                        style={{ color: "red", textAlign: "left" }}
                        validateStatus={userNameUsed ? "error" : "success"}
                        help={userNameUsed ? "username must be unique" : ""}
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
                            span: 24,
                        }}
                        wrapperCol={{
                            span: 24,
                        }}
                        label="birthday"
                        name="birthday"
                        rules={[{ required: true, message: "Birithday is required" }]}
                        style={{ color: "red", textAlign: "left" }}
                    >
                        <DatePicker
                            style={{ width: "100%" }}
                            placeholder="input birthday"
                            picker="date"
                            onChange={handleDateChange}
                        />
                    </Form.Item>

                    <Form.Item
                        labelCol={{
                            span: 24,
                        }}
                        wrapperCol={{
                            span: 24,
                        }}
                        label="Email"
                        name="email"
                        rules={[{ message: "email is required" }]}
                        style={{ color: "red", textAlign: "left" }}
                        validateStatus={showErr ? "error" : "success"}
                        help={showErr ? "email and password not match" : ""}
                    >
                        <Input
                            disabled
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button htmlType="submit" type="primary">
                            submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </>
    );
};

UserDetails.defaultProps = {
    name: ""
};

export default UserDetails;
