import { useMemo } from "react";
import axiosServices, { fetcher } from 'utils/axios'
import useSWR from "swr";
import { OPTIONS } from "constants/constants";

export const endpoints = {
  key: `${import.meta.env.VITE_API_KEY_}/${import.meta.env.VITE_API_VER}/carousel`,
};

export const useGetCarousels = (queryObj = {}) => {
  const qs = new URLSearchParams(queryObj).toString();
  const key = qs ? `/${endpoints.key}?${qs}` : `/${endpoints.key}`;
  const { data, isLoading, error, mutate } = useSWR(key, fetcher, OPTIONS);
  const memoizedValue = useMemo(() => ({
    data,
    isLoading,
    mutate,
    error
  }), [data, isLoading, mutate, error]);
  return memoizedValue;
};
const CAROUSELS = {
  addCarousel: async (payload) => {
    try {
      const response = await axiosServices.post(`/${endpoints.key}`, payload)
      return response
    } catch (error) {
      throw new Error(error?.response?.data?.message);
    }
  },
  editCarousel: async (carouselId, payload) => {
    try {
      const response = await axiosServices.patch(`/${endpoints.key}/${carouselId}`, payload)
      return response
    } catch (error) {
      throw new Error(error?.response?.data?.message);
    }
  },
  deleteCarousel: async (carouselId) => {
    try {
      const response = await axiosServices.delete(`/${endpoints.key}/${carouselId}`)
      return response
    } catch (error) {
      throw new Error(error?.response?.data?.message);
    }
  }
}
export default {
  CAROUSELS
}