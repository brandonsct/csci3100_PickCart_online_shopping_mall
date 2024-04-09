import React, { useState, useEffect } from "react";
import {
  Layout,
  Table,
  Modal,
  Button,
  Tooltip,
  Tag
} from "antd";
import axios, { all } from "axios";
import ProductDetails from "./ProductDetails";
import { ProductOutlined } from "@ant-design/icons";
const API_URL = process.env.REACT_APP_API_URL;
const orderStatusColor = {
  Pending: 'volcano', // Yellow
  Progressing: 'geekblue', // Blue
  Delivering: '#52c41a', // Green
  Completed: '#eb2f96', // Pink
};

const HistoryTableForAdmin = () => {
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
      title: "OrderId",
      dataIndex: "_id",
      width: "18%",
      render: (id) => (
        `${id}`)
    },
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



  const getOrders = async () => {
    const userorders = await axios.get(`${API_URL}/admin/retrieveAllOrders`)
    console.log("orders>>", userorders)

    const raw = userorders.data.allOrders;

    let allOrders = [];

    for (let i = 0; i < raw.length; i++)
    {
      allOrders = allOrders.concat(raw[i].orders);
    }

    setOrders(allOrders)
  }

  useEffect(() => {
    getOrders()
  }, [])
  console.log("orders>>", orders)

  return (
    <>
      <Modal title="Order Details" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <ProductDetails product={productDetails}/>
      </Modal>
      <Table columns={columns} dataSource={orders} />
    </>
  );
};
export default HistoryTableForAdmin;
