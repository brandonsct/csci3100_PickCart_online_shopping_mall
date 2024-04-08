import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Input,
  AutoComplete,
  Layout,
  Table,
  Modal,
  Button,
  Tooltip,
  Tag,
  Card,
  Space
} from "antd";
import axios from "axios";
import ProductDetails from "./ProductDetails";
import { ProductOutlined } from "@ant-design/icons";
const API_URL = process.env.REACT_APP_API_URL;
const orderStatusColor = {
  Pending: 'volcano', // Yellow
  Progressing: 'geekblue', // Blue
  Delivering: '#52c41a', // Green
  Completed: '#eb2f96', // Pink
};

const HistoryTable = () => {
  const [orders, setOrders] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productDetails, setProductDetails] = useState([])
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const showDetails = (record) => {
    console.log("record>>", record)
    setProductDetails(record.items[0].product)
    showModal()
  }
  const columns = [
    {
      title: "Image",
      dataIndex: "items",
      width: "18%",
      render: (item) => (
        <img
          src={item[0]?.product?.imgSrc}
          // alt={record.productName}
          style={{ width: "100px", height: "100px" }}
        />
      ),
    },
    {
      title: "Product Name",
      dataIndex: "items",
      width: "20%",
      ellipsis: true,
      fixed: 'left',
      render: (item) => (
        <Tooltip placement="topLeft" title={item[0]?.product?.productName}>
          {item[0]?.product?.productName}
        </Tooltip>
      ),
      sorter: {
        compare: (a, b) => a.productName.localeCompare(b.productName),
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      ellipsis: true,
      width: "13%",
      filters: [
        {
          text: 'Pending',
          value: 'Pending',
        },
        {
          text: 'Progressing',
          value: 'Progressing',
        },
        {
          text: 'Delivering',
          value: 'Delivering',
        },
        {
          text: 'Completed',
          value: 'Completed',
        },
      ],
      render: (_, { status }) => (
        <>
        <Tag color={orderStatusColor[status]} key={status}>
          {status}
        </Tag>
      </>
      ),
    },
    {
      title: "Price",
      key: "totalPrice",
      dataIndex: "totalPrice",
      textWrap: 'word-break',
      ellipsis: true,
      width: "10%",
      render: (totalPrice) => (
        `$ ${totalPrice} `
      )
    },
    {
      title: "Quantity",
      key: "quantity",
      dataIndex: "items",
      width: "10%",
      render: (items) => items[0].quantity.toString()
    },
    {
      title: "Operation",
      dataIndex: "operation",
      width: "10%",
      fixed: 'right',
      render: (_, record) => (
        <div style={{ justifyContent: "center", alignItems: "center", display: "flex" }}>
          <Button style={{ color: "red" }} icon={<ProductOutlined />} onClick={() => showDetails(record)} />
        </div>
      ),
    },
  ];


  const getUserDetails = async () => {
    const username = JSON.parse(sessionStorage.getItem("username"))?.value;
    console.log("username:", username);
    let response;
    await axios
      .post(`${API_URL}/getuser`, { username })
      .then((resp) => {
        response = resp?.data?.id;
      })
      .catch((error) => {
        console.log("err>>", error);
      });
    return response;
  };

  const getOrders = async () => {
    const userId = await getUserDetails()
    const userorders = await axios.post(`${API_URL}/retrieveOrder`, { userId: userId })
    console.log("orders>>", userorders)
    setOrders(userorders.data.orderList)
  }

  useEffect(() => {
    getOrders()
  }, [])
  return (
    <>
      <Modal title="Order Details" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <ProductDetails product={productDetails}/>
      </Modal>
      <Table columns={columns} dataSource={orders} />
    </>
  );
};
export default HistoryTable;
