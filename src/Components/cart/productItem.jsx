import React, { useState, useEffect } from "react";
import { Checkbox } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { Button, Divider, Flex, Radio } from "antd";
import ButtonNum from "./Button";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const ProductItem = ({
  product,
  updateQuantity,
  userId,
  updateCartAfterDeleting,
}) => {
  const [loadings, setLoadings] = useState([]);
  const [itemDetail, setItemDetail] = useState();
  const enterLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });
    setTimeout(() => {
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
    }, 1000);
  };

  const deleteButton = () => {
    enterLoading(0);
    console.log("deletebuton is pushhed", product.productId);
    console.log("userId is ", userId);
    let productId = product.productId;
    axios
      .post(`${API_URL}/deleteFromCart`, {
        userId: userId,
        productId: productId,
      })
      .then((resp) => {
        console.log("resp", resp.data);
        if (resp.status == 200) {
          console.log("deleted from cart");
        } else if (resp.status == 204) {
          console.log("cannot delete from cart");
        }
        let newCart = resp.data.cart;

        updateCartAfterDeleting(newCart);
      })
      .catch((error) => {
        console.log("err>>", error);
        error();
      });
  };

  useEffect(() => {
    console.log("product in item", product.productId);
    console.log("product in item", typeof product.productId);
    setItemDetail(product);
  }, []);
  // const quantity = product.number;

  return (
    <div class="flex flex-row justify-between">
      <div class="flex flex-row">
        {/* <Checkbox /> */}
        <img src={product.image} class="w-36"></img>
        <div class="flex flex-col ">
          <div class="">
            <p>{product.nameProduct}</p>
            <p class="text-gray-500 text-sm">product ID: {product.productId}</p>
          </div>
          <p>${product.price}</p>
        </div>
      </div>

      <div class="flex flex-row items-center">
        <Button
          type="primary"
          icon={<DeleteOutlined />}
          size="large"
          danger
          loading={loadings[0]}
          style={{
            top: "5px",
            "margin-left": "0.25rem",
            "margin-right": "0.25rem",
          }}
          // onClick={() => enterLoading(0)}
          onClick={deleteButton}
        />

        <ButtonNum
          style={{ "margin-left": "0.25rem", "margin-right": "0.25rem" }}
          quantity={product.numbers}
          updateQuantity={updateQuantity}
          productId={product.productId}
        />
        <div class="mx-6">$246</div>
      </div>
    </div>
  );
};

export default ProductItem;
