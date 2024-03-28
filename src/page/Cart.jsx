import React, { useState } from "react";
import { Card, Divider, Button } from "antd";
import ProductItem from "../Components/cart/productItem";
const Cart = () => {
  // return <Checkbox>Checkbox</Checkbox>;

  return (
    <div class="w-full h-screen overflow-y-auto">
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
          <ProductItem
            product={{
              image:
                "https://img2.rtacdn-os.com/20230413/c24a19d7-2122-45d5-a726-0d86e498a6a2_360x360H.webp",
              nameProduct: "Meadows Home卡通軟抽面紙(細 5PK)",
              productId: "123456",
              numbers: "2",
              price: "123",
            }}
          />
          <Divider></Divider>
          <ProductItem
            product={{
              image:
                "https://img2.rtacdn-os.com/20230413/c24a19d7-2122-45d5-a726-0d86e498a6a2_360x360H.webp",
              nameProduct: "Meadows Home卡通軟抽面紙(細 5PK)",
              productId: "123456",
              numbers: "2",
              price: "123",
            }}
          />
          <Divider></Divider>
          <ProductItem
            product={{
              image:
                "https://img2.rtacdn-os.com/20230413/c24a19d7-2122-45d5-a726-0d86e498a6a2_360x360H.webp",
              nameProduct: "Meadows Home卡通軟抽面紙(細 5PK)",
              productId: "123456",
              numbers: "2",
              price: "123",
            }}
          />
        </Card>
        <Button danger> Check Out</Button>
      </Card>
    </div>
  );
};

export default Cart;
