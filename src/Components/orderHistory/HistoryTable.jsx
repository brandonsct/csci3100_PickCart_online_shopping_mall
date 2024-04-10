import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Input,
  List,
  Layout,
  Table,
  Modal,
  Button,
  Tooltip,
  Tag,
  Card,
  Space,
  Avatar,
} from "antd";
import axios from "axios";
import ProductDetails from "./ProductDetails";
import { ProductOutlined, StarOutlined, LikeOutlined, MessageOutlined, HistoryOutlined, MoneyCollectOutlined, CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
  SyncOutlined, } from "@ant-design/icons";
const API_URL = process.env.REACT_APP_API_URL;


const orderStatusIcon = {
  Pending: <ClockCircleOutlined/>, // Yellow
  Processing: <ClockCircleOutlined/>, // Blue
  Delivering: <SyncOutlined/>, // Green
  Completed: <CheckCircleOutlined/>, // Pink
};
const orderStatusColor = {
  Pending: 'default', // Yellow
  Processing: 'processing', // Blue
  Delivering: 'processing', // Green
  Completed: 'success', // Pink
};
const orderStatusIcons = {
  HouseHoldSupply: 'https://img.rtacdn-os.com/dshop/202403/78e98de8-7103-48f0-98fb-55cac8638051_.webp', // Yellow
  MeatNSeafood: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIa1gGa7EAjXfBUDwHkglH4UjxcLHv4JYDvhuvmUYWqA&s', // Blue
  DairyChilledEggs: 'https://img2.rtacdn-os.com/dshop/202403/f6732131-1244-4f31-9334-3cd3a55b6eb9_.webp', // Green
  BreakfastNBakery: 'https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-bakery-icon-for-your-project-png-image_1541423.jpg', // Pink
};
const IconText = ({ icon, text }) => {
  return (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  )
}


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
          src={item.product?.imgSrc}
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
        <Tooltip placement="topLeft" title={item.product?.productName}>
          {item.product?.productName}
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
          text: 'Processing',
          value: 'Processing',
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
      render: (items) => items.quantity.toString()
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
    const userordersobj = userorders?.data?.orderList
    const flattenedOrders = userordersobj.flatMap(obj => obj.items.map(itemList => ({
      orderId: obj?._id,
      date: obj?.date,
      items: itemList,
      status: obj?.status,
      totalPrice: obj?.totalPrice

    })));
    setOrders(flattenedOrders)
    console.log("flattenedOrders>>", flattenedOrders)

  }

  useEffect(() => {
    getOrders()
  }, [])
  return (
    <>
      <Modal title="Order Details" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <ProductDetails product={productDetails} />
      </Modal>
      {/* <Table columns={columns} dataSource={orders} /> */}
      <Card title={
        <Space>
          <HistoryOutlined />
          Order History
        </Space>
      }>
        <List
          itemLayout="vertical"
          size="large"
          pagination={{
            onChange: (page) => {
              console.log(page);
            },
            pageSize: 5,
          }}
          dataSource={orders}
          footer={
            <div>
              <b>ant design</b> footer part
            </div>
          }
          renderItem={(item) => {
            // console.log("item>>", item)
            return (
              <List.Item
                key={item._id}
                actions={[
                  <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
                  <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
                  <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
                  <IconText icon={ProductOutlined} text="Product Details"/>
                ]}
                extra={
                  <div>
                    <img
                      alt="logo"
                      src={item.items?.product?.imgSrc}
                      style={{ width: "100px", height: "100px", borderRadius: "25%" }}
                    />
                    <div style={{ textAlign: "center" }}>
                      <Space direction="vertical">
                        <Space>
                          <Tag icon={<MoneyCollectOutlined />} ccolor="success">
                            {`$ ${item.items?.product?.price}`}
                          </Tag>
                        </Space>
                        <Space>
                          <span>{`x ${item.items?.quantity} =  $ ${item.items?.product?.price * item.items?.quantity}`}</span>
                        </Space>
                      </Space>
                    </div>
                  </div>
                }
              >
                <List.Item.Meta
                  avatar={<Avatar src={orderStatusIcons[item.items?.product?.category]} />}
                  title={item.items?.product?.productName}
                  description={item.items?.product?.category}
                />
                <Tag color={orderStatusColor[item.status]} icon={orderStatusIcon[item.status]} key={item.status}>
                  {item.status}
                </Tag>
              </List.Item>
            )
          }}
        />
      </Card>
    </>
  );
};
export default HistoryTable;
