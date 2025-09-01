import axiosServices, { fetcher } from 'utils/axios'
import { useMemo } from "react";
import { OPTIONS } from "constants/constants";

import useSWR from "swr";

export const endpoints = {
  key: `${import.meta.env.VITE_API_KEY_}/${import.meta.env.VITE_API_VER}/reservations`,
};

export const useGetReservations = (queryObj = {}) => {
  const queryParams = new URLSearchParams(queryObj).toString();
  const apiURL = `/${endpoints.key}?${queryParams}`;

  const { data, isLoading, error, mutate } = useSWR(apiURL, fetcher, OPTIONS);

  const memoizedValue = useMemo(() => ({
    data,
    isLoading,
    mutate,
    error
  }), [data, isLoading, mutate, error]);

  return memoizedValue;
};
