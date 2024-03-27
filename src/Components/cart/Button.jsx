import React, { useState } from "react";
import "./button.css";

const ButtonNum = () => {
  const [value, setValue] = useState(0);

  function decrement() {
    if (value != 0) {
      setValue(value - 1);
    } else {
      console.log("item canceled");
    }
  }

  function increment() {
    setValue(value + 1);
  }

  return (
    <div class="custom-number-input h-10 w-32">
      <div class="flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-1">
        <button
          onClick={decrement}
          class="border-0 bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-l cursor-pointer outline-none"
        >
          <span class="m-auto text-2xl font-thin">−</span>
        </button>
        <input
          type="number"
          class="border-0 focus:outline-none text-center w-full bg-gray-300 font-semibold text-md hover:text-black focus:text-black  md:text-basecursor-default flex items-center text-gray-700  outline-none"
          name="custom-input-number"
          value={value}
          readOnly
        />
        <button
          onClick={increment}
          class="border-0 bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-r cursor-pointer"
        >
          <span class="m-auto text-2xl font-thin">+</span>
        </button>
      </div>
    </div>
  );
};

export default ButtonNum;
