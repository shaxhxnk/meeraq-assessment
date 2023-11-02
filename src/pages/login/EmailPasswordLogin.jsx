import { Button, Form, Image, Input } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { login } from "../../redux/services/authService";
import { useDispatch, useSelector } from "react-redux";
import { validateEmailOnBlur } from "../../utils/validation";
import { VALIDATE_TRIGGERS } from "../../utils/constants";
import MeeraqLogo from "../../assets/meeraq_logo_color.png";
import LoginPageSvg from "../../assets/loginPageSvg.svg";

export const EmailPasswordLogin = ({ setIsLoggingWithOtp }) => {
  const { isLoading, csrf } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const onFinish = (values) => {
    dispatch(
      login({ email: values.username.trim(), password: values.password, csrf })
    );
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Left Half */}
      <div
        className="lg:w-1/2 h-full"
        style={{
          background: "linear-gradient(45deg, #480025 0%, #031F44 100%)",
        }}
      >
        <div className="flex items-center justify-center h-screen mr-8">
          <img src={LoginPageSvg} alt="My SVG" />
        </div>
      </div>

      {/* Right Half */}
      <div className="lg:w-1/2 h-1/2 lg:h-full">
        <div className="flex p-0 lg:pl-32 lg:pr-32 pt-10 flex-col justify-center items-center flex-1 self-stretch">
          <div className="flex flex-col !w-[360px] items-center">
            <div className="!w-[174px] !mb-[18px] !mt-[100px] justify-center items-center inline-flex">
              <img className="" src={MeeraqLogo} alt="img" />
            </div>
            <div
              className="!mb-[22px] "
              style={{
                color: "var(--text-1, #1D1D1D)",
                fontFamily: "Inter",
                fontSize: "32px",
                fontStyle: "normal",
                fontWeight: 600,
                lineHeight: "150%",
                letterSpacing: "0.08px",
              }}
            >
              {" "}
              Login to your account
            </div>
            <div className="pl-4 lg:pl-0">
              <Form
                name="normal_login"
                className="login-form"
                initialValues={{
                  remember: true,
                }}
                onFinish={onFinish}
              >
                <p
                  style={{
                    color: "var(--text-3, #565656)",
                    fontFamily: "Inter",
                    fontSize: "14px",
                    fontStyle: "normal",
                    fontWeight: 500,
                    lineHeight: "140%",
                    letterSpacing: "0.035px",
                    marginBottom: "8px",
                  }}
                >
                  Email*
                </p>
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
                    style={{ width: "300px" }}
                  />
                </Form.Item>
                <p
                  style={{
                    color: "var(--text-3, #565656)",
                    fontFamily: "Inter",
                    fontSize: "14px",
                    fontStyle: "normal",
                    fontWeight: 500,
                    lineHeight: "140%",
                    letterSpacing: "0.035px",
                    marginBottom: "8px",
                  }}
                >
                  Password*
                </p>
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
                    style={{ width: "300px" }}
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
                    className="bg-sky-500 mt-2"
                    style={{ width: "300px" }}
                  >
                    Log in
                  </Button>
                </Form.Item>
              </Form>
            </div>
            <p className="text-center"> Or</p>

            <Button
              disabled={isLoading}
              className="mt-6"
              onClick={() => setIsLoggingWithOtp((prev) => !prev)}
              style={{ width: "300px" }}
            >
              Login With OTP
            </Button>
          </div>
        </div>
        <div className="flex !pt-[96px] pl-2 pr-2 justify-between items-end self-stretch">
          <div className="text-text-4 font-inter text-sm font-normal">
            © 2023 Meeraq.
          </div>
          <div className="text-text-4 font-inter text-base font-normal">
            pmocoaching@meeraq.com
          </div>
        </div>
      </div>
    </div>
  );
};
