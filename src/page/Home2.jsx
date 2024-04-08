import React, { useState, useEffect } from "react";
import axios from "axios";
import { Spin, Pagination } from "antd";

import { useNavigate, useLocation } from "react-router-dom";
import {
  Input,
  Layout,
  Image,
  Button,
  theme,
  Card,
  List,
  message,
  Carousel,
  AutoComplete,
  Row,
  Col,
  Divider,
  Space,
  Avatar,
  Select,
  InputNumber,
} from "antd";

import { AppstoreOutlined, ShoppingCartOutlined, UndoOutlined } from "@ant-design/icons";

import Filter from "../Components/filter/Filter";

import appIconPhoto from "../asset/icon.png";

const API_URL = process.env.REACT_APP_API_URL;

const { Content, Header } = Layout;
const { Search } = Input;

const contentStyle = {
  height: '160px',
  width: "auto",
  color: '#fff',
  lineHeight: '160px',
  background: '#364d79',
  margin: "0 auto",
};

const Home2 = ({ test }) => {
  // console.log("test>>", test);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();
  const [openFilter, setOpenFilter] = useState("false");

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [messageApi, contextHolder] = message.useMessage();
  const [options, setOptions] = useState([]);
  const [productNameOptions, setProductNameOptions] = useState([]);
  const [masterProduct, setMasterProduct] = useState([])
  const [lowerPrice, setLowerPrice] = useState(0)
  const [upperPrice, setUpperPrice] = useState(200)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      console.log("loading products");
      const response = await axios.get(`${API_URL}/getAllProducts`);
      console.log("resp", response);
      setProducts(response.data);
      setMasterProduct(response.data)
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setIsLoading(false);
    }
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
  const handleSearch = (value) => {
    if (value === "" || value === null || value === undefined) return fetchData()
    setProducts([...products.filter((product) => product.productId.toLowerCase().startsWith(value.toLowerCase()))]);
    console.log("val>>", value)
    console.log("filterID>", products.filter((product) => product.productId.startsWith(value)))
  };
  const handleProductSearch = (value) => {
    if (value === "" || value === null || value === undefined) return fetchData()
    setProducts([...products.filter((product) => product.productName.toLowerCase().startsWith(value.toLowerCase()))]);
    console.log("val>>", value)
    console.log("filterNAME>", products.filter((product) => product.productName.toLowerCase().startsWith(value.toLowerCase())))
  };
  const handdleCategoryClick = async (categories) => {
    setIsLoading(true)
    await fetchData()
    setProducts([...masterProduct.filter((product) => product.category.toLowerCase().startsWith(categories.toLowerCase()))]);
    setIsLoading(false)
  }
  const handleSelectChange = (value) =>{
    if (value === "asc"){
      const sortedProducts = products.sort(
        (a, b) => a.price - b.price
      );
      setProducts([...sortedProducts]);
    }
    else if  (value === "desc"){
      const sortedProducts = products.sort(
        (a, b) => b.price - a.price
      );
      setProducts([...sortedProducts]);
    }
    else if  (value === "ascStock"){
      const sortedProducts = products.sort(
        (a, b) => a.stock - b.stock
      );
      setProducts([...sortedProducts]);
    }
    else {
      const sortedProducts = products.sort(
        (a, b) => b.stock - a.stock
      );
      setProducts([...sortedProducts]);
    }
    
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        console.log("loading products");
        const response = await axios.get(`${API_URL}/getAllProducts`);
        console.log("resp", response);
        setProducts(response.data);
        setMasterProduct(response.data)
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const updateProducts = (newProducts) => {
    console.log("newProducts:", newProducts);
    setProducts(newProducts.data);
  };

  const handleLowerChange = (price) => {
    if (price === null || price === "" || typeof price !== 'number') {
      setLowerPrice(0);
      setProducts([...masterProduct]);
    } else {
      setLowerPrice(price);
      const filteredProducts = masterProduct.filter(
        (product) =>
          product.price >= price &&
          product.price <= upperPrice
      );
      setProducts([...filteredProducts]);
    }
  }
  
  const handleUpperChange = (price) => {
    if (price === null || price === "" || typeof price !== 'number') {
      setUpperPrice(1000);
      setProducts([...masterProduct]);
    } else {
      setUpperPrice(price);
      const filteredProducts = masterProduct.filter(
        (product) =>
          product.price >= lowerPrice &&
          product.price <= price
      );
      setProducts([...filteredProducts]);
    }
  }

  const addToCart = async (item) => {
    console.log("ID:", item.productId);
    const username = JSON.parse(sessionStorage.getItem("username"))?.value;
    console.log("username:", username);
    console.log("condition:", username !== undefined);

    if (username !== undefined && username !== "") {
      const getUserDetails = async () => {
        let response;
        await axios
          .post(`${API_URL}/getuser`, { username })
          .then((resp) => {
            // setUserDetails(resp.data);
            response = resp.data;
          })
          .catch((error) => {
            console.log("err>>", error);
          });
        return response;
      };
      let userDetailFromServer = await getUserDetails();
      console.log("getUserDetails:", userDetailFromServer);
      const success = () => {
        messageApi.open({
          type: "success",
          content: "Product added to cart",
        });
      };
      const error = () => {
        messageApi.open({
          type: "error",
          content: "This is an error message",
        });
      };
      const warning = () => {
        messageApi.open({
          type: "warning",
          content: "out of stock",
        });
      };
      axios
        .post(`${API_URL}/addToCart`, {
          userDetail: userDetailFromServer,
          product: item,
        })
        .then((resp) => {
          if (resp.status == 200) {
            success();
          } else if (resp.status == 204) {
            warning();
          }
        })
        .catch((error) => {
          console.log("err>>", error);
          error();
        });
    } else {
      const warning = () => {
        messageApi.open({
          type: "warning",
          content: " please login",
        });
      };
      warning();
    }
  };

  return (
    <>
      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100vh",
          }}
        >
          <Spin />
        </div>
      ) : (
        <Layout style={{ "overflow-x": "hidden", "overflow-y": "scroll" }}>
          <Header
            style={{
              height: "auto",
              overflow: 'auto',
              backgroundColor: "lightgrey",
              borderRadius: "10px",
            }}
          >
            <Row gutter={4} justify={"start"} align="middle">
              <Col span={4}>
                <Image width={80} height={80} src={appIconPhoto} />
              </Col>
              <Col span={8}>
                <AutoComplete
                  options={options}
                  onChange={handleChange}
                  style={{
                    width: 250,
                  }}
                >
                  <Input.Search allowClear placeholder="Search for product ID"
                    onSearch={handleSearch}
                  />
                </AutoComplete>
              </Col>
              <Col span={8}>
                <AutoComplete
                  options={productNameOptions}
                  onChange={handleProductNameChange}
                  style={{
                    width: 270,
                  }}

                >
                  <Input.Search allowClear placeholder="Search for product name"
                    onSearch={handleProductSearch}
                  />
                </AutoComplete>
              </Col>
              <Col span={4} style={{ textAlign: "right" }}>
                <Button style={{ backgroundColor: "transparent" }} icon={<ShoppingCartOutlined />} onClick={() => navigate("/cart")} />
              </Col>
            </Row>
          </Header>
          <Carousel autoplay style={{ margin: 5 }}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <img style={contentStyle} src={"https://img1.rtacdn-os.com/dshop/202403/85eafc47-97f0-41d5-997f-917403f92d4f_.webp"} />
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <img style={contentStyle} src={"https://img2.rtacdn-os.com/dshop/202404/977ffd9f-e005-4c0e-a028-d99f89e91d18_.webp"} />
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <img style={contentStyle} src={"https://img2.rtacdn-os.com/dshop/202404/75ce002c-4168-4e77-9e4c-1e288948b5ba_.webp"} />
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <img style={contentStyle} src={"https://img2.rtacdn-os.com/dshop/202404/f02de6c1-6fa1-4d64-8404-542347ac5cac_.webp"} />
            </div>
          </Carousel>
          <div
            style={{
              backgroundColor: "#FFFFF7",
              borderRadius: "10px",
              display: "flex",
              justifyContent: "center",
              margin: 10
            }}
          >
            <Space style={{ height: 'auto' }} split={<Divider type="vertical" />}>
              <div style={{ flex: "col" }}>
                <Button shape="circle" style={{ margin: 5, backgroundColor: "transparent", border: "None" }}
                  onClick={() => handdleCategoryClick("HouseHoldSupply")}
                >
                  <Avatar src="https://img.rtacdn-os.com/dshop/202403/78e98de8-7103-48f0-98fb-55cac8638051_.webp" style={{ width: '100%', height: '100%' }} />
                </Button>
                HouseHold Supplies
              </div>
              <div style={{ flex: "col" }}>
                <Button shape="circle" style={{ margin: 5, backgroundColor: "transparent", border: "None" }}
                  onClick={() => handdleCategoryClick("MeatNSeafood")}
                >
                  <Avatar src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIa1gGa7EAjXfBUDwHkglH4UjxcLHv4JYDvhuvmUYWqA&s" style={{ width: '100%', height: '100%' }} />
                </Button>
                MeatNSeafood
              </div>
              <div style={{ flex: "col" }}>
                <Button shape="circle" style={{ margin: 5, backgroundColor: "transparent", border: "None" }}
                  onClick={() => handdleCategoryClick("DairyChilledEggs")}
                >
                  <Avatar src="https://img2.rtacdn-os.com/dshop/202403/f6732131-1244-4f31-9334-3cd3a55b6eb9_.webp" style={{ width: '100%', height: '100%' }} />
                </Button>
                DairyChilledEggs
              </div>
              <div style={{ flex: "col" }}>
                <Button shape="circle" style={{ margin: 5, backgroundColor: "transparent", border: "None" }}
                  onClick={() => handdleCategoryClick("BreakfastNBakery")}
                >
                  <Avatar src="https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-bakery-icon-for-your-project-png-image_1541423.jpg" style={{ width: '100%', height: '100%' }} />
                </Button>
                BreakfastNBakery
              </div>
              <div style={{ flex: "col" }}>
                <Button shape="circle" icon={<UndoOutlined />} style={{ margin: 5, backgroundColor: "transparent", border: "None" }}
                  onClick={fetchData}
                />
                Undo
              </div>

            </Space>
          </div>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {contextHolder}
            <div
              style={{
                backgroundColor: "#FFFFF7",
                borderRadius: "10px",
                display: "flex",
                justifyContent: "center",
                // margin: 10
              }}
            >
              <Space>
                <Space.Compact block>
                  <InputNumber style={{
                      width: 200,
                    }}
                    defaultValue={0}
                    placeholder="lower price range" addonAfter="$" 
                    onChange={(value)=>handleLowerChange(value)}
                    />
                  <InputNumber style={{
                      width: 200,
                    }}
                    defaultValue={1000}
                    placeholder="upper price range" addonAfter="$" 
                    onChange={(value)=>handleUpperChange(value)}
                    />
                  <Select
                    placeholder={"Smart Sort"}
                    style={{
                      width: 200,
                    }}
                    onChange={handleSelectChange}
                    options={[
                      {
                        value: 'asc',
                        label: 'sort price ascending',
                      },
                      {
                        value: 'desc',
                        label: 'sort price descending',
                      },
                      {
                        value: 'ascStock',
                        label: 'sort stock ascending',
                      },
                      {
                        value: 'descStock',
                        label: 'sort stock descending',
                      },
                    ]}
                  />
                </Space.Compact>
              </Space>
            </div>
            {/* <div class="flex items-stretch w-full justify-center">
              <div class="justify-items-start grid border-2 border-gray-800 h-10 items-stretch w-full bg-red-100 rounded">
                <Button
                  type="secondary"
                  class=" pl-1 align text-black"
                  ghost
                  onClick={() => setOpenFilter(!openFilter)}
                >
                  <div class="flex flex-row ">
                    <AppstoreOutlined style={{ fontSize: "30px" }} />
                    <div class=" align-bottom text-lg ml-2">Search box</div>
                  </div>
                </Button>
              </div>
            </div> */}

            {/* {!openFilter && <Filter updateProducts={updateProducts} />}
            <div
              class={`transition-transform duration-500 ease-in-out transform ${
                openFilter ? "translate-y-full" : "translate-y-0"
              } `}
            > */}
            {/* {!openFilter && <Filter updateProducts={updateProducts} />} */}
            {/* </div> */}
            <List
              grid={{
                gutter: 16,
                xs: 1,
                sm: 2,
                md: 4,
                lg: 4,
                xl: 5,
                xxl: 6,
              }}
              dataSource={paginatedProducts}
              renderItem={(item) => (
                <List.Item>
                  <Card title={item.productName}>
                    <img
                      style={{ width: "100%", height: "auto" }}
                      src={item.imgSrc}
                      alt={item.productName}
                    />
                    <p>$ {item.price}</p>
                    <p> Stock: {item.stock}</p>
                    <p>Description: {item.productName}</p>
                    <Button
                      onClick={() => {
                        addToCart(item);
                      }}
                    >
                      Add to Cart
                    </Button>
                    <p class="text-stone-500 text-xs">
                      Product ID: {item.productId}
                    </p>
                  </Card>
                </List.Item>
              )}
              style={{ "margin-top": "20px" }}
            />
            <Pagination
              defaultCurrent={1}
              total={products.length}
              onChange={handlePageChange}
              onShowSizeChange={(current, size) => setItemsPerPage(size)}
              style={{
                "max-width": "fit-content",
                "margin-left": "auto",
                "margin-right": "auto",
              }}
            />
          </Content>
        </Layout>
      )}
    </>
  );
};

export default Home2;
