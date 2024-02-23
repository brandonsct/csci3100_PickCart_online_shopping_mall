import React, { useState, useEffect } from "react";
import { Card, Spin, List, Row, Col, Descriptions, Button, Form, Input, Divider, Space, Table, Collapse } from "antd";
import axios from "axios";
import NavBar from "./navbar";
import Map from "./Map";
import { useParams } from "react-router-dom";
const { TextArea } = Input;

function LocationDetails(props) {
  const venue = props.venue;
  const data = [
    {
      key: "1",
      label: "Venue Name",
      children: venue.venueName,
    },
    {
      key: "2",
      label: "Latitude",
      children: venue.lat,
    },
    {
      key: "3",
      label: "Longitude",
      children: venue.long,
    },
  ];
  const labelStyle = {
    width: "20%",
    textAlign: "center",
  };
  return (
    <div>
      <Descriptions
        title={"Location Details"}
        layout={"horizontal"}
        labelStyle={labelStyle}
        bordered
        items={data}
        column={1}
      />
    </div>
  );
}

function EventDetails() {
  const [events, setEvents] = useState([]);
  const [freeEvents, setFreeEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { venueId } = useParams();
  function getVenueEvents() {
    setIsLoading(true);
    axios({
      url: "http://localhost:8000/venue/" + venueId + "/ev",
      method: "GET",
    })
      .then((res) => {
        setEvents(res.data.map((item, idx) => ({ ...item, key: idx })));
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  function getFreeEvents() {
    setFreeEvents(events.filter((item) => item.price == "Free admission by tickets" || "Free Admission"));
  }
  const columns = [
    {
      title: "Event ID",
      dataIndex: "eventId",
      key: "eventId",
    },
    {
      title: "Event Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Date",
      dataIndex: "dateTime",
      key: "dateTime",
    },
    {
      title: "Event Description",
      dataIndex: "desc",
      key: "desc",
    },
    {
      title: "Presented By",
      dataIndex: "presenter",
      key: "presenter",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
  ];
  useEffect(() => {
    getVenueEvents();
  }, []);
  useEffect(() => {
    getFreeEvents();
  }, [events]);
  return (
    <>
      <div>
        {
          <Collapse
            size="large"
            items={[
              {
                key: 1,
                label: "Free Events",
                children: (
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
                    dataSource={freeEvents}
                    renderItem={(item, idx) => (
                      <List.Item>
                        <Card key={idx} title={item.title}>
                          {item.dateTime}
                        </Card>
                      </List.Item>
                    )}
                  ></List>
                ),
              },
            ]}
          ></Collapse>
        }
        <Table
          title={() => <h3 textAlign="center">All Events</h3>}
          columns={columns}
          bordered
          dataSource={events}
          loading={isLoading}
        />
      </div>
    </>
  );
}

function CommentList(props) {
  //console.log(props.comments);
  return (
    <List
      itemLayout="vertical"
      dataSource={props.comments}
      pagination={{
        onChange: (page) => {
          console.log(page);
        },
        pageSize: 3,
      }}
      renderItem={(item, index) => (
        <List.Item>
          <List.Item.Meta
            style={{ whiteSpace: "pre", textAlign: "left" }}
            title={item.user}
            description={item.content}
          />
        </List.Item>
      )}
    />
  );
}

function Comments(props) {
  //comments: array of comment objects
  const [commentIsSpinning, setCommentIsSpinning] = useState(true);
  const [formIsSpinning, setFormIsSpinning] = useState(false);
  const [comments, setComments] = useState([]);
  const maxWidth = 800;
  useEffect(() => {
    getComments();
  }, []);

  function getComments() {
    setCommentIsSpinning(true);
    axios({
      url: "http://localhost:8000/comments/" + props.venueId,
      method: "GET",
    })
      .then((res) => {
        setComments(res.data);
        setCommentIsSpinning(false);
      })
      .catch((err) => {
        console.log(err);
        setCommentIsSpinning(false);
      });
  }
  function handleSubmit(data) {
    let payload = {
      user: props.user,
      venueId: Number(props.venueId),
      content: data.newCommentContent,
    };
    setFormIsSpinning(true);
    axios({
      url: "http://localhost:8000/newcomment",
      method: "POST",
      data: payload,
    })
      .then((res) => {
        console.log(res.data);
        setFormIsSpinning(false);
        getComments();
      })
      .catch((err) => {
        console.log(err);
        setFormIsSpinning(false);
      });
  }

  return (
    <>
      <div align="center">
        <Card title={"Comments"} style={{ maxWidth: maxWidth, align: "center" }}>
          <Spin spinning={commentIsSpinning}>
            <CommentList comments={comments} />
          </Spin>
        </Card>
      </div>
      <Card loading={formIsSpinning} title={"New comment"}>
        <Form name="newUserComment" onFinish={handleSubmit}>
          <Form.Item name="newCommentContent" rules={[{ required: true, message: "Comment cannot be empty!" }]}>
            <TextArea
              showCount
              maxLength={200}
              placeholder="Your Thoughts..."
              style={{ height: 100, resize: "none", maxWidth: maxWidth }}
            />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Click me to add new comment
          </Button>
        </Form>
      </Card>
    </>
  );
}

function SingleLocation(props) {
  const [user, setUser] = useState(null);
  const { venueId } = useParams();
  const [venue, setVenue] = useState([]);
  function getLocationDetails() {
    axios({
      url: "http://localhost:8000/venue/" + venueId,
      method: "GET",
    })
      .then((res) => {
        setVenue(res.data);
        document.title = res.data.venueName;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function getCurrentUser() {
    const user = JSON.parse(sessionStorage.getItem("username"))?.value || "";
    if (user) {
      setUser(user);
    } else {
      setUser(null);
    }
  }
  useEffect(() => {
    getLocationDetails();
    getCurrentUser();
    //setUser("admin"); //TODO: get current user
  }, []);

  return (
    <>
      <div>{<NavBar></NavBar>}</div>
      <div>
        <h1>{venue.venueName}</h1>
        <Divider />
        <div>
          <Row>
            <Col span={12}>{<Map venues={venue} zoom={15} isSingleLocation />}</Col>
            <Col span={12}>
              <LocationDetails venue={venue} />
            </Col>
          </Row>
        </div>
        <Divider />
        <EventDetails />
        <Comments venueId={venueId} user={user} />
      </div>
    </>
  );
}

export default SingleLocation;
