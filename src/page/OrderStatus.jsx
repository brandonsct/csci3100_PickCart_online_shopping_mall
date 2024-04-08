import React, { useEffect, useState } from "react";
import { SmileOutlined } from "@ant-design/icons";
import { Steps, Card, Avatar, Pagination } from "antd";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const OrderStatus = () => {
  const [orderList, setOrderList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 1; // Show one order per page

  const progress = {
    Pending: 0,
    progress: 1,
    delievery: 2,
    waiting: 3,
    complete: 4,
    finished: 5,
  };
  useEffect(() => {
    const username = JSON.parse(sessionStorage.getItem("username"))?.value;
    console.log("username:", username);
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
    const fetchData = async () => {
      let userDetailFromServer = await getUserDetails();
      console.log("userDetailFromServer:", userDetailFromServer);
      console.log("userDetailFromServer:", userDetailFromServer.id);
      let userID = userDetailFromServer.id;
      setUserId(userID);
      setIsLoading(true);

      await axios
        .post(`${API_URL}/retrieveOrder`, { userId: userID })
        .then((response) => {
          console.log("loading products", response.data.orderList);

          setOrderList(response.data.orderList);
        })
        .catch((error) => {
          console.error("Error fetching data: ", error);
        });
      console.log("orderList:", orderList);
      console.log(typeof orderList);
    };

    fetchData();
  }, []);
  //inside a orderList there are many tickets, one ticket means one order submition.
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const orderTicket = orderList.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  return (
    <div class="overflow-y-auto w-full h-full">
      <Card style={{ margin: "30px", width: "100%" }}>
        <div class="flex flex-col justify-between h-full ">
          {orderTicket.map((orderInfo, index) => (
            <div class="grid grid-cols-2 gap-4 w-full m-6 ">
              <Steps
                direction="vertical"
                size="small"
                current={progress[orderInfo.status]}
                items={[
                  {
                    title: "Order recieved",
                    description: "order is recevieved",
                  },
                  {
                    title: "In Progress",
                    description: "order is in progress",
                  },
                  {
                    title: "In deliver",
                    description: "order is in delivery",
                  },
                  {
                    title: "Waiting",
                    description: "order is waiting for pick up",
                  },
                  {
                    title: "Complete",
                    description: "order is picked up and complete",
                  },
                ]}
              />

              <Card title="Products" style={{ "overflow-y": "auto" }}>
                {orderInfo.items.map((productInfo, index) => (
                  <Card key={index} type="inner">
                    <div class="flex flex-row">
                      <img
                        class="w-40 h-40"
                        src={productInfo.product.imgSrc}
                      ></img>
                      <div class="ml-3">
                        <p>product id : {productInfo.product.productId}</p>
                        <p>price: ${productInfo.product.price}</p>
                        <p>count: {productInfo.quantity}</p>
                      </div>
                    </div>
                  </Card>
                ))}
                <div>Total: ${orderInfo.totalPrice}</div>
              </Card>
            </div>
          ))}

          <div class=" flex justify-center mt-10">
            <Pagination
              defaultCurrent={1}
              total={orderList.length}
              pageSize={itemsPerPage}
              onChange={paginate}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};
export default OrderStatus;
