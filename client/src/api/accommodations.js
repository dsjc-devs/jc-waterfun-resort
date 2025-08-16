import { useMemo } from "react";
import axiosServices, { fetcher } from 'utils/axios'
import useSWR from "swr";

export const endpoints = {
  key: `${import.meta.env.VITE_API_KEY_}/${import.meta.env.VITE_API_VER}/accommodations`,
};

const options = {
  revalidateIfStale: true,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  onSuccess: (data, key, config) => data
};

export const useGetAccommodations = (queryObj = {}) => {
  const queryParams = new URLSearchParams(queryObj).toString();
  const apiUrl = `/${endpoints.key}?${queryParams}`;

  const { data, isLoading, error, mutate } = useSWR(apiUrl, fetcher, options);

  const memoizedValue = useMemo(() => ({
    data,
    isLoading,
    mutate,
    error
  }), [data, isLoading, mutate, error]);

  return memoizedValue;
};

export const useGetSingleAccommodation = (id) => {
  const apiUrl = `/${endpoints.key}/${id}`;

  const { data, isLoading, error, mutate } = useSWR(id && apiUrl, fetcher, options);

  const memoizedValue = useMemo(() => ({
    data,
    isLoading,
    mutate,
    error
  }), [data, isLoading, mutate, error]);

  return memoizedValue;
};

const Accommodations = {
  addAccommodation: async (payload) => {
    try {
      const response = await axiosServices.post(`/${endpoints.key}`, payload)
      return response
    } catch (error) {
      throw new Error(error?.response?.data?.message);
    }
  },
  editAccommodation: async (id, payload) => {
    try {
      const response = await axiosServices.patch(`/${endpoints.key}/${id}`, payload)
      return response
    } catch (error) {
      throw new Error(error?.response?.data?.message);
    }
  },
  deleteAccommodation: async (id) => {
    try {
      const response = await axiosServices.delete(`/${endpoints.key}/${id}`)
      return response
    } catch (error) {
      throw new Error(error?.response?.data?.message);
    }
  }
}

export default {
  Accommodations
}


