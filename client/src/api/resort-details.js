import { useMemo } from "react";
import axiosServices, { fetcher } from 'utils/axios'
import useSWR from "swr";
import { OPTIONS } from "constants/constants";

export const endpoints = {
  key: `${import.meta.env.VITE_API_KEY_}/${import.meta.env.VITE_API_VER}/resort-details`,
};

export const useGetResortDetails = () => {
  const { data, isLoading, error, mutate } = useSWR(`/${endpoints.key}`, fetcher, OPTIONS);

  const memoizedValue = useMemo(() => ({
    resortDetails: data,
    isLoading,
    mutate,
    error
  }), [data, isLoading, mutate, error]);

  return memoizedValue;
};

const ResortDetails = {
  editResortDetails: async (payload) => {
    try {
      const response = await axiosServices.patch(`/${endpoints.key}`, payload)
      return response
    } catch (error) {
      throw new Error(error?.response?.data?.message);
    }
  },
}

export default {
  ResortDetails
}