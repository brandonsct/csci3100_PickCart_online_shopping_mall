import React, { Component } from "react";
import axios from "axios";
import { Table, Button, Input, Collapse } from "antd";
import NavBar from "./navbar";
import { withRouter } from "react-router-dom";
import { SignUp } from "./signup";
class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: [],
      editingKey: "",
      editingValues: {},
    };
  }
  componentDidMount() {
    this.LoadUserList();
  }

  LoadUserList() {
    axios({
      url: "http://localhost:8000/admin/user",
      method: "GET",
    })
      .then((r) => {
        this.setState({
          userList: r.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // Edit a user
  editUser = (e) => {
    this.setState({
      editingKey: e.id,
      editingValues: { username: e.name, password: e.pw },
    });
  };

  // Update a user
  updateUser = (key) => {
    const { editingValues } = this.state;

    key = key.id;
    axios({
      url: `http://localhost:8000/updateuser/${key}`,
      method: "PUT",
      data: editingValues,
    })
      .then((r) => {
        console.log(r.data);
        this.LoadUserList();
        // Update the user list with the updated user data
        this.setState((prevState) => ({
          //userList: prevState.userList.map((user) => (user._id === r.data.id ? r.data : user)),
          editingKey: "",
          editingValues: {},
        }));
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // Delete a user
  deleteUser = (e) => {
    const payload = {
      username: e,
    };

    axios({
      url: `http://localhost:8000/deleteuser/${e}`,
      method: "DELETE",
    })
      .then((e) => {
        this.LoadUserList();
      })
      .catch((err) => console.log(err));
  };

  render() {
    const { editingKey, editingValues } = this.state;
    let role;
    try {
      role = JSON.parse(sessionStorage.getItem("role"))?.value;
    } catch (error) {
      console.log("error>>", error);
    }
    if (role !== "admin") {
      window.location.assign("/");
    }

    const columns = [
      {
        title: "Username",
        dataIndex: "name",
        key: "name",
        width: 100,
        render: (text, record) =>
          editingKey === record.id ? (
            <Input
              value={editingValues.username}
              onChange={(e) => this.setState({ editingValues: { ...editingValues, username: e.target.value } })}
              style={{ width: 200 }}
            />
          ) : (
            text
          ),
      },
      {
        title: "Hashed Password",
        dataIndex: "pw",
        key: "pw",
        width: 600,
        render: (text, record) =>
          editingKey === record.id ? (
            <Input
              value={editingValues.password}
              onChange={(e) => this.setState({ editingValues: { ...editingValues, password: e.target.value } })}
              style={{ width: 600 }}
            />
          ) : (
            text
          ),
      },
      {
        title: "Operations",
        key: "operations",
        width: 100,
        render: (text, record) => (
          <div>
            {editingKey === record.id ? (
              <Button
                style={{ marginRight: "10px", backgroundColor: "green" }}
                type="primary"
                onClick={() => this.updateUser(record)}
              >
                Update User
              </Button>
            ) : (
              <Button style={{ marginRight: "10px" }} type="primary" onClick={() => this.editUser(record)}>
                Edit User
              </Button>
            )}
            <Button type="primary" danger onClick={() => this.deleteUser(record.name)}>
              Delete User
            </Button>
          </div>
        ),
      },
    ];

    return (
      <main>
        <div>
          {<NavBar />}
          <h1 style={{ textAlign: "left" }}>Manage Users</h1>
          {/*<Collapse
            size="large"
            items={[
              {
                key: 1,
                label: "Create new user",
                children: <SignUp />,
              },
            ]}
          ></Collapse>*/}
          <Button style={{ float: "left", marginLeft: "7px", marginBottom: "10px" }} type="primary" href="/register">
            Create User
          </Button>
        </div>
        <div>
          <Table columns={columns} dataSource={this.state.userList} rowKey="name" />
        </div>
      </main>
    );
  }
}

export default User;
