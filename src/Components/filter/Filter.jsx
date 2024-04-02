import React, { useState } from "react";
import { Card, Select, Button, Slider } from "antd";
import axios from "axios";

const Filter = (props) => {
  const OPTIONS = [
    "HouseHold Supply",
    "Meat and Seafood",
    "Dairy, Chilled and Eggs",
    "Breakfast and Bakery",
  ];
  let translationTable = {
    "HouseHold Supply": "HouseHoldSupply",
    "Meat and Seafood": "MeatNSeafood",
    "Dairy, Chilled and Eggs": "DairyChilledEggs",
    "Breakfast and Bakery": "BreakfastNBakery",
  };
  const API_URL = process.env.REACT_APP_API_URL;

  const [selectedItems, setSelectedItems] = useState([]);
  const [sliderOption, setSliderOption] = useState([0, 200]);
  const filteredOptions = OPTIONS.filter((o) => !selectedItems.includes(o));
  const [productNum, setProductNum] = useState();
  const onChangeComplete = (value) => {
    console.log("onChangeComplete: ", value);

    setSliderOption(value);
  };

  const applyFilter = () => {
    let translatedSelected = [];
    selectedItems.forEach((item) => {
      translatedSelected.push(translationTable[item]);
    });

    let filterData = {
      category: translatedSelected,
      priceRange: sliderOption,
    };
    console.log("category:", translatedSelected);
    axios({
      method: "POST",
      data: filterData,
      url: `${API_URL}/filterProducts`,
    })
      .then((response) => {
        props.updateProducts(response);
        setProductNum(response.data.length);
        // console.log("response:::::", response);
        // setProducts(response.data);
        // setIsLoading(false);
      })
      .catch((error) => {
        // console.error("Error fetching data: ", error);
        // setIsLoading(false);
      });
    // props.updateProducts(data);
    console.log("filterData:", filterData);
  };
  return (
    <Card
      style={{
        width: 600,
      }}
    >
      <div class="flex flex-row">
        <p>Select Category:</p>
        <Select
          mode="multiple"
          placeholder="Inserted are removed"
          value={selectedItems}
          onChange={setSelectedItems}
          style={{
            width: "100%",
          }}
          options={filteredOptions.map((item) => ({
            value: item,
            label: item,
          }))}
        />
      </div>

      <div class="">
        <div>
          Price:{sliderOption[0]} to {sliderOption[1]}
        </div>
        <Slider
          range
          step={10}
          min={0}
          max={200}
          defaultValue={[0, 200]}
          //   onChange={onChange}
          onChangeComplete={onChangeComplete}
        />
      </div>

      <div class="flex justify-center">
        <Button onClick={applyFilter}>Apply</Button>
      </div>

      {productNum > 0 ? (
        <div className="text-cyan-500">{productNum} result is searched</div>
      ) : (
        <div className="text-red-500">No results are found</div>
      )}
    </Card>
  );
};

export default Filter;
