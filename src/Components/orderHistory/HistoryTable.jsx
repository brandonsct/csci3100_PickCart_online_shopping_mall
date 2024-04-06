import React from "react";
import { Space, Table, Tag, Card } from "antd";
const columns = [
  {
    title: "OrderID",
    dataIndex: "OrderID",
    key: "OrderID",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Number Of Product",
    dataIndex: "NumProduct",
    key: "NumProduct",
  },
  {
    title: "Delievery Method",
    dataIndex: "DelieveryMethod",
    key: "DelieveryMethod",
  },
  {
    title: "Price",
    key: "Price",
    dataIndex: "Price",

    // render: (_, { tags }) => (
    //   <>
    //     {tags.map((tag) => {
    //       let color = tag.length > 5 ? "geekblue" : "green";
    //       if (tag === "loser") {
    //         color = "volcano";
    //       }
    //       return (
    //         <Tag color={color} key={tag}>
    //           {tag.toUpperCase()}
    //         </Tag>
    //       );
    //     })}
    //   </>
    // ),
  },
  {
    title: "Order Date",
    dataIndex: "OrderDate",
    key: "OrderDate",
  },
  {
    title: "Complete Date",
    dataIndex: "CompleteDate",
    key: "CompleteDate",
  },
  {
    title: "Product Detail",
    dataIndex: "product",
    key: "ProductDetail",
    render: (products) =>
      products.map((product) => (
        <Card
          // title="Card title"
          bordered={false}
          style={{
            width: 300,
          }}
        >
          <div className="flex flex-row justify-around w-full">
            <img src={product.image} className="w-10 h-10"></img>
            <p>{product.name}</p>
          </div>
        </Card>
      )),
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <a>Refund </a>
        <a>Reorder</a>
      </Space>
    ),
  },
];
const data = [
  {
    OrderID: "1124",
    NumProduct: "3",
    Price: "$702",
    DelieveryMethod: "delivery",
    OrderDate: "1-2-2023",
    CompleteDate: "10-2-2023",
    product: [
      {
        image:
          "https://img.rtacdn-os.com/20230906/6f6cb414-b5e0-3004-b7af-d03222bb948f_360x360H.webp",
        name: "Meadows Home軟抽面紙(大) 4PK",
      },
      {
        image:
          "https://img.rtacdn-os.com/20230906/6f6cb414-b5e0-3004-b7af-d03222bb948f_360x360H.webp",
        name: "Meadows Home軟抽面紙(大) 4PK",
      },
      {
        image:
          "https://img.rtacdn-os.com/20230906/6f6cb414-b5e0-3004-b7af-d03222bb948f_360x360H.webp",
        name: "Meadows Home軟抽面紙(大) 4PK",
      },
    ],
  },
  {
    OrderID: "1125",
    NumProduct: "1",
    Price: "$234",
    DelieveryMethod: "delivery",
    OrderDate: "1-2-2023",
    CompleteDate: "10-2-2023",
    product: [
      {
        image:
          "https://img.rtacdn-os.com/20230906/6f6cb414-b5e0-3004-b7af-d03222bb948f_360x360H.webp",
        name: "Meadows Home軟抽面紙(大) 4PK",
      },
    ],
  },
  {
    OrderID: "1126",
    NumProduct: "1",
    Price: "$234",
    DelieveryMethod: "delivery",
    OrderDate: "1-2-2023",
    CompleteDate: "10-2-2023",
    product: [
      {
        image:
          "https://img.rtacdn-os.com/20230906/6f6cb414-b5e0-3004-b7af-d03222bb948f_360x360H.webp",
        name: "Meadows Home軟抽面紙(大) 4PK",
      },
    ],
  },
];
const App = () => {
  return <Table columns={columns} dataSource={data} />;
};
export default App;
