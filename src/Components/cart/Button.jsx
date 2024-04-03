import React, { useState, useEffect } from "react";
import "./button.css";
import { message } from "antd";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;
const ButtonNum = ({ quantity, updateQuantity, productId }) => {
  const [value, setValue] = useState(quantity);
  const [messageApi, contextHolder] = message.useMessage();

  function decrement() {
    if (value > 0) {
      let newValue = value - 1;
      setValue(newValue);
      updateQuantity(productId, newValue);
    } else {
      console.log("item canceled");
    }
  }
  async function checkStock(productId, quantity) {
    let result = await axios({
      method: "POST",
      data: {
        productId: productId,
        quantity: quantity,
      },
      url: `${API_URL}/checkStock`,
    })
      .then((resp) => {
        console.log("response::::::", resp);

        console.log("message", resp.data.message);
        console.log("success?", resp.data.success);
        return resp.data.success;
      })
      .catch((err) => {
        console.log("error", err);
      });
    return result;
  }

  const warning = () => {
    messageApi.open({
      type: "warning",
      content: "number out of sstock",
    });
  };
  async function increment() {
    const newValue = value + 1;
    console.log("checkStocks", await checkStock(productId, newValue));
    if (await checkStock(productId, newValue)) {
      console.log("correct path");
      setValue(newValue);
      updateQuantity(productId, newValue);
    } else {
      console.log("wrong path");
      console.log("value", value);
      warning();
    }
  }

  useEffect(() => {
    console.log("quantity in num", quantity);
    console.log("productId in num", productId);

    setValue(quantity);
  }, [quantity]);

  return (
    <>
      {contextHolder}
      <div class="custom-number-input h-10 w-32">
        <div class="flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-1">
          <button
            onClick={decrement}
            class="border-0 bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-l cursor-pointer outline-none"
          >
            <span class="m-auto text-2xl font-thin">−</span>
          </button>
          <input
            type="number"
            class="border-0 focus:outline-none text-center w-full bg-gray-300 font-semibold text-md hover:text-black focus:text-black  md:text-basecursor-default flex items-center text-gray-700  outline-none"
            name="custom-input-number"
            value={value}
            readOnly
          />
          <button
            onClick={increment}
            class="border-0 bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-r cursor-pointer"
          >
            <span class="m-auto text-2xl font-thin">+</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default ButtonNum;
