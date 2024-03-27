import React from "react";
import { SmileOutlined } from "@ant-design/icons";
import { Steps, Card, Avatar } from "antd";
const { Meta } = Card;
const description = "This is a description.";
const OrderStatus = () => (
  <div class="grid grid-cols-2 gap-4 w-full m-6">
    <Steps
      direction="vertical"
      size="small"
      current={1}
      items={[
        {
          title: "Finished",
          description,
        },
        {
          title: "In Progress",
          description,
        },
        {
          title: "Waiting",
          description,
        },
      ]}
    />
    <div class="overflow-y-auto">
      <Card title="Products">
        <Card
          type="inner"
          title="brainMeadows Home軟抽面紙(細) 5PK"
          extra={"$32.09"}
        >
          <div class="flex flex-row">
            <img
              class="w-40 h-40"
              src="https://img.rtacdn-os.com/20230906/60b08b24-1a24-34a7-8de9-a9893328175d_360x360H.webp"
            ></img>

            <div>
              <p>count: 25</p>
              <p>product id : 2539664</p>
            </div>
          </div>
        </Card>
        <Card
          type="inner"
          title="brainMeadows Home軟抽面紙(細) 5PK"
          extra={"$32.09"}
          style={{
            marginTop: 16,
          }}
        >
          <div class="flex flex-row">
            <img
              class="w-40 h-40"
              src="https://img.rtacdn-os.com/20230906/60b08b24-1a24-34a7-8de9-a9893328175d_360x360H.webp"
            ></img>

            <div>
              <p>count: 25</p>
              <p>product id : 2539664</p>
            </div>
          </div>
        </Card>
        <Card
          type="inner"
          title="brainMeadows Home軟抽面紙(細) 5PK"
          extra={"$32.09"}
          style={{
            marginTop: 16,
          }}
        >
          <div class="flex flex-row">
            <img
              class="w-40 h-40"
              src="https://img.rtacdn-os.com/20230906/60b08b24-1a24-34a7-8de9-a9893328175d_360x360H.webp"
            ></img>

            <div>
              <p>count: 25</p>
              <p>product id : 2539664</p>
            </div>
          </div>
        </Card>
      </Card>
    </div>
  </div>
);
export default OrderStatus;
