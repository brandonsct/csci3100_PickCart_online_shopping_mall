import React from "react";
import HistoryTable from "../Components/orderHistory/HistoryTable";
/**
 * Renders the Orderhistory component.
 *
 * @returns {JSX.Element} The rendered Orderhistory component.
 */
const Orderhistory = () => {
  return (
    <div className="justify-items-center w-full h-screen overflow-scroll p-6">
      <HistoryTable />
    </div>
  );
};

export default Orderhistory;
