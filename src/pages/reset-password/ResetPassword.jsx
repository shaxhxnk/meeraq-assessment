import { Button, Form, Input } from "antd";
import React from "react";
import { LockOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router";
import { usePostApi } from "../../hooks/usePostApi";
import { validatePassword } from "../../utils/validation";

export const ResetPassword = () => {
  const [form] = Form.useForm();
  const { token } = useParams();
  const { data, error, isLoading, postData } = usePostApi(
    `${process.env.REACT_APP_BASE_URL}/api/password_reset/confirm/`
  );
  const navigate = useNavigate();

  const submitHandler = (values) => {
    postData({
      token: token,
      password: values.password,
    });
  };

  const validateConfirmPassword = (_, value) => {
    if (!value) {
      return Promise.reject("Please input the confirm password!");
    }

    const passwordFieldValue = form.getFieldValue("password");
    if (passwordFieldValue !== value) {
      return Promise.reject("Password does not match");
    }

    return Promise.resolve();
  };

  if (data) {
    return (
      <div className="mt-8 bg-white p-6 rounded-lg shadow sm:mx-auto sm:w-full sm:max-w-md">
        <p className="text-center">
          Password has been reset successfully. Go back to login.
        </p>
        <div className="flex justify-center">
          <Button
            type="primary"
            className="block rounded mt-3 mx-auto"
            onClick={() => navigate("/")}
          >
            Go to Login Page
          </Button>
        </div>
      </div>
    );
  }
  return !error || error?.response?.data?.password ? (
    <div className="flex flex-col gap-2">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-4 text-center text-3xl font-extrabold text-gray-900">
          Reset Password
        </h2>
      </div>
      <div className="mt-8 bg-white p-6 rounded-lg shadow sm:mx-auto sm:w-full sm:max-w-md">
        <p className="text-center">
          Enter a new password below to change your password.
        </p>
        {error?.response?.data?.password && (
          <p className="text-center text-[#ff4d4f]">
            {error?.response?.data?.password[0]}
          </p>
        )}
        <Form className="mt-8" form={form} onFinish={submitHandler}>
          <Form.Item
            // rules={[{ required: true, message: "Please input your Password!" }]}
            rules={[{ validator: validatePassword }]}
            name="password"
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Password"
              maxLength={20}
            />
          </Form.Item>
          <Form.Item
            dependencies={["password"]}
            rules={[{ validator: validateConfirmPassword }]}
            maxLength={20}
            name="confirmPassword"
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Confirm Password"
            />
          </Form.Item>

          <div className="flex mt-10 justify-center">
            <Button
              loading={isLoading}
              type="primary"
              className=" rounded block mx-auto"
              htmlType="submit"
            >
              Reset Password
            </Button>
          </div>
        </Form>
      </div>
    </div>
  ) : (
    <div className="mt-8  bg-white p-6 rounded-lg shadow sm:mx-auto sm:w-full sm:max-w-md">
      <p className="text-center text-[#ff4d4f]">
        The link has been expired. Please go to the forgot password to get the
        valid link
      </p>
      <div className="flex mt-4 justify-center">
        <Button
          type="primary"
          className="block  mx-auto"
          onClick={() => navigate("/forgot-password")}
        >
          Go to forgot password
        </Button>
      </div>
    </div>
  );
};
