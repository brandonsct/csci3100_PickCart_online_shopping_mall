import React, { Component, useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Tooltip, Collapse, Space, Modal, notification  } from "antd";
import { EditOutlined, StopOutlined, UndoOutlined } from "@ant-design/icons";
import UserDetails from "../Components/profiledetails";
const moment = require('moment');
const API_URL = process.env.REACT_APP_API_URL;

const UserCRUD = () => {
  const [api, contextHolder] = notification.useNotification();
  const [userList, setUserList] = useState([]);
  const [singleUser, setSingleUser] = useState({});
  const [loading, setLoading] =useState(true)

  const openNotification = (user_data) => {
    console.log("user_data.deleted>>", user_data.deleted)
    if (user_data.deleted === "true") {
      return api.open({
      message: 'User Suspended',
      description:
        `You have successfully suspended user with user id ${user_data._id}
        username: ${user_data.username}`,
      duration: 2,
    })
  } else {
    return api.open({
      message: 'User Reverted',
      description:
        `You have successfully reverted user with user id ${user_data._id}
        username: ${user_data.username}`,
      duration: 4,
    })
  }
  };

  const loadUserList = () => {
    axios
      .get(`${API_URL}/admin/user`)
      .then((response) => {
        setUserList(response.data);
        setLoading(false)
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

  const deleteUser = async (record) =>{
    try {
      setLoading(true)
      const delete_user = await axios.put(`${API_URL}/admin/deleteuser`, {record})
      if (delete_user?.status === 200) {
        console.log("delete_user>>", delete_user)
        setLoading(false)
        loadUserList()
        openNotification(delete_user?.data)

      }
      else {
        console.log("err in deleting user>>", delete_user)
        setLoading(false)
      }
    } catch (error) {
      console.log("err in deleting user>>" ,error)
      setLoading(false)
    }
  }
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
      sorter: {
        compare: (a, b) => a.id.localeCompare(b.id),
      },
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      fixed: 'left',
      width: "100px",
      sorter: {
        compare: (a, b) => a.username.localeCompare(b.username),
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "250px",
      sorter: {
        compare: (a, b) => a.email.localeCompare(b.email),
      },
    },
    {
      title: "FirstName",
      dataIndex: "firstname",
      key: "firstname",
      sorter: {
        compare: (a, b) => a.firstname.localeCompare(b.firstname),
      },
    },
    {
      title: "LastName",
      dataIndex: "lastname",
      key: "lastname",
      sorter: {
        compare: (a, b) => a.lastname.localeCompare(b.lastname),
      },
    },
    {
      title: "Birthday",
      dataIndex: "birthday",
      key: "birthday",
      sorter: {
        compare: (a, b) => a.birthday.localeCompare(b.birthday),
      },
      render: (birthday) => moment(birthday).format('YYYY-MM-DD'),
    },
    {
      title: "Action",
      key: "action",
      fixed: 'right',
      render: (_, record) => {
        return (
        <div style={{justifyContent: "center", alignItems: "center", display: "flex"}}>
          <Button
            onClick={() => showModal(record)}
            style={{ color: "blue" }}
            icon={<EditOutlined />}
          />

          {record.deleted === "false" ? <Button style={{ color: "red" }} icon={<StopOutlined />} onClick={()=>deleteUser(record)}/> : 
          <Button style={{ color: "red" }} icon={<UndoOutlined />} onClick={()=>deleteUser(record)}/>
          }
        </div>
      )},
    },
  ];
  useEffect(() => {
    loadUserList();
  }, [handleCancel, isModalOpen, showModal]);
  return (

    <div
      className="overflow-x-auto w-full m-6"
    >
      {contextHolder}
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
        loading={loading}
        size="middle"
        // style={{ 
        //   backgroundColor: "black",
        // }}
        scroll={{
          x: 1000,
        }}
      />
    </div>
  );
};

export default UserCRUD;
