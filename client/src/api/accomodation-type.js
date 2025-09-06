import { useMemo } from "react";
import axiosServices, { fetcher } from 'utils/axios'
import useSWR from "swr";
import { OPTIONS } from "constants/constants";

export const endpoints = {
  key: `${import.meta.env.VITE_API_KEY_}/${import.meta.env.VITE_API_VER}/accommodation-type`,
};

export const useGetAccommodationTypes = () => {
  const key = `/${endpoints.key}`;

  const { data, isLoading, error, mutate } = useSWR(key, fetcher, OPTIONS);

  const memoizedValue = useMemo(() => ({
    accomodationTypes: data,
    isLoading,
    mutate,
    error
  }), [data, isLoading, mutate, error]);

  return memoizedValue;
};

const AccommodationType = {
  addAccommodation: async (payload) => {
    try {
      const response = await axiosServices.post(`/${endpoints.key}`, payload)
      return response
    } catch (error) {
      throw new Error(error?.response?.data?.message);
    }
  },
  editAccommodationType: async (id, payload) => {
    try {
      const response = await axiosServices.patch(`/${endpoints.key}/${id}`, payload)
      return response
    } catch (error) {
      throw new Error(error?.response?.data?.message);
    }
  },
  deleteAccommodationType: async (id) => {
    try {
      const response = await axiosServices.delete(`/${endpoints.key}/${id}`)
      return response
    } catch (error) {
      throw new Error(error?.response?.data?.message);
    }
  }
}

export default {
  AccommodationType
}