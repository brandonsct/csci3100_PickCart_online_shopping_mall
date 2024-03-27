import React from "react";
import { SmileOutlined } from "@ant-design/icons";
import { Timeline } from "antd";
const OrderStatus = () => (
  <div class="grid grid-cols-2 gap-4 w-full m-6">
    <Timeline
      items={[
        {
          color: "blue",
          children: "Create a services site 2015-09-01",
        },
        {
          color: "green",
          children: "Create a services site 2015-09-01",
        },
        {
          color: "red",
          children: (
            <>
              <p>Solve initial network problems 1</p>
              <p>Solve initial network problems 2</p>
              <p>Solve initial network problems 3 2015-09-01</p>
            </>
          ),
        },
        {
          children: (
            <>
              <p>Technical testing 1</p>
              <p>Technical testing 2</p>
              <p>Technical testing 3 2015-09-01</p>
            </>
          ),
        },
        {
          color: "gray",
          children: (
            <>
              <p>Technical testing 1</p>
              <p>Technical testing 2</p>
              <p>Technical testing 3 2015-09-01</p>
            </>
          ),
        },
        {
          color: "gray",
          children: (
            <>
              <p>Technical testing 1</p>
              <p>Technical testing 2</p>
              <p>Technical testing 3 2015-09-01</p>
            </>
          ),
        },
        {
          color: "#00CCFF",
          dot: <SmileOutlined />,
          children: <p>Custom color testing</p>,
        },
      ]}
    />
    <div class="bg-black"></div>
  </div>
);
export default OrderStatus;
