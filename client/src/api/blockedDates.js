import { useMemo } from "react";
import { fetcher } from 'utils/axios'
import { OPTIONS } from "constants/constants";

import useSWR from "swr";

export const endpoints = {
  key: `${import.meta.env.VITE_API_KEY_}/${import.meta.env.VITE_API_VER}/blocked-dates`,
};

export const useGetBlockedDates = () => {
  const { data, isLoading, error, mutate } = useSWR(`/${endpoints.key}`, fetcher, OPTIONS);
  const memoizedValue = useMemo(() => ({
    data,
    isLoading,
    mutate,
    error
  }), [data, isLoading, mutate, error]);
  return memoizedValue;
};