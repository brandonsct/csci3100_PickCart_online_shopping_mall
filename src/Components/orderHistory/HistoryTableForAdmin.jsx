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
import ProductDetails from "./AdminProductDetails";
import { EditOutlined, DeleteOutlined, AppstoreAddOutlined, ProductOutlined, HistoryOutlined } from "@ant-design/icons";

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
  const [orderDetails, setOrderDetails] = useState([])
  const [createProd, setCreateProd] = useState(false);
  const [singleOrder, setSingleOrder] = useState({});

  const showModal = (order) => {
    setSingleOrder(order);
    console.log("Single order");
    console.log(order);
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
/*
  const deleteOrder = (productId ) => {
    setIsLoading(true);
    axios({
      method: "PUT",
      url: `${API_URL}/admin/delete/product`,
      data: { productId: productId }
    })
      .then((response) => {
        if ((response.status) === 200) {
          console.log("del>>response.data>>", response.data)
          getProducts()
          setIsLoading(false);
        }
        else {
          console.log("response>>", response)
          return getProducts()
        }
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        getProducts()
        setIsLoading(false);
      });
  }
*/
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
          <Button
            onClick={() => {
              setCreateProd(false)
              showModal(record)
            }}
            style={{ color: "blue" }}
            icon={<EditOutlined />}
          />

          <Button style={{ color: "red" }} icon={<DeleteOutlined />} onClick={()=>{/* deleteOrder(record._id) */}}/>
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
      let userorder = raw[i].orders;
      const userId = raw[i].userID;

      for (let j = 0; j < userorder.length; j++)
      {
        userorder[j].userId = userId;
      }

      allOrders = allOrders.concat(userorder);
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
        <ProductDetails order={singleOrder}/>
      </Modal>
      <Table columns={columns} dataSource={orders} />
    </>
  );
};
export default HistoryTableForAdmin;
