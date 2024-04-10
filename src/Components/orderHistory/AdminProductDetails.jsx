import React, { useState, useEffect } from "react";
import {
    Button,
    Form,
    Input,
    Select,
    Col,
    Row,
    Avatar,
    DatePicker,
} from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserOutlined, ClockCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { useForm } from "antd/lib/form/Form";

const progress = {
    Pending: 0,
    progress: 1,
    delievery: 2,
    waiting: 3,
    complete: 4,
    finished: 5,
  };


const { Option } = Select;
const API_URL = process.env.REACT_APP_API_URL;

const ProductDetails = ({ order, onSuccess, create }) => {
    const [form] = useForm();

    const [product, setProducts] = useState({
        _id: order._id,
        productName: order.items[0].product.productName,
        category: order.items[0].product.category,
        imgSrc: order.items[0].product.imgSrc,
        status: order.status
    });

    const [formData, setFormData] = useState(product);
    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };
    const handleSelectChange = (value) => {
        setFormData({ ...formData, ["status"]: value })
    }
    const updateProducts = () => {
        if (create) {
            axios
                .post(`${API_URL}/admin/retrieveAllOrders`, { formData })
                .then((response) => {
                    if (response.status === 200) {
                        console.log("response>>", response)
                        return onSuccess()
                    }
                    console.log("response>>", response)
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            console.log("Formdata>>", formData)
            axios
                .put(`${API_URL}/admin/retrieveAllOrders`, { formData })
                .then((response) => {
                    if (response.status === 200) {
                        console.log("response>>", response)
                        return onSuccess()
                    }
                    console.log("response>>", response)
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };
    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };
    useEffect(() => {
        form.setFieldsValue(product);
    }, [form, product])


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
                        product
                    }
                    onFinish={updateProducts}
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
                        label="Order ID"
                        name="_id"
                    >
                        <Input
                            disabled
                        />
                    </Form.Item>
                    <Form.Item
                        labelCol={{
                            span: 24,
                        }}
                        wrapperCol={{
                            span: 24,
                        }}
                        label="Status"
                        name="status"
                        rules={[{ required: true, message: "Status is required" }]}
                    >
                        <Select
                            placeholder="Select a status"
                            onChange={handleSelectChange}
                        >
                            <Option value="Pending">Pending</Option>
                            <Option value="progress">progress</Option>
                            <Option value="delievery">delievery</Option>
                            <Option value="waiting">waiting</Option>
                            <Option value="complete">complete</Option>
                            <Option value="finished">finished</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        labelCol={{
                            span: 24,
                        }}
                        wrapperCol={{
                            span: 24,
                        }}
                        label="Product Name"
                        name="productName"
                    >
                        <Input
                            disabled
                        />
                    </Form.Item>
                    <Form.Item
                        labelCol={{
                            span: 24,
                        }}
                        wrapperCol={{
                            span: 24,
                        }}
                        label="Category"
                        name="category"
                    >
                        <Input disabled />
                    </Form.Item>
                        <Form.Item>

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



export default ProductDetails;
