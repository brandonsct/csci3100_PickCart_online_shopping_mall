import React, { Component, useState, useEffect } from "react";
import axios from "axios";
import { Table, Input, Button } from "antd";
import NavBar from "./navbar";

class FavouriteLocations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locationList: [],
      filteredLocations: [],
      isLoadingData: true,
      userFavList: [],
    };
    this.LoadLocationList();

    this.handleFilter = this.handleFilter.bind(this);
  }

  // load all locations in a table
  LoadLocationList() {
    this.setState({ isLoadingData: true });
    axios({
      url: "http://localhost:8000/venue",
      method: "GET",
      withCredentials: true,
    })
      .then((r) => {
        const filteredData = r.data.filter((v) => v.eventCount > 3);
        const slicedData = filteredData.slice(0, 10);
        this.setState(
          {
            locationList: slicedData,
            filteredLocations: slicedData,
          },
          () => {
            this.loadUserFavLoc();
          }
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleFilter() {
    const fitleredLoc = this.state.filteredLocations.filter((loc) => {
      console.log("loc>>");
      console.log("this.state.userFavList>>", this.state.userFavList);
      return this.state.userFavList.includes(parseInt(loc.locid));
    });
    this.setState({ filteredLocations: fitleredLoc, isLoadingData: false });
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
        this.setState({ userFavList: resp.data }, () => {
          this.handleFilter();
        });
      })
      .catch((err) => {
        console.log("err", err);
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
    ];

    return (
      <main>
        <div>
          <NavBar />
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

export default FavouriteLocations;
