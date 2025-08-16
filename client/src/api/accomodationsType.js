import { useMemo } from "react";
import axiosServices, { fetcher } from 'utils/axios'
import useSWR from "swr";

export const endpoints = {
  key: `${import.meta.env.VITE_API_KEY_}/${import.meta.env.VITE_API_VER}/accommodation-type`,
};

const options = {
  revalidateIfStale: true,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  onSuccess: (data, key, config) => data
};

export const useGetAccommodationTypes = () => {
  const key = `/${endpoints.key}`;

  const { data, isLoading, error, mutate } = useSWR(key, fetcher, options);

  const memoizedValue = useMemo(() => ({
    accomodationTypes: data,
    isLoading,
    mutate,
    error
  }), [data, isLoading, mutate, error]);

  return memoizedValue;
};


