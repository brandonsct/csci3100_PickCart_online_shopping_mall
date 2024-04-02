import React, { Component, useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Tooltip, Collapse, Space, Modal } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import UserDetails from "../Components/profiledetails";
const moment = require('moment');
const API_URL = process.env.REACT_APP_API_URL;

const UserCRUD = () => {
  const [userList, setUserList] = useState([]);
  const [singleUser, setSingleUser] = useState({});

  const loadUserList = () => {
    axios
      .get(`${API_URL}/admin/user`)
      .then((response) => {
        setUserList(response.data);
        // console.log("userList>>", userList)
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = (record) => {
    setSingleUser(record);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: "100px",
      textWrap: 'word-break',
      ellipsis: true,
      fixed: 'left',
      render: (id) => (
        <Tooltip placement="topLeft" title={id}>
          {id}
        </Tooltip>
      ),
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      fixed: 'left',
      width: "100px",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "250px",
    },
    {
      title: "FirstName",
      dataIndex: "firstname",
      key: "firstname",
    },
    {
      title: "LastName",
      dataIndex: "lastname",
      key: "lastname",
    },
    {
      title: "Birthday",
      dataIndex: "birthday",
      key: "birthday",
      render: (birthday) => moment(birthday).format('YYYY-MM-DD'),
    },
    {
      title: "Action",
      key: "action",
      fixed: 'right',
      render: (_, record) => (
        <div style={{justifyContent: "center", alignItems: "center", display: "flex"}}>
          <Button
            onClick={() => showModal(record)}
            style={{ color: "blue" }}
            icon={<EditOutlined />}
          />

          <Button style={{ color: "red" }} icon={<DeleteOutlined />} />
        </div>
      ),
    },
  ];
  useEffect(() => {
    loadUserList();
  }, [handleCancel, isModalOpen, showModal]);
  return (

    <div
      className="overflow-x-auto w-full m-6"
    >
      <Modal
        destroyOnClose={true}
        title="Edit User"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={300}
        footer={null}
      >
        <UserDetails onSuccess={handleCancel} user={singleUser} />
      </Modal>
      <Table columns={columns} dataSource={userList}
        size="middle"
        style={{ 
          backgroundColor: "black",
        }}
        scroll={{
          x: 1000,
        }}
      />
    </div>
  );
};

export default UserCRUD;
