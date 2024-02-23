import React from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const SuccessPage = (props) => {
  const { status, title, subTitle, path, showButton } = props;
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
              Go Console
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
};

export default SuccessPage;
