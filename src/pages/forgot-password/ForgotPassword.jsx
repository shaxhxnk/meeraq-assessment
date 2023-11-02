import { Button, Form, Input, notification } from "antd";
import React from "react";
import { UserOutlined } from "@ant-design/icons";
import { usePostApi } from "../../hooks/usePostApi";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { validateEmailOnBlur } from "../../utils/validation";
import { VALIDATE_TRIGGERS } from "../../utils/constants";
import { logout } from "../../redux/services/authService.js";
import { useDispatch } from "react-redux";

export const ForgotPassword = () => {
  const [form] = Form.useForm();

  const navigate = useNavigate();

  const { data, error, isLoading, postData } = usePostApi(
    `${process.env.REACT_APP_BASE_URL}/api/password_reset/`
  );

  const submitHandler = (values) => {
    postData({ email: values.email.trim() });
  };

  if (data) {
    return (
      <div className="mt-8 bg-white p-6 rounded-lg shadow sm:mx-auto sm:w-full sm:max-w-md">
        <p className="text-center">
          We have sent you an reset link on your email address. Please check
          your email to reset your password.
        </p>
        <div className="flex justify-center items-center">
          <Button
            type="primary"
            onClick={() => {
              navigate("/");
            }}
            className="mt-4 rounded block mx-auto"
          >
            Go back to login
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className=" text-center text-3xl font-extrabold text-gray-900">
          Trouble Logging In ?
        </h2>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow sm:mx-auto sm:w-full sm:max-w-md">
        <p className="text-center">
          Enter your email address, and we will send you a link to get back into
          your account.{" "}
        </p>
        <Form form={form} onFinish={submitHandler} className="mt-4">
          <Form.Item
            validateTrigger={VALIDATE_TRIGGERS}
            rules={[
              {
                validator: () => Promise.resolve(),
                validateTrigger: "onChange",
              },
              {
                validator: validateEmailOnBlur,
                validateTrigger: "onBlur",
              },
            ]}
            // rules={[
            //   { required: true, message: "Please input your Email!" },
            //   { type: "email", message: "Please enter valid email address." },
            // ]}
            name="email"
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Input your email "
            />
          </Form.Item>
          <div className="flex justify-end">
            <Button
              loading={isLoading}
              type="primary"
              className="mt-4 rounded block mx-auto"
              htmlType="submit"
            >
              Send Reset Link
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};
