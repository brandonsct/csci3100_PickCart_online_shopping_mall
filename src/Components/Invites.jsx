import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Descriptions, Button, Form, Input, Alert, List } from "antd";
import NavBar from "./navbar";
function getUsername() {
  return JSON.parse(sessionStorage.getItem("username"))?.value || "";
}

function Invite(props) {
  const [invite, setInvite] = useState(props.invite);
  const [joined, setJoined] = useState([]);
  const [isJoined, setIsJoined] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const eventId = props.invite.eventId;
  const venueLink = "http://localhost:3000/venue/" + props.invite.venue;
  const labelStyle = {
    width: "20%",
    textAlign: "center",
  };
  const details = [
    {
      key: "1",
      label: "Event Date & Time",
      children: invite.dateTime,
    },
    { key: "2", label: "Venue ID", children: <a href={venueLink}>{invite.venue}</a> },
    { key: "3", label: "Price", children: invite.price },
  ];
  function getJoined() {
    axios({
      url: "http://localhost:8000/invites/user",
      method: "POST",
      data: {
        username: getUsername(), //TODO: get current user
      },
    })
      .then((res) => {
        const joinedList = res.data.map((item) => item.eventId);
        setJoined(joinedList);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  function handleClick() {
    let payload = {
      username: getUsername(),
      delete: isJoined ? true : false,
    };
    axios({
      url: "http://localhost:8000/invites/update/" + props.invite.eventId,
      method: "PUT",
      data: payload,
    }).then((res) => {
      console.log(res);
      getInvite();
      getJoined();
      props.update();
    });
  }

  function getInvite() {
    axios({
      url: "http://localhost:8000/invites/" + props.invite.eventId,
      method: "GET",
    })
      .then((res) => {
        const invite = res.data;
        setInvite({
          title: invite.event.title,
          dateTime: invite.event.dateTime,
          price: invite.event.price,
          venue: invite.event.venue,
          users: invite.users,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  useEffect(() => {
    getJoined();
    setIsLoading(false);
    //setInvite(props.invite);
  }, []);

  useEffect(() => {
    setIsJoined(joined.includes(eventId));
  }, [joined]);

  return (
    <>
      <Card style={{ width: "100%" }} title={invite.title} loading={isLoading}>
        <Descriptions
          title={"Event Details"}
          layout={"horizontal"}
          labelStyle={labelStyle}
          bordered
          items={details}
          column={1}
        />
        <p>{invite.users.length} users is/are going to this event.</p>
        <Button onClick={handleClick}>{isJoined ? "Leave" : "Join"}</Button>
      </Card>
    </>
  );
}

function NewInviteForm(props) {
  const [showError, setShowError] = useState(false);
  function handleClose() {
    setShowError(false);
  }
  async function handleSubmit(data) {
    try {
      const event = await axios.get("http://localhost:8000/ev/" + data.eventId);
      if (event) {
        axios({
          url: "http://localhost:8000/invites/create/" + data.eventId,
          method: "PUT",
          data: {
            username: getUsername(),
          },
        })
          .then((res) => {
            console.log(res.data);
            if (res.status == 200) {
              props.update();
            }
          })
          .catch((err) => {
            console.log(err);
            setShowError(true);
          });
      }
    } catch (err) {
      setShowError(true);
      console.log("Error occurred>>");
      console.log(showError);
    }
  }
  return (
    <div align="center">
      <Form name="basic" layout={"inline"} onFinish={handleSubmit} autoComplete="off">
        <Form.Item
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 12,
          }}
          label="Event ID:"
          name="eventId"
        >
          <Input type="string" name="eventId" placeholder="Input Event ID" required />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Create
        </Button>
      </Form>
      {showError ? <Alert type="warning" message={"Invite Not Created"} closable onClose={handleClose}></Alert> : null}
    </div>
  );
}

function Invites(props) {
  const [invites, setInvites] = useState([]);
  const [childUpdated, setChildUpdated] = useState(0);
  function getAllInvites() {
    axios({
      url: "http://localhost:8000/invites",
      method: "GET",
    })
      .then((res) => {
        const inviteList = res.data.map((item) => {
          return {
            eventId: item.eventId,
            title: item.event.title,
            dateTime: item.event.dateTime,
            price: item.event.price,
            venue: item.event.venue,
            users: item.users,
          };
        });
        setInvites(inviteList);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  function onChildUpdate() {
    setChildUpdated((current) => current + 1);
  }
  useEffect(() => {
    getAllInvites();
    document.title = "Invites";
  }, []);

  useEffect(() => {
    console.log("childUpdated");
    getAllInvites();
  }, [childUpdated]);

  return (
    <>
      <NavBar></NavBar>
      <h1>Invites</h1>

      <Card title={"Create a new Event Invite!"}>
        <div align="center">
          <NewInviteForm update={onChildUpdate} />
        </div>
      </Card>

      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 4,
          lg: 4,
          xl: 6,
          xxl: 3,
        }}
        dataSource={invites}
        renderItem={(item, idx) => (
          <List.Item>
            <Invite invite={item} key={idx} update={onChildUpdate} />
          </List.Item>
        )}
      />
    </>
  );
}

export default Invites;
