import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Result } from "antd";
import "../App.css";

/**
 * Renders a component for handling 404 page not found error.
 *
 * @param {Object} props - The props object containing component properties.
 * @returns {JSX.Element} The JSX element representing the NoMatch component.
 */
function NoMatch(props) {
  const navigate = useNavigate();

  /**
   * Checks if an item exists in the sessionStorage.
   *
   * @param {string} key - The key of the item to check.
   * @returns {boolean} True if the item exists, false otherwise.
   */
  function isSessionStorageItemExists(key) {
    const item = sessionStorage.getItem(key);
    return item !== null;
  }

  // Usage
  const itemExists = isSessionStorageItemExists("username");

  useEffect(() => {
    if (!itemExists) {
      // Item exists in sessionStorage
      navigate("/home");
      // Item does not exist in sessionStorage
      // This code is for dealing with no wrongly input url
    }
  });

  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={<Button type="primary">Back Home</Button>}
    />
  );
}

export default NoMatch;
