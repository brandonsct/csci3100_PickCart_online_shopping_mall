import React, { useState, useEffect } from "react";
import axios from "axios";
import { Spin, Pagination } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Input,
  Layout,
  Collapse,
  Menu,
  Image,
  Button,
  theme,
  Card,
  List,
  Row,
  Col,
} from "antd";

import { AppstoreOutlined } from "@ant-design/icons";

import Filter from "../Components/filter/Filter";

import appIconPhoto from "../asset/icon.png";
import { ReactComponent as LogoSidebar } from "../asset/icon/login_logo.svg";

const { Panel } = Collapse;
const API_URL = process.env.REACT_APP_API_URL;

// const productPhotoPath = "../asset/productInfo";
// const data = [
//   {
//     title: "Title 1",
//     // cardDetail: `${productPhotoPath}/rice.jpeg`,
//   },
//   {
//     title: "Title 2",
//     // cardDetail: `${productPhotoPath}/rice.jpeg`,
//   },
//   {
//     title: "Title 3",
//     // cardDetail: `${productPhotoPath}/rice.jpeg`,
//   },
//   {
//     title: "Title 4",
//     // cardDetail: `${productPhotoPath}/rice.jpeg`,
//   },
//   {
//     title: "Title 5",
//     // cardDetail: `${productPhotoPath}/rice.jpeg`,
//   },
//   {
//     title: "Title 6",
//     // cardDetail: `${productPhotoPath}/rice.jpeg`,
//   },
//   {
//     title: "Title 1",
//     // cardDetail: `${productPhotoPath}/rice.jpeg`,
//   },
//   {
//     title: "Title 2",
//     // cardDetail: `${productPhotoPath}/rice.jpeg`,
//   },
//   {
//     title: "Title 3",
//     // cardDetail: `${productPhotoPath}/rice.jpeg`,
//   },
//   {
//     title: "Title 4",
//     // cardDetail: `${productPhotoPath}/rice.jpeg`,
//   },
//   {
//     title: "Title 5",
//     // cardDetail: `${productPhotoPath}/rice.jpeg`,
//   },
//   {
//     title: "Title 6",
//     // cardDetail: `${productPhotoPath}/rice.jpeg`,
//   },
//   {
//     title: "Title 1",
//     // cardDetail: `${productPhotoPath}/rice.jpeg`,
//   },
//   {
//     title: "Title 2",
//     // cardDetail: `${productPhotoPath}/rice.jpeg`,
//   },
//   {
//     title: "Title 3",
//     // cardDetail: `${productPhotoPath}/rice.jpeg`,
//   },
//   {
//     title: "Title 4",
//     // cardDetail: `${productPhotoPath}/rice.jpeg`,
//   },
//   {
//     title: "Title 5",
//     // cardDetail: `${productPhotoPath}/rice.jpeg`,
//   },
//   {
//     title: "Title 6",
//     // cardDetail: `${productPhotoPath}/rice.jpeg`,
//   },
// ];

const { Header, Sider, Content } = Layout;
const { Search } = Input;

const Home2 = ({ test }) => {
  console.log("test>>", test);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();
  const [openFilter, setOpenFilter] = useState("false");

  const logOut = () => {
    axios({
      method: "DELETE",
      url: `${API_URL}/logout`,
      withCredentials: true,
    })
      .then((res) => {
        if (res.status === 200) {
          console.log("Logged out");
          sessionStorage.clear();
          navigate("/login");
        }
      })

      .catch((err) => {
        return navigate("/login");
      });
  };

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
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
  }, []);

  const onSearch = (value, _e, info) => {
    console.log(info?.source, value);
    console.log("value:", value);
    axios({
      method: "POST",
      data: {
        id: value,
        name: value,
      },
      url: `${API_URL}/getProducts`,
    })
      .then((response) => {
        setProducts(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setIsLoading(false);
      });
  };

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

  const addToCart = (item) => {
    console.log("ID:", item.productId);
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
          {/* <Header
              style={{
                padding: 0,
                background: colorBgContainer,
              }}
            ></Header> */}
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <div class="flex flex-row w-screen text-center items-center justify-around">
              <div
                // class="flex items-center"
                style={{
                  "max-width": "fit-content",
                  "margin-left": "auto",
                  "margin-right": "auto",
                }}
              >
                <Image width={100} height={100} src={appIconPhoto} />
                <Search
                  placeholder="input search text"
                  onSearch={onSearch}
                  style={{ width: 300, height: 100, "padding-top": "30px" }}
                />
              </div>
            </div>
            <div class="flex items-stretch w-full justify-center">
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
            </div>

            {/* {!openFilter && <Filter updateProducts={updateProducts} />}
            <div
              class={`transition-transform duration-500 ease-in-out transform ${
                openFilter ? "translate-y-full" : "translate-y-0"
              } `}
            > */}
            {!openFilter && <Filter updateProducts={updateProducts} />}
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
