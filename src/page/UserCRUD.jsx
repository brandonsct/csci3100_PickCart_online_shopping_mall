import React, { Component, useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Input, Collapse, Space, Modal } from "antd";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import UserDetails from "../Components/Profiledetails"

const API_URL = process.env.REACT_APP_API_URL;

const UserCRUD = () => {
  const [userList, setUserList] = useState([])
  const [singleUser, setSingleUser] = useState({})
  const loadUserList = () => {
    axios.get(`${API_URL}/admin/user`)
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
    setSingleUser(record)
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
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Username',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Birthday',
      dataIndex: 'birthday',
      key: 'birthday',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <>
          <Button onClick={() => showModal(record)} style={{ color: "blue" }} icon={<EditOutlined />} />
          
          <Button style={{ color: "red" }} icon={<DeleteOutlined />} />
        </>
      ),
    },
  ];
  useEffect(()=>{
    loadUserList()
  }, [])
  return (
    <div className="overflow-x-auto w-full m-6">
      <Modal destroyOnClose={true} title="Edit User" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} width={300}>
            <UserDetails onSuccess={handleCancel} user={singleUser} />
      </Modal>
      <Table columns={columns} dataSource={userList} />
    </div>
  );
};

export default UserCRUD;
