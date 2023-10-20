import { Button, Form, Input } from "antd";
import React, { useEffect, useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { usePostApi } from "../../hooks/usePostApi";
import { useNavigate } from "react-router-dom";

export const ObserverLogin = () => {
  const [email,setEmails]=useState(null)
  const navigate = useNavigate();
  const {
    data: observerData,
    isLoading: observerDataLoading,
    error: observerDataError,
    postData: observerPostData,
  } = usePostApi(`${process.env.REACT_APP_BASE_URL}/assessmentApi/observer-view/`);

  const onFinish = (values) => {
  
    observerPostData({
      name: values.name,
      email: values.email,
  });
  setEmails(values.email)
};

useEffect(() => {
 
  if (observerData) {
    navigate("/observer-assessment",{ state: { email } });
  }
}, [observerData]);

  return (
    <div class="flex justify-center h-screen">
      <div class="flex flex-col space-y-4 items-center">
        <div class="text-center text-xl mt-10">
          Performance Evaluation Assessment
        </div>
        <div className="text-center text-red-500">
          All the questions are mandatory.
        </div>
        <div class="text-center">Personal Details</div>'
        <div className="ml-32">
        <Form
          onFinish={onFinish}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 12 }}
        >
          <Form.Item
            label="Name"
            name="name"
            labelCol={{ span: 24 }}
            rules={[
              {
                required: true,
                message: "Please enter your name!",
              },
            ]}
          >
            <Input placeholder="Enter Your Name" className="!w-[350px]" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            labelCol={{ span: 24 }}
            rules={[
              {
                required: true,
                message: "Please enter your email!",
              },
            ]}
          >
            <Input placeholder="Enter Your Email" className="!w-[350px]" />
          </Form.Item>

          <Form.Item
            label="Contact/Mobile No."
            name="contact"
            labelCol={{ span: 24 }}
            rules={[
              {
                required: true,
                message: "Please enter your contact number!",
              },
            ]}
          >
            <Input
              placeholder="Enter Your Contact Number"
              className="!w-[350px]"
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6, span: 12 }}>
            <Button type="primary" htmlType="submit">
              Start Assessment
            </Button>
          </Form.Item>
        </Form>
        </div>
      </div>
    </div>
  );
};
