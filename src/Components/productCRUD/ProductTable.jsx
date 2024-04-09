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
  Tabs,
  Card
} from "antd";
import axios from "axios";
import { EditOutlined, DeleteOutlined, AppstoreAddOutlined, ProductOutlined, HistoryOutlined } from "@ant-design/icons";
import ProductDetails from "./ProductDetails";
import HistoryTableForAdmin from "../orderHistory/HistoryTableForAdmin";


const { Header, Content, Footer } = Layout;
const { Search } = Input
const moment = require('moment');
const API_URL = process.env.REACT_APP_API_URL;

const categories = {
  HouseHoldSupply: 'volcano', // Yellow
  MeatNSeafood: 'geekblue', // Blue
  DairyChilledEggs: '#52c41a', // Green
  BreakfastNBakery: '#eb2f96', // Pink
};

const ProductCRUDTable = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [singleProduct, setSingleProduct] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [productNameOptions, setProductNameOptions] = useState([]);
  const [createProd, setCreateProd] = useState(false)
  const generateToken = () => {
    const timestamp = moment().format('YYYYMMDDHHmmss');
    const randomString = Math.random().toString(36).substring(2, 8);
    const token = timestamp + randomString;
    return token;
  }
  const emptyProductData = {
    productId: generateToken(),
    productName: "",
    category: "",
    imgSrc: "",
    price: "",
    stock: "",
  };
  const handleChange = (value) => {
    setOptions(() => {
      return products
        .filter((product) => product.productId.startsWith(value))
        .map((product) => ({
          label: product.productId,
          value: product.productId,
        }));
    });
    console.log("trigger>>productid>>change")
  };
  const handleProductNameChange = (value) => {
    setProductNameOptions(() => {
      return products
        .filter((product) => product.productName.toLowerCase().startsWith(value.toLowerCase()))
        .map((product) => ({
          label: product.productName,
          value: product.productName,
        }));
    });
  }
  const getProducts = () => {
    console.log("fetching>>")
    setIsLoading(true)
    axios
      .get(`${API_URL}/getAllProducts`)
      .then((response) => {
        setProducts(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setIsLoading(false);
      });
  }
  const deleteProducts = (productId ) => {
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
  const handleSearch = (value) => {
    if (value === "" || value === null || value === undefined) return getProducts()
    setProducts([...products.filter((product) => product.productId.toLowerCase().startsWith(value.toLowerCase()))]);
    console.log("val>>", value)
    console.log("filterID>", products.filter((product) => product.productId.startsWith(value)))
  };
  const handleProductSearch = (value) => {
    if (value === "" || value === null || value === undefined) return getProducts()
    setProducts([...products.filter((product) => product.productName.toLowerCase().startsWith(value.toLowerCase()))]);
    console.log("val>>", value)
    console.log("filterNAME>", products.filter((product) => product.productName.toLowerCase().startsWith(value.toLowerCase())))
  };


  const showModal = (record) => {
    setSingleProduct(record);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const columns = [
    {
      title: "Product ID",
      dataIndex: "productId",
      width: "15%",
      textWrap: 'word-break',
      ellipsis: true,
      fixed: 'left',
      render: (id) => (
        <Tooltip placement="topLeft" title={id}>
          {id}
        </Tooltip>
      ),
      sorter: {
        compare: (a, b) => a.productId.localeCompare(b.productId),
      },
    },

    {
      title: "Product Name",
      dataIndex: "productName",
      width: "18%",
      ellipsis: true,
      fixed: 'left',
      render: (name) => (
        <Tooltip placement="topLeft" title={name}>
          {name}
        </Tooltip>
      ),
      sorter: {
        compare: (a, b) => a.productName.localeCompare(b.productName),
      },
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: "18%",
      fixed: 'left',
      filters: [
        {
          text: 'HouseHoldSupply',
          value: 'HouseHoldSupply',
        },
        {
          text: 'MeatNSeafood',
          value: 'MeatNSeafood',
        },
        {
          text: 'DairyChilledEggs',
          value: 'DairyChilledEggs',
        },
        {
          text: 'BreakfastNBakery',
          value: 'BreakfastNBakery',
        },
      ],
      onFilter: (value, record) => record.category.startsWith(value),
      filterSearch: true,
      render: (_, { category }) => (
        <>
        <Tag color={categories[category]} key={category}>
          {category}
        </Tag>
      </>
      ),
    },
    {
      title: "Image",
      dataIndex: "imgSrc",
      width: "20%",
      render: (Image) => (
        <img
          src={Image}
          // alt={record.productName}
          style={{ width: "100px", height: "100px" }}
        />
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      width: "15%",
      render: (p) => (`$ ${p}`),
      sorter: {
        compare: (a, b) => a.price - b.price,
      },
    },
    {
      title: "Stock Number",
      dataIndex: "stock",
      width: "18%",
      sorter: {
        compare: (a, b) => a.stock - b.stock,
      },
    },
    // {
    //   title: "Sales",
    //   dataIndex: "saleNumber",
    //   width: "5%",
    // },

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

          <Button style={{ color: "red" }} icon={<DeleteOutlined />} onClick={()=>deleteProducts(record.productId)}/>
        </div>
      ),
    },
  ];
  useEffect(() => {
    getProducts()
    console.log("tiggger>>")
  }, []);
  return (
    <Content
      style={{
        padding: '0 0px',
      }}
    >
      <div
        style={{
          padding: 24,
          minHeight: 380,
        }}
      >
        <Modal
          destroyOnClose={true}
          title={createProd ? "Add Product" : "Edit Product"}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          width={300}
          footer={null}
          afterClose={getProducts}
        >
          {createProd ?
            <ProductDetails onSuccess={handleCancel} product={singleProduct} create={true}/> :
            <ProductDetails onSuccess={handleCancel} product={singleProduct} create={false}/>
            }
        </Modal>
        <Row gutter={8} justify={"start"} style={{
          backgroundColor: "lightgrey",
          flex: "row", justifyContent: "center", alignItems: "center"
        }}>
          <Col span={8}>
            <AutoComplete
              options={options}
              onChange={handleChange}
              style={{
                width: 200,
                margin: 15
              }}
            >
              <Input.Search allowClear size="large" placeholder="input productId" onSearch={handleSearch} />
            </AutoComplete>
          </Col>
          <Col span={8}>
            <AutoComplete
              options={productNameOptions}
              onChange={handleProductNameChange}
              style={{
                width: 200,
                margin: 15,
              }}

            >
              <Input.Search allowClear size="large" placeholder="input productName" onSearch={handleProductSearch} />
            </AutoComplete>
          </Col>
          <Col span={8}>
            <Button size={"large"} icon={<AppstoreAddOutlined />} type={"primary"}
              onClick={() => {
                setCreateProd(true)
                showModal(emptyProductData
                )
              }}
              style={{
                width: 200,
                margin: 15,
                marginTop: 22
              }}>
              Add product
            </Button>
          </Col>
        </Row>

        <Table columns={columns} dataSource={[...products]}
          loading={isLoading}
          size="middle"
          pagination={{ pageSize: 5 }}
          scroll={{
            x: 1000,
          }}
        />
      </div>
    </Content>


  )
}

const itemsTab = [
  {
      key: '1',
      label: 'Products',
      children: <ProductCRUDTable/>,
      icon: <ProductOutlined />
  },
  {
      key: '2',
      label: 'Orders',
      children: <HistoryTableForAdmin/>,
      icon: <HistoryOutlined />
  },
]



const ProductTable = () =>{
  return (
    <>
      <Card
        style={{
          width: '100%',
        }}
        title="Admin Backend management system"
        tabList={itemsTab}
      />
    </>
  );
}

export default ProductTable;
