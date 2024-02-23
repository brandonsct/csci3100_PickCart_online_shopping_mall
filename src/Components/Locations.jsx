import React, { Component, useState, useEffect } from "react";
import axios from "axios";
import { Table, Input, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Map from "./Map";
import NavBar from "./navbar";
import { StarOutlined } from "@ant-design/icons";
import { FaStar } from "react-icons/fa";

class Locations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locationList: [],
      filteredLocations: [],
      isLoadingData: true,
      userFavList: [],
      lastUpdatedTime: JSON.parse(sessionStorage.getItem("lastUpdatedTime"))?.value || '',
    };

    this.searchLocation = this.searchLocation.bind(this);
  }

  //invoked for each set state(only called once => new class + new componentdidmount)
  componentDidMount() {
    this.LoadLocationList();
    this.loadUserFavLoc();
    this.getCurrentUser();
  }

  // load all locations in a table
  LoadLocationList() {
    this.setState({ isLoadingData: true });
    axios({
      url: "http://localhost:8000/venue",
      method: "GET",
    })
      .then((r) => {
        const filteredData = r.data.filter((v) => v.eventCount > 3);
        const slicedData = filteredData.slice(0, 10);
        this.setState({
          locationList: slicedData,
          filteredLocations: slicedData,
          isLoadingData: false,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getCurrentUser() {
    axios({
      url: "http://localhost:8000/checkAuth",
      method: "GET",
      withCredentials: true,
    })
      .then((res) => {
        this.setState({ user: res.data.username });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  searchLocation(event) {
    const filter = event.target.value.toLowerCase();

    if (filter === "") {
      this.setState({ filteredLocations: this.state.locationList });
    } else {
      const filteredLocations = this.state.locationList.filter((location) => {
        const txtValue = Object.values(location).join(" ").toLowerCase();
        return txtValue.indexOf(filter) > -1;
      });

      this.setState({ filteredLocations });
    }
  }
  handleFilter() {
    const fitleredLoc = this.state.filteredLocations.filter((loc) => {
      console.log("loc>>", loc);
      console.log("this.state.userFavList>>", this.state.userFavList);
      return this.state.userFavList.includes(parseInt(loc.locid));
    });
    this.setState({ filteredLocations: fitleredLoc });
  }

  loadUserFavLoc() {
    const usernameValue = JSON.parse(sessionStorage.getItem("username"))?.value || "";
    axios({
      url: `http://localhost:8000/userbyusername`,
      method: "POST",
      withCredentials: true,
      data: { username: usernameValue },
    })
      .then((resp) => {
        console.log("resp>>", resp);
        this.setState({ userFavList: resp.data });
      })
      .catch((err) => {
        console.log("err", err);
      });
  }

  handleFavClick(record) {
    this.setState({ isLoadingData: true });
    const usernameValue = JSON.parse(sessionStorage.getItem("username"))?.value || "";
    console.log("record>", record);
    axios({
      url: "http://localhost:8000/addFavbyUser",
      method: "POST",
      withCredentials: true,
      data: {
        username: usernameValue,
        locid: record.locid,
      },
    }).then((result) => {
      this.LoadLocationList();
      this.loadUserFavLoc();
    });
  }

  addToFavourite = (record) => {
    const { user } = this.state;
    const locid = record.locid;
    const data = { user: user, locid: locid };
    this.handleSubmit(data);
  };

  handleSubmit(data) {
    let payload = {
      user: data.user,
      locid: data.locid,
    };
    axios({
      url: "http://localhost:8000/venue/fav",
      method: "POST",
      data: payload,
    })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    const columns = [
      {
        title: "Venue ID",
        dataIndex: "locid",
        key: "locid",
      },
      {
        title: "Venue Name",
        dataIndex: "name",
        key: "name",
        render: (text, record) => <a href={`/venue/${record.locid}`}>{text}</a>,
      },
      {
        title: "Latitude",
        dataIndex: "lat",
        key: "lat",
      },
      {
        title: "Longitude",
        dataIndex: "long",
        key: "long",
      },
      {
        title: "Number of Events",
        dataIndex: "eventCount",
        key: "eventCount",
        sorter: (a, b) => a.eventCount - b.eventCount,
        sortDirections: ["descend", "ascend"],
      },
      {
        title: <div onClick={() => this.handleFilter()}>Favourites</div>,
        dataIndex: "fav",
        key: "fav",
        render: (fav, rowRecord) => (
          <Button
            icon={
              <FaStar
                color={this.state.userFavList.includes(parseInt(rowRecord.locid)) ? "yellow" : "white"}
                style={{ stroke: "black", strokeWidth: "10" }}
              />
            }
            type="text"
            onClick={() => this.handleFavClick(rowRecord)}
          />
        ),

        /*title: "Add To Favourite",
        render: (_, record) => (
          <button type="button" className="btn btn-success" onClick={() => this.addToFavourite(record)}>
            Add
          </button>
        ),*/
      },
    ];

    return (
      <main>
        <div>
          <NavBar />
        </div>
        <div style={{ height: "500px", width: "100%" }}>
          {<Map venues={this.state.locationList} isSingleLocation={false} zoom={11} markerLink={true} />}
        </div>
        <p style={{ textAlign: "right" }}>Last Updated at {this.state.lastUpdatedTime}</p>
        <div>
          <Input size="large" placeholder="Search" onChange={this.searchLocation} prefix={<SearchOutlined />} />
        </div>
        <div>
          <Table
            columns={columns}
            dataSource={this.state.filteredLocations}
            loading={this.state.isLoadingData}
            pagination={false}
            rowKey="locid"
          />
        </div>
      </main>
    );
  }
}

export default Locations;
