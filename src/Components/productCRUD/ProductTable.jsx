import React, { useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Table,
  Typography,
  Button,
} from "antd";
const originData = [
  {
    productID: "123",
    productName: "Meadows Home 3摺式抹手紙 250PC",
    price: "$123",
    stockNum: "123",
    saleNumber: "123",
    productImage:
      "https://img1.rtacdn-os.com/20240301/76d845f3-04c4-3775-a0d1-2e3dd2c3bfdc_360x360H.webp",
    category: "houseHold",
  },
  {
    productID: "223",
    productName: "Meadows Home 3摺式抹手紙 250PC",
    price: "$223",
    stockNum: "223",
    saleNumber: "223",
    productImage:
      "https://img1.rtacdn-os.com/20240301/76d845f3-04c4-3775-a0d1-2e3dd2c3bfdc_360x360H.webp",
    category: "houseHold",
  },
  {
    productID: "122",
    productName: "Meadows Home 3摺式抹手紙 250PC",
    price: "$223",
    stockNum: "223",
    saleNumber: "1333",
    productImage:
      "https://img1.rtacdn-os.com/20240301/76d845f3-04c4-3775-a0d1-2e3dd2c3bfdc_360x360H.webp",
    category: "houseHold",
  },
];
// for (let i = 0; i < 100; i++) {
//   originData.push({
//     key: i.toString(),
//     name: `Edward ${i}`,
//     age: 32,
//     address: `London Park no. ${i}`,
//   });
// }

// originData.push({
//   productID: "123",
//   productName: "James",
//   price: "123",
//   stockNum: "123",
//   saleNumber: "123",
// });
const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
const ProductTable = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record) => record.key === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      name: "",
      age: "",
      address: "",
      ...record,
    });
    setEditingKey(record.key);
  };
  const cancel = () => {
    setEditingKey("");
  };
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };
  const columns = [
    {
      title: "Product ID",
      dataIndex: "productID",
      width: "5%",
      editable: true,
    },

    {
      title: "Product Name",
      dataIndex: "productName",
      width: "20%",
      editable: true,
    },

    {
      title: "Image",
      dataIndex: "productImage",
      width: "10%",
      editable: true,
      render: (text, record) => (
        <img
          src={record.productImage}
          alt={record.productName}
          style={{ width: "100px", height: "100px" }}
        />
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      width: "15%",
      editable: true,
    },
    {
      title: "Stock Number",
      dataIndex: "stockNum",
      width: "5%",
      editable: true,
    },
    {
      title: "Sales",
      dataIndex: "saleNumber",
      width: "5%",
      editable: true,
    },
    {
      title: "Category",
      dataIndex: "category",
      width: "20%",
      editable: true,
    },
    {
      title: "Operation",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            Edit
          </Typography.Link>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const handleAdd = () => {
    const newData = {
      productID: "123",
      productName: "Meadows Home 3摺式抹手紙 250PC",
      price: "$123",
      stockNum: "123",
      saleNumber: "123",
      productImage:
        "https://img1.rtacdn-os.com/20240301/76d845f3-04c4-3775-a0d1-2e3dd2c3bfdc_360x360H.webp",
      category: "houseHold",
    };
    setData([...data, newData]);
  };
  return (
    <Form form={form} component={false}>
      <Button
        onClick={handleAdd}
        type="primary"
        style={{
          marginBottom: 16,
        }}
      >
        Add a row
      </Button>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
      />
    </Form>
  );
};
export default ProductTable;
