import { OPTIONS } from "constants/constants";
import { useMemo } from "react";
import useSWR from "swr";
import { fetcher } from "utils/axios";

const endpoints = {
  key: `${import.meta.env.VITE_API_KEY_}/${import.meta.env.VITE_API_VER}/resort-rates`,
};

export const useGetResortRates = () => {
  const { data, isLoading, error, mutate } = useSWR(`/${endpoints.key}`, fetcher, OPTIONS);

  const memoizedValue = useMemo(() => ({
    resortRates: data,
    isLoading,
    mutate,
    error
  }), [data, isLoading, mutate, error]);

  return memoizedValue;
};