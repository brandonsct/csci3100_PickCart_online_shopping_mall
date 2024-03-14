import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { HomeOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";
import { Menu, theme, Row, Col } from "antd";
import { FaHeart } from "react-icons/fa6";
const { SubMenu } = Menu;

const NavBar = (props) => {
  const { component } = props;
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const logOut = () => {
    axios({
      method: "DELETE",
      url: "http://localhost:8000/logout",
      withCredentials: true,
    })
      .then((res) => {
        if (res.status === 200) {
          console.log("Logged out");
          sessionStorage.clear();
          navigate("/login");
        }
      })

      .catch((err) => {
        return navigate("/login");
      });
  };
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:8000/checkAuth", {
          withCredentials: true,
        });
        setUser(res.data);
      } catch (error) {
        setUser(null);
        return location.pathname == "/register" ? null : navigate("/login");
      }
    };
    checkAuth();
  }, []);
  // console.log("user>>", user);
  if (!user) {
    return (
      <Menu
        mode="horizontal"
        theme="dark"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <Menu.Item key="left-item" style={{ marginLeft: 100 }}>
          {component}
        </Menu.Item>
        <Menu.Item
          key="right-item"
          style={{ marginLeft: "auto" }}
          icon={<UserOutlined />}
        />
      </Menu>
    );
  } else {
    return (
      <Menu
        mode="horizontal"
        theme="dark"
        style={{ justifyContent: "flex-end" }}
      >
        <Row>
          <Menu.Item key="cart" onClick={() => navigate("/cart")}>
            <HomeOutlined
              // style={{ marginRight: 10 }}
              class="mr-2.5"
            />
            Cart
          </Menu.Item>
          <Menu.Item key="favourites" onClick={() => navigate("/venue/fav")}>
            <FaHeart style={{ marginRight: 10 }} />
            Favourites
          </Menu.Item>
          <Menu.Item key="invites" onClick={() => navigate("/invites")}>
            <MailOutlined style={{ marginRight: 10 }} />
            Event Invitations
          </Menu.Item>
          <Menu.Item key="right-item" style={{ marginLeft: "auto" }}>
            <SubMenu
              key="SubMenu"
              icon={<UserOutlined />}
              title={user.username}
            >
              <Menu.Item key="setting:1" onClick={logOut}>
                Logout
              </Menu.Item>
              {user.role == "admin" ? (
                <Menu.Item
                  key="setting:2"
                  onClick={() => navigate("/admin/user")}
                >
                  Manage Users
                </Menu.Item>
              ) : (
                <></>
              )}
              {user.role == "admin" ? (
                <Menu.Item
                  key="setting:3"
                  onClick={() => navigate("/admin/event")}
                >
                  Manage Events
                </Menu.Item>
              ) : (
                <></>
              )}
            </SubMenu>
          </Menu.Item>
        </Row>
      </Menu>
    );
  }
};

NavBar.defaultProps = {
  component: "CSCI 3100 project",
};

export default NavBar;
