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


const { Option } = Select;
const API_URL = process.env.REACT_APP_API_URL;

const ProductDetails = ({ product, onSuccess, create }) => {
    const [form] = useForm();

    const [formData, setFormData] = useState(product);
    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };
    const handleSelectChange = (value) => {
        setFormData({ ...formData, ["category"]: value })
    }
    const updateProducts = () => {
        if (create) {
            axios
                .post(`${API_URL}/admin/products`, { formData })
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
                .put(`${API_URL}/admin/products`, { formData })
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
        form.setFieldsValue(product)
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
                        label="Product ID"
                        name="productId"
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
                        label="Product Name"
                        name="productName"
                        rules={[{ required: true, message: "Product Name is required" }]}
                    >
                        <Input
                            type="string"
                            name="productName"
                            onChange={handleChange}
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
                        rules={[{ required: true, message: "Category is required" }]}
                    >
                        <Select
                            placeholder="Select a category"
                            onChange={handleSelectChange}
                        >
                            <Option value="HouseHoldSupply">HouseHoldSupply</Option>
                            <Option value="MeatNSeafood">MeatNSeafood</Option>
                            <Option value="DairyChilledEggs">DairyChilledEggs</Option>
                            <Option value="BreakfastNBakery">BreakfastNBakery</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        labelCol={{
                            span: 24,
                        }}
                        wrapperCol={{
                            span: 24,
                        }}
                        label="Image"
                        name="imgSrc"
                        rules={[{ required: true, message: "Image is required" }]}
                    >
                        <Input
                            type="string"
                            name="imgSrc"
                            onChange={handleChange}
                        />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Price"
                                name="price"
                                rules={[{ required: true, message: "Price is required" }]}
                            >
                                <Input
                                    name="price"
                                    placeholder="Price"
                                    onChange={handleChange}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Stock"
                                name="stock"
                                rules={[{ required: true, message: "Stock is required" }]}
                            >
                                <Input
                                    name="stock"
                                    placeholder="Stock"
                                    onChange={handleChange}
                                />
                            </Form.Item>
                        </Col>
                    </Row>


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
