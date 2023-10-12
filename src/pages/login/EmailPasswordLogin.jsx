import { Button, Form, Input } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { login } from "../../redux/services/authService";
import { useDispatch, useSelector } from "react-redux";
import { validateEmailOnBlur } from "../../utils/validation";
import { VALIDATE_TRIGGERS } from "../../utils/constants";
import MeeraqLogo from "../../assets/meeraq_logo_color.png";

export const EmailPasswordLogin = ({ setIsLoggingWithOtp }) => {
  const { isLoading, csrf } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const onFinish = (values) => {
    dispatch(
      login({ email: values.username.trim(), password: values.password, csrf })
    );
  };

  return (
    <div>
      <div className="bg-gray-100 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* <h2 className=" text-center text-3xl font-extrabold text-gray-900">
            Log in to your account
          </h2> */}
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"></div>
          <div className="flex flex-col  bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <Form
              name="normal_login"
              className="login-form"
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
            >
              <div className="flex justify-center">
                <img
                  className="w-[40%] mb-[4rem] h-auto"
                  src={MeeraqLogo}
                  alt="Meeraq logo"
                />
              </div>

              <div>
                <h2 className=" text-center text-3xl font-extrabold text-gray-900 mb-[2rem]">
                  Log in to your account
                </h2>
              </div>
              <Form.Item
                name="username"
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
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Email"
                />
              </Form.Item>
              <Form.Item
                name="password"
                className="mb-1"
                rules={[
                  {
                    required: true,
                    message: "Please input your Password!",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Password"
                />
              </Form.Item>
              <div className="flex">
                <Link
                  className="block ml-auto text-[0.8rem]  hover:text-sky-500"
                  to="/forgot-password"
                >
                  Forgot Password ?
                </Link>
              </div>
              <Form.Item className="mt-2 flex justify-center">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isLoading}
                  className="bg-sky-500"
                >
                  Log in
                </Button>
              </Form.Item>
            </Form>
            <p className="text-center"> Or</p>
            <Button
              disabled={isLoading}
              className="mt-6 mx-auto"
              onClick={() => setIsLoggingWithOtp((prev) => !prev)}
            >
              Login With OTP
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
