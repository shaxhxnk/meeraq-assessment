import { message, notification } from "antd";
import axios from "axios";
import { useState } from "react";

export const useDeleteApi = (url) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteData = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios({
        method: "DELETE",
        url,
        data,
      });

      if (response.data.status) {
        // Handle success status if needed
      } else if (response?.data?.message !== "") {
        notification.success({
          message: response?.data?.message
            ? response?.data?.message
            : "Deleted successfully!",
        });
      }
      setData(response.data ? response.data : { status: "success" });
      setIsLoading(false);
    } catch (error) {
      if (error.response?.data?.message) {
        notification.error({ message: error.response.data.message });
      } else {
        notification.error({
          message: error?.response?.data?.error
            ? error?.response?.data?.error
            : "Something went wrong during deletion.",
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

  return { data, isLoading, error, deleteData, resetState };
};
