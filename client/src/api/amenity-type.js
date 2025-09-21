import { useMemo } from "react";
import axiosServices, { fetcher } from 'utils/axios';
import useSWR from "swr";
import { OPTIONS } from "constants/constants";

export const endpoints = {
  key: `${import.meta.env.VITE_API_KEY_}/${import.meta.env.VITE_API_VER}/amenities-type`,
};

export const useGetAmenityTypes = () => {
  const key = `/${endpoints.key}`;

  const { data, isLoading, error, mutate } = useSWR(key, fetcher, OPTIONS);

  const memoizedValue = useMemo(() => ({
    amenityTypes: data,
    isLoading,
    mutate,
    error
  }), [data, isLoading, mutate, error]);

  return memoizedValue;
};

const AmenityType = {
  addAmenityType: async (payload) => {
    try {
      const response = await axiosServices.post(`/${endpoints.key}`, payload);
      return response;
    } catch (error) {
      throw new Error(error?.response?.data?.message);
    }
  },
  editAmenityType: async (id, payload) => {
    try {
      const response = await axiosServices.patch(`/${endpoints.key}/${id}`, payload);
      return response;
    } catch (error) {
      throw new Error(error?.response?.data?.message);
    }
  },
  deleteAmenityType: async (id) => {
    try {
      const response = await axiosServices.delete(`/${endpoints.key}/${id}`);
      return response;
    } catch (error) {
      throw new Error(error?.response?.data?.message);
    }
  }
}

export default {
  AmenityType
}
