import React, { useState, useEffect } from "react";
import {
    Button,
    Form,
    Input,
    Typography,
    Col,
    Row,
} from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useForm } from "antd/lib/form/Form";

const { Title } = Typography;
const API_URL = process.env.REACT_APP_API_URL;

const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
};
const AddPayment = () => {
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
    // useEffect(() => {
    //     form.setFieldsValue(userInit)
    //    }, [form, userInit])

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
                    // initialValues={
                    //     userInit
                    // }
                    onFinish={handleSubmit}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    layout="vertical"
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="First Name"
                                name="firstName"
                            // First Name Form.Item props
                            >
                                <Input
                                // First Name Input props
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Last Name"
                                name="lastName"
                            // Last Name Form.Item props
                            >
                                <Input
                                // Last Name Input props
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
                        label="PayMent"
                        name="PayMent"
                        rules={[{ required: true, message: "PayMent is required" }]}
                        style={{ color: "red", textAlign: "left" }}
                        validateStatus={showErr ? "error" : "success"}
                        help={showErr ? "PayMent and password not match" : ""}
                    >
                        <Input
                            // placeholder={
                            //     !formData.password ? "password is required" : "input password"
                            // }
                            name="PayMent"
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
                        label="email"
                        name="email"
                        rules={[{ required: true, message: "email is required" }]}
                        style={{ color: "red", textAlign: "left" }}
                        validateStatus={showErr ? "error" : "success"}
                        help={showErr ? "email and password not match" : ""}
                    >
                        <Input.Password
                            // placeholder={
                            //     !formData.password ? "password is required" : "input password"
                            // }
                            // name="password"
                            // onChange={handleChange}
                            // status={!formData.password ? "error" : ""}
                            // prefix={!formData.password ? <ClockCircleOutlined /> : null}
                        />
                    </Form.Item>

                    {/* <Form.Item
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
                    </Form.Item> */}
                </Form>
            </div>
        </>
    );
};


export default AddPayment;
