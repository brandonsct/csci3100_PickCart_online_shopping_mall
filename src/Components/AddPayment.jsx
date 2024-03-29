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
    Avatar, Divider, Tooltip
} from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { UserOutlined, ClockCircleOutlined, CreditCardOutlined } from '@ant-design/icons';
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
                                    backgroundColor: '#1677ff',
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
                            placeholder={
                                "XXXX-XXXX-XXXX-XXXX"
                            }
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
                            <Col span={12}>
                                <DatePicker picker="year" />
                            </Col>                        </Row>

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
