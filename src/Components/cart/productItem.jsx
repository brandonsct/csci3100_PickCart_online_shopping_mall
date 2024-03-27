import React, { useState } from "react";
import { Checkbox } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { Button, Divider, Flex, Radio } from "antd";
import ButtonNum from "./Button";
const ProductItem = ({ product }) => {
  const [loadings, setLoadings] = useState([]);
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
  return (
    <div class="flex flex-row justify-between">
      <div class="flex flex-row">
        <Checkbox />
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
          onClick={() => enterLoading(0)}
        />

        <ButtonNum
          style={{ "margin-left": "0.25rem", "margin-right": "0.25rem" }}
        />
        <div class="mx-6">$246</div>
      </div>
    </div>
  );
};

export default ProductItem;
