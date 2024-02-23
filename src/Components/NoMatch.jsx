import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Result } from 'antd';
import '../App.css'

function NoMatch(props) {
  const navigate = useNavigate();
  function isSessionStorageItemExists(key) {
    const item = sessionStorage.getItem(key);
    return item !== null;
  }
  // Usage
  const itemExists = isSessionStorageItemExists("username");
  useEffect(() => {
    if (!itemExists) {
      // Item exists in sessionStorage
      navigate("/login");
      // Item does not exist in sessionStorage
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
