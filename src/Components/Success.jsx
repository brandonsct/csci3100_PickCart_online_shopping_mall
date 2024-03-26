import React from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const SuccessPage = (props) => {
  const { status, title, subTitle, path, showButton, alttitle } = props;
  const navigate = useNavigate();

  return (
    <>
      <Result
        status={status}
        title={title}
        subTitle={subTitle}
        extra={[
          showButton ? (
            <Button type="primary" key="console" onClick={() => navigate(path)}>
              {alttitle}
            </Button>
          ) : (
            <></>
          ),
        ]}
      />
    </>
  );
};

SuccessPage.defaultProps = {
  showButton: true,
  alttitle: "Go Console"
};

export default SuccessPage;
