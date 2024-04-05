import React, { useEffect, useState } from "react";
import { Card, Divider, Button, message, Spin } from "antd";
import axios from "axios";
import ProductItem from "../Components/cart/productItem";

const API_URL = process.env.REACT_APP_API_URL;

const Cart = () => {
  // return <Checkbox>Checkbox</Checkbox>;
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState();
  const [messageApi, contextHolder] = message.useMessage();

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

      axios
        .post(`${API_URL}/getCart`, { id: userID })
        .then((resp) => {
          let data = resp.data;
          let cart = data.cart;
          console.log("cart", typeof cart);
          // console.log("cart", cart.length);
          if (cart == undefined) {
            setIsLoading(false);
          } else {
            console.log("cart in else:", cart);
            setCartItems(cart);
            setIsLoading(false);
          }
        })
        .catch((error) => {
          console.log("err>>", error);
        });
      console.log("cartItems:", cartItems);
      console.log(typeof cartItems);
    };

    fetchData();
  }, []);

  const savebutton = () => {
    console.log("item saved", cartItems);
    console.log("userId", userId);
    const success = () => {
      messageApi.open({
        type: "success",
        content: "Cart saved",
      });
    };
    const error = () => {
      messageApi.open({
        type: "error",
        content: "Cart cannot saved",
      });
    };
    const warning = () => {
      messageApi.open({
        type: "warning",
        content: "out of stock",
      });
    };
    axios
      .post(`${API_URL}/saveCart`, { cartUpdate: cartItems, userId: userId })
      .then((resp) => {
        console.log("resp", resp.data);
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
  };

  const submitOrder = () => {
    console.log("item saved", cartItems);
    console.log("userId", userId);
    const success = () => {
      messageApi.open({
        type: "success",
        content: "Order submited",
      });
    };
    const error = () => {
      messageApi.open({
        type: "error",
        content: "order cannot be sent",
      });
    };
    const warning = (message) => {
      messageApi.open({
        type: "warning",
        content: message,
      });
    };
    if (cartItems != undefined && cartItems.length != 0 && userId) {
      axios
        .post(`${API_URL}/orderSubmit`, { order: cartItems, userId: userId })
        .then((resp) => {
          console.log("resp", resp.data);
          if (resp.status == 200) {
            success();
            setCartItems([]);
          } else if (resp.status == 201) {
            warning(`out of stock: ${resp.data.outOfStock}`);
          }
        })
        .catch((error) => {
          console.log("err>>", error);
          error();
        });
    } else {
      if (cartItems == undefined) {
        warning("empty cart");
      } else if (cartItems.length == 0) {
        warning("empty cart cannot check out");
      } else {
        warning("cannot identify user");
      }
    }
  };
  const updateQuantity = (productId, newQuantity) => {
    console.log(`${productId}:${newQuantity}`);
    setCartItems((prevCartItems) =>
      prevCartItems.map((item) =>
        item.product.productId === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const updateCartAfterDeleting = (newCart) => {
    console.log("updateCartAfterDeleting: newCart", newCart);
    setCartItems(newCart);
    console.log("updateCartAfterDeleting: cartItems ", cartItems);
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
        <div class="w-full h-screen overflow-y-auto">
          {contextHolder}
          <Card title="Cart">
            {/* <Card type="inner" title="Inner Card title">
          Inner Card content
        </Card> */}
            <Card
              style={{
                marginTop: 16,
                height: "66.666667%",
              }}
              type="inner"
              title="ordered items"
            >
              {cartItems.length == 0 ? (
                <>Your cart is empty</>
              ) : (
                cartItems.map((item, index) => (
                  <React.Fragment key={index}>
                    <ProductItem
                      product={{
                        image: item.product.imgSrc,
                        nameProduct: item.product.productName,
                        productId: item.product.productId,
                        numbers: item.quantity,
                        price: item.product.price,
                      }}
                      userId={userId}
                      updateQuantity={updateQuantity}
                      updateCartAfterDeleting={updateCartAfterDeleting}
                    />
                    {index < cartItems.length - 1 && <Divider />}
                  </React.Fragment>
                ))
              )}
            </Card>

            <Button
              type="primary"
              style={{ marginTop: "15px" }}
              onClick={savebutton}
            >
              save
            </Button>
            <Button
              danger
              style={{ "margin-top": "15px", "margin-left": "10px" }}
              onClick={submitOrder}
            >
              Check Out
            </Button>
          </Card>
        </div>
      )}
    </>
  );
};

export default Cart;
