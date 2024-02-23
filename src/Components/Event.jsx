import React, { Component, useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Input, Form, Modal, Select, DatePicker, TimePicker } from "antd";
import { useForm } from "antd/lib/form/Form";
import NavBar from "./navbar";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import SuccessPage from "./Success";

function EditEventForm({ event, venues, update }) {
  const [locationArr, setLocationArr] = useState([]);
  const [fullLoc, setFullLoc] = useState([]);
  const [showErr, setShowErr] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    eventId: "",
    title: "",
    venue: "",
    date: "",
    desc: "",
    presenter: "",
    price: "",
  });
  const { Option } = Select;
  const [form] = Form.useForm();

  useEffect(() => {
    const venue = venues.filter((item) => item.locid == event.venue)[0];
    console.log(venue);
    form.setFieldsValue({ ...event, venue: venue.name });
    setSuccess(false);
  }, [form, event]);

  const handleSubmit = (fieldValues) => {
    const parsedValue = parseInt(fieldValues.eventId);
    if (isNaN(parsedValue)) {
      return setShowErr(true);
    }
    const [loc] = fullLoc.filter((item) => item.name == fieldValues.venue);
    const eventDetails = {
      title: fieldValues.title,
      venue: parseInt(loc.locid),
      dateTime: fieldValues.dateTime,
      desc: fieldValues.desc,
      presenter: fieldValues.presenter,
      price: fieldValues.price,
    };
    setFormData(eventDetails);
    axios({
      url: "http://localhost:8000/admin/event/update/" + parsedValue,
      method: "PUT",
      data: eventDetails,
    })
      .then((res) => {
        console.log("res", res);
        setFormData({ eventId: parsedValue });
        form.resetFields();
        setSuccess(true);
        update();
      })
      .catch((err) => {
        console.log("err>>", err);
      });
  };

  useEffect(() => {
    const fetchVenues = () => {
      const venues = axios({
        url: "http://localhost:8000/venue",
        method: "GET",
      })
        .then((location) => {
          setFullLoc(location.data);
          const venuenames = location?.data.map((item) => {
            return { name: item.name, venueId: item.locid };
          });
          //console.log("location.data>>", venuenames);
          setLocationArr(venuenames);
          console.log("fetched venues");
        })
        .catch((err) => console.log("err>>", err));
    };
    fetchVenues();
  }, [success]);

  return (
    <>
      {success && (
        <SuccessPage
          status={"success"}
          showButton={false}
          title={`Successfully updated event id: ${formData.eventId}`}
        />
      )}
      {!success && (
        <Form
          form={form}
          name="basic"
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 18,
          }}
          style={{
            width: "100%",
            alignContent: "center",
          }}
          initialValues={event}
          autoComplete="off"
          onFinish={handleSubmit}
        >
          <Form.Item name="eventId" label="Event ID">
            <Input readOnly disabled />
          </Form.Item>
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true }]}
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 18,
            }}
          >
            <Input placeholder="Title" name="title" />
          </Form.Item>
          <Form.Item
            name="venue"
            label="Venue"
            rules={[{ required: true }]}
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 18,
            }}
          >
            <Select name="venue">
              {locationArr.map((option) => (
                <Option key={option.venueId} value={option.name}>
                  {option.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="dateTime" label="Date" rules={[{ required: true, message: "Please input the date" }]}>
            <TextArea autoSize={{ minRows: 2, maxRows: 4 }} />
          </Form.Item>
          <Form.Item
            name="desc"
            label="Description"
            rules={[{ required: true }]}
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 18,
            }}
          >
            <TextArea name="desc" placeholder="Event Description" autoSize={{ minRows: 2, maxRows: 4 }} />
          </Form.Item>
          <Form.Item
            name="presenter"
            label="Presenter"
            rules={[{ required: true }]}
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 18,
            }}
          >
            <Input name="presenter" placeholder="Presenter" />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true }]}
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 18,
            }}
          >
            <Input name="price" placeholder="Price" />
          </Form.Item>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </div>
        </Form>
      )}
    </>
  );
}

function CreateEventForm() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [locationArr, setLocationArr] = useState([]);
  const [eventIds, seteventIds] = useState([]);
  const [fullLoc, setFullLoc] = useState([]);
  const [showErr, setShowErr] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    eventId: "",
    title: "",
    venue: "",
    date: "",
    desc: "",
    presenter: "",
    price: "",
  });
  const { Option } = Select;
  const [form] = Form.useForm();
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setSuccess(false);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setSuccess(false);
    setIsModalOpen(false);
  };

  const handleSubmit = (fieldValues) => {
    const parsedValue = parseInt(fieldValues.eventId);
    if (isNaN(parsedValue)) {
      return setShowErr(true);
    }
    const [loc] = fullLoc.filter((item) => item.name == fieldValues.venue);
    const eventDetails = {
      eventId: parsedValue,
      title: fieldValues.title,
      venue: parseInt(loc.locid),
      dateTime: fieldValues.dateTime.format("YYYY-MM-DD HH:mm:ss"),
      desc: fieldValues.desc,
      presenter: fieldValues.presenter,
      price: fieldValues.price,
    };
    setFormData(eventDetails);
    axios({
      url: "http://localhost:8000/admin/event/create",
      method: "POST",
      data: eventDetails,
    })
      .then((res) => {
        console.log("res", res);
        form.resetFields();
        setSuccess(true);
      })
      .catch((err) => {
        console.log("err>>", err);
      });
  };
  const initialValues = {
    eventId: eventIds, // Set the initial value here
  };
  const generateRandomNumber = () => {
    const upperLimit = 1000000;
    let randomNum = Math.floor(Math.random() * upperLimit) + 1;

    while (eventIds.includes(randomNum)) {
      randomNum = Math.floor(Math.random() * upperLimit) + 1;
    }

    seteventIds(randomNum);
  };

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [form, initialValues]);

  useEffect(() => {
    const fetchVenues = () => {
      const venues = axios({
        url: "http://localhost:8000/venue",
        method: "GET",
      })
        .then((location) => {
          setFullLoc(location.data);
          const venuenames = location?.data.map((item) => item.name);
          //console.log("location.data>>", venuenames);
          setLocationArr(venuenames);
        })
        .catch((err) => console.log("err>>", err));
    };
    const fetchEvents = () => {
      const events = axios({
        url: "http://localhost:8000/admin/event",
        method: "GET",
      })
        .then((events) => {
          const eventIds = events?.data.map((item) => item.eventId);
          //console.log("seteventIds>>", eventIds);
          const generateRandomNumber = () => {
            const upperLimit = 1000000;
            let randomNum = Math.floor(Math.random() * upperLimit) + 1;

            while (eventIds.includes(randomNum)) {
              randomNum = Math.floor(Math.random() * upperLimit) + 1;
            }

            seteventIds(randomNum);
          };
          generateRandomNumber();
        })
        .catch((err) => console.log("err>>", err));
    };
    fetchVenues();
    fetchEvents();
  }, [success]);

  return (
    <>
      <Button shape="circle" type="primary" icon={<PlusOutlined />} onClick={showModal} />
      <Modal
        footer={null}
        title="Add Event"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        height={400}
        width={1000}
      >
        {success && (
          <SuccessPage
            status={"success"}
            path={"/venue"}
            title={`Successfully create event id: ${formData.eventId}: ${formData.title}`}
            subTitle={"Thank you for signing up."}
          />
        )}
        {!success && (
          <Form
            form={form}
            name="basic"
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 18,
            }}
            style={{
              width: "100%",
              alignContent: "center",
            }}
            initialValues={initialValues}
            autoComplete="off"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="eventId"
              label="Event ID"
              rules={[{ required: true }]}
              labelCol={{
                span: 6,
              }}
              wrapperCol={{
                span: 18,
              }}
              hasFeedback
              validateStatus={showErr ? "error" : "success"}
              help={showErr ? "Numbers Only" : ""}
            >
              <Input disabled name="eventId" type="number" placeholder="Event ID" />
            </Form.Item>
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true }]}
              labelCol={{
                span: 6,
              }}
              wrapperCol={{
                span: 18,
              }}
            >
              <Input placeholder="Title" name="title" />
            </Form.Item>
            <Form.Item
              name="venue"
              label="Venue"
              rules={[{ required: true }]}
              labelCol={{
                span: 6,
              }}
              wrapperCol={{
                span: 18,
              }}
            >
              <Select name="venue">
                {locationArr.map((option) => (
                  <Option key={option} value={option}>
                    {option}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="dateTime"
              label="Date"
              rules={[{ required: true }]}
              labelCol={{
                span: 6,
              }}
              wrapperCol={{
                span: 18,
              }}
            >
              <DatePicker name="dateTime" showTime format="YYYY-MM-DD HH:mm:ss" />
            </Form.Item>
            <Form.Item
              name="desc"
              label="Description"
              rules={[{ required: true }]}
              labelCol={{
                span: 6,
              }}
              wrapperCol={{
                span: 18,
              }}
            >
              <TextArea name="desc" placeholder="Event Description" autoSize={{ minRows: 2, maxRows: 4 }} />
            </Form.Item>
            <Form.Item
              name="presenter"
              label="Presenter"
              rules={[{ required: true }]}
              labelCol={{
                span: 6,
              }}
              wrapperCol={{
                span: 18,
              }}
            >
              <Input name="presenter" placeholder="Presenter" />
            </Form.Item>
            <Form.Item
              name="price"
              label="Price"
              rules={[{ required: true }]}
              labelCol={{
                span: 6,
              }}
              wrapperCol={{
                span: 18,
              }}
            >
              <Input name="price" placeholder="Price" />
            </Form.Item>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </div>
          </Form>
        )}
      </Modal>
    </>
  );
}

function Event() {
  const [eventList, setEventList] = useState([]);
  const [fullLoc, setFullLoc] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [editingValues, setEditingValues] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDelModalOpen, setIsDelModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [childUpdated, setChildUpdated] = useState(0);
  const [form] = Form.useForm();
  useEffect(() => {
    setIsLoading(true);
    const fetchVenues = () => {
      const venues = axios({
        url: "http://localhost:8000/venue",
        method: "GET",
      })
        .then((location) => {
          setFullLoc(location?.data);
          setIsLoading(false);
          console.log("fetched venues");
        })
        .catch((err) => console.log("err>>", err));
    };
    fetchVenues();
    loadEventList();
  }, [childUpdated]);

  function onChildUpdate() {
    setChildUpdated((current) => current + 1);
  }

  useEffect(() => {
    form.setFieldsValue({ ...editingValues, eventId: editingKey });
  }, [form, editingKey]);

  const loadEventList = () => {
    axios({
      url: "http://localhost:8000/admin/event",
      method: "GET",
    })
      .then((r) => {
        setEventList(r.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const editEvent = (e) => {
    setEditingValues({
      eventId: e.eventId,
      title: e.title,
      venue: e.venue,
      dateTime: e.dateTime,
      desc: e.desc,
      presenter: e.presenter,
      price: e.price,
    });
    setIsModalOpen(true);
  };

  const handleOk = () => {};
  const handleCancel = () => {
    setIsModalOpen(false);
    setIsDelModalOpen(false);
  };

  const deleteEvent = (e) => {
    console.log(e);
    axios({
      url: `http://localhost:8000/admin/event/delete/${e}`,
      method: "DELETE",
    })
      .then((e) => {
        loadEventList();
      })
      .catch((err) => console.log(err));
  };

  const columns = [
    {
      title: "Event Name",
      dataIndex: "title",
      key: "title",
      render: (text, record) => text,
      width: 800,
    },
    {
      title: "Event ID",
      dataIndex: "eventId",
      key: "eventId",
    },
    {
      title: "Event Name",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Venue",
      dataIndex: "venue",
      key: "venue",
    },
    {
      title: "Date Time",
      dataIndex: "dateTime",
      key: "dateTime",
    },
    {
      title: "Event Description",
      dataIndex: "desc",
      key: "desc",
    },
    {
      title: "Presenter",
      dataIndex: "presenter",
      key: "presenter",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Operations",
      key: "operations",
      render: (text, record) => (
        <div>
          {
            <Button
              style={{ marginBottom: "10px" }}
              type="primary"
              onClick={() => editEvent(record)}
              icon={<EditOutlined />}
            >
              {/* Edit Event */}
            </Button>
          }
          <Button type="primary" danger onClick={() => deleteEvent(record.eventId)} icon={<DeleteOutlined />}>
            {/* Delete Event */}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <main>
      <div>
        {<NavBar />}
        <h1 style={{ textAlign: "left" }}>Manage Events</h1>
      </div>
      <CreateEventForm />
      {<div style={{ clear: "both" }}></div>}
      <div>
        <Table loading={isLoading} columns={columns} dataSource={eventList} rowKey="eventId" />
      </div>
      <div>
        <Modal footer={null} title="Edit Event" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
          <EditEventForm key={1} event={editingValues} venues={fullLoc} update={onChildUpdate} />
        </Modal>
        {
          <Modal title="Delete Event" open={isDelModalOpen} onOk={handleCancel} onCancel={handleCancel}>
            Successfully deleted!
          </Modal>
        }
        {/*<Form form={form} initialValues={{ ...editingValues, eventId: editingKey }} onFinish={updateEvent}>
            <Form.Item name="eventId" label="Event ID">
              <Input readOnly />
            </Form.Item>
            <Form.Item name="title" label="Title" rules={[{ required: true, message: "Please input the title" }]}>
              <TextArea autoSize={{ minRows: 2, maxRows: 4 }} />
            </Form.Item>
            <Form.Item name="venue" label="Venue" rules={[{ required: true, message: "Please input the venue" }]}>
              <TextArea autoSize={{ minRows: 2, maxRows: 4 }} />
            </Form.Item>
            <Form.Item name="dateTime" label="Date" rules={[{ required: true, message: "Please input the date" }]}>
              <TextArea autoSize={{ minRows: 2, maxRows: 4 }} />
            </Form.Item>
            <Form.Item
              name="desc"
              label="Description"
              rules={[{ required: true, message: "Please input the description" }]}
            >
              <TextArea autoSize={{ minRows: 3, maxRows: 10 }} />
            </Form.Item>
            <Form.Item
              name="presenter"
              label="Presenter"
              rules={[{ required: true, message: "Please input the presenter" }]}
            >
              <TextArea autoSize={{ minRows: 2, maxRows: 4 }} />
            </Form.Item>
            <Form.Item name="price" label="Price" rules={[{ required: true, message: "Please input the price" }]}>
              <TextArea autoSize={{ minRows: 2, maxRows: 4 }} />
            </Form.Item>
  </Form>*/}
      </div>
    </main>
  );
}
export default Event;

//:(
/*
class Event extends Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      eventList: [],
      editingKey: "",
      editingValues: {},
      allowInput: false,
      isButtonEnabled: true,
      form: null,
      isModalOpen: false,
      isDelModalOpen: false,
    };
  }

  componentDidMount() {
    this.loadEventList();
  }

  componentDidUpdate(){

  }

  loadEventList() {
    axios({
      url: "http://localhost:8000/admin/event",
      method: "GET",
    })
      .then((r) => {
        this.setState({
          eventList: r.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  addEvent = (value) => {
    this.formRef.current
      .validateFields()
      .then((values) => {
        console.log("Success:", values);
        axios
          .post("/createevent", values)
          .then((response) => {
            console.log("Server response:", response);
            this.setState({ allowInput: false, isButtonEnabled: true });
            this.loadEventList();
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      })
      .catch((errorInfo) => {
        console.log("Failed:", errorInfo);
      });
  };
  // Edit an event
  editEvent = (e) => {
    this.setState(
      {
        editingKey: e.eventId,
        editingValues: {
          title: e.title,
          venue: e.venue,
          dateTime: e.dateTime,
          desc: e.desc,
          presenter: e.presenter,
          price: e.price,
        },
      },
      () => {
        this.formRef.current?.setFieldsValue();
        console.log(this.state.editingKey);
        console.log(this.state.editingValues);
        this.setState({ isModalOpen: true });
      }
    );
  };

  // Update an event
  updateEvent = (key) => {
    const updateData = key;

    key = key.eventId;

    axios({
      url: `http://localhost:8000/admin/event/update/${key}`,
      method: "PUT",
      data: updateData,
    })
      .then((r) => {
        console.log(r.data);
        // Update the user list with the updated user data
        this.loadEventList();
        this.setState({ isModalOpen: false });
        this.setState((prevState) => ({
          editingKey: "",
          editingValues: {},
        }));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleOk = () => {
    this.formRef.current.submit();
  };
  handleCancel = () => {
    this.setState({
      isModalOpen: false,
      isDelModalOpen: false,
    });
  };

  handleDelCancel = () => {
    this.setState({
      isModalOpen: false,
      isDelModalOpen: false,
    });
  };
  // Update an event
  handleOK = (key) => {
    const updateData = key;

    key = key.eventId;

    axios({
      url: `http://localhost:8000/admin/event/update/${key}`,
      method: "PUT",
      data: this.state.editingValues,
    })
      .then((r) => {
        console.log(r.data);
        this.loadEventList();
        // Update the user list with the updated user data
        this.setState((prevState) => ({
          editingKey: "",
          editingValues: {},
        }));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  /// Delete an event
  deleteEvent = (e) => {
    axios({
      url: `http://localhost:8000/admin/event/delete/${e}`,
      method: "DELETE",
    })
      .then((e) => {
        this.setState({ isDelModalOpen: true });
        this.loadEventList();
      })
      .catch((err) => console.log(err));
  };
  render() {
    let role;
    try {
      role = JSON.parse(sessionStorage.getItem("role"))?.value;
    } catch (error) {
      console.log("error>>", error);
    }
    if (role !== "admin") {
      window.location.assign("/");
    }
    const { editingKey, editingValues } = this.state;
    const columns = [
      {
        title: "Event ID",
        dataIndex: "eventId",
        key: "eventId",
      },
      {
        title: "Event Name",
        dataIndex: "title",
        key: "title",
      },
      {
        title: "Venue",
        dataIndex: "venue",
        key: "venue",
      },
      {
        title: "Date Time",
        dataIndex: "dateTime",
        key: "dateTime",
      },
      {
        title: "Event Description",
        dataIndex: "desc",
        key: "desc",
      },
      {
        title: "Presenter",
        dataIndex: "presenter",
        key: "presenter",
      },
      {
        title: "Price",
        dataIndex: "price",
        key: "price",
      },
      {
        title: "Operations",
        key: "operations",
        render: (text, record) => (
          <div>
            {
              /*editingKey === record.eventId ? (
              <Button
                style={{ marginBottom: "10px", backgroundColor: "green" }}
                type="primary"
                onClick={() => this.updateEvent(record)}
              >
                Update Event
              </Button>
            ) : (*/
/*
              <Button style={{ marginBottom: "10px" }} type="primary" onClick={() => this.editEvent(record)}>
                Edit Event
              </Button>
            }
            <Button type="primary" danger onClick={() => this.deleteEvent(record.eventId)}>
              Delete Event
            </Button>
          </div>
        ),
      },
    ];

    return (
      <main>
        <div>
          <NavBar />
          <h1 style={{ textAlign: "left" }}>Manage Event</h1>
        </div>
        <CreateEventForm />
        {
          <div style={{ clear: "both" }}>
            {this.state.allowInput && (
              <Form onFinish={this.addEvent}>
                <Form.Item
                  name="EventID"
                  label="Event ID"
                  rules={[{ required: true, message: "Please input the Event ID" }]}
                >
                  <TextArea placeholder="Event ID" />
                </Form.Item>
                <Form.Item name="Title" label="Title" rules={[{ required: true, message: "Please input the title" }]}>
                  <TextArea placeholder="Title" />
                </Form.Item>
                <Form.Item name="Venue" label="Venue" rules={[{ required: true, message: "Please input the venue" }]}>
                  <TextArea placeholder="Location" />
                </Form.Item>
                <Form.Item name="Date" label="Date" rules={[{ required: true, message: "Please input the date" }]}>
                  <TextArea placeholder="Date and Time" />
                </Form.Item>
                <Form.Item
                  name="Description"
                  label="Description"
                  rules={[{ required: true, message: "Please input the description" }]}
                >
                  <TextArea placeholder="Event Description" />
                </Form.Item>
                <Form.Item
                  name="Presenter"
                  label="Presenter"
                  rules={[{ required: true, message: "Please input the presenter" }]}
                >
                  <TextArea placeholder="Presenter" />
                </Form.Item>
                <Form.Item name="Price" label="Price" rules={[{ required: true, message: "Please input the price" }]}>
                  <TextArea placeholder="Price" />
                </Form.Item>
                <Form.Item>
                  <Button style={{ marginBottom: "10px" }} type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            )}
          </div>
        }
        <div>
          <Modal title="Edit Event" open={this.state.isModalOpen} onOk={this.handleOk} onCancel={this.handleCancel}>
            <Form
              ref={this.formRef}
              initialValues={{ ...this.state.editingValues, eventId: this.state.editingKey }}
              onFinish={this.updateEvent}
            >
              <Form.Item name="eventId" label="Event ID">
                <Input readOnly />
              </Form.Item>
              <Form.Item name="title" label="Title" rules={[{ required: true, message: "Please input the title" }]}>
                <TextArea autoSize={{ minRows: 2, maxRows: 4 }} />
              </Form.Item>
              <Form.Item name="venue" label="Venue" rules={[{ required: true, message: "Please input the venue" }]}>
                <TextArea autoSize={{ minRows: 2, maxRows: 4 }} />
              </Form.Item>
              <Form.Item name="dateTime" label="Date" rules={[{ required: true, message: "Please input the date" }]}>
                <TextArea autoSize={{ minRows: 2, maxRows: 4 }} />
              </Form.Item>
              <Form.Item
                name="desc"
                label="Description"
                rules={[{ required: true, message: "Please input the description" }]}
              >
                <TextArea autoSize={{ minRows: 3, maxRows: 10 }} />
              </Form.Item>
              <Form.Item
                name="presenter"
                label="Presenter"
                rules={[{ required: true, message: "Please input the presenter" }]}
              >
                <TextArea autoSize={{ minRows: 2, maxRows: 4 }} />
              </Form.Item>
              <Form.Item name="price" label="Price" rules={[{ required: true, message: "Please input the price" }]}>
                <TextArea autoSize={{ minRows: 2, maxRows: 4 }} />
              </Form.Item>
            </Form>
          </Modal>
          <Modal title="Delete Event" open={this.state.isDelModalOpen} onOk={this.handleDelCancel}>
            Successfully deleted!
          </Modal>
          <Table columns={columns} dataSource={this.state.eventList} rowKey="eventId" />
        </div>
      </main>
    );
  }
}*/
