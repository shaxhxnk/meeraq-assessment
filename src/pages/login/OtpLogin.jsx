import { Button, Form, Input } from "antd";
import React, { useState } from "react";
import { UserOutlined } from "@ant-design/icons";
import { usePostApi } from "../../hooks/usePostApi";
import { useDispatch, useSelector } from "react-redux";
import { loginWithOtp } from "../../redux/services/authService";
import { validateEmailOnBlur } from "../../utils/validation";
import { VALIDATE_TRIGGERS } from "../../utils/constants";
import MeeraqLogo from "../../assets/meeraq_logo_color.png";

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
        />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={generateOtpLoading}
          className="bg-sky-500"
        >
          Generate OTP
        </Button>
      </Form.Item>
      <p>Or</p>
      <Button
        className="mt-4"
        onClick={() => setIsLoggingWithOtp((prev) => !prev)}
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
        />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={generateOtpLoading}
          className="bg-sky-500"
        >
          Login
        </Button>
      </Form.Item>
    </Form>
  );

  return (
    <div>
      <div className="bg-gray-100 sm:px-6 lg:px-8">
        {/* <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className=" text-center text-3xl font-extrabold text-gray-900">
            OTP Login
          </h2>
        </div> */}
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="flex justify-center">
              <img
                className="w-[40%] mb-[4rem] h-auto"
                src={MeeraqLogo}
                alt="Meeraq logo"
              />
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
              <h2 className=" text-center text-3xl font-extrabold text-gray-900 mb-[2rem]">
                OTP Login
              </h2>
            </div>
            {generateOtpData ? validateOtpForm : generateOtpForm}
          </div>
        </div>
      </div>
    </div>
  );
};
