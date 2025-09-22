import { useMemo } from "react";
import axiosServices, { fetcher } from 'utils/axios'
import useSWR from "swr";
import { OPTIONS } from "constants/constants";

export const endpoints = {
  key: `${import.meta.env.VITE_API_KEY_}/${import.meta.env.VITE_API_VER}/amenities`,
};

export const useGetAmenities = (queryObj = {}) => {
  const queryParams = new URLSearchParams(queryObj).toString();
  const apiUrl = `/${endpoints.key}?${queryParams}`;

  const { data, isLoading, error, mutate } = useSWR(apiUrl, fetcher, OPTIONS);

  const memoizedValue = useMemo(() => ({
    data,
    isLoading,
    mutate,
    error
  }), [data, isLoading, mutate, error]);

  return memoizedValue;
};

export const useGetSingleAmenity = (id) => {
  const apiUrl = `/${endpoints.key}/${id}`;
  const { data, isLoading, error, mutate } = useSWR(id && apiUrl, fetcher, OPTIONS);

  const memoizedValue = useMemo(() => ({
    data,
    isLoading,
    mutate,
    error
  }), [data, isLoading, mutate, error]);

  return memoizedValue;
};

const Amenities = {
  addAmenities: async (payload) => {
    try {
      const response = await axiosServices.post(`/${endpoints.key}`, payload)
      return response
    } catch (error) {
      throw new Error(error?.response?.data?.message);
    }
  },
  editAmenityById: async (id, payload) => {
    try {
      const response = await axiosServices.patch(`/${endpoints.key}/${id}`, payload)
      return response
    } catch (error) {
      throw new Error(error?.response?.data?.message);
    }
  },
  deleteAmenity: async (id) => {
    try {
      const response = await axiosServices.delete(`/${endpoints.key}/${id}`)
      return response
    } catch (error) {
      throw new Error(error?.response?.data?.message);
    }
  }
}

export default {
  Amenities
}