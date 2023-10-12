import axios from "axios";
import { useState, useEffect, useCallback } from "react";

export const useGetApi = (url) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [key, setKey] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios({
          method: "GET",
          url,
          withCredentials: true,
        });
        setData(response.data);
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
        setData(null);
      }
    };
    fetchData();
  }, [url, key]);

  const resetState = useCallback(() => {
    setError(null);
    setIsLoading(false);
    setData(null);
  }, []);

  const getData = useCallback(() => {
    setKey((prev) => !prev);
  }, []);

  return { data, isLoading, error, resetState, getData };
};
