import { Button, Form, Input } from "antd";
import React, { useState } from "react";
import { UserOutlined } from "@ant-design/icons";
import { usePostApi } from "../../hooks/usePostApi";
import { useDispatch, useSelector } from "react-redux";
import { loginWithOtp } from "../../redux/services/authService";
import { validateEmailOnBlur } from "../../utils/validation";
import { VALIDATE_TRIGGERS } from "../../utils/constants";
import MeeraqLogo from "../../assets/meeraq_logo_color.png";
import LoginPageSvg from "../../assets/loginPageSvg.svg";

export const OtpLogin = ({ setIsLoggingWithOtp }) => {
  const { isLoading, isAuthenticated, error, csrf } = useSelector(
    (state) => state.auth
  );
  const [email, setEmail] = useState("");
  const {
    data: generateOtpData,
    isLoading: generateOtpLoading,
    error: generateOtpError,
    postData: generateOtp,
  } = usePostApi(`${process.env.REACT_APP_BASE_URL}/api/otp/generate/`);
  const [generateOtpFormData] = Form.useForm();

  const dispatch = useDispatch();

  const onFinishGenerateOtp = (values) => {
    // dispatch(login({ email: values.username, password: values.password }));
    generateOtp({
      email: values.email.trim(),
    });
    setEmail(values.email.trim());
  };

  const onFinishValidateOtp = (values) => {
    dispatch(loginWithOtp({ otp: values.otp, email, csrf }));
  };

  const generateOtpForm = (
    <Form
      form={generateOtpFormData}
      name="normal_login"
      className="login-form flex flex-col items-center justify-center"
      initialValues={{
        remember: true,
      }}
      onFinish={onFinishGenerateOtp}
    >
      <Form.Item
        className="w-full"
        name="email"
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
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={generateOtpLoading}
          className="bg-sky-500 mt-4"
          style={{ width: "300px" }}
        >
          Generate OTP
        </Button>
      </Form.Item>
      <p>Or</p>
      <Button
        className="mt-4"
        onClick={() => setIsLoggingWithOtp((prev) => !prev)}
        style={{ width: "300px" }}
      >
        Login With Password
      </Button>
    </Form>
  );

  const validateOtpForm = (
    <Form
      // name="validate_otp"
      className=""
      initialValues={{
        remember: true,
      }}
      onFinish={onFinishValidateOtp}
    >
      <Form.Item
        name="otp"
        rules={[
          {
            required: true,
            message: "Please input OTP!",
          },
        ]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="OTP"
          className="mt-8"
          style={{ width: "300px" }}
        />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={generateOtpLoading}
          className="bg-sky-500 mt-8"
          style={{ width: "300px" }}
        >
          Login
        </Button>
      </Form.Item>
    </Form>
  );

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
            <div className="!w-[174px] !mb-[22px] !mt-[100px] justify-center items-center inline-flex">
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
              OTP Login
            </div>
            <div className="pl-4 lg:pl-0">
              {generateOtpData ? validateOtpForm : generateOtpForm}
            </div>
          </div>
        </div>
        <div className="flex !pt-[230px] pl-2 pr-2 justify-between items-end self-stretch">
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
