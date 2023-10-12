import { message, notification } from "antd";
import axios from "axios";
import { useState } from "react";

export const usePostApi = (url) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const postData = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios({
        method: "POST",
        url,
        data,
      });
      if (response.data.status) {
      } else if (response?.data?.message != "") {
        notification.success({
          message: response?.data?.message
            ? response?.data?.message
            : "Success!",
        });
      }
      setData(
        response?.data?.details ? response?.data?.details : response?.data
      );
      setIsLoading(false);
    } catch (error) {
      if (error.response?.data?.email) {
        notification.error({ message: "Email not found!" });
      } else if (error.response?.data?.password) {
      } else {
        notification.error({
          message: error?.response?.data?.error
            ? error?.response?.data?.error
            : "Something went wrong",
        });
      }
      setError(error);
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setError(null);
    setIsLoading(false);
    setData(null);
  };

  return { data, isLoading, error, postData, resetState };
};
